const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');

const regex = /<([a-zA-Z0-9]+)([^>]*)>([^<]+)<\/\1>/g;
let m;
const missing = [];
while ((m = regex.exec(html)) !== null) {
  const tag = m[1].toLowerCase();
  const attrs = m[2];
  const text = m[3].trim();
  if (!text) continue;
  if (['script', 'style', 'head', 'title', 'meta'].includes(tag)) continue;
  if (/^[0-9$%.,\/\s+\-•→✕⚡🔒]+$/.test(text)) continue;
  if (text.length < 3) continue;
  
  if (!attrs.includes('data-i18n') && !attrs.includes('id=rep-') && !attrs.includes('id=scan-') && !attrs.includes('id=sample-')) {
 missing.push({ tag, text });
 }
}

console.log('Total untagged visible text elements in index.html:', missing.length);
missing.forEach((item, i) => {
 console.log([] <>: );
});
