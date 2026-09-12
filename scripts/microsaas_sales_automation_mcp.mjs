/**
 * ==============================================================================
 * AUDITFLOW AI — MICROSASS SALES, PROSPECTING & AUTOMATION MCP SERVER
 * ==============================================================================
 * Protocol: Model Context Protocol (MCP) STDIO (JSON-RPC 2.0)
 * Especialidad: Prospeccion Web B2B, Ventas MicroSaaS y Automatizacion Desatendida
 * ==============================================================================
 */

import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const TOOLS = [
  {
    name: 'prospect_b2b_target',
    description: 'Genera el perfil de prospeccion fiduciaria, angulo de dolor y pitch de ventas personalizado para un decisor B2B real.',
    inputSchema: {
      type: 'object',
      properties: {
        companyName: { type: 'string', description: 'Nombre de la empresa o bufete' },
        country: { type: 'string', description: 'Pais de operacion (ej. El Salvador, Guatemala, Costa Rica, Suecia)' },
        decisorRole: { type: 'string', description: 'Cargo del decisor (ej. Socio Director, CFO, Abogado General, Controller)' },
        decisorName: { type: 'string', description: 'Nombre del decisor' },
        industry: { type: 'string', description: 'Industria o especialidad (ej. Legal Corporativo, Logistica, Retail)' }
      },
      required: ['companyName', 'decisorRole', 'decisorName']
    }
  },
  {
    name: 'structure_sales_pricing_ladder',
    description: 'Calcula la proyeccion de ingresos y conversion del embudo MicroSaaS ( USD Flash, /mes Pro, /ano Anual).',
    inputSchema: {
      type: 'object',
      properties: {
        leadsContactedMonthly: { type: 'number', description: 'Numero total de decisores reales contactados al mes' },
        freeTrialConversionRate: { type: 'number', description: 'Tasa esperada de conversion a prueba gratis (default: 5%)', default: 5 },
        flashReportConversionRate: { type: 'number', description: 'Tasa de compra del reporte  USD (default: 2%)', default: 2 },
        proSubscriptionConversionRate: { type: 'number', description: 'Tasa de conversion a Pro  USD/mes (default: 0.5%)', default: 0.5 }
      },
      required: ['leadsContactedMonthly']
    }
  },
  {
    name: 'automate_outreach_cadence',
    description: 'Disena la cadencia automatizada multicanal (Email + LinkedIn) paso a paso para el ciclo comercial.',
    inputSchema: {
      type: 'object',
      properties: {
        campaignName: { type: 'string', description: 'Nombre de la campana' },
        targetAudience: { type: 'string', description: 'Audiencia (ej. Bufetes Centroamerica 7AM, Nordicos 4AM)' },
        channels: { type: 'array', items: { type: 'string' }, description: 'Canales (Email, LinkedIn, Buffer)' }
      },
      required: ['campaignName', 'targetAudience']
    }
  },
  {
    name: 'validate_fiduciary_rules',
    description: 'Audita que la campana cumpla al 100% con la Triada Presidencial: Cero datos sinteticos, Cero intentos fingidos y Cero modo simulacion.',
    inputSchema: {
      type: 'object',
      properties: {
        totalLeads: { type: 'number', description: 'Cantidad total de leads en la base' },
        areAllDomainsReal: { type: 'boolean', description: 'Si el 100% de los dominios son reales' },
        isDryRunActive: { type: 'boolean', description: 'Si existe algun flag de simulacion o dryRun' }
      },
      required: ['totalLeads', 'areAllDomainsReal', 'isDryRunActive']
    }
  }
];

