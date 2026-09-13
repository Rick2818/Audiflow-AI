/**
 * AuditFlow AI - Módulo de Auditoría y Clasificación de Documentos
 * Categoriza formatos (PDF, Word docx, Imagen OCR) y gestiona estados de escaneo.
 */

export const AuditScanner = {
    detectFormat(fileName, mimeType = '') {
        const name = (fileName || '').toLowerCase();
        const mime = (mimeType || '').toLowerCase();

        if (name.endsWith('.pdf') || mime.includes('pdf')) {
            return { type: 'pdf', label: '📄 PDF Fiduciario', isMultimodal: true };
        }
        if (/\.(png|jpe?g|webp|bmp|tiff)$/i.test(name) || mime.startsWith('image/')) {
            return { type: 'image', label: '📷 Escaneo / Foto (OCR Visual)', isMultimodal: true };
        }
        if (/\.(docx|doc)$/i.test(name) || mime.includes('word') || mime.includes('officedocument')) {
            return { type: 'docx', label: '📝 Microsoft Word (.docx)', isMultimodal: false };
        }
        return { type: 'text', label: '📄 Texto / Documento Estándar', isMultimodal: false };
    },

    getScannerStages() {
        return [
            { threshold: 0.0, title: 'Iniciando escáner en memoria RAM volátil...', subtext: 'Aislamiento efímero SOC-2 / GDPR Art. 28 (0 retención)' },
            { threshold: 0.8, title: 'Cotejando cláusulas contra el Código de Comercio...', subtext: 'Verificando penalizaciones, intereses moratorios y topes de responsabilidad' },
            { threshold: 1.8, title: 'Calculando fuga financiera de EBITDA...', subtext: 'Construyendo soluciones de redline y rescate patrimonial en memoria RAM' },
            { threshold: 2.8, title: '¡Auditoría fiduciaria completada con éxito!', subtext: 'Generando certificado de integridad SHA-256' }
        ];
    }
};

if (typeof window !== 'undefined') {
    window.AuditScanner = AuditScanner;
}
