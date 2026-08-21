import fs from 'fs';
import path from 'path';

const markdownPath = path.join(process.cwd(), 'MASTER_PROMPT_BLUEPRINT.md');
const docPathWorkspace = path.join(process.cwd(), 'MASTER_PROMPT_BLUEPRINT.doc');
const docPathArtifact = 'C:\\Users\\Ricardo\\.gemini\\antigravity\\brain\\1b74fe70-ca6a-4d85-8c65-a075df1bb7a1\\MASTER_PROMPT_BLUEPRINT.doc';

const mdText = fs.readFileSync(markdownPath, 'utf8');

// Convert Markdown to clean HTML suitable for Word .doc
let htmlContent = mdText
  .replace(/^# (.*$)/gim, '<h1 style="color: #047857; font-family: Arial, sans-serif; font-size: 22pt; margin-top: 20px;">$1</h1>')
  .replace(/^## (.*$)/gim, '<h2 style="color: #065f46; font-family: Arial, sans-serif; font-size: 16pt; margin-top: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">$1</h2>')
  .replace(/^### (.*$)/gim, '<h3 style="color: #1e293b; font-family: Arial, sans-serif; font-size: 13pt; margin-top: 12px;">$1</h3>')
  .replace(/^\* (.*$)/gim, '<li style="font-family: Arial, sans-serif; font-size: 10.5pt; margin-bottom: 4px; color: #334155;">$1</li>')
  .replace(/^- (.*$)/gim, '<li style="font-family: Arial, sans-serif; font-size: 10.5pt; margin-bottom: 4px; color: #334155;">$1</li>')
  .replace(/^> (.*$)/gim, '<blockquote style="background-color: #f1f5f9; border-left: 4px solid #10b981; padding: 10px; font-style: italic; color: #475569; margin: 10px 0;">$1</blockquote>')
  .replace(/```markdown([\s\S]*?)```/g, '<pre style="background-color: #0b0f19; color: #10b981; padding: 15px; font-family: Consolas, monospace; font-size: 9.5pt; border-radius: 6px; white-space: pre-wrap;">$1</pre>')
  .replace(/```([\s\S]*?)```/g, '<pre style="background-color: #0b0f19; color: #38bdf8; padding: 15px; font-family: Consolas, monospace; font-size: 9.5pt; border-radius: 6px; white-space: pre-wrap;">$1</pre>')
  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

// Paragraph wrapping
htmlContent = htmlContent.split('\n\n').map(p => {
  if (p.startsWith('<h') || p.startsWith('<li') || p.startsWith('<blockquote') || p.startsWith('<pre')) {
    return p;
  }
  return `<p style="font-family: Arial, sans-serif; font-size: 10.5pt; line-height: 1.5; color: #1e293b; margin-bottom: 10px;">${p}</p>`;
}).join('\n');

const wordDocument = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>AuditFlow AI Master Prompt Blueprint 2.0</title>
<!--[if gte mso 9]>
<xml>
 <w:WordDocument>
  <w:View>Print</w:View>
  <w:Zoom>100</w:Zoom>
  <w:DoNotOptimizeForBrowser/>
 </w:WordDocument>
</xml>
<![endif]-->
<style>
@page {
    size: 21cm 29.7cm;
    margin: 2cm 2cm 2cm 2cm;
    mso-page-orientation: portrait;
}
body {
    font-family: 'Arial', sans-serif;
    color: #1e293b;
    background-color: #ffffff;
}
</style>
</head>
<body>
<div style="background-color: #0b0f19; padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
    <h1 style="color: #10b981; font-family: Arial, sans-serif; font-size: 24pt; margin: 0;">AuditFlow AI</h1>
    <p style="color: #9ca3af; font-family: Arial, sans-serif; font-size: 11pt; margin-top: 5px;">Master Prompt Blueprint 2.0 — Fábrica de MicroSaaS B2B de Alta Conversión</p>
</div>

${htmlContent}

<div style="margin-top: 40px; border-top: 2px solid #e2e8f0; padding-top: 15px; text-align: center; font-size: 9pt; color: #64748b; font-family: Arial, sans-serif;">
    © 2026 AuditFlow AI • Documento Oficial de Arquitectura y Estrategia B2B
</div>
</body>
</html>
`;

fs.writeFileSync(docPathWorkspace, wordDocument, 'utf8');
try {
  fs.writeFileSync(docPathArtifact, wordDocument, 'utf8');
} catch (e) {}
console.log('DOC files generated successfully!');

