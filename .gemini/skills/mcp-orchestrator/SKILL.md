---
name: mcp-orchestrator
description: Antigravity Skill para orquestar y configurar servidores MCP (Model Context Protocol) como Fetch, Puppeteer, GitHub y PostgreSQL/Supabase en proyectos MicroSaaS.
---

# MCP SERVER ORCHESTRATOR SKILL

Esta skill define la configuración estandarizada de servidores **Model Context Protocol (MCP)** para permitir que el agente Antigravity se conecte con herramientas externas y bases de datos de forma autónoma.

## 🔌 Servidores MCP Soportados y Configuración

El archivo de configuración `mcp_config.json` define los servidores MCP Stdio y SSE activos:

```json
{
  "mcpServers": {
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    },
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"]
    }
  }
}
```

## 🎯 Casos de Uso por Servidor

1. **`fetch`**: Extraer datos estructurados de páginas públicas, documentación de APIs y servicios web sin ejecutar JavaScript pesado.
2. **`puppeteer`**: Realizar auditorías visuales de UI, tomar capturas de pantalla de navegadores headless y verificar el diseño responsive.
3. **`github`**: Crear automatizaciones, Pull Requests y releases directamente en repositorios GitHub.
4. **`postgres`**: Consultar métricas de conversión, registros de leads y tablas de Supabase/PostgreSQL en tiempo real.
