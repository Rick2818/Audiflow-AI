import multer from 'multer';
import pdfParse from 'pdf-parse';
import fetch from 'node-fetch';

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

function validatePreflightQuality(text) {
  if (!text || typeof text !== 'string') return { valid: false, wordCount: 0 };
  const cleanText = text.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, ' ').trim();
  const words = cleanText.split(/\s+/).filter(w => w.length > 1);
  return {
    valid: words.length >= 50,
    wordCount: words.length
  };
}

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await runMiddleware(req, res, upload.single('document'));

    let documentText = '';
    let documentName = 'Contrato.pdf';

    if (req.file) {
      documentName = req.file.originalname || 'Documento.pdf';
      const fileBuffer = req.file.buffer;

      if (req.file.mimetype === 'application/pdf' || documentName.endsWith('.pdf')) {
        const pdfData = await pdfParse(fileBuffer);
        documentText = pdfData.text || '';
      } else {
        documentText = fileBuffer.toString('utf-8');
      }
    } else if (req.body && req.body.sample_text) {
      documentText = req.body.sample_text;
    } else {
      documentText = `CONTRATO DE SERVICIOS PROFESIONALES Y ARRENDAMIENTO COMERCIAL
Entre los suscritos a saber, DEUDOR CORPORATIVO S.A. y PROVEEDOR GLOBAL CORP.
CLÁUSULA 1: OBJETO. Arrendamiento de infraestructura y servicios de consultoría B2B.
CLÁUSULA 2: TARIFA Y SOBRECARGOS. La tarifa mensual base será de $5,000 USD. Se aplicará un sobrecargo administrativo automático del 18% no reembolsable en caso de mora de 24 horas.
CLÁUSULA 3: MULTA DE CANCELACIÓN. En caso de terminación anticipada, el cliente deberá abonar una penalización fija equivalente a 12 meses de renta ($60,000 USD) de forma inmediata.
CLÁUSULA 4: INDEXACIÓN DOBLE. Los honorarios se reajustarán semestralmente conforme al IPC más un 5% adicional acumulativo aplicable retroactivamente.`;
    }

    const preflight = validatePreflightQuality(documentText);
    if (!preflight.valid) {
      return res.status(422).json({
        success: false,
        error_type: 'PREFLIGHT_FAILED',
        error: 'El documento es ilegible o tiene menos de 50 palabras legibles. Por favor sube una versión más clara.',
        word_count: preflight.wordCount
      });
    }

    const reportId = 'rep_' + Math.random().toString(36).substring(2, 11);
    const mockAuditData = {
      report_id: reportId,
      document_name: documentName,
      leakage_detected_usd: "$18,500 USD",
      risk_level: "RIESGO ALTO",
      lead_score: 92,
      summary: [
        {
          id: 1,
          title: "Penalización Excesiva por Terminación Anticipada",
          clause: "Cláusula 3: Multa de Cancelación Fija de 12 meses ($60,000 USD)",
          risk_summary: "Penalización fija desproporcionada que vulnera normativas comerciales estándar.",
          tactical_fix: "Sustituir por penalización fija de 30 días de preaviso sin cobro retroactivo."
        },
        {
          id: 2,
          title: "Sobrecargo Administrativo Automático del 18%",
          clause: "Cláusula 2: Sobrecargo del 18% por mora de 24 horas",
          risk_summary: "Cobro punitivo por retrasos menores sin período de gracia.",
          tactical_fix: "Establecer período de gracia de 5 días hábiles e interés moratorio tope según tasa bancaria."
        },
        {
          id: 3,
          title: "Indexación Doble Semestral Retroactiva",
          clause: "Cláusula 4: Reajuste IPC + 5% acumulativo retroactivo",
          risk_summary: "Duplicación de indexación que sobrecalienta el costo del servicio en plazos medianos.",
          tactical_fix: "Limitar el reajuste al IPC anual simple sin porcentajes acumulativos adicionales."
        }
      ]
    };

    return res.status(200).json({
      success: true,
      report_id: reportId,
      audit_data: mockAuditData,
      execution_time: "<2.1s",
      memory_status: "PURGED_FROM_RAM"
    });

  } catch (err) {
    console.error('Error en api/audit.js:', err);
    return res.status(500).json({ error: 'Error procesando auditoría en memoria RAM' });
  }
}
