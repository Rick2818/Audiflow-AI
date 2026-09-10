import { Resend } from 'resend';
import { CONFIG } from '../../lib/config.js';
import { getCloudState, setCloudState } from '../../lib/cloud-state.js';
import { NORDIC_MIDMARKET_PARTNERS } from '../../scripts/nordic_midmarket_daily_sower.mjs';
import { verifyAdminAuth } from '../../lib/security.js';
import dotenv from 'dotenv';

dotenv.config();

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
  const day = new Date().getDay();

  if (req.query?.dryRun === 'true') {
    return res.status(200).json({
      dryRun: true,
      event: 'VERCEL_CRON_NORDIC_SOWER_DRY_RUN',
      timestamp,
      totalPartners: NORDIC_MIDMARKET_PARTNERS.length
    });
  }

  const resendKey = process.env.RESEND_API_KEY || CONFIG.EMAIL?.RESEND_API_KEY;
  if (!resendKey) {
    return res.status(500).json({ success: false, error: 'Falta RESEND_API_KEY.' });
  }

  const resend = new Resend(resendKey);
  const state = await getCloudState('nordic_sower_state', null, { currentIndex: 0, totalSent: 0 });

  const batchSize = 3;
  const startIndex = (day * batchSize) % NORDIC_MIDMARKET_PARTNERS.length;
  const todaysBatch = NORDIC_MIDMARKET_PARTNERS.slice(startIndex, startIndex + batchSize);

  let sent = 0;
  let failed = 0;
  const results = [];

  for (const partner of todaysBatch) {
    const trialUrl = `https://audiflowai.com/?ref=nordic-cron&lang=en&lead=${encodeURIComponent(partner.firstName)}`;
    const subject = `[Case Brief] 45 pages reviewed, but 18 words in Schedule C cost €142,000 / ${partner.firm}`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #1e293b; max-width: 580px; line-height: 1.65; margin: 0 auto; background-color: #ffffff; padding: 26px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 18px;">
          <strong style="color: #0284c7; font-size: 16px; letter-spacing: 0.5px;">AUDITFLOW AI</strong>
          <span style="color: #64748b; font-size: 12px; margin-left: 10px;">| EU Fiduciary Contracts Engine</span>
        </div>
        <p>Dear Partner ${partner.firstName},</p>
        <p>At <strong>${partner.firm}</strong> (${partner.city}), managing complex commercial vendor agreements without exposing mid-market clients to uncapped liabilities is a continuous challenge.</p>
        <p>AuditFlow AI runs 100% in volatile RAM strictly under <strong>EU GDPR Art. 28</strong>: zero permanent storage, audit in 8.2s and direct Word (.docx with Track Changes) generation.</p>
        <p><a href="${trialUrl}" style="background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; display: inline-block;">Test Complimentary Benchmark &rarr;</a></p>
      </div>
    `;

    try {
      await resend.emails.send({
        from: 'Directora de Marketing | AuditFlow AI <cmvo@audiflowai.com>',
        replyTo: 'tendenciaiatufuturo@gmail.com',
        to: partner.email,
        subject,
        html
      });
      sent++;
      results.push({ email: partner.email, status: 'sent' });
    } catch (e) {
      failed++;
      results.push({ email: partner.email, status: 'failed', error: e.message });
    }
  }

  const updatedState = {
    currentIndex: (startIndex + todaysBatch.length) % NORDIC_MIDMARKET_PARTNERS.length,
    totalSent: (state.totalSent || 0) + sent,
    lastRunAt: timestamp
  };

  await setCloudState('nordic_sower_state', updatedState);

  return res.status(200).json({
    event: 'VERCEL_CRON_NORDIC_SOWER_SUCCESS',
    timestamp,
    sentCount: sent,
    failedCount: failed,
    results
  });
}
