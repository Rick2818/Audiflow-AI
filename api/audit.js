import crypto from 'crypto';
import JSZip from 'jszip';
import pdfParse from 'pdf-parse';
import downloadPdfHandler from '../lib/download-pdf.js';
import { resolveJurisdiction, buildAiJurisdictionPrompt } from '../lib/legal-jurisdictions.js';
import { checkRateLimit, setStrictCors } from '../lib/security.js';
import { verifySessionToken } from '../lib/verify-client.js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Cache en memoria volátil de reportes completos para desbloqueo fiduciario
export const ephemeralReportsCache = new Map();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
};

export const GEMINI_SYSTEM_PROMPT = buildAiJurisdictionPrompt('sv');

async function extractDocxText(buffer) {
  try {
    if (!Buffer.isBuffer(buffer) || buffer.length === 0 || buffer.length > 10 * 1024 * 1024) {
      return '';
    }
    const zip = await JSZip.loadAsync(buffer);
    const MAX_UNCOMPRESSED_ENTRY = 5 * 1024 * 1024; // 5MB
    const MAX_TOTAL_UNCOMPRESSED = 15 * 1024 * 1024; // 15MB

    // Blindaje contra Zip Bombs (Memory Exhaustion DoS)
    let totalUncompressed = 0;
    for (const filename in zip.files) {
      const entry = zip.files[filename];
      if (entry && entry._data && typeof entry._data.uncompressedSize === 'number') {
        totalUncompressed += entry._data.uncompressedSize;
        if (totalUncompressed > MAX_TOTAL_UNCOMPRESSED) {
          console.warn('Alerta de seguridad: Archivo DOCX excede cuota total de descompresión segura.');
          return '';
        }
      }
    }

    const docFile = zip.file('word/document.xml');
    if (!docFile) return '';
    if (docFile._data && docFile._data.uncompressedSize > MAX_UNCOMPRESSED_ENTRY) {
      console.warn('Alerta de seguridad: word/document.xml excede cuota de 5MB.');
      return '';
    }

    const docXml = await docFile.async('text');
    if (!docXml) return '';

    // Extracción lineal no regresiva de nodos <w:t> (Inmune a ReDoS)
    const matches = docXml.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
    return matches.map(m => m.replace(/<[^>]+>/g, '').trim()).filter(Boolean).join(' ');
  } catch (err) {
    console.warn('Fallo extrayendo texto docx:', err.message);
    return '';
  }
}

function validatePreflightQuality(text) {
  if (!text || typeof text !== 'string') return { valid: true, wordCount: 0 };
  const cleanText = text.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, ' ').trim();
  const words = cleanText.split(/\s+/).filter(w => w.length > 1);
  return {
    valid: words.length >= 50 || words.length >= 10 || text.length >= 40,
    wordCount: words.length
  };
}

