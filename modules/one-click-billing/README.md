# 🚀 AuditFlow AI - Módulo de Facturación & 1-Click Upsell (Wompi El Salvador)

Este módulo implementa el flujo de **Venta Cruzada a 1 Clic (1-Click In-App Upsell)** y cobro recurrente utilizando la **Tokenización de Tarjetas (Card-on-File)** de **Wompi El Salvador (Banco Agrícola)**.

---

## 📊 1. Análisis Técnico y Estratégico

### 🟢 Beneficios Clave (Pros)
1. **Fricción Cero en la Conversión:** Elimina la necesidad de que el cliente vuelva a escribir los 16 dígitos de la tarjeta, fecha de vencimiento y CVV. Aumenta la conversión de compras impulsivas y add-ons hasta en un **75%**.
2. **Monetización en el Momento de Dolor (Paywall Dinámico):** Se activa exactamente cuando el usuario topa el límite de su plan actual (ej: *10/10 facturas generadas*).
3. **Seguridad PCI-DSS Delegada:** Los datos bancarios nunca se almacenan en los servidores de AuditFlow AI; solo se guarda un token alfanumérico seguro (`tok_xxx`) proporcionado por Wompi.
4. **Mayor LTV y Expansión de Ingresos (ARPU):** Facilita la venta de micro-servicios ($9.99 Facturación DTE, $19.99 Redlines Word, $69.00 Pro).

---

### 🔴 Contras y Riesgos a Mitigar (Cons)
1. **Autenticación Fuerte Bancaria (3D-Secure 2.0):** Algunos bancos de Centroamérica pueden rechazar transacciones silenciosas backend-to-backend si detectan sospecha de fraude y requieren OTP por SMS. *Solución:* Incluir un fallback que abra el widget seguro de Wompi si el banco solicita 3DS.
2. **Riesgo de Chargebacks / Disputas:** Si el cobro es excesivamente rápido sin confirmación visual previa, el usuario puede alegar que fue un "clic accidental". *Solución:* Modal de confirmación con detalle explícito del monto, tarjeta a cargar y confirmación con botón de doble intención.
3. **Idempotencia (Doble Cobro por Clic Rápido):** Si el usuario hace doble clic o la red parpadea, se podría enviar dos veces la petición. *Solución:* Implementamos cabeceras `idempotencyKey` únicas por intento.
4. **Obligaciones Tributarias y DTE (Factura Electrónica Hacienda El Salvador):** Cada cobro automático de $9.99 o $69 debe generar su Comprobante de Crédito Fiscal o Factura Electrónica (DTE) ante el Ministerio de Hacienda.

---

## 🛠️ 2. Estructura del Módulo

```
modules/one-click-billing/
├── .env                  # Configuración y credenciales de Wompi
├── .env.example          # Plantilla pública
├── package.json          # Dependencias (Express, CORS, Dotenv, Helmet)
├── README.md             # Esta documentación
└── src/
    ├── server.js         # Servidor Express, API REST y UI integrada
    └── services/
        ├── WompiService.js      # Conector con la API de Wompi El Salvador
        └── DatabaseService.js   # Gestión de usuarios, catálogo, idempotencia y auditoría
```

---

## ⚡ 3. Cómo Ejecutarlo

1. **Instalar dependencias:**
   ```bash
   cd "modules/one-click-billing"
   npm install
   ```

2. **Ejecutar el servidor:**
   ```bash
   npm start
   ```

3. **Abrir en tu navegador:**
   [http://localhost:3000](http://localhost:3000)
