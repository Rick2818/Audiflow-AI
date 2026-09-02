import fs from 'fs';
import path from 'path';

let suppressionCache = null;

export function getSuppressionList() {
  if (suppressionCache) return suppressionCache;
  try {
    const listPath = path.resolve(process.cwd(), 'lib/suppression_list.json');
    if (fs.existsSync(listPath)) {
      suppressionCache = JSON.parse(fs.readFileSync(listPath, 'utf8'));
      return suppressionCache;
    }
  } catch (err) {
    console.warn('[SuppressionCheck] Error loading suppression list:', err.message);
  }
  return { suppressed_emails: ['info@garrigues.com'], suppressed_domains: ['garrigues.com'], suppressed_companies: ['garrigues'] };
}

export function isSuppressed(email = '', company = '', name = '') {
  const list = getSuppressionList();
  const em = (email || '').toLowerCase().trim();
  const co = (company || '').toLowerCase().trim();
  const na = (name || '').toLowerCase().trim();

  if (list.suppressed_emails.some(e => e.toLowerCase() === em)) return true;
  if (list.suppressed_domains.some(d => em.endsWith('@' + d.toLowerCase()) || em.includes(d.toLowerCase()))) return true;
  if (list.suppressed_companies.some(c => co.includes(c.toLowerCase()) || na.includes(c.toLowerCase()))) return true;

  return false;
}