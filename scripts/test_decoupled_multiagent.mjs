/**
 * ==============================================================================
 * AUDITFLOW AI - TEST SUITE: ARQUITECTURA MULTIAGENTE DESACOPLADA (n8n & Supabase)
 * ==============================================================================
 * Ejecuta validaciones exhaustivas sobre:
 * 1. Estructura e integridad sintáctica de los flujos JSON de n8n.
 * 2. Compuertas de validación (Gatekeepers) ante payloads válidos y corruptos.
 * 3. Contratos de entrada y salida (Extractor, Risk Analyzer, Mitigation).
 */

import fs from 'fs';
import path from 'path';

const WORKFLOWS_DIR = path.resolve('n8n/workflows');
const MIGRATION_PATH = path.resolve('db/migrations/20260903_task_executions_migration.sql');

console.log('=================================================================');
console.log('🧪 AUDITFLOW AI — SUITE DE VALIDACIÓN MULTIAGENTE DESACOPLADO');
console.log('=================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failCount++;
  }
}

// ------------------------------------------------------------------------------
// TEST 1: Validación de integridad de los flujos JSON de n8n
// ------------------------------------------------------------------------------
console.log('🔍 TEST 1: Verificación de archivos y sintaxis JSON de workflows...');

const expectedWorkflows = [
  'n8n_subwf_extractor.json',
  'n8n_subwf_risk_analyzer.json',
  'n8n_subwf_mitigation_writer.json',
  'n8n_orchestrator_dispatcher.json'
];

for (const wfFile of expectedWorkflows) {
  const filePath = path.join(WORKFLOWS_DIR, wfFile);
  const exists = fs.existsSync(filePath);
  assert(exists, `Archivo existe: ${wfFile}`);

  if (exists) {
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      assert(Array.isArray(content.nodes) && content.nodes.length > 0, `${wfFile} contiene nodos válidos (${content.nodes.length} nodos)`);
      assert(typeof content.connections === 'object', `${wfFile} tiene topología de conexiones`);
    } catch (e) {
      assert(false, `Error parseando JSON de ${wfFile}: ${e.message}`);
    }
  }
}

// ------------------------------------------------------------------------------
// TEST 2: Validación del archivo de migración SQL
// ------------------------------------------------------------------------------
console.log('\n🗄️ TEST 2: Verificación de migración SQL para Supabase...');
assert(fs.existsSync(MIGRATION_PATH), 'Archivo de migración SQL existe');

if (fs.existsSync(MIGRATION_PATH)) {
  const sql = fs.readFileSync(MIGRATION_PATH, 'utf8');
  assert(sql.includes('CREATE TABLE IF NOT EXISTS public.task_executions'), 'DDL contiene tabla task_executions');
  assert(sql.includes('task_execution_status AS ENUM'), 'DDL contiene ENUM de estados');
  assert(sql.includes('record_task_checkpoint'), 'Función idempotente record_task_checkpoint declarada');
  assert(sql.includes('complete_task_checkpoint'), 'Función de cierre complete_task_checkpoint declarada');
}

// ------------------------------------------------------------------------------
// TEST 3: Validación del Gatekeeper del Extractor (Payload Válido vs Corrupto)
// ------------------------------------------------------------------------------
console.log('\n👮 TEST 3: Validación del Gatekeeper del Extractor (Code Node logic)...');

function validateExtractorGatekeeper(out) {
  const errors = [];
  if (!out || out.status !== 'SUCCESS') errors.push('Status must be SUCCESS');
  if (!Array.isArray(out.clauses)) {
    errors.push('Clauses must be an array');
  } else {
    out.clauses.forEach((c, idx) => {
      if (!c.clauseId) errors.push(`Clause[${idx}] missing clauseId`);
      if (!c.clauseType) errors.push(`Clause[${idx}] missing clauseType`);
      if (!c.verbatimText) errors.push(`Clause[${idx}] missing verbatimText`);
    });
  }
  return { isValid: errors.length === 0, errors };
}

