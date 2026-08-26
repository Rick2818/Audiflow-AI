import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';

console.log('🖼️ Compilando Carrusel de LinkedIn (6 Diapositivas en PDF Horizontal 4:3)...');

// Formato 4:3 Horizontal (800 x 600 pt)
const doc = new PDFDocument({
  size: [800, 600],
  margins: { top: 0, bottom: 0, left: 0, right: 0 },
  info: {
    Title: 'AuditFlow AI — Las 5 Cláusulas Trampa en Contratos de Proveedores (LinkedIn Carousel)',
    Author: 'Ricardo • Fundador & CEO, AuditFlow AI Corp.',
    Subject: 'Carrusel Educativo B2B LegalTech para Directores Legales y CEOs',
    Keywords: 'AuditFlow AI, LinkedIn Carousel, LegalTech, Contract Management'
  }
});

const outputPath = path.join(process.cwd(), 'frontend', 'LinkedIn_Carousel_AuditFlow_AI.pdf');
const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

const slides = [
  { file: 'slide1_cover.jpg', title: 'Slide 1: Portada' },
  { file: 'slide2_renewal.jpg', title: 'Slide 2: Renovación Automática' },
  { file: 'slide3_inflation.jpg', title: 'Slide 3: Incrementos de Precio' },
  { file: 'slide4_sla.jpg', title: 'Slide 4: SLAs Tecnológicos' },
  { file: 'slide5_redline.jpg', title: 'Slide 5: Redline en Word' },
  { file: 'slide6_cta.jpg', title: 'Slide 6: CTA Final' }
];

slides.forEach((slide, index) => {
  if (index > 0) doc.addPage({ size: [800, 600], margins: { top: 0, bottom: 0, left: 0, right: 0 } });
  
  const imgPath = path.join(process.cwd(), 'frontend', 'images', 'carousel', slide.file);
  if (fs.existsSync(imgPath)) {
    doc.image(imgPath, 0, 0, { width: 800, height: 600 });
  } else {
    doc.rect(0, 0, 800, 600).fill('#0f172a');
    doc.fillColor('#ffffff').fontSize(24).text(slide.title, 50, 280);
  }
});

doc.end();

writeStream.on('finish', () => {
  console.log(`✅ Carrusel PDF para LinkedIn generado exitosamente en: ${outputPath}`);
});
