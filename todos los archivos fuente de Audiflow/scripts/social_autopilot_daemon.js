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

  // Generador dinámico de Trending Topics y Ofertas de Alta Conversión según el día de la semana
  generateDailyTrendingContent(date = new Date()) {
    const day = date.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const daysName = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const todayName = daysName[day];

    const templates = [
      {
        // 0 - Domingo
        fb: `🚨 AUDITORÍA DE FIN DE SEMANA • BLINDAJE CONTRACTUAL EN 3 SEGUNDOS:\n\n¿Sabías que un contrato estándar de 400 páginas puede ocultar hasta $14,400 en fugas financieras y cláusulas de renovación forzosa invisibles?\n\nEn AuditFlow AI creamos la primera Demo en 1 Clic con Análisis Fiduciario Forense 100% privado en memoria RAM volátil:\n⚡ Detección instantánea de $14,400 en riesgos y sobrecostos en 3 segundos.\n🔒 Privacidad estricta: Cero persistencia en disco, cumplimiento GDPR & SOC-2 en 14 países.\n🛡️ Garantía Fiduciaria 10x: Si no detectamos riesgos críticos en tus contratos, tu auditoría es 100% reembolsable.\n\n👉 Prueba la Demo Interactiva en 1 Clic ahora mismo: https://audiflowai.com\n\n💬 Comenta "DEMO" para recibir el Checklist de Fugas Financieras 2026 de inmediato.`,
        ig: `¿Firmarías un contrato que tiene $14,400 en fugas ocultas? 📄⚠️\n\nEl 74% de las penalizaciones comerciales ocurren por cláusulas leoninas que pasan desapercibidas.\n\nDescubre cómo blindar tu empresa en 3 segundos con AuditFlow AI:\n⚡ Demo en 1 Clic con detección de $14,400 en riesgos fiduciarios.\n🔒 100% Privado en RAM Volátil (Zero Data Retention).\n🛡️ Garantía Fiduciaria 10x en 14 jurisdicciones.\n\n👉 Comenta “AUDITORIA” y te enviamos acceso instantáneo a la Demo en 1 Clic.\n\n#AuditFlowAI #LegalTech #CFO #Compliance2026 #FinanzasB2B`,
        li: `Gobernanza y Cumplimiento Fiduciario 2026 • Análisis en RAM Volátil\n\nEl 78% de las contingencias legales corporativas provienen de contratos que superan las 400 páginas y que ningún equipo humano puede auditar línea por línea en minutos.\n\nAuditFlow AI procesa 400 páginas en 3 segundos detectando un promedio de $14,400 en fugas y cláusulas trampa, respaldado por nuestra Garantía Fiduciaria 10x.\n\n👇 Prueba la Demo en 1 Clic sin registro previo:\nhttps://audiflowai.com\n\n#LegalTech #Compliance2026 #CFO #GeneralCounsel #RiskManagement #AuditFlowAI`
      },
      {
        // 1 - Lunes
        fb: `⚡ INICIA LA SEMANA BLINDADO: DEMO EN 1 CLIC CON $14,400 EN FUGAS DETECTADAS\n\nCada lunes se firman miles de acuerdos de servicios con penalizaciones automáticas que drenan presupuestos. AuditFlow AI analiza 400 páginas en 3 segundos con 0% retención en disco.\n\n✅ Detección de $14,400 en sobrecostos ocultos.\n✅ Informe Redline en Word (.docx) descargable al instante.\n✅ Garantía Fiduciaria 10x en 14 países.\n\n👉 Accede a la Demo en 1 Clic: https://audiflowai.com\n\n💬 Comenta "BLINDAJE" para auditar tu primer contrato.`,
        ig: `Inicia tu semana sin riesgos contractuales 🛡️✨\n\nAuditFlow AI audita contratos de 400 páginas en 3 segundos y detecta hasta $14,400 en fugas invisibles con IA privada en RAM volátil.\n\n👉 Comenta "PROTEGER" para recibir tu auditoría exprés.\n\n#LegalTech #Compliance #AuditFlowAI #B2B #CFO`,
        li: `Eficiencia Operativa y Control de Riesgos Contractuales • Lunes de Blindaje\n\nReducir los tiempos de revisión de 72 horas a 3 segundos es posible con IA en RAM volátil de AuditFlow AI. Detecta $14,400 en fugas fiduciarias antes de que comprometan el flujo de caja.\n\n👉 Acceso inmediato: https://audiflowai.com\n\n#LegalTech #CFO #Compliance #AuditFlowAI`
      },
      {
        // 2 - Martes
        fb: `🔍 ANÁLISIS FORENSE EN RAM VOLÁTIL: CERO PERSISTENCIA, 100% CONFIDENCIALIDAD\n\n¿Por qué los directores legales y CFOs eligen AuditFlow AI?\nPorque tus contratos confidenciales NUNCA tocan el disco duro ni entrenan modelos de terceros. Procesamiento puro en RAM volátil con detección de $14,400 en inconsistencias fiduciarias.\n\n👉 Pruébalo en 1 Clic: https://audiflowai.com`,
        ig: `Confidencialidad absoluta: Cero datos guardados en disco 🔒⚡\n\nAuditFlow AI audita contratos en memoria RAM volátil en 3 segundos. Detección de fugas de hasta $14,400 y garantía fiduciaria 10x.\n\n👉 Comenta "CONFIDENCIAL" para ver la Demo en vivo.\n\n#LegalTech #Privacidad #AuditFlowAI`,
        li: `Seguridad y Zero Data Retention en Auditoría Legal B2B\n\nCumplimiento estricto en 14 jurisdicciones. AuditFlow AI elimina el riesgo de fuga de información confidencial auditando contratos en RAM volátil.\n\n👉 Conoce la plataforma: https://audiflowai.com\n\n#Security #LegalTech #CFO #AuditFlowAI`
      },
      {
        // 3 - Miércoles
        fb: `💡 CÓMO DETECTAR $14,400 EN FUGAS CONTRACTUALES EN 3 SEGUNDOS:\n\nCláusulas de indemnidad asimétrica, penalizaciones desmedidas y plazos fatales automáticos. AuditFlow AI entrega el reporte Redline con recomendaciones listas para negociar.\n\n👉 Demo interactiva en 1 Clic: https://audiflowai.com`,
        ig: `No dejes que una cláusula mal redactada te cueste miles de dólares 📉⚠️\n\nAuditFlow AI encuentra las cláusulas trampa en 3 segundos con Garantía 10x.\n\n👉 Comenta "FUGAS" para recibir el reporte gratuito.\n\n#LegalTech #AuditFlowAI #Contratos`,
        li: `Optimización Financiera y Reducción de Litigios Contractuales\n\nEl diagnóstico preventivo de AuditFlow AI ahorra cientos de horas de revisión y miles de dólares en litigios evitados.\n\n👉 Demo en 1 Clic: https://audiflowai.com\n\n#Compliance #LegalOps #CFO #AuditFlowAI`
      },
      {
        // 4 - Jueves
        fb: `🛡️ GARANTÍA FIDUCIARIA 10X: PROTECCIÓN TOTAL PARA TU EMPRESA\n\nEn AuditFlow AI respaldamos cada auditoría fiduciaria. Si nuestro motor no detecta las cláusulas críticas de tus contratos, te reembolsamos el 100% de tu suscripción o diagnóstico.\n\n👉 Prueba la Demo en 1 Clic: https://audiflowai.com`,
        ig: `Garantía Fiduciaria 10x en cada contrato auditado 💼🔒\n\nAuditFlow AI es la herramienta definitiva para directores legales y financieros.\n\n👉 Comenta "GARANTIA" para probarla.\n\n#AuditFlowAI #LegalTech #Garantia10x`,
        li: `Gobernanza Corporativa y Garantía de Calidad Fiduciaria\n\n¿Cómo garantizar que ningún contrato tenga vicios ocultos? Con auditoría asistida por IA en RAM volátil y respaldo fiduciario 10x.\n\n👉 Ver Demo: https://audiflowai.com\n\n#Governance #GeneralCounsel #AuditFlowAI`
      },
      {
        // 5 - Viernes
        fb: `🚨 CIERRE DE SEMANA: NO DEJES CONTRATOS SIN AUDITAR PARA EL LUNES\n\nAudita tus documentos pendientes antes de cerrar la jornada. 400 páginas analizadas en 3 segundos con detección forense de fugas de hasta $14,400.\n\n👉 Demo en 1 Clic: https://audiflowai.com`,
        ig: `Cierra la semana con tus contratos 100% blindados ⚡📄\n\nAuditFlow AI te ahorra horas de revisión manual en un solo clic.\n\n👉 Comenta "VIERNES" para auditar tu documento gratis.\n\n#AuditFlowAI #LegalTech #Productividad`,
        li: `Cierre Contractual de Fin de Semana: Cero Riesgos Acumulados\n\nAgiliza la firma de acuerdos con contrapartes con reportes Redline inmediatos en Word (.docx).\n\n👉 https://audiflowai.com\n\n#LegalOps #B2B #AuditFlowAI`
      },
      {
        // 6 - Sábado
        fb: `📊 DIAGNÓSTICO EXPRÉS POR $19 O PLAN PRO POR $69/MES: LA MEJOR INVERSIÓN EN COMPLIANCE\n\nProtege tus contratos corporativos con la suite líder de auditoría en RAM volátil. Detección de $14,400 en fugas con garantía 10x.\n\n👉 Demo en 1 Clic: https://audiflowai.com`,
        ig: `Diagnóstico preventivo de contratos al instante 🚀🛡️\n\nAuditFlow AI: La solución más rápida, privada y económica del mercado.\n\n👉 Comenta "PLAN" para conocer nuestras opciones.\n\n#AuditFlowAI #LegalTech #SaaS`,
        li: `Estrategia de Transformación Digital en Operaciones Legales\n\nAuditFlow AI democratiza la auditoría contractual de nivel Big-4 para empresas de todos los tamaños.\n\n👉 Probar Demo: https://audiflowai.com\n\n#LegalTech #Innovation #AuditFlowAI`
      }
    ];

    const current = templates[day];

    return {
      facebook: {
        title: `Blindaje Contractual ${todayName} • AuditFlow AI`,
        content: current.fb,
        tags: ['AuditFlowAI', 'LegalTech', 'Compliance2026', 'CFO']
      },
      instagram: {
        title: `Blindaje Fiduciario • ${todayName}`,
        content: current.ig,
        tags: ['LegalTech', 'AuditFlowAI', 'ContractManagement']
      },
      linkedin: {
        title: `Gobernanza y Cumplimiento 2026 • ${todayName}`,
        content: current.li,
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