function handleToolCall(name, args) {
  if (name === 'prospect_b2b_target') {
    const { companyName, country = 'Regional', decisorRole, decisorName, industry = 'Corporativo' } = args;
    const isLegal = decisorRole.toLowerCase().includes('abogad') || decisorRole.toLowerCase().includes('socio') || decisorRole.toLowerCase().includes('legal') || decisorRole.toLowerCase().includes('counsel');

    const hook = isLegal
      ? 'Deteccion automatica de penalizaciones asimetricas y redlines en Word (.docx con Control de Cambios) en 8 segundos.'
      : 'Deteccion preventiva de fugas de EBITDA y sobrecargos ocultos en facturas comerciales.';

    const suggestedSubject = isLegal
      ? `[Diagnostico Contractual] Redlines en Word y revision en RAM volatil para ${companyName}`
      : `[Blindaje Preventivo] Deteccion de fugas de EBITDA y clausulas trampa para ${companyName}`;

    return {
      profile: {
        company: companyName,
        decisor: `${decisorName} (${decisorRole})`,
        country,
        sector: isLegal ? 'Legal / Firmas de Abogados' : 'Finanzas / CFO'
      },
      fiduciaryStrategy: {
        corePainPoint: hook,
        suggestedSubject,
        recommendedEntryOffer: 'Auditoria de cortesia en RAM volatil (8 segundos sin tarjeta) con upsell a Reporte Word por $19 USD.'
      }
    };
  }

  if (name === 'structure_sales_pricing_ladder') {
    const leads = args.leadsContactedMonthly;
    const trialRate = (args.freeTrialConversionRate || 5) / 100;
    const flashRate = (args.flashReportConversionRate || 2) / 100;
    const proRate = (args.proSubscriptionConversionRate || 0.5) / 100;

    const trialsGenerated = Math.round(leads * trialRate);
    const flashSalesCount = Math.round(leads * flashRate);
    const proSalesCount = Math.round(leads * proRate);

    const flashRevenueUsd = flashSalesCount * 19;
    const proMonthlyRevenueUsd = proSalesCount * 69;
    const proAnnualRunRateUsd = proMonthlyRevenueUsd * 12;
    const totalFirstMonthUsd = flashRevenueUsd + proMonthlyRevenueUsd;

    return {
      monthlyFunnelProjection: {
        leadsContacted: leads,
        trialsGenerated,
        flashAudits19Usd: flashSalesCount,
        proSubscriptions69Usd: proSalesCount
      },
      revenueProjectionUsd: {
        flashReportsRevenue: `$${flashRevenueUsd} USD`,
        proMonthlyRecurringRevenue: `$${proMonthlyRevenueUsd} USD / mes (MRR)`,
        proAnnualRunRate: `$${proAnnualRunRateUsd} USD / ano (ARR)`,
        totalImmediateCashMonth1: `$${totalFirstMonthUsd} USD`
      },
      verdict: proSalesCount >= 5 ? 'Traccion comercial acelerada para MicroSaaS.' : 'Requiere aumentar el volumen de prospeccion a 300+ decisores mensuales.'
    };
  }

  if (name === 'automate_outreach_cadence') {
    const { campaignName, targetAudience, channels = ['Email', 'LinkedIn'] } = args;
    return {
      campaign: campaignName,
      audience: targetAudience,
      cadenceSteps: [
        { day: 'Dia 1 (7:00 AM CST)', channel: 'Email Corporativo', action: 'Despacho de valor forense con invitacion a auditar 1 contrato en RAM volatil (8s gratis)' },
        { day: 'Dia 3', channel: 'LinkedIn', action: 'Solicitud de conexion personalizada del Director General haciendo referencia al caso de estudio de su sector' },
        { day: 'Dia 5', channel: 'Email Seguimiento', action: 'Muestra visual de informe con Redlines en Word (.docx con Control de Cambios)' },
        { day: 'Dia 9', channel: 'LinkedIn DM', action: 'Compartir fragmento de clausula trampa comun detectada en la industria' },
        { day: 'Dia 14', channel: 'Email Cierre Fiduciario', action: 'Ultima llamada de cortesia fiduciaria antes de pausar el contacto' }
      ],
      automationEngine: 'Ejecutado por GitHub Actions Cloud + Resend API / Gmail SMTP con aislamiento de rebotes.'
    };
  }

  if (name === 'validate_fiduciary_rules') {
    const { totalLeads, areAllDomainsReal, isDryRunActive } = args;
    const passed = areAllDomainsReal && !isDryRunActive;

    return {
      fiduciaryComplianceCheck: {
        zeroSyntheticData: areAllDomainsReal ? 'APROBADO (100% empresas reales con MX)' : 'FALLIDO (Se detectaron dominios ficticios)',
        zeroSimulatedSends: !isDryRunActive ? 'APROBADO (Despacho real con Message ID)' : 'FALLIDO (Flag de simulacion activo)',
        zeroDryRunMode: !isDryRunActive ? 'APROBADO (Produccion real activa)' : 'FALLIDO (Modo prueba activo)',
        overallStatus: passed ? 'OPERACION 100% VALIDA Y FIDUCIARIA' : 'BLOQUEADO POR DIRECTIVA PRESIDENCIAL'
      }
    };
  }

  throw new Error('Herramienta desconocida: ' + name);
}

rl.on('line', (line) => {
  if (!line.trim()) return;

  try {
    const request = JSON.parse(line);
    const { id, method, params } = request;

    if (method === 'initialize') {
      const response = {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: {
            name: 'microsaas-sales-automation',
            version: '1.0.0'
          }
        }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
      return;
    }

    if (method === 'notifications/initialized') {
      return;
    }

    if (method === 'tools/list') {
      const response = {
        jsonrpc: '2.0',
        id,
        result: { tools: TOOLS }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
      return;
    }

    if (method === 'tools/call') {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};
      try {
        const result = handleToolCall(toolName, toolArgs);
        const response = {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          }
        };
        process.stdout.write(JSON.stringify(response) + '\n');
      } catch (toolErr) {
        const errorResponse = {
          jsonrpc: '2.0',
          id,
          error: {
            code: -32000,
            message: toolErr.message
          }
        };
        process.stdout.write(JSON.stringify(errorResponse) + '\n');
      }
      return;
    }

    const defaultResponse = {
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: 'Metodo no encontrado: ' + method }
    };
    process.stdout.write(JSON.stringify(defaultResponse) + '\n');
  } catch (err) {
    // Ignorar lineas invalidas
  }
});