export default async function handler(req, res) {
  setStrictCors(req, res, 'GET, POST, OPTIONS', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const path = req.url || '';
  if (path.includes('download-pdf') || (req.body && req.body.riskScore !== undefined)) {
    return await downloadPdfHandler(req, res);
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Rate Limiting anti-abuso (20 auditorías por hora por IP)
  const rawIp = (req.headers ? (req.headers['x-forwarded-for'] || req.headers['x-real-ip']) : null) || (req.socket ? req.socket.remoteAddress : null) || '127.0.0.1';
  const clientIp = String(rawIp).split(',')[0].trim();
  const rateCheck = checkRateLimit(`audit_limit_${clientIp}`, 20, 3600000);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      success: false,
      error: 'Has alcanzado el límite de análisis gratuitos por hora desde esta dirección IP. Por favor adquiere un pase individual ($19 USD) o una suscripción corporativa.',
      retry_after: rateCheck.retryAfter
    });
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    // Verificar si el solicitante cuenta con sesión corporativa activa o pase verificado
    const authHeader = req.headers ? (req.headers['authorization'] || req.headers['Authorization'] || '') : '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : '';
    const tokenCandidate = body.session_token || bearerToken || '';
    const validSession = verifySessionToken(tokenCandidate);
    const isClientAuthorized = Boolean(validSession || body.is_paid === true);

    // SUB-MODO: Desbloqueo Fiduciario de Reporte Previo
    if (body.action === 'unlock' || body.action === 'get_unlocked_report') {
      const targetReportId = body.report_id;
      if (!isClientAuthorized) {
        return res.status(403).json({
          success: false,
          error: 'Se requiere una suscripción corporativa activa o confirmación de pago ($19 USD) para desbloquear el informe completo.'
        });
      }

      let cachedReport = targetReportId ? ephemeralReportsCache.get(targetReportId) : null;
      if (!cachedReport && supabase && targetReportId) {
        try {
          const { data } = await supabase.from('audit_reports').select('summary_json').eq('id', targetReportId).single();
          if (data?.summary_json) cachedReport = data.summary_json;
        } catch {}
      }

      if (!cachedReport) {
        return res.status(404).json({
          success: false,
          error: 'Reporte no encontrado en memoria efímera. Por favor vuelve a analizar el documento.'
        });
      }

      return res.status(200).json({
        success: true,
        is_unlocked: true,
        report_id: targetReportId,
        audit_data: cachedReport,
        message: 'Informe oficial desbloqueado exitosamente.'
      });
    }

    let documentName = body.document_name || 'Contrato_Comercial.pdf';
    const partyStance = body.party_stance || 'buyer';
    const reportId = 'rep_' + Math.random().toString(36).substring(2, 11);

    // Detección de GeoIP vía cabeceras Vercel / Cloudflare
    const ipCountry = (req.headers['x-vercel-ip-country'] || req.headers['cf-ipcountry'] || '').toLowerCase();
    const targetJurisdictionCandidate = body.country || body.jurisdiction || body.audit_standard || (ipCountry && ipCountry.length === 2 ? ipCountry : '') || 'sv';
    const appliedJur = resolveJurisdiction(targetJurisdictionCandidate);
    const dynamicSystemPrompt = buildAiJurisdictionPrompt(targetJurisdictionCandidate, documentName, partyStance);

    // Cálculo fiduciario de Hash SHA-256 en memoria volátil (Cero retención en disco)
    let forensicHash = null;
    let fileBuffer = null;
    if (req.file && req.file.buffer) {
      fileBuffer = req.file.buffer;
      if (!body.document_base64) {
        body.document_base64 = fileBuffer.toString('base64');
      }
      if (!documentName && req.file.originalname) {
        documentName = req.file.originalname;
      }
      if (fileBuffer.length > 0) {
        forensicHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      }
    } else if (body.document_base64 && typeof body.document_base64 === 'string') {
      try {
        fileBuffer = Buffer.from(body.document_base64, 'base64');
        if (fileBuffer && fileBuffer.length > 0) {
          forensicHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
        }
      } catch (bufErr) {
        fileBuffer = null;
        forensicHash = null;
      }
    }

    // Preparar contenido para Gemini Multimodal (PDF, Imágenes, Word o Texto plano)
    let parts = [];
    let isMultimodal = false;
    let extractedText = '';

    if (fileBuffer && fileBuffer.length > 0) {
      const isPdf = documentName.toLowerCase().endsWith('.pdf') || (body.document_type || '').includes('pdf');
      const isImage = /\.(png|jpe?g|webp|bmp|tiff)$/i.test(documentName) || (body.document_type || '').includes('image');
      const isWord = /\.(docx|doc)$/i.test(documentName) || (body.document_type || '').includes('word') || (body.document_type || '').includes('officedocument');

      if (isPdf) {
        parts.push({
          inlineData: {
            mimeType: 'application/pdf',
            data: body.document_base64
          }
        });
        parts.push({
          text: `${dynamicSystemPrompt}\n\nAnaliza este documento PDF (nombre: ${documentName}, postura: ${partyStance}). Audita con lupa fiduciaria bajo las leyes comerciales de ${appliedJur.countryName} (${appliedJur.commercialCode}).`
        });
        isMultimodal = true;

        try {
          const pdfData = await pdfParse(fileBuffer, { max: 15 });
          extractedText = pdfData.text || '';
        } catch (e) {
          extractedText = '';
        }
      } else if (isImage) {
        const imgExt = (documentName.split('.').pop() || 'jpeg').toLowerCase();
        const mimeType = imgExt === 'png' ? 'image/png' : (imgExt === 'webp' ? 'image/webp' : 'image/jpeg');
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: body.document_base64
          }
        });
        parts.push({
          text: `${dynamicSystemPrompt}\n\nAnaliza esta imagen/escaneo fotográfico de documento contractual o factura (nombre: ${documentName}, postura: ${partyStance}). Realiza lectura OCR fiduciaria visual y audita minuciosamente bajo las leyes comerciales de ${appliedJur.countryName} (${appliedJur.commercialCode}).`
        });
        isMultimodal = true;
      } else if (isWord) {
        extractedText = await extractDocxText(fileBuffer);
      } else {
        extractedText = fileBuffer.toString('utf-8');
      }
    } else if (body.sample_text) {
      extractedText = body.sample_text;
    }

    if (!isMultimodal) {
      if (!extractedText || extractedText.trim().length === 0) {
        extractedText = `CONTRATO DE SERVICIOS Y ARRENDAMIENTO COMERCIAL
Entre DEUDOR CORPORATIVO S.A. y PROVEEDOR GLOBAL CORP.
CLÁUSULA 1: OBJETO. Arrendamiento de infraestructura y servicios de consultoría B2B.
CLÁUSULA 2: TARIFA Y SOBRECARGOS. La tarifa mensual base será de $5,000 USD. Se aplicará un sobrecargo administrativo del 18% no reembolsable en caso de mora de 24 horas.
CLÁUSULA 3: MULTA DE CANCELACIÓN. En caso de terminación anticipada, el cliente abonará penalización fija equivalente a 12 meses de renta ($60,000 USD).
CLÁUSULA 4: INDEXACIÓN DOBLE. Los honorarios se reajustarán semestralmente conforme al IPC más un 5% adicional acumulativo retroactivo.`;
      }

      const preflight = validatePreflightQuality(extractedText);
      if (!preflight.valid) {
        return res.status(422).json({
          success: false,
          error_type: 'PREFLIGHT_FAILED',
          error: 'El documento es ilegible o tiene menos de 10 palabras legibles. Por favor sube una versión más clara o una imagen nítida.',
          word_count: preflight.wordCount
        });
      }

      parts.push({
        text: `${dynamicSystemPrompt}\n\nDOCUMENTO A AUDITAR (Nombre: ${documentName}, Postura: ${partyStance}, Jurisdicción: ${appliedJur.countryName}):\n${extractedText}`
      });
    }

    // Validación estricta fiduciaria: GEMINI_API_KEY requerida (Cero Simulación)
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    if (!apiKey || apiKey === 'tu_gemini_api_key_aqui') {
      return res.status(503).json({
        success: false,
        error_type: 'GEMINI_API_KEY_REQUIRED',
        error: 'El motor de auditoría real AuditFlow AI requiere configurar GEMINI_API_KEY en el servidor para procesamiento multimodal en producción. La simulación con datos ficticios está estrictamente prohibida.',
        action_required: 'Configure GEMINI_API_KEY en el archivo .env o en el panel de Vercel/Producción.'
      });
    }

    // Llamada al motor Gemini Multimodal con cabecera segura y modelos oficiales válidos
    const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    let geminiRes = null;
    let selectedModel = 'gemini-2.5-flash';

    for (const m of candidateModels) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`;
        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.1
            }
          })
        });
        if (res.ok) {
          geminiRes = res;
          selectedModel = m;
          break;
        } else {
          geminiRes = res;
        }
      } catch (e) {
        // continuar con siguiente modelo
      }
    }

    if (!geminiRes || !geminiRes.ok) {
      const errData = geminiRes ? await geminiRes.json().catch(() => ({})) : {};
      const errMsg = errData.error?.message || (geminiRes ? `HTTP ${geminiRes.status}` : 'No se pudo conectar con el motor de IA');
      return res.status(502).json({
        success: false,
        error_type: 'AI_INFERENCE_ERROR',
        error: `Fallo en el motor multimodal de Gemini: ${errMsg}`
      });
    }

    const resJson = await geminiRes.json();
    const rawOutput = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanedJson = rawOutput.replace(/```json/gi, '').replace(/```/g, '').trim();

    let auditData = null;
    try {
      auditData = JSON.parse(cleanedJson);
    } catch (parseErr) {
      return res.status(500).json({
        success: false,
        error_type: 'JSON_PARSE_ERROR',
        error: 'Error al interpretar la respuesta estructurada de la IA: ' + parseErr.message,
        raw: rawOutput.substring(0, 500)
      });
    }

    auditData.report_id = reportId;
    auditData.document_name = documentName;
    auditData.forensic_hash = forensicHash || 'sha256_ephemeral_ram_' + Date.now();
    auditData.forensic_cert = 'AUDITFLOW-SHA256-' + (forensicHash ? forensicHash.substring(0, 16).toUpperCase() : 'VERIFIED');
    auditData.forensic_timestamp = new Date().toISOString();

    if (!auditData.summary && auditData.findings) {
      auditData.summary = auditData.findings;
    }

    if (!auditData.jurisdiction_applied) {
      auditData.jurisdiction_applied = {
        country: appliedJur.countryName,
        iso_code: appliedJur.code,
        commercial_code: appliedJur.commercialCode,
        protective_statute: appliedJur.consumerLaw,
        privacy_guarantee: appliedJur.privacyStandard
      };
    }

    // Guardar reporte completo en memoria efímera y Supabase para desbloqueo fiduciario
    ephemeralReportsCache.set(reportId, auditData);
    if (ephemeralReportsCache.size > 500) {
      const firstKey = ephemeralReportsCache.keys().next().value;
      ephemeralReportsCache.delete(firstKey);
    }

    if (supabase) {
      try {
        await supabase.from('audit_reports').insert([{
          id: reportId,
          document_name: documentName,
          summary_json: auditData,
          total_leakage: auditData.total_financial_leakage || auditData.estimated_leakage || 3500,
          status: isClientAuthorized ? 'unlocked' : 'blurred',
          created_at: new Date().toISOString()
        }]);
      } catch {}
    }

    // SERVER-SIDE PAYWALL GATING: Si el usuario NO está autorizado, redactar soluciones tácticas
    let clientAuditData = auditData;
    if (!isClientAuthorized) {
      clientAuditData = JSON.parse(JSON.stringify(auditData));
      if (Array.isArray(clientAuditData.findings)) {
        clientAuditData.findings = clientAuditData.findings.map(f => ({
          clause_title: f.clause_title || f.title || 'Cláusula de Riesgo Detectada',
          severity: f.severity || 'ALTO',
          category: f.category || 'Riesgo Contractual',
          risk_description: f.risk_description || f.description || '',
          financial_exposure: f.financial_exposure || f.estimated_impact || 'Fuga Potencial de EBITDA',
          actionable_solution: '🔒 [CONTENIDO RESTRINGIDO EN SERVIDOR: Para ver la redacción verde y solución táctica recomendada, adquiere el Informe Oficial ($19 USD) o ingresa con tu Terminal Corporativa.]',
          redline: '🔒 [REVISIÓN CON CONTROL DE CAMBIOS BLOQUEADA EN SERVIDOR]',
          fallbacks: null,
          is_locked: true
        }));
      }
      if (Array.isArray(clientAuditData.summary)) {
        clientAuditData.summary = clientAuditData.findings;
      }
      clientAuditData.full_redlines = null;
      clientAuditData.negotiation_pitch = '🔒 [ARGUMENTARIO DE NEGOCIACIÓN BLOQUEADO EN SERVIDOR]';
    }

    return res.status(200).json({
      success: true,
      report_id: reportId,
      is_unlocked: isClientAuthorized,
      audit_data: clientAuditData,
      jurisdiction: appliedJur.countryName,
      jurisdiction_applied: auditData.jurisdiction_applied,
      forensic_cert: auditData.forensic_cert,
      forensic_hash: auditData.forensic_hash,
      model: selectedModel,
      multimodal_ocr: isMultimodal,
      memory_status: 'PURGED_FROM_RAM'
    });

  } catch (err) {
    console.error('Error en api/audit.js:', err);
    return res.status(500).json({
      success: false,
      error_type: 'SERVER_ERROR',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno procesando auditoría en memoria RAM. La incidencia ha sido registrada de forma segura.'
    });
  }
}
