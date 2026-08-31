#!/usr/bin/env node
import { MetaAdsInstagramMcp } from '../lib/meta-ads-instagram-mcp.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — META ADS & INSTAGRAM MCP SERVER (STDIO JSON-RPC)
 * ==============================================================================
 */

const mcpClient = new MetaAdsInstagramMcp();

const TOOLS = [
  {
    name: 'publish_instagram_carousel',
    description: 'Publica un carrusel interactivo de diapositivas en Instagram con la Graph API.',
    inputSchema: {
      type: 'object',
      properties: {
        mediaUrls: {
          type: 'array',
          items: { type: 'string' },
          description: 'Lista de URLs públicas de las diapositivas (mínimo 2 imágenes).'
        },
        caption: {
          type: 'string',
          description: 'Texto del post con hashtags, gancho y llamado a la acción (CTA).'
        }
      },
      required: ['mediaUrls', 'caption']
    }
  },
  {
    name: 'publish_instagram_reel',
    description: 'Publica un video/Reel vertical (9:16) en el feed y pestaña de Reels de Instagram.',
    inputSchema: {
      type: 'object',
      properties: {
        videoUrl: {
          type: 'string',
          description: 'URL pública del video en formato MP4.'
        },
        caption: {
          type: 'string',
          description: 'Texto y hashtags para el Reel.'
        },
        coverUrl: {
          type: 'string',
          description: 'URL opcional para la imagen de portada/thumbnail.'
        }
      },
      required: ['videoUrl', 'caption']
    }
  },
  {
    name: 'get_instagram_insights',
    description: 'Obtiene métricas de rendimiento de la cuenta de Instagram (alcance, impresiones, interacciones).',
    inputSchema: {
      type: 'object',
      properties: {
        metrics: {
          type: 'array',
          items: { type: 'string' },
          description: 'Lista de métricas a consultar (ej. impressions, reach, profile_views).'
        }
      }
    }
  },
  {
    name: 'create_meta_instagram_campaign',
    description: 'Crea una campaña publicitaria en Meta Ads orientada a conversiones y leads para Instagram.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Nombre descriptivo de la campaña.' },
        objective: { type: 'string', description: 'Objetivo de Meta Ads (OUTCOME_LEADS, OUTCOME_SALES, OUTCOME_TRAFFIC).' },
        dailyBudget: { type: 'number', description: 'Presupuesto diario en centavos de USD (ej. 2000 = $20.00).' }
      },
      required: ['name']
    }
  },
  {
    name: 'create_meta_instagram_adset',
    description: 'Crea un conjunto de anuncios en Meta Ads segmentado exclusivamente para ubicaciones de Instagram (Feeds, Stories, Reels).',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'string', description: 'ID de la campaña en Meta Ads.' },
        name: { type: 'string', description: 'Nombre del conjunto de anuncios.' },
        dailyBudgetInCents: { type: 'number', description: 'Presupuesto diario en centavos.' },
        countries: {
          type: 'array',
          items: { type: 'string' },
          description: 'Códigos ISO de países objetivo (ej. MX, CO, CL, PE, PA, ES).'
        }
      },
      required: ['campaignId']
    }
  }
];

let buffer = '';

process.stdin.on('data', async (chunk) => {
  buffer += chunk.toString();
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const message = JSON.parse(line);
      await handleMessage(message);
    } catch (err) {
      console.error('[MCP Server] Error procesando mensaje:', err.message);
    }
  }
});

async function handleMessage(message) {
  const { id, method, params } = message;

  if (method === 'initialize') {
    sendResponse({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: {
          name: 'meta-ads-instagram-mcp',
          version: '1.0.0'
        }
      }
    });
    return;
  }

  if (method === 'tools/list') {
    sendResponse({
      jsonrpc: '2.0',
      id,
      result: {
        tools: TOOLS
      }
    });
    return;
  }

  if (method === 'tools/call') {
    const { name, arguments: args } = params;
    try {
      let result;
      switch (name) {
        case 'publish_instagram_carousel':
          result = await mcpClient.publishCarousel(args);
          break;
        case 'publish_instagram_reel':
          result = await mcpClient.publishReel(args);
          break;
        case 'get_instagram_insights':
          result = await mcpClient.getInstagramInsights(args?.metrics);
          break;
        case 'create_meta_instagram_campaign':
          result = await mcpClient.createCampaign(args);
          break;
        case 'create_meta_instagram_adset':
          result = await mcpClient.createInstagramAdSet(args);
          break;
        default:
          throw new Error(`Herramienta desconocida: ${name}`);
      }

      sendResponse({
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
      });
    } catch (err) {
      sendResponse({
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: err.message
        }
      });
    }
  }
}

function sendResponse(response) {
  process.stdout.write(JSON.stringify(response) + '\n');
}
