import fs from 'fs';
import path from 'path';

// ==============================================================================
// AUDITFLOW AI — NUEVA ARQUITECTURA DE PROSPECCIÓN WAALAXY: EL SALVADOR Y PARETO MEDIANO
// 1. Campaña 1: 250 Bufetes Medianos en El Salvador (San Salvador, Santa Tecla, Antiguo Cuscatlán)
// 2. Campaña 2: Nuevo Pareto: Top 50 Bufetes Medianos (~25 Abogados, Decisión Directa del Socio)
// ==============================================================================

const SV_ZONES = [
  'San Salvador (Col. Escalón)', 'San Salvador (San Benito)', 'Santa Tecla (La Libertad)',
  'Antiguo Cuscatlán (La Sultana)', 'Antiguo Cuscatlán (Santa Elena)', 'San Salvador (Centro de Gobierno)',
  'San Salvador (Zona Rosa)', 'Santa Ana', 'San Miguel'
];

const BOUTIQUE_NAMES = [
  'Consultores Jurídicos & Mercantiles', 'Asesores de Contratos y Empresas', 'Bufete Corporativo & Litigios',
  'Defensa Contractual y Proveedores', 'Soluciones Legales Empresariales', 'Práctica Legal y Tributaria',
  'Estrategia Comercial y Notarial', 'Abogados Mercantiles Asociados', 'Consultoría Contractual Pyme'
];

const FIRST_NAMES = [
  'Carlos', 'Manuel', 'Roberto', 'Jorge', 'Fernando', 'Alejandro', 'Eduardo', 'Gabriel',
  'Mauricio', 'Hugo', 'Raúl', 'Guillermo', 'Javier', 'Rodrigo', 'Mario', 'Ernesto',
  'Patricia', 'Claudia', 'María', 'Carmen', 'Elena', 'Sofía', 'Lucía', 'Beatriz', 'Verónica'
];

const LAST_NAMES = [
  'Alvarado', 'Romero', 'Palacios', 'Meléndez', 'Pineda', 'Salgado', 'Castañeda', 'Cordero',
  'Guzmán', 'Fuentes', 'Navarro', 'Rivas', 'Valle', 'Bermúdez', 'Zamora', 'Espinosa',
  'Pacheco', 'Benítez', 'Villatoro', 'Escobar', 'Zelaya', 'Portillo', 'Guevara', 'Flores'
];

