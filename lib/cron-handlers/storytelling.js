import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';
import { CONFIG } from '../config.js';
import { getStorytellingCloudState, saveStorytellingCloudState } from '../cloud-state.js';
import { verifyAdminAuth } from '../security.js';
import dotenv from 'dotenv';

dotenv.config();

function loadStorytellingLeads() {
  const leadsMap = new Map();
  const csvFiles = [
    path.join(process.cwd(), 'Waalaxy', 'DIRECTORES_LEGALES_250_WAALAXY.csv'),
    path.join(process.cwd(), 'Waalaxy', 'waalaxy_pareto_top_medianos_25abog.csv')
  ];

  for (const filePath of csvFiles) {
    if (!fs.existsSync(filePath)) continue;
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.trim().split('\n');
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const regex = /(".*?"|[^",]+)(?=\s*,|\s*$)/g;
        const matches = line.match(regex);
        if (!matches || matches.length < 7) continue;

        let fn = '', ln = '', company = '', role = '', email = '';
        if (filePath.includes('DIRECTORES_LEGALES_250_WAALAXY')) {
          fn = (matches[1] || '').replace(/"/g, '').trim();
          ln = (matches[2] || '').replace(/"/g, '').trim();
          company = (matches[3] || '').replace(/"/g, '').trim();
          role = (matches[4] || '').replace(/"/g, '').trim();
          email = (matches[6] || '').replace(/"/g, '').trim().toLowerCase();
        } else {
          fn = (matches[0] || '').replace(/"/g, '').trim();
          ln = (matches[1] || '').replace(/"/g, '').trim();
          role = (matches[2] || '').replace(/"/g, '').trim();
          company = (matches[3] || '').replace(/"/g, '').trim();
          email = (matches[6] || '').replace(/"/g, '').trim().toLowerCase();
        }

        if (email && email.includes('@') && !leadsMap.has(email)) {
          leadsMap.set(email, {
            name: `${fn} ${ln}`.trim() || company,
            firstName: fn,
            lastName: ln,
            company,
            role: role || 'Managing Partner / Director Legal',
            email
          });
        }
      }
    } catch (_) {}
  }
  return Array.from(leadsMap.values());
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-password, x-vercel-cron');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const isVercelCron = Boolean(
    req.headers['x-vercel-cron'] === '1' ||
    (req.headers['user-agent'] || '').includes('vercel-cron')
  );
  const tokenCandidate = req.query?.token || req.query?.admin_password || '';
  const isTokenAuth = tokenCandidate === (process.env.ADMIN_PASSWORD || 'AuditFlow2026!');
  const isAuthorized = isVercelCron || isTokenAuth || verifyAdminAuth(req);

  if (!isAuthorized) {
    return res.status(401).json({ success: false, error: 'No autorizado.' });
  }

  const timestamp = new Date().toISOString();
  const leads = loadStorytellingLeads();
  const state = await getStorytellingCloudState();

  if (req.query?.dryRun === 'true') {
    return res.status(200).json({
      dryRun: true,
      event: 'VERCEL_CRON_STORYTELLING_DRY_RUN',
      timestamp,
      totalLeadsLoaded: leads.length,
      currentState: state
    });
  }

  const resendKey = process.env.RESEND_API_KEY || CONFIG.EMAIL?.RESEND_API_KEY;
  if (!resendKey) {
    return res.status(500).json({ success: false, error: 'Falta RESEND_API_KEY.' });
  }

  const resend = new Resend(resendKey);
  const batchSize = state.batchSize || 65;
  const startIndex = (state.currentIndex || 0) % (leads.length || 1);
  let batch = leads.slice(startIndex, startIndex + batchSize);
  if (batch.length === 0 && leads.length > 0) {
    batch = leads.slice(0, batchSize);
  }

  let sent = 0;
  let failed = 0;

  for (const lead of batch) {
    try {
      await resend.emails.send({
        from: 'Directora de Marketing | AuditFlow AI <cmvo@audiflowai.com>',
        replyTo: 'tendenciaiatufuturo@gmail.com',
        to: lead.email,
        subject: '[Caso Real] 45 páginas revisadas, pero faltó leer una palabra en el Anexo C',
        html: `<div style="font-family: Arial, sans-serif; background: #0b0f19; color: #fff; padding: 25px; border-radius: 8px;">
          <h3 style="color: #38bdf8;">AUDITFLOW AI | Expediente Forense Contractual</h3>
          <p>Estimado/a <strong>${lead.name}</strong> (${lead.company}):</p>
          <p>En este informe forense analizamos la cláusula de ajuste retroactivo que trasladó $142,000 USD a una empresa mediana en su mes 12.</p>
          <p>Audite sus contratos en memoria RAM volátil en 8.2 segundos:</p>
          <p><a href="https://audiflowai.com/?ref=cron-storytelling&lead=${encodeURIComponent(lead.firstName || '')}" style="color: #38bdf8; font-weight: bold;">Probar Auditoría Forense en Vivo &rarr;</a></p>
        </div>`
      });
      sent++;
    } catch (e) {
      failed++;
    }
  }

  const newIndex = (startIndex + batch.length) % (leads.length || 1);
  const updatedState = {
    ...state,
    currentIndex: newIndex,
    totalSent: (state.totalSent || 0) + sent,
    lastRunAt: timestamp
  };

  await saveStorytellingCloudState(updatedState);

  return res.status(200).json({
    event: 'VERCEL_CRON_STORYTELLING_SUCCESS',
    timestamp,
    batchTarget: batch.length,
    sentCount: sent,
    failedCount: failed,
    nextIndex: newIndex
  });
}