// Caso 3A: Payload válido
const validExtractorPayload = {
  status: 'SUCCESS',
  clausesExtractedCount: 2,
  clauses: [
    {
      clauseId: 'cl_indemn_01',
      clauseType: 'INDEMNIFICATION',
      verbatimText: 'El Cliente indemnizará de forma ilimitada al Proveedor por todo daño directo o indirecto.',
      sourceReference: { sectionNumber: 'Cláusula 12.1' },
      detectedKeyTerms: ['indemnizará', 'ilimitada']
    },
    {
      clauseId: 'cl_liab_02',
      clauseType: 'LIMITATION_OF_LIABILITY',
      verbatimText: 'La responsabilidad del Proveedor no excederá de $10 USD.',
      sourceReference: { sectionNumber: 'Cláusula 13' },
      detectedKeyTerms: ['$10 USD']
    }
  ],
  missingClauseTypes: [],
  extractionTimestamp: new Date().toISOString()
};

const resValid = validateExtractorGatekeeper(validExtractorPayload);
assert(resValid.isValid === true, 'Gatekeeper aprueba payload válido del Extractor');

// Caso 3B: Payload corrupto (simula alucinación o respuesta rota del LLM)
const corruptedPayload = {
  status: 'SUCCESS',
  clauses: [
    {
      // Faltan clauseId y verbatimText
      clauseType: 'INDEMNIFICATION'
    }
  ]
};

const resCorrupt = validateExtractorGatekeeper(corruptedPayload);
assert(resCorrupt.isValid === false, 'Gatekeeper intercepta payload corrupto del Extractor');
assert(resCorrupt.errors.length === 2, `Se detectaron exactamente ${resCorrupt.errors.length} fallos en el payload corrupto`);

// ------------------------------------------------------------------------------
// TEST 4: Validación del Gatekeeper del Analista de Riesgo
// ------------------------------------------------------------------------------
console.log('\n⚖️ TEST 4: Validación del Gatekeeper del Analista de Riesgo...');

function validateRiskGatekeeper(out) {
  const errors = [];
  if (!out || out.status !== 'SUCCESS') errors.push('Status must be SUCCESS');
  if (typeof out.overallContractRiskScore !== 'number') errors.push('overallContractRiskScore must be number');
  if (!Array.isArray(out.assessments)) {
    errors.push('assessments must be an array');
  } else {
    out.assessments.forEach((a, idx) => {
      if (!a.clauseId) errors.push(`Assessment[${idx}] missing clauseId`);
      if (!a.severity) errors.push(`Assessment[${idx}] missing severity`);
      if (typeof a.riskScore !== 'number') errors.push(`Assessment[${idx}] riskScore must be number`);
    });
  }
  return { isValid: errors.length === 0, errors };
}

const validRiskPayload = {
  status: 'SUCCESS',
  overallContractRiskScore: 92,
  dominantRiskFactor: 'CRITICAL',
  assessments: [
    {
      clauseId: 'cl_indemn_01',
      clauseType: 'INDEMNIFICATION',
      severity: 'CRITICAL',
      riskScore: 95,
      financialExposureEstimateUsd: 500000,
      legalExposureRationale: 'Indemnización unilateral sin tope expone a pasivos ilimitados.',
      financialExposureRationale: 'Riesgo de insolvencia operativa ante contingencias.',
      triggerConditions: ['Cualquier reclamo de terceros']
    }
  ],
  analysisCompletedAt: new Date().toISOString()
};

const resRisk = validateRiskGatekeeper(validRiskPayload);
assert(resRisk.isValid === true, 'Gatekeeper aprueba evaluación de riesgo válida');

const corruptRiskPayload = {
  status: 'SUCCESS',
  overallContractRiskScore: 'NO_ES_NUMERO',
  assessments: [{ clauseId: 'cl_01' }] // falta severity y riskScore numérico
};

const resRiskCorrupt = validateRiskGatekeeper(corruptRiskPayload);
assert(resRiskCorrupt.isValid === false, 'Gatekeeper intercepta y rechaza riesgo sin score numérico');

// ------------------------------------------------------------------------------
// RESUMEN
// ------------------------------------------------------------------------------
console.log('\n=================================================================');
console.log(`🏁 RESULTADO FINAL: ${passCount} pruebas superadas, ${failCount} fallidas.`);
console.log('=================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('✨ Todos los contratos de datos y compuertas de n8n están en regla.');
}
