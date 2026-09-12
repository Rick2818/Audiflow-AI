/**
 * ==============================================================================
 * AUDITFLOW AI — MICROSASS METRICS & UNIT ECONOMICS MCP SERVER
 * ==============================================================================
 * Protocol: Model Context Protocol (MCP) via STDIO (JSON-RPC 2.0)
 * Description: Herramientas fiduciarias para calculo y auditoria de Micro-SaaS B2B
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
    name: 'calculate_unit_economics',
    description: 'Calcula las metricas fiduciarias de un Micro-SaaS: MRR, ARR, CAC, LTV, Ratio LTV/CAC, Payback y Margen Operativo en USD.',
    inputSchema: {
      type: 'object',
      properties: {
        activeSubscribers: { type: 'number', description: 'Numero de suscriptores activos' },
        monthlyPriceUsd: { type: 'number', description: 'Precio promedio mensual en USD (ARPU)' },
        monthlyMarketingSpendUsd: { type: 'number', description: 'Gasto total mensual en marketing y ventas' },
        newCustomersPerMonth: { type: 'number', description: 'Nuevos clientes adquiridos en el mes' },
        monthlyChurnPercent: { type: 'number', description: 'Porcentaje de cancelacion mensual (ej. 2.5 para 2.5%)' },
        grossMarginPercent: { type: 'number', description: 'Margen bruto porcentual (ej. 85 para 85%)', default: 85 }
      },
      required: ['activeSubscribers', 'monthlyPriceUsd', 'monthlyMarketingSpendUsd', 'newCustomersPerMonth', 'monthlyChurnPercent']
    }
  },
  {
    name: 'audit_pricing_ladder',
    description: 'Audita la estructura de precios del Micro-SaaS ( Flash, /mes Pro, /ano Anual) y evalua friccion de compra y conversion esperada.',
    inputSchema: {
      type: 'object',
      properties: {
        productType: { type: 'string', description: 'Tipo de Micro-SaaS (ej. LegalTech, FinTech, Compliance)' },
        currentFlashAuditPrice: { type: 'number', description: 'Precio del informe de entrada en USD (default: 19)' },
        monthlyProPrice: { type: 'number', description: 'Precio de la suscripcion mensual en USD (default: 69)' },
        annualEnterprisePrice: { type: 'number', description: 'Precio de la licencia anual en USD (default: 590)' }
      }
    }
  },
  {
    name: 'diagnose_churn_risk',
    description: 'Evalua el riesgo de abandono (churn) de usuarios en base a dias de inactividad, documentos auditados y valor percibido.',
    inputSchema: {
      type: 'object',
      properties: {
        daysSinceLastAudit: { type: 'number', description: 'Dias transcurridos desde la ultima auditoria del cliente' },
        auditsCompletedLast30Days: { type: 'number', description: 'Contratos o facturas auditadas en los ultimos 30 dias' },
        hasExportedWordDocx: { type: 'boolean', description: 'Si el cliente ha descargado redlines en Word' }
      },
      required: ['daysSinceLastAudit', 'auditsCompletedLast30Days']
    }
  }
];

function handleToolCall(name, args) {
  if (name === 'calculate_unit_economics') {
    const { activeSubscribers, monthlyPriceUsd, monthlyMarketingSpendUsd, newCustomersPerMonth, monthlyChurnPercent, grossMarginPercent = 85 } = args;
    const mrr = activeSubscribers * monthlyPriceUsd;
    const arr = mrr * 12;
    const cac = newCustomersPerMonth > 0 ? monthlyMarketingSpendUsd / newCustomersPerMonth : 0;
    const churnDecimal = Math.max(0.001, monthlyChurnPercent / 100);
    const marginDecimal = (grossMarginPercent || 85) / 100;
    const ltv = (monthlyPriceUsd * marginDecimal) / churnDecimal;
    const ltvCacRatio = cac > 0 ? (ltv / cac) : 0;
    const monthlyContribution = monthlyPriceUsd * marginDecimal;
    const paybackMonths = monthlyContribution > 0 ? (cac / monthlyContribution) : 0;

    const healthStatus = ltvCacRatio >= 3.5 ? 'EXCELENTE (> 3.5x)' : (ltvCacRatio >= 2.5 ? 'SALUDABLE (2.5x - 3.5x)' : 'ALTO RIESGO (< 2.5x)');

    return {
      financialSummary: {
        mrrUsd: Number(mrr.toFixed(2)),
        arrUsd: Number(arr.toFixed(2)),
        cacUsd: Number(cac.toFixed(2)),
        ltvUsd: Number(ltv.toFixed(2)),
        ltvCacRatio: Number(ltvCacRatio.toFixed(2)),
        paybackMonths: Number(paybackMonths.toFixed(1)),
        grossMarginPercent,
        healthStatus
      },
      recommendations: [
        ltvCacRatio < 3.0 ? 'Incrementar precio o retencion para elevar LTV' : 'Ratio LTV/CAC optimo para escalar adquisicion',
        paybackMonths > 3 ? 'Ajustar canales de adquisicion; el payback supera los 3 meses' : 'Payback fiduciario dentro del umbral seguro (< 3 meses)'
      ]
    };
  }

  if (name === 'audit_pricing_ladder') {
    const flash = args.currentFlashAuditPrice || 19;
    const pro = args.monthlyProPrice || 69;
    const annual = args.annualEnterprisePrice || 590;

    const annualDiscountPercent = Math.round((1 - (annual / (pro * 12))) * 100);

    return {
      tierAnalysis: {
        entryTripwire: { priceUsd: flash, role: 'Romper la barrera de desconfianza financiera sin friccion' },
        recurringPro: { priceUsd: pro, role: 'Nucleo del MRR para medianas empresas y bufetes' },
        annualEnterprise: { priceUsd: annual, discountVsMonthly: `${annualDiscountPercent}%`, role: 'Flujo de caja inmediato y retencion anual' }
      },
      fiduciaryVerdict: 'Escalera de precios balanceada con psicologia B2B optima para tickets medios en USD.'
    };
  }

  if (name === 'diagnose_churn_risk') {
    const { daysSinceLastAudit, auditsCompletedLast30Days, hasExportedWordDocx } = args;
    let riskScore = 0;
    const alerts = [];

    if (daysSinceLastAudit > 14) {
      riskScore += 45;
      alerts.push('Inactividad prolongada: Mas de 14 dias sin auditorias.');
    } else if (daysSinceLastAudit > 7) {
      riskScore += 20;
      alerts.push('Inactividad moderada: Mas de 7 dias sin uso de la plataforma.');
    }

    if (auditsCompletedLast30Days < 2) {
      riskScore += 35;
      alerts.push('Sub-utilizacion: Menos de 2 auditorias ejecutadas en el mes.');
    }

    if (!hasExportedWordDocx) {
      riskScore += 20;
      alerts.push('Falta de adopcion del activo clave: No ha descargado informe en Word (.docx).');
    }

    const riskLevel = riskScore >= 60 ? 'ALTO RIESGO DE CANCELACION' : (riskScore >= 30 ? 'RIESGO MODERADO' : 'CLIENTE SANO / COMPROMETIDO');

    return {
      riskScore,
      riskLevel,
      alerts,
      suggestedIntervention: riskScore >= 30 ? 'Enviar plantilla de redlines sugerida o caso de estudio fiduciario de su industria.' : 'Mantener cadencia habitual.'
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
            name: 'microsaas-metrics-engine',
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

    // Metodo no soportado
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
