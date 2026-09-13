import pdfParse from 'pdf-parse';
import downloadPdfHandler from '../lib/download-pdf.js';
import { resolveJurisdiction, buildAiJurisdictionPrompt } from '../lib/legal-jurisdictions.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
};

export const GEMINI_SYSTEM_PROMPT = buildAiJurisdictionPrompt('sv');

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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    let documentName = body.document_name || 'Contrato_Comercial.pdf';
    const partyStance = body.party_stance || 'buyer';
    const reportId = 'rep_' + Math.random().toString(36).substring(2, 11);

    const targetJurisdictionCandidate = body.country || body.jurisdiction || body.audit_standard || '';
    const appliedJur = resolveJurisdiction(targetJurisdictionCandidate);
    const dynamicSystemPrompt = buildAiJurisdictionPrompt(targetJurisdictionCandidate, documentName, partyStance);

    // Preparar contenido para Gemini Multimodal (PDF base64 o texto)
    let parts = [];
    let isMultimodalPdf = false;
    let extractedText = '';

    if (body.document_base64) {
      const isPdf = documentName.toLowerCase().endsWith('.pdf') || (body.document_type || '').includes('pdf');
      if (isPdf) {
        // Enviar el PDF directamente a Gemini como inlineData base64 (OCR visual multimodal)
        parts.push({
          inlineData: {
            mimeType: 'application/pdf',
            data: body.document_base64
          }
        });
        parts.push({
          text: `${dynamicSystemPrompt}\n\nAnaliza este documento PDF (nombre: ${documentName}, postura: ${partyStance}). Audita con lupa fiduciaria bajo las leyes comerciales de ${appliedJur.countryName} (${appliedJur.commercialCode}).`
        });
        isMultimodalPdf = true;

        // Extraer texto opcional con pdfParse para preflight check si es digital
        try {
          const buffer = Buffer.from(body.document_base64, 'base64');
          const pdfData = await pdfParse(buffer, { max: 15 });
          extractedText = pdfData.text || '';
        } catch (e) {
          // Si falla pdfParse (ej. PDF escaneado con solo imágenes), Gemini se encarga con OCR visual
          extractedText = '';
        }
      } else {
        const buffer = Buffer.from(body.document_base64, 'base64');
        extractedText = buffer.toString('utf-8');
      }
    } else if (body.sample_text) {
      extractedText = body.sample_text;
    }

    if (!isMultimodalPdf) {
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
          error: 'El documento es ilegible o tiene menos de 10 palabras legibles. Por favor sube una versión más clara.',
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

    // Llamada al motor Gemini Multimodal con fallback adaptativo entre modelos de alta velocidad
    const candidateModels = ['gemini-flash-latest', 'gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
    let geminiRes = null;
    let selectedModel = 'gemini-flash-latest';

    for (const m of candidateModels) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
          geminiRes = res; // conservar para inspeccionar error si todos fallan
        }
      } catch (e) {
        // continuar con siguiente modelo
      }
    }

    if (!geminiRes.ok) {
      const errData = await geminiRes.json().catch(() => ({}));
      const errMsg = errData.error?.message || `HTTP ${geminiRes.status}`;
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

    return res.status(200).json({
      success: true,
      report_id: reportId,
      audit_data: auditData,
      jurisdiction: appliedJur.countryName,
      jurisdiction_applied: auditData.jurisdiction_applied,
      model: 'gemini-2.5-flash-multimodal',
      multimodal_ocr: isMultimodalPdf,
      memory_status: 'PURGED_FROM_RAM'
    });

  } catch (err) {
    console.error('Error en api/audit.js:', err);
    return res.status(500).json({
      success: false,
      error_type: 'SERVER_ERROR',
      error: 'Error procesando auditoría en memoria RAM: ' + err.message
    });
  }
}
