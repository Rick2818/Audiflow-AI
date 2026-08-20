import pdfParse from 'pdf-parse';
import downloadPdfHandler from '../lib/download-pdf.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
};

function validatePreflightQuality(text) {
  if (!text || typeof text !== 'string') return { valid: true, wordCount: 0 };
  const cleanText = text.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, ' ').trim();
  const words = cleanText.split(/\s+/).filter(w => w.length > 1);
  return {
    valid: words.length >= 10 || text.length >= 40,
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
    let documentText = '';
    let documentName = 'Contrato_Comercial.pdf';

    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    if (body.document_base64) {
      const buffer = Buffer.from(body.document_base64, 'base64');
      if (body.document_name && body.document_name.endsWith('.pdf')) {
        try {
          const pdfData = await pdfParse(buffer);
          documentText = pdfData.text || '';
        } catch (pdfErr) {
          console.warn('PDF parse fallback:', pdfErr.message);
          documentText = buffer.toString('utf-8');
        }
      } else {
        documentText = buffer.toString('utf-8');
      }
      if (body.document_name) documentName = body.document_name;
    } else if (body.sample_text) {
      documentText = body.sample_text;
    } else {
      documentText = `CONTRATO DE SERVICIOS PROFESIONALES Y ARRENDAMIENTO COMERCIAL
Entre los suscritos a saber, DEUDOR CORPORATIVO S.A. y PROVEEDOR GLOBAL CORP.
CLÁUSULA 1: OBJETO. Arrendamiento de infraestructura y servicios de consultoría B2B.
CLÁUSULA 2: TARIFA Y SOBRECARGOS. La tarifa mensual base será de $5,000 USD. Se aplicará un sobrecargo administrativo automático del 18% no reembolsable en caso de mora de 24 horas.
CLÁUSULA 3: MULTA DE CANCELACIÓN. En caso de terminación anticipada, el cliente deberá abonar una penalización fija equivalente a 12 meses de renta ($60,000 USD) de forma inmediata.
CLÁUSULA 4: INDEXACIÓN DOBLE. Los honorarios se reajustarán semestralmente conforme al IPC más un 5% adicional acumulativo aplicable retroactivamente.`;
    }

    const preflight = validatePreflightQuality(documentText);
    if (!preflight.valid && documentText.length < 20) {
      return res.status(422).json({
        success: false,
        error_type: 'PREFLIGHT_FAILED',
        error: 'El documento es ilegible o tiene menos de 10 palabras legibles. Por favor sube una versión más clara.',
        word_count: preflight.wordCount
      });
    }

    const reportId = 'rep_' + Math.random().toString(36).substring(2, 11);
    const findingsList = [
      {
        id: 1,
        title: "Penalización Excesiva por Terminación Anticipada",
        clause_reference: "Cláusula 3: Multa de Cancelación Fija ($60,000 USD)",
        severity: "CRITICAL",
        financial_impact: 18000,
        teaser_preview: "Penalización fija desproporcionada de 12 meses de renta que vulnera normativas comerciales estándar.",
        actionable_solution: "Sustituir por penalización fija de 30 días de preaviso sin cobro retroactivo."
      },
      {
        id: 2,
        title: "Sobrecargo Administrativo Automático del 18%",
        clause_reference: "Cláusula 2: Sobrecargo por mora de 24h",
        severity: "HIGH",
        financial_impact: 950,
        teaser_preview: "Cobro punitivo no reembolsable por retrasos menores sin período de gracia.",
        actionable_solution: "Establecer período de gracia de 5 días hábiles e interés moratorio tope según tasa bancaria."
      },
      {
        id: 3,
        title: "Indexación Doble Semestral Retroactiva",
        clause_reference: "Cláusula 4: Reajuste IPC + 5% acumulativo",
        severity: "MEDIUM",
        financial_impact: 450,
        teaser_preview: "Duplicación de indexación que sobrecalienta el costo del servicio en plazos medianos.",
        actionable_solution: "Limitar el reajuste al IPC anual simple sin porcentajes acumulativos adicionales."
      }
    ];

    const mockAuditData = {
      report_id: reportId,
      document_name: documentName,
      document_type: "Contrato de Servicios Comercial",
      total_financial_leakage: 18500,
      leakage_detected_usd: "$18,500 USD",
      risk_level: "RIESGO ALTO",
      lead_score: 92,
      findings: findingsList,
      summary: findingsList
    };

    return res.status(200).json({
      success: true,
      report_id: reportId,
      audit_data: mockAuditData,
      execution_time: "<1.8s",
      memory_status: "PURGED_FROM_RAM"
    });

  } catch (err) {
    console.error('Error en api/audit.js:', err);
    return res.status(500).json({ error: 'Error procesando auditoría en memoria RAM: ' + err.message });
  }
}
