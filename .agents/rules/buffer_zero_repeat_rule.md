# 🛡️ Regla de Oro Inmutable: Prohibición de Repetición de Posts e Imágenes en Buffer (Zero-Repeat Visuals Rule)

## 📌 Directiva Obligatoria Universal
De forma obligatoria, permanente e inviolable, el **Especialista en Buffer (`buffer-specialist`)**, la **Directora de Marketing y Ventas (`marketing-director`)** y todos los procesos automatizados de publicación social tienen como **Regla de Oro**:

> 🚫 **PROHIBICIÓN ABSOLUTA DE REPETICIÓN DE POSTS E IMÁGENES:**  
> **Cada post nuevo publicado o programado en Buffer (LinkedIn, Facebook, Instagram) DEBE llevar una imagen nueva y un copy fresco.**  
> Queda terminantemente prohibido reciclar cíclicamente la misma imagen o el mismo texto semana tras semana.

---

## 🎨 Catálogo Oficial de Nuevos Assets Visuales Aprobados

Cada publicación debe seleccionar un recurso visual único de este banco de alta fidelidad verificado:

### 1. Posts Cuadrados / Horizontales (LinkedIn, Facebook Feed, Instagram Feed - 1:1)
1. `https://audiflowai.com/images/auditflow_forensic_redline.jpg` — Laptop y tablet en sala de juntas ejecutiva mostrando auditoría forense con diff en tiempo real.
2. `https://audiflowai.com/images/cfo_ebitda_protection.jpg` — Directora Financiera (CFO) analizando métricas de fuga de EBITDA y alertas contractuales con vista nocturna a la ciudad.
3. `https://audiflowai.com/images/ram_volatile_security.jpg` — Centro de datos de alta seguridad bancaria ilustrando la memoria RAM volátil Zero-Disk.
4. `https://audiflowai.com/images/contract_word_redline.jpg` — Escritorio corporativo con MacBook mostrando redline en Word con control de cambios (.docx).
5. `https://audiflowai.com/images/hidden_liability_alert.jpg` — Lupa sobre contrato legal destacando alerta holográfica roja de 'Unlimited Liability Risk'.
6. `https://audiflowai.com/images/general_counsel_audit_win.jpg` — Directora Jurídica / Abogada General sosteniendo tablet con certificación '0 Pasivos Ocultos'.
7. `https://audiflowai.com/images/smart_redline_ai_interface.jpg` — Interfaz comparativa side-by-side de cláusula abusiva vs. contrapropuesta aprobada con tope mutuo de $50,000 USD.

### 2. Formato Vertical Reels / Stories (Instagram Reels & Facebook Video - 9:16)
1. `https://audiflowai.com/images/reel_scene1_hook_penalty.jpg` — Escena 1 (Gancho): Ejecutivo atónito al descubrir penalidad imprevista de $142,000 USD en contrato.
2. `https://audiflowai.com/images/reel_scene2_ram_scan_8s.jpg` — Escena 2 (Solución): Escaneo algorítmico móvil de 8.2 segundos en RAM volátil con 0 retención.
3. `https://audiflowai.com/images/reel_scene3_counsel_word_cta.jpg` — Escena 3 (Resultado): Abogada satisfecha con el Redline en Word y llamado a la acción ($19 USD).

---

## ⚙️ Mecanismo de Deduplicación y Selección Dinámica

1. **Consulta Previa Obligatoria a la Bitácora (`social_published_feed.json`):**
   - Antes de despachar o programar cualquier contenido, el motor o subagente debe inspeccionar el historial de publicaciones.
   - Si una imagen o título fue publicado recientemente, queda **bloqueada** y el motor debe seleccionar la siguiente disponible en la cola.

2. **Rotación Secuencial Pura (Non-Cyclic Pool):**
   - Se elimina la asignación fija por día de la semana (`dayOfWeek`).
   - El sistema almacena un puntero de rotación (`buffer_rotation_state.json`) que avanza linealmente asegurando que cada día presente una perspectiva jurídica, un ángulo comercial y un creativo visual completamente diferente.

3. **Verificación de Integridad de URL:**
   - Todo asset visual debe existir físicamente en `/frontend/images/` y `/images/` del repositorio, garantizando que el preview en redes cargue instantáneamente y sin enlaces rotos.
