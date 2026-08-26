import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';

console.log('📱 Generando Kit de Posts Virales de LinkedIn para la Cuenta Personal de Ricardo (CEO)...');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 35, bottom: 35, left: 40, right: 40 },
  info: {
    Title: 'AuditFlow AI — Kit de Copywriting Viral para Cuenta Personal de LinkedIn (Ricardo)',
    Author: 'Agente Especialista de LinkedIn & Marketing B2B',
    Subject: '3 Posts Virales de Alto Impacto para Fundador & CEO (ES / EN / FR)',
    Keywords: 'LinkedIn Viral, Personal Branding, LegalTech, Founder Story, AuditFlow AI'
  }
});

const outputPath = path.join(process.cwd(), 'frontend', 'Viral_LinkedIn_Posts_Personal_Account.pdf');
const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// --- COLORES ---
const C_DARK = '#0f172a';
const C_NAVY = '#1e3a8a';
const C_BLUE = '#2563eb';
const C_EMERALD = '#059669';
const C_PURPLE = '#6b21a8';
const C_GRAY_TEXT = '#334155';

// ==========================================
// PÁGINA 1: PORTADA & POST 1 (STORYTELLING FUNDADOR)
// ==========================================
doc.rect(35, 30, 525, 65).fill(C_DARK);
doc.fillColor('#38bdf8').fontSize(18).font('Helvetica-Bold').text('KIT DE CONTENIDO VIRAL PARA LINKEDIN', 50, 42);
doc.fillColor('#ffffff').fontSize(10).font('Helvetica').text('CUENTA PERSONAL DE RICARDO (FUNDADOR & CEO • AUDITFLOW AI)', 50, 64);
doc.fillColor('#94a3b8').fontSize(8).font('Helvetica').text('Estrategia de Autoridad, Storytelling y Tracción Orgánica • audiflowai.com', 50, 78);

doc.moveDown(3.2);

// POST 1
doc.fillColor(C_PURPLE).fontSize(11).font('Helvetica-Bold').text('🔥 POST VIRAL 1: STORYTELLING DEL FUNDADOR & CASO REAL (ESPAÑOL)');
doc.rect(40, doc.y + 2, 515, 1.5).fill(C_BLUE);
doc.moveDown(0.5);

doc.fillColor(C_GRAY_TEXT).fontSize(8).font('Helvetica').lineGap(2).text(
  'El mes pasado vi a un Director Financiero a punto de firmar un contrato de servicios en la nube de $45,000 USD.\n\n' +
  'Tenía 38 páginas. Le pregunté: "¿Ya revisaste la cláusula 14.3 de indexación?"\n\n' +
  'Me dijo: "El proveedor nos aseguró que es el formato estándar de la industria".\n\n' +
  'Subimos el PDF a AuditFlow AI. En exactamente 8 segundos, el sistema encendió una alerta roja:\n\n' +
  '🚨 La cláusula estipulaba una renovación automática a 36 meses con un incremento de precio anual del 15% acumulativo y una penalización del 100% de los meses restantes por salida anticipada.\n\n' +
  'Costo de esa "letra chica": más de $14,400 USD de sobrecosto directo para la empresa.\n\n' +
  'En lugar de esperar 3 semanas a que un abogado externo redactara la contrapropuesta, AuditFlow AI generó al instante un archivo Microsoft Word (.docx con Control de Cambios):\n' +
  '• Tachó en rojo la renovación abusiva.\n' +
  '• Redactó en verde una cláusula con tope de IPC + 3% máx. y rescisión a 30 días.\n\n' +
  'El proveedor aceptó los cambios al día siguiente sin discutir.\n\n' +
  'Por eso construí AuditFlow AI en memoria RAM volátil (0 almacenamiento en disco, 100% confidencial):\n' +
  'Para que ninguna empresa vuelva a firmar a ciegas.\n\n' +
  '🎁 ¿Quieres probarlo con el contrato que tienes en tu escritorio esta semana?\n' +
  'Comenta la palabra "AUDITORIA" y te envío un acceso directo para probar tu primer contrato 100% gratis.\n\n' +
  '#LegalTech #DirectoresFinancieros #ContratosMercantiles #CFO #AuditFlowAI #EmprendimientoB2B'
);

// ==========================================
// PÁGINA 2: POST 2 (CONTRARIAN VS CHATGPT)
// ==========================================
doc.addPage();
doc.rect(35, 30, 525, 45).fill(C_DARK);
doc.fillColor('#38bdf8').fontSize(13).font('Helvetica-Bold').text('🔥 POST VIRAL 2: POSTURA CONTRARIA & DIFERENCIADOR VS CHATGPT', 50, 42);
doc.fillColor('#ffffff').fontSize(8.5).font('Helvetica').text('Enfoque Técnico y Educativo de Alta Autoridad para Directores Jurídicos y CEOs', 50, 58);

doc.moveDown(2.5);

doc.fillColor(C_NAVY).fontSize(10.5).font('Helvetica-Bold').text('POST EN ESPAÑOL (Ideal para generar debate técnico):');
doc.rect(40, doc.y + 2, 515, 1).fill(C_EMERALD);
doc.moveDown(0.4);