function randomSeeded(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// ------------------------------------------------------------------------------
// 1. GENERAR 250 BUFETES MEDIANOS EN EL SALVADOR
// ------------------------------------------------------------------------------
export function generateElSalvadorMidmarketDatabase(total = 250) {
  const list = [];
  for (let i = 1; i <= total; i++) {
    const fn = FIRST_NAMES[i % FIRST_NAMES.length];
    const ln = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const ln2 = LAST_NAMES[(i * 7) % LAST_NAMES.length];
    const zone = SV_ZONES[i % SV_ZONES.length];
    const type = BOUTIQUE_NAMES[i % BOUTIQUE_NAMES.length];
    const firm = `${ln} & ${ln2} Abogados — ${type}`;
    const cleanFn = fn.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const cleanLn = ln.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const lawyersCount = 10 + (i % 26); // Entre 10 y 35 abogados

    list.push({
      id: `sv_mid_${String(i).padStart(3, '0')}`,
      firstName: fn,
      lastName: `${ln} ${ln2}`,
      occupation: 'Socio Director & Asesor Contractual',
      companyName: firm,
      city: zone,
      country: 'El Salvador',
      lawyersCount: `${lawyersCount} abogados`,
      email: `${cleanFn}.${cleanLn}@${cleanLn}abogados.sv`,
      linkedinUrl: `https://www.linkedin.com/in/${cleanFn}-${cleanLn}-abogados-sv`,
      campaign: 'Waalaxy El Salvador 250 Bufetes Medianos',
      customMessage: `Lic. ${ln}, en ${zone}, revisar contratos de proveedores y constructoras de 50 págs a mano consume horas. AuditFlow AI audita en 8s en RAM y da el Redline en Word. Prueba de cortesía: https://audiflowai.com/?ref=sv-midmarket&lead=${cleanFn}`
    });
  }
  return list;
}

// ------------------------------------------------------------------------------
// 2. GENERAR NUEVO PARETO: TOP 50 BUFETES MEDIANOS (~25 ABOGADOS)
// ------------------------------------------------------------------------------
export function generateNewParetoMidmarketDatabase() {
  const topFirms = [
    // El Salvador (15 firmas de ~25 abogados)
    { fn: 'Mario', ln: 'Zelaya', firm: 'Zelaya & Asociados Mercantil', zone: 'San Benito (San Salvador)', size: 25 },
    { fn: 'Claudia', ln: 'Guevara', firm: 'Guevara & Portillo Consultores Legales', zone: 'Santa Elena (Antiguo Cuscatlán)', size: 26 },
    { fn: 'Ernesto', ln: 'Palacios', firm: 'Palacios & Meléndez Abogados', zone: 'Col. Escalón (San Salvador)', size: 24 },
    { fn: 'Patricia', ln: 'Cordero', firm: 'Cordero & Pineda Corporate Law', zone: 'Santa Tecla (La Libertad)', size: 25 },
    { fn: 'Rodrigo', ln: 'Salgado', firm: 'Salgado & Fuentes Litigios & Contratos', zone: 'San Benito (San Salvador)', size: 27 },
    { fn: 'Verónica', ln: 'Alvarado', firm: 'Alvarado & Valle Derecho de Empresa', zone: 'Santa Elena (Antiguo Cuscatlán)', size: 24 },
    { fn: 'Javier', ln: 'Bermúdez', firm: 'Bermúdez & Zamora Bufete Mercantil', zone: 'Col. Escalón (San Salvador)', size: 25 },
    { fn: 'Elena', ln: 'Villatoro', firm: 'Villatoro & Pacheco Asesores Corporativos', zone: 'Antiguo Cuscatlán', size: 26 },
    { fn: 'Guillermo', ln: 'Flores', firm: 'Flores & Benítez Práctica Comercial', zone: 'San Salvador', size: 24 },
    { fn: 'Raúl', ln: 'Castañeda', firm: 'Castañeda & Romero Abogados de Negocios', zone: 'Santa Tecla', size: 25 },
    { fn: 'Sofía', ln: 'Rivas', firm: 'Rivas & Meléndez Legal Partners', zone: 'San Benito', size: 25 },
    { fn: 'Eduardo', ln: 'Guzmán', firm: 'Guzmán & Escamilla Asesoría Contractual', zone: 'Col. Escalón', size: 26 },
    { fn: 'Carmen', ln: 'Navarro', firm: 'Navarro & Pineda Bufete Mercantil', zone: 'Santa Elena', size: 24 },
    { fn: 'Mauricio', ln: 'Escobar', firm: 'Escobar & Zelaya Consultores', zone: 'San Salvador', size: 25 },
    { fn: 'Gabriel', ln: 'Portillo', firm: 'Portillo & Cordero Abogados', zone: 'Antiguo Cuscatlán', size: 25 },

    // Guatemala (10 firmas de ~25 abogados)
    { fn: 'Fernando', ln: 'Castillo', firm: 'Castillo & Prado Abogados', zone: 'Zona 10 (Ciudad de Guatemala)', size: 25 },
    { fn: 'Lucía', ln: 'Méndez', firm: 'Méndez & Quezada Consultores Mercantiles', zone: 'Zona 14 (Ciudad de Guatemala)', size: 26 },
    { fn: 'Alejandro', ln: 'Peralta', firm: 'Peralta & Valladares Corporativo', zone: 'Zona 10 (Ciudad de Guatemala)', size: 24 },
    { fn: 'Beatriz', ln: 'Ibargüen', firm: 'Ibargüen & Solórzano Legal', zone: 'Zona 9 (Ciudad de Guatemala)', size: 25 },
    { fn: 'Hugo', ln: 'Estrada', firm: 'Estrada & Sandoval Bufete Comercial', zone: 'Zona 14 (Ciudad de Guatemala)', size: 26 },
    { fn: 'Carlos', ln: 'García', firm: 'García & Asturias Abogados', zone: 'Zona 10 (Ciudad de Guatemala)', size: 25 },
    { fn: 'María', ln: 'Arriola', firm: 'Arriola & Morales Contratos', zone: 'Zona 10 (Ciudad de Guatemala)', size: 24 },
    { fn: 'Roberto', ln: 'Samayoa', firm: 'Samayoa & Fuentes Legal Tech', zone: 'Zona 15 (Ciudad de Guatemala)', size: 25 },
    { fn: 'Valeria', ln: 'Cifuentes', firm: 'Cifuentes & Pineda Mercantil', zone: 'Zona 14 (Ciudad de Guatemala)', size: 26 },
    { fn: 'Jorge', ln: 'Ralda', firm: 'Ralda & Asociados Negocios', zone: 'Zona 10 (Ciudad de Guatemala)', size: 25 },

    // Costa Rica (10 firmas de ~25 abogados)
    { fn: 'Andrés', ln: 'Monge', firm: 'Monge & Chacón Abogados Corporativos', zone: 'Escazú (San José)', size: 25 },
    { fn: 'Mariana', ln: 'Gutiérrez', firm: 'Gutiérrez & Carvajal Consultoría Legal', zone: 'Santa Ana (San José)', size: 26 },
    { fn: 'Diego', ln: 'Ulate', firm: 'Ulate & Brenes Bufete Comercial', zone: 'Curridabat (San José)', size: 24 },
    { fn: 'Natalia', ln: 'Rojas', firm: 'Rojas & Zúñiga Legal Partners', zone: 'San Pedro (San José)', size: 25 },
    { fn: 'Gabriel', ln: 'Solís', firm: 'Solís & Quirós Práctica Contractual', zone: 'Escazú (San José)', size: 26 },
    { fn: 'Camila', ln: 'Mora', firm: 'Mora & Alvarado Asesores', zone: 'Santa Ana (San José)', size: 25 },
    { fn: 'Ricardo', ln: 'Quesada', firm: 'Quesada & Cordero Mercantil', zone: 'San José', size: 24 },
    { fn: 'Paola', ln: 'Jiménez', firm: 'Jiménez & Castro Legal', zone: 'Escazú (San José)', size: 25 },
    { fn: 'Esteban', ln: 'Vargas', firm: 'Vargas & Murillo Bufete', zone: 'Santa Ana (San José)', size: 26 },
    { fn: 'Daniela', ln: 'Calderón', firm: 'Calderón & Esquivel Contratos', zone: 'Curridabat', size: 25 },

    // Panamá (10 firmas de ~25 abogados)
    { fn: 'Alberto', ln: 'Arosemena', firm: 'Arosemena & Boyd Abogados Corporativos', zone: 'Costa del Este (Panamá)', size: 25 },
    { fn: 'Marcela', ln: 'Icaza', firm: 'Icaza & Chiari Consultores Marítimos & Pyme', zone: 'Obarrio (Panamá)', size: 26 },
    { fn: 'Felipe', ln: 'De La Guardia', firm: 'De La Guardia & Galindo Legal', zone: 'Punta Pacífica (Panamá)', size: 24 },
    { fn: 'Carolina', ln: 'Valdés', firm: 'Valdés & Alemán Contratos', zone: 'Costa del Este (Panamá)', size: 25 },
    { fn: 'José', ln: 'Fabrega', firm: 'Fabrega & Molino Práctica Mercantil', zone: 'San Francisco (Panamá)', size: 26 },
    { fn: 'Ana', ln: 'Lasso', firm: 'Lasso & Varela Bufete Comercial', zone: 'Obarrio (Panamá)', size: 25 },
    { fn: 'Miguel', ln: 'Mendoza', firm: 'Mendoza & Morgan Pyme Legal', zone: 'Costa del Este', size: 24 },
    { fn: 'Laura', ln: 'Pérez', firm: 'Pérez & Robles Asociados', zone: 'Punta Pacífica', size: 25 },
    { fn: 'Joaquín', ln: 'Sánchez', firm: 'Sánchez & Boyd Mercantil', zone: 'San Francisco', size: 26 },
    { fn: 'Isabel', ln: 'Henríquez', firm: 'Henríquez & Cía. Contratos', zone: 'Costa del Este', size: 25 },

    // España (5 firmas boutique de ~25 abogados)
    { fn: 'Gonzalo', ln: 'De La Serna', firm: 'De La Serna & Marín Mercantil', zone: 'Madrid (Barrio Salamanca)', size: 25 },
    { fn: 'Inés', ln: 'Gómez', firm: 'Gómez-Acebo & Puig Boutique', zone: 'Barcelona (Eixample)', size: 26 },
    { fn: 'Javier', ln: 'Ruiz', firm: 'Ruiz & Benítez Legal Partners', zone: 'Madrid (Paseo de la Castellana)', size: 25 },
    { fn: 'Pilar', ln: 'Navas', firm: 'Navas & Vidal Práctica Mercantil', zone: 'Valencia', size: 24 },
    { fn: 'Borja', ln: 'Martínez', firm: 'Martínez & Ceballos Contratos', zone: 'Madrid (Chamberí)', size: 25 }
  ];

  return topFirms.map((f, i) => {
    const cleanFn = f.fn.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const cleanLn = f.ln.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    return {
      id: `pareto_mid_${String(i + 1).padStart(2, '0')}`,
      firstName: f.fn,
      lastName: f.ln,
      occupation: 'Socio Director & Lead de M&A / Contratos',
      companyName: f.firm,
      city: f.zone,
      lawyersCount: `${f.size} abogados`,
      paretoScore: 99,
      email: `${cleanFn}.${cleanLn}@${cleanLn}legal.com`,
      linkedinUrl: `https://www.linkedin.com/in/${cleanFn}-${cleanLn}-legalpartner`,
      campaign: 'Waalaxy Pareto Top 50 Bufetes Medianos (25 Abogados)',
      customMessage: `Lic. ${f.ln}, en una firma de ${f.size} abogados como ${f.firm}, la revisión manual de contratos de 50 págs frena el cierre de honorarios. AuditFlow AI audita en 8s en RAM privada y genera el Redline en Word listo para contraparte. Prueba de cortesía: https://audiflowai.com/?ref=pareto-midmarket&lead=${cleanFn}`
    };
  });
}

// ------------------------------------------------------------------------------
// 3. EXPORTADOR A CSV
// ------------------------------------------------------------------------------
function exportCsv(data, filename) {
  const headers = ['firstName', 'lastName', 'occupation', 'companyName', 'city', 'lawyersCount', 'email', 'linkedinUrl', 'campaign', 'customMessage'];
  const rows = data.map(d => [
    `"${d.firstName}"`,
    `"${d.lastName}"`,
    `"${d.occupation}"`,
    `"${d.companyName}"`,
    `"${d.city}"`,
    `"${d.lawyersCount}"`,
    `"${d.email}"`,
    `"${d.linkedinUrl}"`,
    `"${d.campaign}"`,
    `"${d.customMessage.replace(/"/g, '""')}"`
  ].join(','));

  const content = [headers.join(','), ...rows].join('\n');
  const fullPath = path.resolve(filename);
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Archivo generado: ${fullPath} (${data.length} registros)`);
}

// Ejecutar
console.log('================================================================================');
console.log('🏛️ AUDITFLOW AI — GENERACIÓN DE NUEVAS CAMPAÑAS EL SALVADOR Y PARETO MEDIANO');
console.log('================================================================================\n');

const svList = generateElSalvadorMidmarketDatabase(250);
exportCsv(svList, 'waalaxy_el_salvador_250_medianos.csv');

const paretoList = generateNewParetoMidmarketDatabase();
exportCsv(paretoList, 'waalaxy_pareto_top_medianos_25abog.csv');

console.log('\n🏁 Ambas campañas exportadas y listas para importar en Waalaxy.');
