---
name: contract-copilot
description: Antigravity Skill para integrar asistentes conversacionales de Inteligencia Artificial (Chat with Document / Contract Copilot) en aplicaciones B2B de auditoría de contratos y facturación.
---

# CONTRACT COPILOT & CHAT WITH DOCUMENT SKILL

Esta skill proporciona las instrucciones y la arquitectura técnica para habilitar asistentes conversacionales en tiempo real sobre contratos, facturas y documentos legales B2B.

## 🛠️ Arquitectura del Asistente Conversacional

1. **Endpoint Serverless (`/api/chat-document`)**:
   - Recibe la pregunta del usuario (`question`), el texto del documento (`document_text`) y la historia previa (`history`).
   - Envía el contexto del documento a Gemini 2.5 Flash con un system prompt legal especializado.
   - Devuelve respuestas ejecutivas en 2-4 oraciones citando las cláusulas exactas.

2. **Integración con la Interfaz de Usuario (UI/UX)**:
   - Flotante interactivo en la vista de resultados de auditoría.
   - Botones rápidos de preguntas predefinidas:
     - *"¿Cuál es la penalización por cancelación anticipada?"*
     - *"¿Hay sobrecargos en mantenimiento no declarados?"*
     - *"¿Cómo debo redactar la carta de objeción?"*

3. **Garantía de Privacidad en RAM**:
   - Las preguntas y el contexto se procesan de forma efímera en memoria RAM sin almacenar logs conversacionales en disco.