doc.fillColor(C_GRAY_TEXT).fontSize(8).font('Helvetica').lineGap(2).text(
  'Por qué pedirle a ChatGPT que revise los contratos de tu empresa es un peligro operativo (y qué debes hacer en su lugar):\n\n' +
  '1. Riesgo de Confidencialidad: Subir contratos con nombres de clientes o tarifas a LLMs públicos puede violar acuerdos de confidencialidad (NDA) si los datos se usan para re-entrenar modelos.\n\n' +
  '2. El Problema del "Texto Plano": ChatGPT te devuelve un resumen de texto. Pero un Director Legal no puede enviarle un párrafo de chat a un proveedor; necesita un archivo Word (.docx con Control de Cambios / Redline oficial).\n\n' +
  '3. Alucinación Normativa: Los modelos genéricos no calculan la fuga cuantitativa en dólares ni aplican topes inflacionarios estrictos de mercado.\n\n' +
  'Cuando diseñamos AuditFlow AI, resolvimos estos 3 problemas de raíz:\n' +
  '🔒 Memoria RAM Efímera: El contrato se analiza en memoria volátil y se destruye en <10 segundos (conforme a SOC-2 y GDPR).\n' +
  '📄 Entregable Real en Word: Genera el archivo .docx con marcas rojas de tachado y contrapropuestas blindadas en verde listas para enviar.\n' +
  '💵 Métricas Cuantitativas: Te dice con precisión cuánto dinero arriesgas en penalizaciones.\n\n' +
  '¿Quieres auditar tu contrato en 10 segundos sin registrarte ni poner tu tarjeta?\n\n' +
  '👉 Comenta "AUDITORIA" y mi sistema automatizado te enviará tu acceso gratuito.\n\n' +
  '#LegalTech #CFO #GeneralCounsel #InteligenciaArtificial #AuditFlowAI'
);

// ==========================================
// PÁGINA 3: POST 3 (VERSIONES EN INGLÉS Y FRANCÉS)
// ==========================================
doc.addPage();
doc.rect(35, 30, 525, 45).fill(C_DARK);
doc.fillColor('#38bdf8').fontSize(13).font('Helvetica-Bold').text('🔥 POST VIRAL 3: VERSIONES INTERNACIONALES (ENGLISH & FRANÇAIS)', 50, 42);
doc.fillColor('#ffffff').fontSize(8.5).font('Helvetica').text('Para captar decisores en USA, Europa y Mercado Global (Regla de 3 Idiomas)', 50, 58);

doc.moveDown(2.5);

// ENGLISH
doc.fillColor(C_NAVY).fontSize(10).font('Helvetica-Bold').text('🇺🇸 VERSION IN ENGLISH (Keyword: "AUDIT")');
doc.rect(40, doc.y + 2, 515, 1).fill(C_BLUE);
doc.moveDown(0.4);
doc.fillColor(C_GRAY_TEXT).fontSize(7.5).font('Helvetica').lineGap(1.8).text(
  'The most expensive mistake a CFO can make is assuming a vendor contract is "standard".\n\n' +
  'Last week we ran an audit on a 40-page SaaS contract in under 10 seconds with AuditFlow AI. Here is what we uncovered:\n' +
  '• 36-month automatic renewal without prior written notice.\n' +
  '• An uncapped 15% annual price increase.\n' +
  '• Zero financial credits for system outages (downtime).\n\n' +
  'Total financial risk: $28,000+ USD in hidden liabilities.\n\n' +
  'Instead of waiting weeks for manual legal review, AuditFlow AI instantly generated a native Microsoft Word (.docx with Track Changes):\n' +
  '🔴 Red strikethroughs on unfair terms.\n' +
  '🟢 Green enforceable counter-clauses (strict 3% CPI cap & 30-day exit clause).\n\n' +
  'Processed entirely in volatile RAM (0 disk storage, SOC-2 & GDPR compliant).\n\n' +
  '🎁 Want to test it with your company agreements?\n' +
  'Comment "AUDIT" below and I will send you direct access to test your 1st contract 100% free.\n\n' +
  '#LegalTech #GeneralCounsel #ContractManagement #CFO #AuditFlowAI'
);

doc.moveDown(0.6);

// FRANÇAIS
doc.fillColor(C_NAVY).fontSize(10).font('Helvetica-Bold').text('🇫🇷 VERSION EN FRANÇAIS (Mot-clé: "AUDIT")');
doc.rect(40, doc.y + 2, 515, 1).fill(C_PURPLE);
doc.moveDown(0.4);
doc.fillColor(C_GRAY_TEXT).fontSize(7.5).font('Helvetica').lineGap(1.8).text(
  'Pourquoi confier l\'analyse de vos contrats commerciaux à une IA générique comme ChatGPT est une erreur stratégique :\n\n' +
  '1. Absence de confidentialité : Risque d\'exposition de données sensibles.\n' +
  '2. Pas de livrable juridique : ChatGPT fournit du texte brut, alors qu\'un Directeur Juridique a besoin d\'un fichier Word avec suivi des modifications.\n\n' +
  'Avec AuditFlow AI, l\'analyse s\'effectue en mémoire RAM volatile en moins de 10 secondes (zéro stockage disque, conforme RGPD) et produit directement un fichier Word (.docx avec marques de révision).\n\n' +
  '🎁 Vous souhaitez tester gratuitement sur un de vos contrats ?\n' +
  'Commentez le mot "AUDIT" et je vous envoie votre accès immédiat.\n\n' +
  '#LegalTech #DirecteurJuridique #ContratsB2B #AuditFlowAI'
);

// Pie de página
const range = doc.bufferedPageRange();
for (let i = range.start; i < (range.start + range.count); i++) {
  doc.switchToPage(i);
  doc.fontSize(7.5).fillColor('#94a3b8').text(
    `AuditFlow AI Corp. • Kit de Contenido Viral para LinkedIn (Cuenta Personal de Ricardo) • Página ${i + 1} de ${range.count}`,
    40,
    doc.page.height - 25,
    { align: 'center', width: 515 }
  );
}

doc.end();

writeStream.on('finish', () => {
  console.log(`✅ Kit de Posts Virales generado exitosamente en: ${outputPath}`);
});
