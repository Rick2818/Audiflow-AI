import fs from 'fs';

const html = fs.readFileSync('frontend/admin.html', 'utf8');

// Check script tags balance
const openScripts = (html.match(/<script\b[^>]*>/gi) || []).length;
const closeScripts = (html.match(/<\/script>/gi) || []).length;
console.log('Script tags:', { openScripts, closeScripts });

// Check main tags
const openMains = (html.match(/<main\b[^>]*>/gi) || []).length;
const closeMains = (html.match(/<\/main>/gi) || []).length;
console.log('Main tags:', { openMains, closeMains });

// Check tab containers
const tabs = ['leads', 'tx', 'outreach', 'seo', 'directories', 'shadow', 'verify', 'social'];
tabs.forEach(t => {
  const hasId = html.includes(`id="tab-content-${t}"`);
  console.log(`Tab tab-content-${t} exists:`, hasId);
});

// Check if tab-content-outreach closes before tab-content-seo
const outreachPos = html.indexOf('id="tab-content-outreach"');
const seoPos = html.indexOf('id="tab-content-seo"');
console.log('outreachPos:', outreachPos, 'seoPos:', seoPos);

const outreachSubstr = html.substring(outreachPos, seoPos);
// count open divs and close divs inside outreach before seo
const openDivs = (outreachSubstr.match(/<div\b[^>]*>/gi) || []).length;
const closeDivs = (outreachSubstr.match(/<\/div>/gi) || []).length;
console.log('Outreach div balance before SEO:', { openDivs, closeDivs, difference: openDivs - closeDivs });
