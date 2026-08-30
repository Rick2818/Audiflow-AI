import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

import { SocialWebhookBridge } from '../lib/social-webhook-bridge.js';

/**
 * ==============================================================================
 * AUDITFLOW AI — SOCIAL AUTOPILOT DAEMON (24/7 AUTONOMOUS ENGINE)
 * ==============================================================================
 * Motor 100% autónomo que:
 * 1. Genera y despacha publicaciones de Trending Topics los 7 días de la semana (8:00 AM).
 * 2. Monitorea y auto-responde en tiempo real a interacciones en ES, EN, FR, PT, DE.
 * 3. Opera sin requerir ninguna intervención humana ni configuraciones del usuario.
 * ==============================================================================
 */

const STORAGE_PATH = path.resolve(process.cwd(), 'social_published_feed.json');

export class SocialAutopilotDaemon {
  constructor() {
    this.bridge = new SocialWebhookBridge();
    this.isRunning = false;
  }

  // Generador dinámico de Trending Topics según el día de la semana
  generateDailyTrendingContent(date = new Date()) {
    const day = date.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const daysName = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const todayName = daysName[day];

    return {
      facebook: {
        title: `Blindaje Contractual ${todayName} • AuditFlow AI`,
        content: `🚨 ANTES DE FIRMAR CUALQUIER CONTRATO ESTE ${todayName.toUpperCase()}: El 74% de las penalizaciones contractuales en 2026 provienen de cláusulas invisibles de renovación forzosa y jurisdicción desproporcionada.\n\nEn AuditFlow AI creamos el primer auditor forense 100% privado en memoria RAM volátil:\n✅ 0% persistencia de datos (tus contratos jamás se almacenan en disco ni entrenan modelos).\n✅ Detección en 10 segundos de cláusulas leoninas y sobrecostos.\n✅ Descarga inmediata del informe Redline en Word (.docx) con control de cambios.\n\n👉 Audita tu primer contrato GRATIS en 10s: https://audiflowai.com\n\n💬 Comenta "AUDITORIA" para recibir el Checklist Fiduciario 2026 sin costo.`,
        tags: ['AuditFlowAI', 'LegalTech', 'Compliance2026', 'CFO']
      },
      instagram: {
        title: `5 Cláusulas Trampa en Contratos B2B • ${todayName}`,
        content: `Firmar un contrato sin leer la letra chica puede costarte meses de trabajo o demandas absurdas. 📄⚠️\n\nEl 85% de los litigios comerciales ocurren por 3 o 4 líneas mal redactadas.\n\nProtege tu negocio en 5 segundos con IA privada en RAM volátil:\n⚡ Sube tu documento a AuditFlow AI.\n🔒 Análisis 100% confidencial (Zero Data Retention).\n🛡️ Detección instantánea de riesgos y sugerencias de contrapropuesta.\n\n👉 Comenta “CONTRATO” y te enviamos tu auditoría 100% GRATIS.\n\n#LegalTech #InteligenciaArtificial #ContratosB2B #AuditFlowAI`,
        tags: ['LegalTech', 'AuditFlowAI', 'ContractManagement']
      },
      linkedin: {
        title: `Gobernanza y Cumplimiento 2026 • ${todayName}`,
        content: `El 78% de los litigios comerciales en 2026 provienen de cláusulas que nadie leyó con detenimiento.\n\nNo es falta de abogados; es falta de tiempo y exceso de volumen contractual.\n\nAuditFlow AI analiza, clasifica y detecta anomalías contractuales en menos de 10 segundos con privacidad estricta de datos (cero almacenamiento en disco).\n\n👇 ¿Quieres verificar la salud de tus contratos actuales?\n\nComenta "AUDITORIA" en este post para recibir un Diagnóstico Exprés Gratuito.\n\n#LegalTech #Compliance2026 #GestionDeRiesgos #B2B #AuditFlowAI #CFO #GeneralCounsel`,
        tags: ['LegalTech', 'Compliance2026', 'GeneralCounsel']
      }
    };
  }

  // Guardar en el histórico de publicaciones activas
  saveToPublishedFeed(feedItem) {
    let feed = [];
    if (fs.existsSync(STORAGE_PATH)) {
      try {
        feed = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf8'));
      } catch(e) { feed = []; }
    }
    feed.unshift(feedItem);
    if (feed.length > 50) feed = feed.slice(0, 50); // Mantener últimos 50
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(feed, null, 2), 'utf8');
  }

  // Ejecución diaria
  async executeDailyCycle() {
    const now = new Date();
    console.log(`\n============================================================`);
    console.log(`🤖 [AUTOPILOT] INICIANDO CICLO DIARIO (${now.toLocaleString()})`);
    console.log(`============================================================`);

    const content = this.generateDailyTrendingContent(now);

    const postRecord = {
      timestamp: now.toISOString(),
      dateFormatted: now.toISOString().split('T')[0],
      status: 'PUBLISHED_AUTONOMOUSLY',
      platforms: ['facebook', 'instagram', 'linkedin', 'waalaxy'],
      data: content
    };

    // Despacho a través del webhook bridge
    await this.bridge.dispatchFullDailyKit({
      facebook: content.facebook.content,
      instagram: content.instagram.content,
      linkedin: content.linkedin.content
    });

    this.saveToPublishedFeed(postRecord);
    console.log('✅ [AUTOPILOT] Publicación de hoy registrada y activa en el feed oficial.');
  }

  // Iniciar demonio continuo
  start() {
    this.isRunning = true;
    console.log('🛡️ [AUTOPILOT DAEMON] Motor autónomo 24/7 iniciado.');
    
    // Ejecutar ciclo inicial inmediatamente
    this.executeDailyCycle();

    // Comprobar cada 1 hora para ejecutar a las 8:00 AM automáticamente
    setInterval(() => {
      const now = new Date();
      if (now.getHours() === 8 && now.getMinutes() < 15) {
        this.executeDailyCycle();
      }
    }, 15 * 60 * 1000); // Chequeo cada 15 minutos
  }
}

const daemon = new SocialAutopilotDaemon();
daemon.start();
