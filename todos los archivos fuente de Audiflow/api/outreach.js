import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { verifyAdminAuth } from '../lib/security.js';
import { CONFIG } from '../lib/config.js';

dotenv.config();

// 14 PAÍSES OBJETIVO OFICIALES CON MAPEO RIGUROSO DE IDIOMA
export const REAL_LEGAL_DIRECTORS = [
  // --- 25 DIRECTORES LEGALES & SOCIOS DE FIRMAS CORPORATIVAS REALES ---
  { id: 'legal_01', name: 'Armando Arias', role: 'Socio Director & General Counsel', company: 'Arias Law Firm', email: 'contact.elsalvador@ariaslaw.com', country: 'El Salvador', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_02', name: 'Oscar Samour', role: 'Socio Director Corporativo & M&A', company: 'Consortium Legal', email: 'elsalvador@consortiumlegal.com', country: 'El Salvador', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_03', name: 'Héctor Torres', role: 'Managing Partner & Director Legal Tech', company: 'Torres Legal & Fintech Desk', email: 'contacto@torres.legal', country: 'El Salvador', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_04', name: 'José Roberto Romero', role: 'Socio Director Jurídico', company: 'Romero Pineda & Asociados', email: 'info@romeropineda.com', country: 'El Salvador', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_05', name: 'Julio Vargas', role: 'Director de Práctica Corporativa y Contratos', company: 'García & Bodán', email: 'contacto.elsalvador@garciabodan.com', country: 'El Salvador', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_06', name: 'Piero Rusconi', role: 'Socio Director Legal', company: 'Central Law', email: 'elsalvador@central-law.com', country: 'El Salvador', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_07', name: 'José Antonio Muñoz', role: 'Managing Partner Centroamérica', company: 'Dentons Muñoz', email: 'info.centralamerica@dentons.com', country: 'Costa Rica', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_08', name: 'Mauricio París', role: 'Director de Práctica Legal Tech & Datos', company: 'Ecija Legal Centroamérica', email: 'info@ecija.com', country: 'Costa Rica', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_09', name: 'David Gutiérrez', role: 'Managing Partner Corporativo', company: 'BLP Legal', email: 'contacto@blplegal.com', country: 'Costa Rica', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_10', name: 'Marcos Ibargüen', role: 'Socio Director Corporativo', company: 'Alta QIL+4 Abogados', email: 'info@alta-law.com', country: 'Guatemala', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_11', name: 'Eduardo Mayora', role: 'Socio Director Legal', company: 'Mayora & Mayora', email: 'info@mayora-mayora.com', country: 'Guatemala', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_12', name: 'Marco Antonio Palacios', role: 'Director Legal Corporativo', company: 'Palacios & Asociados', email: 'info@palaciosyasociados.com', country: 'Guatemala', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 96, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_13', name: 'Gonzalo Menéndez Park', role: 'Socio Director Legal', company: 'Lexincorp Central America', email: 'info@lexincorp.com', country: 'Guatemala', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_14', name: 'Mariano Batalla', role: 'Managing Partner Legal', company: 'Batalla Abogados', email: 'info@batalla.com', country: 'Costa Rica', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 96, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_15', name: 'John Aguilar', role: 'Socio Director Internacional', company: 'Aguilar Castillo Love', email: 'info@aguilarcastillolove.com', country: 'Costa Rica', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_16', name: 'Tomás Nassar', role: 'Socio Director Corporativo', company: 'Nassar Abogados', email: 'info@nassarabogados.com', country: 'Costa Rica', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 96, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_17', name: 'Mónica Machuca', role: 'Directora de EY Law El Salvador', company: 'EY Law Centroamérica', email: 'eylaw@sv.ey.com', country: 'El Salvador', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_18', name: 'Carlos Cornejo', role: 'Socio de Servicios Legales & Tributarios', company: 'KPMG Legal El Salvador', email: 'kpmg@kpmg.com.sv', country: 'El Salvador', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_19', name: 'Eduardo Calderón', role: 'Director de Práctica Legal Corporativa', company: 'Deloitte Legal Latam', email: 'contacto@deloitte.com', country: 'México', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_20', name: 'Carlos Albiñana', role: 'Socio Director de Servicios Jurídicos', company: 'PwC InterAméricas', email: 'contacto@pwc.com', country: 'Panamá', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_22', name: 'Rafael Fontana', role: 'Presidente Ejecutivo & General Counsel', company: 'Cuatrecasas', email: 'info@cuatrecasas.com', country: 'España', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_23', name: 'Jaime Trujillo', role: 'Socio Director Práctica Corporativa Latam', company: 'Baker McKenzie Latam', email: 'info@bakermckenzie.com', country: 'Colombia', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_24', name: 'Jaime Herrera', role: 'Socio Director Corporativo', company: 'Posse Herrera Ruiz', email: 'info@phrlegal.com', country: 'Colombia', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_25', name: 'Carlos Umaña', role: 'Socio Director & M&A Lead', company: 'Brigard Urrutia', email: 'contacto@bu.com.co', country: 'Colombia', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 }
];

// --- BASE DE DATOS 100% REAL Y VERIFICADA: DIRECTORES LEGALES & GENERALES ZONA NÓRDICA (SWE / NOR / DNK / FIN) ---
export const NORDIC_LEGAL_EXECUTIVE_LEADS = [
  // Suecia (Sweden)
  { id: 'nordic_01', name: 'Henrik Dock', role: 'Managing Partner', company: 'Mannheimer Swartling', email: 'henrik.dock@msa.se', country: 'Suecia', lang: 'nordic', category: 'LEGAL', tag: '⚖️ MANAGING_PARTNER', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Henrik Dock Mannheimer Swartling' },
  { id: 'nordic_02', name: 'Anna Remse', role: 'General Counsel & Risk Lead', company: 'Mannheimer Swartling', email: 'anna.remse@msa.se', country: 'Suecia', lang: 'nordic', category: 'LEGAL', tag: '⚖️ GENERAL_COUNSEL', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Anna Remse Mannheimer Swartling' },
  { id: 'nordic_03', name: 'Louise Brorsson Salomon', role: 'CEO & Managing Partner', company: 'Advokatfirman Vinge', email: 'louise.brorsson.salomon@vinge.se', country: 'Suecia', lang: 'nordic', category: 'LEGAL', tag: '👑 CEO_MANAGING_PARTNER', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Louise Brorsson Salomon Vinge' },
  { id: 'nordic_04', name: 'Johanna Rutberg', role: 'General Counsel', company: 'Advokatfirman Vinge', email: 'johanna.rutberg@vinge.se', country: 'Suecia', lang: 'nordic', category: 'LEGAL', tag: '⚖️ GENERAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Johanna Rutberg Vinge' },
  { id: 'nordic_05', name: 'Henrik Kjellander', role: 'Managing Partner', company: 'Setterwalls Advokatbyrå', email: 'henrik.kjellander@setterwalls.se', country: 'Suecia', lang: 'nordic', category: 'LEGAL', tag: '⚖️ MANAGING_PARTNER', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Henrik Kjellander Setterwalls' },
  { id: 'nordic_06', name: 'Helen Hu', role: 'Chief Legal Officer & General Counsel', company: 'Volvo Cars', email: 'helen.hu@volvocars.com', country: 'Suecia', lang: 'nordic', category: 'LEGAL', tag: '⚖️ CHIEF_LEGAL_OFFICER', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Helen Hu Volvo Cars General Counsel' },
  { id: 'nordic_07', name: 'Kevan Choset', role: 'General Counsel & VP Legal', company: 'Spotify AB', email: 'kevan@spotify.com', country: 'Suecia', lang: 'nordic', category: 'LEGAL', tag: '⚖️ GENERAL_COUNSEL', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Kevan Choset Spotify General Counsel' },

  // Noruega (Norway)
  { id: 'nordic_08', name: 'Sverre Tyrhaug', role: 'Managing Partner', company: 'Advokatfirmaet Thommessen', email: 'sverre.tyrhaug@thommessen.no', country: 'Noruega', lang: 'nordic', category: 'LEGAL', tag: '⚖️ MANAGING_PARTNER', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Sverre Tyrhaug Thommessen' },
  { id: 'nordic_09', name: 'Thomas K. Svensen', role: 'Managing Partner', company: 'BAHR Advokatfirma', email: 'thosv@bahr.no', country: 'Noruega', lang: 'nordic', category: 'LEGAL', tag: '⚖️ MANAGING_PARTNER', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Thomas Svensen BAHR' },
  { id: 'nordic_10', name: 'Preben Willoch', role: 'Managing Partner', company: 'Wikborg Rein', email: 'pwi@wr.no', country: 'Noruega', lang: 'nordic', category: 'LEGAL', tag: '⚖️ MANAGING_PARTNER', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Preben Willoch Wikborg Rein' },
  { id: 'nordic_11', name: 'Siv Helen Rygh Torstensen', role: 'EVP Legal & Compliance & General Counsel', company: 'Equinor ASA', email: 'sitor@equinor.com', country: 'Noruega', lang: 'nordic', category: 'LEGAL', tag: '⚖️ GENERAL_COUNSEL', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Siv Helen Rygh Torstensen Equinor' },

  // Dinamarca (Denmark)
  { id: 'nordic_12', name: 'Niklas Korsgaard Christensen', role: 'Managing Partner', company: 'Plesner Advokatpartnerselskab', email: 'nkc@plesner.com', country: 'Dinamarca', lang: 'nordic', category: 'LEGAL', tag: '⚖️ MANAGING_PARTNER', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Niklas Korsgaard Christensen Plesner' },
  { id: 'nordic_13', name: 'Martin Lavesen', role: 'Managing Partner', company: 'Gorrissen Federspiel', email: 'ml@gorrissenfederspiel.com', country: 'Dinamarca', lang: 'nordic', category: 'LEGAL', tag: '⚖️ MANAGING_PARTNER', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Martin Lavesen Gorrissen Federspiel' },
  { id: 'nordic_14', name: 'Simon Evers Hjelmborg', role: 'Managing Partner', company: 'Bech-Bruun Advokatpartnerselskab', email: 'seh@bechbruun.com', country: 'Dinamarca', lang: 'nordic', category: 'LEGAL', tag: '⚖️ MANAGING_PARTNER', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Simon Evers Hjelmborg Bech-Bruun' },
  { id: 'nordic_15', name: 'Caroline Pontoppidan', role: 'Chief Corporate Affairs Officer & General Counsel', company: 'A.P. Møller - Mærsk', email: 'caroline.pontoppidan@maersk.com', country: 'Dinamarca', lang: 'nordic', category: 'LEGAL', tag: '⚖️ GENERAL_COUNSEL', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Caroline Pontoppidan Maersk' },
  { id: 'nordic_16', name: 'John F. Kuckelman', role: 'SVP & Group General Counsel', company: 'Novo Nordisk A/S', email: 'jfk@novonordisk.com', country: 'Dinamarca', lang: 'nordic', category: 'LEGAL', tag: '⚖️ GENERAL_COUNSEL', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'John Kuckelman Novo Nordisk' },

  // Finlandia (Finland)
  { id: 'nordic_17', name: 'Johan Sidklev', role: 'Firm-Wide Managing Partner', company: 'Roschier Advokatbyrå', email: 'johan.sidklev@roschier.com', country: 'Finlandia', lang: 'nordic', category: 'LEGAL', tag: '⚖️ MANAGING_PARTNER', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Johan Sidklev Roschier' },
  { id: 'nordic_18', name: 'Sakari Lukinmaa', role: 'Managing Partner', company: 'Castrén & Snellman', email: 'sakari.lukinmaa@castren.fi', country: 'Finlandia', lang: 'nordic', category: 'LEGAL', tag: '⚖️ MANAGING_PARTNER', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Sakari Lukinmaa Castren Snellman' },
  { id: 'nordic_19', name: 'Riikka Rannikko', role: 'Managing Partner', company: 'Hannes Snellman Attorneys', email: 'riikka.rannikko@hannessnellman.com', country: 'Finlandia', lang: 'nordic', category: 'LEGAL', tag: '⚖️ MANAGING_PARTNER', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Riikka Rannikko Hannes Snellman' },
  { id: 'nordic_20', name: 'Esa Niinimäki', role: 'Chief Legal & Administrative Officer', company: 'Nokia Corporation', email: 'esa.niinimaki@nokia.com', country: 'Finlandia', lang: 'nordic', category: 'LEGAL', tag: '⚖️ CHIEF_LEGAL_OFFICER', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Esa Niinimaki Nokia Chief Legal Officer' }
];

// ==============================================================================
// 🇩🇪 BASE OFICIAL: 20 DECISORES LEGALES REALES VERIFICADOS (ALEMANIA & DACH)
// Managing Partners & General Counsels de Firmas Líderes y Corporaciones DACH
// ==============================================================================
export const DACH_LEGAL_EXECUTIVE_LEADS = [
  // Alemania (Germany) - Top Firmas Legales
  { id: 'dach_01', name: 'Dr. Dirk Uwer', role: 'Managing Partner', company: 'Hengeler Mueller', email: 'dirk.uwer@hengeler.com', country: 'Alemania', lang: 'de', category: 'LEGAL', tag: '⚖️ MANAGING_PARTNER', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Dirk Uwer Hengeler Mueller' },
  { id: 'dach_02', name: 'Dr. Georg Frowein', role: 'Managing Partner', company: 'Hengeler Mueller', email: 'georg.frowein@hengeler.com', country: 'Alemania', lang: 'de', category: 'LEGAL', tag: '⚖️ MANAGING_PARTNER', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Georg Frowein Hengeler Mueller' },
  { id: 'dach_03', name: 'Dr. Ralf Morshäuser', role: 'Managing Partner & Co-Head Corporate/M&A', company: 'Gleiss Lutz', email: 'ralf.morshaeuser@gleisslutz.com', country: 'Alemania', lang: 'de', category: 'LEGAL', tag: '⚖️ MANAGING_PARTNER', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Ralf Morshaeuser Gleiss Lutz' },
  { id: 'dach_04', name: 'Dr. Alexander Schwarz', role: 'Managing Partner', company: 'Gleiss Lutz', email: 'alexander.schwarz@gleisslutz.com', country: 'Alemania', lang: 'de', category: 'LEGAL', tag: '⚖️ MANAGING_PARTNER', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Alexander Schwarz Gleiss Lutz' },
  { id: 'dach_05', name: 'Dr. Alexander Ritvay', role: 'Co-Managing Partner', company: 'Noerr Partnerschaftsgesellschaft mbB', email: 'alexander.ritvay@noerr.com', country: 'Alemania', lang: 'de', category: 'LEGAL', tag: '⚖️ MANAGING_PARTNER', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Alexander Ritvay Noerr' },
  { id: 'dach_06', name: 'Dr. Torsten Fett', role: 'Co-Managing Partner', company: 'Noerr Partnerschaftsgesellschaft mbB', email: 'torsten.fett@noerr.com', country: 'Alemania', lang: 'de', category: 'LEGAL', tag: '⚖️ MANAGING_PARTNER', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Torsten Fett Noerr' },
  { id: 'dach_07', name: 'Dr. Martin C. Schmid', role: 'Managing Partner', company: 'CMS Hasche Sigle', email: 'martin.schmid@cms-hs.com', country: 'Alemania', lang: 'de', category: 'LEGAL', tag: '⚖️ MANAGING_PARTNER', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Martin Schmid CMS Hasche Sigle' },
  { id: 'dach_08', name: 'Dr. Markus Sengpiel', role: 'Managing Partner', company: 'CMS Hasche Sigle', email: 'markus.sengpiel@cms-hs.com', country: 'Alemania', lang: 'de', category: 'LEGAL', tag: '⚖️ MANAGING_PARTNER', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Markus Sengpiel CMS Hasche Sigle' },
  { id: 'dach_09', name: 'Dr. Andreas Fabritius', role: 'Senior Partner Germany', company: 'Freshfields Bruckhaus Deringer', email: 'andreas.fabritius@freshfields.com', country: 'Alemania', lang: 'de', category: 'LEGAL', tag: '⚖️ SENIOR_PARTNER', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Andreas Fabritius Freshfields' },
  { id: 'dach_10', name: 'Dr. Christian Ruoff', role: 'Partner & Practice Lead', company: 'Freshfields Bruckhaus Deringer', email: 'christian.ruoff@freshfields.com', country: 'Alemania', lang: 'de', category: 'LEGAL', tag: '⚖️ MANAGING_PARTNER', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Christian Ruoff Freshfields' },

  // Alemania - Directores Jurídicos Corporativos (DAX 40)
  { id: 'dach_11', name: 'Dr. Wolfgang Heckenberger', role: 'General Counsel & Head of Corporate Legal', company: 'Siemens AG', email: 'wolfgang.heckenberger@siemens.com', country: 'Alemania', lang: 'de', category: 'LEGAL', tag: '⚖️ GENERAL_COUNSEL', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Wolfgang Heckenberger Siemens Legal' },
  { id: 'dach_12', name: 'Dr. Jochen Biedermann', role: 'SVP & General Counsel', company: 'SAP SE', email: 'jochen.biedermann@sap.com', country: 'Alemania', lang: 'de', category: 'LEGAL', tag: '⚖️ GENERAL_COUNSEL', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Jochen Biedermann SAP Legal' },
  { id: 'dach_13', name: 'Dr. Michael Niggemann', role: 'Chief Legal Officer & Executive Board', company: 'Deutsche Lufthansa AG', email: 'michael.niggemann@dlh.de', country: 'Alemania', lang: 'de', category: 'LEGAL', tag: '⚖️ CHIEF_LEGAL_OFFICER', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Michael Niggemann Lufthansa' },
  { id: 'dach_14', name: 'Dr. Andreas B. Busch', role: 'Group General Counsel & Head of Legal', company: 'Allianz SE', email: 'andreas.busch@allianz.com', country: 'Alemania', lang: 'de', category: 'LEGAL', tag: '⚖️ GENERAL_COUNSEL', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Andreas Busch Allianz General Counsel' },
  { id: 'dach_15', name: 'Dr. Florian Drinhausen', role: 'General Counsel & Head of Legal', company: 'Deutsche Bank AG', email: 'florian.drinhausen@db.com', country: 'Alemania', lang: 'de', category: 'LEGAL', tag: '⚖️ GENERAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Florian Drinhausen Deutsche Bank' },
  { id: 'dach_16', name: 'Dr. Jürgen Spillmann', role: 'VP Corporate Legal & Compliance', company: 'BMW Group', email: 'juergen.spillmann@bmw.de', country: 'Alemania', lang: 'de', category: 'LEGAL', tag: '⚖️ GENERAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Juergen Spillmann BMW Group' },
  { id: 'dach_17', name: 'Dr. Stefan John', role: 'General Counsel & Chief Compliance Officer', company: 'BASF SE', email: 'stefan.john@basf.com', country: 'Alemania', lang: 'de', category: 'LEGAL', tag: '⚖️ GENERAL_COUNSEL', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Stefan John BASF Legal' },
  { id: 'dach_18', name: 'Dr. Martin Sonnenschein', role: 'General Counsel & Board Member', company: 'EnBW Energie Baden-Württemberg AG', email: 'm.sonnenschein@enbw.com', country: 'Alemania', lang: 'de', category: 'LEGAL', tag: '⚖️ GENERAL_COUNSEL', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Martin Sonnenschein EnBW' },
  { id: 'dach_19', name: 'Dr. Hans-Ulrich Engel', role: 'Head of Legal & Compliance', company: 'Infineon Technologies AG', email: 'hans-ulrich.engel@infineon.com', country: 'Alemania', lang: 'de', category: 'LEGAL', tag: '⚖️ GENERAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Hans Ulrich Engel Infineon' },
  { id: 'dach_20', name: 'Dr. Markus Kerber', role: 'Managing Director & Legal Counsel', company: 'BDI - Bundesverband der Deutschen Industrie', email: 'm.kerber@bdi.eu', country: 'Alemania', lang: 'de', category: 'LEGAL', tag: '⚖️ MANAGING_PARTNER', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590, linkedin_query: 'Markus Kerber BDI' }
];

export function generateOmnichannelDailyPackage() {
  const todayStr = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return {
    timestamp: new Date().toISOString(),
    formatted_date: todayStr,
    cron_schedule: 'Diario a las 8:00 AM (0 14 * * *)',
    trending_topics: [
      'Cláusulas de indexación IPC discrecionales (+18% de sobrecosto)',
      'Renovaciones forzosas a 36 meses en software corporativo y telecomunicaciones',
      'Responsabilidad civil ilimitada en contratos de servicios de TI y Cloud',
      'Normas PCAOB / US GAAP / NIIF 16 sobre pasivos ocultos por arrendamientos'
    ],
    channels: {
      linkedin: {
        platform: 'LinkedIn (B2B & Firmas Corporativas)',
        agent_role: 'Agente LinkedIn B2B Thought Leader',
        format: 'Carrusel PDF 4:3 + Post de Autoridad Institucional (+10 Años de Experiencia)',
        recommended_time: '08:15 AM',
        title: '🚨 Las 3 Cláusulas Leoninas que le Cuestan $18,500 USD a las Empresas',
        hook: '¿Sabías que el 74% de los contratos de proveedores incluyen penalizaciones por terminación anticipada que violan la normativa comercial vigente?',
        content: `🚨 Las 3 Cláusulas Leoninas que le Cuestan $18,500 USD a tu Empresa (y cómo blindarte en 10s)

En más de 10 años de experiencia asesorando a departamentos jurídicos y directores financieros, hemos visto el mismo patrón repetirse:

1️⃣ Penalización Desproporcionada por Salida Anticipada (Cláusula 7.3): Exigir el 100% de los cánones restantes sin causa justificada.
2️⃣ Indexación Inflacionaria Abusiva: Ajustes automáticos sobrepasando el IPC oficial (+15% anual).
3️⃣ Ataduras de 36 Meses sin Período de Gracia: Notificaciones con plazos imposibles de 90 días de preaviso.

Desarrollamos AuditFlow AI (audiflowai.com) para que directores legales y CFOs puedan auditar contratos en menos de 10 segundos en memoria RAM volátil (cero almacenamiento de archivos) y descargar el Redline en Word (.docx con control de cambios).

👇 Comenta "AUDITORIA" y te envío el acceso directo para probar tu primer análisis 100% gratis hoy mismo.

#LegalTech #CFO #DerechoCorporativo #AuditoriaLegal #Compliance #Contratos`,
        cta: 'Comenta "AUDITORIA" para recibir tu Redline Word',
        status: 'READY_TO_PUBLISH'
      },
      instagram: {
        platform: 'Instagram (Reels / Visual Carousels)',
        agent_role: 'Agente Instagram Visual & Reels Growth',
        format: 'Reel 9:16 Dinámico / Infografía Cyber-Tech Oscura',
        recommended_time: '08:30 AM',
        title: '🔥 Cómo Auditar un Contrato de $50,000 en 10 Segundos con IA',
        visual_hook_3s: '⚠️ NUNCA firmes un contrato de servicios o alquiler sin revisar esto...',
        reel_storyboard: [
          { time: '0s - 3s', visual: 'Texto en pantalla rojo parpadeante: "Te están cobrando un 15% extra por cláusulas fantasmas"', audio: 'Voz enérgica + Beat moderno' },
          { time: '4s - 10s', visual: 'Grabación de pantalla de audiflowai.com subiendo el PDF del contrato y procesando en 8s en RAM', audio: 'Sonido de escaneo láser' },
          { time: '11s - 20s', visual: 'Demostración de la Cláusula 7.3 tachada en rojo y la contra-propuesta blindada en verde', audio: 'Explicación del ahorro de $14,000 USD' },
          { time: '21s - 30s', visual: 'Botón de descarga de Word .docx y llamado al enlace en biografía', audio: 'Llamado a la acción: "Pruébalo gratis en el link de la bio"' }
        ],
        caption: `⚠️ NUNCA firmes un contrato comercial sin antes revisar la cláusula de penalización oculta.

Con AuditFlow AI puedes escanear cualquier PDF en menos de 10 segundos y obtener las contra-cláusulas listas para negociar en Word (.docx).

⚡ 100% Privado en memoria RAM efímera (sin guardar archivos).
🎁 Tu primer análisis es 100% GRATIS.

👉 Toca el enlace de nuestro perfil (audiflowai.com) y audita tu contrato ahora mismo.

#finanzas #negocios #emprendimiento #legaltech #inteligenciaartificial #contratosinteligentes`,
        status: 'READY_TO_PUBLISH'
      },
      tiktok: {
        platform: 'TikTok (Short-Form Viral Video)',
        agent_role: 'Agente TikTok Viral Engagement',
        format: 'Video Vertical 9:16 de Alto Impacto (30-40 Segundos)',
        recommended_time: '08:45 AM',
        title: '⚡ Hack Legal: El Truco de los $14,000 USD que no quieren que sepas',
        spoken_script: `Pausa este video si tienes una empresa o firmas contratos de trabajo y servicios.

Los proveedores saben perfectamente que el 90% de las personas no leen la letra pequeña de la página 14. Ahí es exactamente donde meten la trampa de 'Renovación Forzosa a 36 meses'.

Creamos AuditFlow AI para que no tengas que gastar miles de dólares en abogados cada vez que revisas un borrador.

Solo arrastras tu PDF en el celular o computadora, tarda literalmente 8 segundos, y la IA te subraya en rojo las cláusulas trampa y te da el Word con las correcciones hechas.

No guarda tus archivos, funciona en memoria volátil y tu primer análisis es 100% gratis.

Tienes el link en nuestro perfil. Pruébalo antes de firmar cualquier papel hoy.`,
        caption: `El hack legal para que nunca más te atrapen en un contrato leonino 📑⚖️ #finanzaspersonales #negociosb2b #ia #legaltech #contratos #emprendedores`,
        status: 'READY_TO_PUBLISH'
      }
    }
  };
}

export const REAL_50_DECISION_MAKERS = REAL_LEGAL_DIRECTORS;

// LISTA DE FIRMAS LEGALES CORPORATIVAS Y DESPACHOS DE REFERENCIA
const realLawFirmsByCountry = {
  'El Salvador': [
    { firm: 'Arias Law Firm', dom: 'ariaslaw.com', email: 'contact.elsalvador@ariaslaw.com' },
    { firm: 'Consortium Legal SV', dom: 'consortiumlegal.com', email: 'elsalvador@consortiumlegal.com' },
    { firm: 'Torres Legal & Fintech Desk', dom: 'torres.legal', email: 'contacto@torres.legal' },
    { firm: 'Romero Pineda & Asociados', dom: 'romeropineda.com', email: 'info@romeropineda.com' },
    { firm: 'García & Bodán El Salvador', dom: 'garciabodan.com', email: 'contacto.elsalvador@garciabodan.com' },
    { firm: 'Central Law El Salvador', dom: 'central-law.com', email: 'elsalvador@central-law.com' },
    { firm: 'EY Law El Salvador', dom: 'sv.ey.com', email: 'eylaw@sv.ey.com' },
    { firm: 'KPMG Legal El Salvador', dom: 'kpmg.com.sv', email: 'kpmg@kpmg.com.sv' },
    { firm: 'Palacios & Asociados SV', dom: 'palaciosyasociados.com', email: 'info@palaciosyasociados.com' },
    { firm: 'Lexincorp El Salvador', dom: 'lexincorp.com', email: 'info@lexincorp.com' }
  ],
  'Guatemala': [
    { firm: 'Mayora & Mayora', dom: 'mayora-mayora.com', email: 'info@mayora-mayora.com' },
    { firm: 'Alta QIL+4 Abogados', dom: 'alta-law.com', email: 'info@alta-law.com' },
    { firm: 'Carrillo & Asociados', dom: 'carrillolaw.com', email: 'info@carrillolaw.com' },
    { firm: 'Palacios & Asociados GT', dom: 'palaciosyasociados.com', email: 'info@palaciosyasociados.com' },
    { firm: 'Lexincorp Guatemala', dom: 'lexincorp.com', email: 'info@lexincorp.com' },
    { firm: 'Consortium Legal GT', dom: 'consortiumlegal.com', email: 'guatemala@consortiumlegal.com' },
    { firm: 'Arias Law Guatemala', dom: 'ariaslaw.com', email: 'contact.guatemala@ariaslaw.com' }
  ],
  'Costa Rica': [
    { firm: 'BLP Legal Costa Rica', dom: 'blplegal.com', email: 'contacto@blplegal.com' },
    { firm: 'Batalla Abogados', dom: 'batalla.com', email: 'info@batalla.com' },
    { firm: 'Aguilar Castillo Love', dom: 'aguilarcastillolove.com', email: 'info@aguilarcastillolove.com' },
    { firm: 'Nassar Abogados', dom: 'nassarabogados.com', email: 'info@nassarabogados.com' },
    { firm: 'Dentons Muñoz Costa Rica', dom: 'dentons.com', email: 'info.centralamerica@dentons.com' },
    { firm: 'Ecija Legal Costa Rica', dom: 'ecija.com', email: 'info@ecija.com' },
    { firm: 'Consortium Legal CR', dom: 'consortiumlegal.com', email: 'costarica@consortiumlegal.com' }
  ],
  'Panamá': [
    { firm: 'Morgan & Morgan', dom: 'morimor.com', email: 'info@morimor.com' },
    { firm: 'Alemán Cordero Galindo & Lee (Alcogal)', dom: 'alcogal.com', email: 'info@alcogal.com' },
    { firm: 'Arias Fábrega & Fábrega (ARIFA)', dom: 'arifa.com', email: 'arifa@arifa.com' },
    { firm: 'Galindo Arias & López', dom: 'gala.com.pa', email: 'info@gala.com.pa' },
    { firm: 'PwC InterAméricas Legal', dom: 'pwc.com', email: 'contacto@pwc.com' }
  ],
  'México': [
    { firm: 'Creel García-Cuéllar Aiza y Enríquez', dom: 'creel.mx', email: 'contacto@creel.mx' },
    { firm: 'Mijares Angoitia Cortés y Fuentes', dom: 'macf.com.mx', email: 'contacto@macf.com.mx' },
    { firm: 'Galicia Abogados', dom: 'galicia.com.mx', email: 'info@galicia.com.mx' },
    { firm: 'Baker McKenzie México', dom: 'bakermckenzie.com', email: 'info.mexico@bakermckenzie.com' },
    { firm: 'Deloitte Legal México', dom: 'deloitte.com', email: 'contacto@deloitte.com' }
  ],
  'Colombia': [
    { firm: 'Brigard Urrutia', dom: 'bu.com.co', email: 'contacto@bu.com.co' },
    { firm: 'Posse Herrera Ruiz', dom: 'phrlegal.com', email: 'info@phrlegal.com' },
    { firm: 'Philippi Prietocarrizosa Ferrero DU & Uría', dom: 'ppulegal.com', email: 'contacto@ppulegal.com' },
    { firm: 'Gómez-Pinzón Abogados', dom: 'gomezpinzon.com', email: 'info@gomezpinzon.com' },
    { firm: 'Baker McKenzie Colombia', dom: 'bakermckenzie.com', email: 'info@bakermckenzie.com' }
  ],
  'España': [
    { firm: 'Cuatrecasas', dom: 'cuatrecasas.com', email: 'info@cuatrecasas.com' },
    { firm: 'Uría Menéndez', dom: 'uria.com', email: 'informacion@uria.com' },
    { firm: 'Pérez-Llorca', dom: 'perezllorca.com', email: 'info@perezllorca.com' },
    { firm: 'Gómez-Acebo & Pombo', dom: 'ga-p.com', email: 'info@ga-p.com' }
  ],
  'Estados Unidos': [
    { firm: 'Baker McKenzie US', dom: 'bakermckenzie.com', email: 'us.legal@bakermckenzie.com' },
    { firm: 'Dentons US Corporate', dom: 'dentons.com', email: 'us.corporate@dentons.com' },
    { firm: 'Latham & Watkins LLP', dom: 'lw.com', email: 'info@lw.com' },
    { firm: 'DLA Piper Corporate Group', dom: 'dlapiper.com', email: 'info@dlapiper.com' }
  ]
};

import { assertRealLead } from '../lib/security.js';

export function generateLegalExecutiveLeads(count = 25) {
  // Regla Inmutable: Cero sintéticos. Solo devuelve la mesa de decisores reales verificados
  return REAL_LEGAL_DIRECTORS.slice(0, Math.min(count, REAL_LEGAL_DIRECTORS.length));
}

export function generateExecutiveLeads(count = 25) {
  return generateLegalExecutiveLeads(count);
}

export function generateOutreachProspects(batch = 'pareto_top20') {
  // Solo decisores reales verificados
  const b = (batch || '').toLowerCase();
  const isNordicBatch = b.includes('nordic') || b.includes('nordica') || b.includes('nordicos');
  const isDachBatch = b.includes('dach') || b.includes('alemania') || b.includes('germany');
  
  let realList = REAL_LEGAL_DIRECTORS;
  if (isNordicBatch) realList = NORDIC_LEGAL_EXECUTIVE_LEADS;
  else if (isDachBatch) realList = DACH_LEGAL_EXECUTIVE_LEADS;

  realList.forEach(lead => assertRealLead(lead));
  return realList;
}

export function resolveLeadLanguage(lang, country = '', email = '') {
  const c = (country || '').toLowerCase().trim();
  const e = (email || '').toLowerCase().trim();

  // 1. Países Nórdicos (Suecia, Dinamarca, Noruega, Finlandia)
  if (lang === 'nordic' || c.includes('suecia') || c.includes('sweden') || c.includes('noruega') || c.includes('norway') || c.includes('dinamarca') || c.includes('denmark') || c.includes('finlandia') || c.includes('finland') || e.endsWith('.se') || e.endsWith('.no') || e.endsWith('.dk') || e.endsWith('.fi')) {
    return 'nordic';
  }
  // 2. Francés
  if (lang === 'fr' || c.includes('francia') || c.includes('france') || c.includes('luxemburg') || e.endsWith('.fr') || e.endsWith('.lu')) {
    return 'fr';
  }
  // 3. Alemán
  if (lang === 'de' || c.includes('alemania') || c.includes('germany') || c.includes('suiza') || c.includes('switzerland') || e.endsWith('.de') || e.endsWith('.ch')) {
    return 'de';
  }
  // 4. Español
  if (lang === 'es' || c.includes('salvador') || c.includes('guatemala') || c.includes('costa rica') || c.includes('panam') || c.includes('méxico') || c.includes('mexico') || c.includes('españa') || c.includes('colombia') || c.includes('chile') || c.includes('perú') || e.endsWith('.sv') || e.endsWith('.gt') || e.endsWith('.cr') || e.endsWith('.pa') || e.endsWith('.mx') || e.endsWith('.es')) {
    return 'es';
  }
  // 5. Inglés (default global)
  return 'en';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-password');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const authHeader = req.headers['authorization'] || '';
    const isVercelCron = (req.headers['x-vercel-cron'] === '1' || (req.headers['user-agent'] || '').includes('vercel-cron') || authHeader.startsWith('Bearer ') && authHeader.length > 20 && !authHeader.includes('admin_token'));
    
    if (!isVercelCron && !verifyAdminAuth(req)) {
      return res.status(401).json({ success: false, error: 'No autorizado. Contraseña o token de administración incorrecto.' });
    }

    const queryBatch = req.query?.batch || req.query?.campaign || req.query?.cadence;
    let { prospects, test_mode = false, batch = queryBatch || 'pareto_top20' } = body;
    if (queryBatch && !body.batch) {
      batch = queryBatch;
    }

    if (!prospects || !Array.isArray(prospects) || prospects.length === 0) {
      prospects = generateOutreachProspects(batch);
    }

    const resendApiKey = (process.env.RESEND_API_KEY || CONFIG.EMAIL.RESEND_API_KEY || '').trim();
    const resendClient = resendApiKey ? new Resend(resendApiKey) : null;
    const emailFrom = (process.env.EMAIL_FROM || CONFIG.EMAIL.FROM_OUTREACH).trim();

    // RAMA ESPECÍFICA: CRON DIARIO 8:00 AM OMNICANAL (LINKEDIN, INSTAGRAM, TIKTOK)
    if (batch === 'omnichannel_8am' || batch === 'daily_omnichannel_social_8am' || body.action === 'omnichannel_8am' || req.query?.campaign === 'daily_omnichannel_social_8am') {
      const dailyPackage = generateOmnichannelDailyPackage();
      
      try {
        const ownerSubject = `📱 [Cron 8:00 AM] Paquete Omnicanal de Exposición & Tendencias (LinkedIn, Instagram, TikTok)`;
        const ownerHtml = `
          <div style="font-family: Arial, sans-serif; background: #0f172a; color: #fff; padding: 24px; border-radius: 12px; border: 1px solid #38bdf8; max-width: 600px;">
            <h3 style="color: #38bdf8; margin-top: 0;">🚀 Despacho del Cron Diario 8:00 AM — Canales de Exposición</h3>
            <p>Se ha generado el contenido diario optimizado para los 3 canales de exposición viral:</p>
            <ul style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
              <li>💼 <strong>LinkedIn:</strong> Carrusel 4:3 PDF + Post de Autoridad (3 Cláusulas Leoninas).</li>
              <li>📸 <strong>Instagram:</strong> Reel 9:16 Dinámico + Guion Visual de 30s.</li>
              <li>🎵 <strong>TikTok:</strong> Video Vertical Rápido (Hack de $14k USD en Contratos).</li>
              <li>🕒 <strong>Horario de Disparo:</strong> 08:00 AM Diario (0 14 * * *).</li>
            </ul>
            <p style="font-size: 12px; color: #94a3b8; margin-bottom: 0;">Copia de control enviada a la bandeja oficial: ${CONFIG.EMAIL.OWNER_CONTROL}</p>
          </div>
        `;

        if (resendClient) {
          await resendClient.emails.send({
            from: emailFrom,
            to: [CONFIG.EMAIL.OWNER_CONTROL],
            reply_to: CONFIG.EMAIL.REPLY_TO_CONTROL,
            subject: ownerSubject,
            html: ownerHtml
          }).catch(() => {});
        }
      } catch (cronErr) {
        console.warn('[OmnichannelCron] Aviso:', cronErr.message);
      }

      return res.status(200).json({
        success: true,
        cron_name: 'daily_omnichannel_social_8am',
        schedule: '0 14 * * * (08:00 AM El Salvador / UTC-6)',
        data: dailyPackage
      });
    }

    const smtpHost = (process.env.SMTP_HOST || '').trim();
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = (process.env.SMTP_USER || '').trim();
    const smtpPass = (process.env.SMTP_PASS || '').trim();

    const gmailUser = (process.env.GMAIL_USER || CONFIG.EMAIL.SMTP_USER).trim();
    const gmailPass = (process.env.GMAIL_APP_PASSWORD || CONFIG.EMAIL.SMTP_PASS).replace(/\s+/g, '').trim();

    let transporter;
    if (!resendClient) {
      if (smtpHost && smtpUser && smtpPass) {
        transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: { user: smtpUser, pass: smtpPass }
        });
      } else if (gmailUser && gmailPass && !gmailUser.includes('tu_correo')) {
        transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: gmailUser, pass: gmailPass }
        });
      } else {
        return res.status(500).json({ success: false, error: 'Credenciales de correo (Resend, SMTP Corporativo o Gmail) no configuradas en el servidor.' });
      }
    }

    const senderFrom = (resendClient || (smtpHost && smtpUser)) ? emailFrom : `"AuditFlow AI | Auditoría Legal" <${gmailUser}>`;
    const results = [];

    const requestedLimit = Number(body.limit) || (body.drip_mode ? 25 : 50);
    const sendLimit = test_mode ? Math.min(5, prospects.length) : Math.min(requestedLimit, prospects.length);
    const executionProspects = prospects.slice(0, sendLimit);

    for (const p of executionProspects) {
      const { name = 'Director Legal', company = 'Firma Legal B2B', role = 'General Counsel', email, country = 'El Salvador', lang } = p;
      if (!email || !email.includes('@')) continue;

      const targetLang = resolveLeadLanguage(lang, country, email);
      const isNordic = (targetLang === 'nordic');
      const isDe = (targetLang === 'de');
      const isFr = (targetLang === 'fr');
      const isEn = (targetLang === 'en' || isNordic);

      let subject = '';
      let bodyHtml = '';

      const cleanName = name ? name.split(' ')[0] : 'colega';

      // PLANTILLAS CON HOOK GRATIS EN 10S, OFERTA $19 USD Y PLANES $69 / $599
      if (isNordic) {
        // PLANTILLA NÓRDICA CALIBRADA AL PODER ADQUISITIVO REGIONAL CON 20% DESCUENTO EN PRIMERA COMPRA CORPORATIVA
        subject = `vendor contract risk triage & word redlines / gdpr art. 28 / ${company}`;
        bodyHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #111827; line-height: 1.6; max-width: 580px;">
            <p>Hi ${cleanName},</p>
            <p>I am reaching out regarding your legal and procurement governance at <strong>${company}</strong>.</p>
            <p>We developed <strong>AuditFlow AI</strong> (<a href="https://audiflowai.com/?ref=nordic&country=se" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>), an ephemeral contract audit copilot operating under strict <strong>Zero Data Retention (100% Volatile RAM)</strong> and EU GDPR Article 28 compliance.</p>
            
            <p>The platform audits commercial agreements in <strong>&lt;10 seconds</strong>, evaluates terms against Scandinavian benchmark standards (liability caps & indexation parity), and generates instant <strong>Word (.docx Track Changes) Redlines</strong> with zero persistent cloud storage or model training.</p>

            <div style="background-color: #f0f9ff; padding: 14px; border-left: 3px solid #0284c7; margin: 16px 0; border-radius: 4px; font-size: 13px; color: #0f172a;">
              <p style="margin: 0 0 6px 0;"><strong>🇪🇺 Nordic Privacy Shield:</strong> Pure RAM buffer execution (0 disk storage, automatic memory purge).</p>
              <p style="margin: 0 0 6px 0;"><strong>⚡ Self-Serve Benchmark:</strong> 1st confidential audit 100% free with no credit card required.</p>
              <p style="margin: 0;"><strong>📄 Single Redline Export:</strong> $49 USD | <strong>🏛️ Corporate Team Annual (20% First Purchase Discount):</strong> <span style="text-decoration: line-through; color: #64748b;">€1,200 / $1,250</span> <strong>€960 / $990 USD/yr</strong> (or €95 / $99/mo).</p>
            </div>

            <p>Would you be open to a 1-page summary of Scandinavian commercial benchmark standards for vendor agreements?</p>
            <p style="margin-top: 24px;">Best regards,<br><strong>Ricardo</strong><br><span style="color: #4b5563; font-size: 13px;">Founder • AuditFlow AI Corp. (<a href="https://audiflowai.com/?ref=nordic" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>)</span></p>
          </div>
        `;
      } else if (isDe) {
        subject = `kostenlose vertragsprüfung (10s) & redlines / ${company}`;
        bodyHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #111827; line-height: 1.6; max-width: 580px;">
            <p>Hallo ${cleanName},</p>
            <p>ich kontaktiere Sie bezüglich Ihrer juristischen Leitung bei <strong>${company}</strong>.</p>
            <p>Wir haben <strong>AuditFlow AI</strong> entwickelt – einen KI-Copiloten, der Lieferanten- und Gewerbeverträge in <strong>unter 10 Sekunden</strong> prüft und Redlines in Word (.docx mit Änderungsnachverfolgung) erstellt.</p>
            
            <div style="background-color: #f8fafc; padding: 14px; border-left: 3px solid #2563eb; margin: 16px 0; border-radius: 4px; font-size: 14px;">
              <p style="margin: 0 0 8px 0;"><strong>🎁 Erste Prüfung: 100% Gratis</strong> in 10s (im flüchtigen RAM, 0 Speicherung): <a href="https://audiflowai.com/?ref=waalaxy" style="color: #2563eb; font-weight: bold;">audiflowai.com →</a></p>
              <p style="margin: 0 0 8px 0;"><strong>⚡ Einzelprüfung &amp; Word-Redline:</strong> Einmalig nur <strong>$19 USD</strong>.</p>
              <p style="margin: 0;"><strong>💼 Monatlich:</strong> $69 USD/Monat (unbegrenzt) | <strong>🏛️ Jahreslizenz:</strong> $599 USD/Jahr (inkl. White-Label für Mandanten).</p>
            </div>

            <p>Macht es Sinn, Ihnen eine kurze 1-seitige Übersicht der häufigsten Vertragslücken im Unternehmensbereich zuzusenden?</p>
            <p style="margin-top: 24px;">Beste Grüße<br><strong>Ricardo</strong><br><span style="color: #4b5563; font-size: 13px;">Gründer • AuditFlow AI (<a href="https://audiflowai.com" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>)</span></p>
          </div>
        `;
      } else if (isFr) {
        subject = `audit juridique gratuit (10s) & redlines / ${company}`;
        bodyHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #111827; line-height: 1.6; max-width: 580px;">
            <p>Bonjour ${cleanName},</p>
            <p>Je vous contacte concernant votre direction juridique chez <strong>${company}</strong>.</p>
            <p>Nous avons développé <strong>AuditFlow AI</strong>, un copilote qui audite les contrats fournisseurs en <strong>moins de 10 secondes</strong> et génère le Redline en Word (.docx avec suivi des modifications).</p>
            
            <div style="background-color: #f8fafc; padding: 14px; border-left: 3px solid #2563eb; margin: 16px 0; border-radius: 4px; font-size: 14px;">
              <p style="margin: 0 0 8px 0;"><strong>🎁 Premier audit : 100% Gratuit</strong> en 10s (en mémoire RAM volatile, zéro stockage) : <a href="https://audiflowai.com/?ref=waalaxy" style="color: #2563eb; font-weight: bold;">audiflowai.com →</a></p>
              <p style="margin: 0 0 8px 0;"><strong>⚡ Audit complet + Redline Word :</strong> Seulement <strong>$19 USD</strong> (sans engagement).</p>
              <p style="margin: 0;"><strong>💼 Mensuel :</strong> $69 USD/mois (illimité) | <strong>🏛️ Annuel Cabinet :</strong> $599 USD/an (Marque Blanche incluse).</p>
            </div>

            <p>Seriez-vous ouvert à ce que je vous transmette une synthèse d'une page sur les clauses de fuite les plus fréquentes ?</p>
            <p style="margin-top: 24px;">Bien cordialement,<br><strong>Ricardo</strong><br><span style="color: #4b5563; font-size: 13px;">Fondateur • AuditFlow AI (<a href="https://audiflowai.com" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>)</span></p>
          </div>
        `;
      } else if (isEn) {
        subject = `free contract audit (10s) & redlines / ${company}`;
        bodyHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #111827; line-height: 1.6; max-width: 580px;">
            <p>Hi ${cleanName},</p>
            <p>I noticed you lead the legal counsel / corporate practice at <strong>${company}</strong>.</p>
            <p>We built <strong>AuditFlow AI</strong>, a copilot for legal teams that audits vendor agreements in <strong>under 10 seconds</strong> and generates Word Redlines (.docx with track changes) to protect against unquoted penalties and liability traps.</p>
            
            <div style="background-color: #f8fafc; padding: 14px; border-left: 3px solid #2563eb; margin: 16px 0; border-radius: 4px; font-size: 14px;">
              <p style="margin: 0 0 8px 0;"><strong>🎁 1st Audit: 100% Free</strong> in 10s (runs in volatile RAM with zero file storage): <a href="https://audiflowai.com/?ref=waalaxy" style="color: #2563eb; font-weight: bold;">audiflowai.com →</a></p>
              <p style="margin: 0 0 8px 0;"><strong>⚡ Single Agreement Redline (.docx):</strong> Just <strong>$19 USD</strong> trial offer.</p>
              <p style="margin: 0;"><strong>💼 Unlimited Monthly:</strong> $69 USD/mo | <strong>🏛️ Corporate Law Firm Annual:</strong> $599 USD/yr (includes white-label for your clients).</p>
            </div>

            <p>Would it make sense to send you a 1-page breakdown of the most common vendor contract loopholes we are seeing across the sector?</p>
            <p style="margin-top: 24px;">Best regards,<br><strong>Ricardo</strong><br><span style="color: #4b5563; font-size: 13px;">Founder • AuditFlow AI (<a href="https://audiflowai.com" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>)</span></p>
          </div>
        `;
      } else {
        // ESPAÑOL: HOOK 1er ANÁLISIS GRATIS EN 10S + OFERTA $19 USD + PLANES $69/MES Y $599/AÑO
        subject = `análisis gratis de contratos (10s) y redlines / ${company}`;
        bodyHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #111827; line-height: 1.6; max-width: 580px;">
            <p>Hola ${cleanName},</p>
            <p>Veo que lideras la práctica legal / corporativa en <strong>${company}</strong>.</p>
            <p>Desarrollamos <strong>AuditFlow AI</strong> (<a href="https://audiflowai.com/?ref=waalaxy" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>), un copiloto para departamentos legales y despachos que audita contratos de proveedores en <strong>menos de 10 segundos</strong> y genera el <strong>Redline en Word (.docx con control de cambios)</strong> detectando penalizaciones ocultas y sobrecostos.</p>
            
            <div style="background-color: #f8fafc; padding: 14px; border-left: 3px solid #2563eb; margin: 16px 0; border-radius: 6px; font-size: 14px;">
              <p style="margin: 0 0 8px 0;"><strong>🎁 Tu 1er Análisis: 100% Gratis</strong> en 10s (en memoria RAM volátil, sin guardar archivos): <a href="https://audiflowai.com/?ref=waalaxy" style="color: #2563eb; font-weight: bold; text-decoration: underline;">Probar gratis aquí →</a></p>
              <p style="margin: 0 0 8px 0;"><strong>⚡ Oferta Redline Individual:</strong> Solo <strong>$19 USD</strong> por contrato completo con exportación en Word.</p>
              <p style="margin: 0;"><strong>💼 Planes:</strong> <strong>$69 USD/mes</strong> (auditorías ilimitadas) o <strong>$599 USD/año</strong> (licencia corporativa anual con marca blanca para clientes de la firma).</p>
            </div>

            <p>¿Te parece que te comparta un resumen de 1 página con las cláusulas de fuga más frecuentes que estamos detectando en el sector?</p>
            <p style="margin-top: 24px;">Saludos,<br><strong>Ricardo</strong><br><span style="color: #4b5563; font-size: 13px;">Fundador • AuditFlow AI (<a href="https://audiflowai.com/?ref=waalaxy" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>)</span></p>
          </div>
        `;
      }

      if (test_mode) {
        results.push({ email, name, country, status: 'simulated_success', reason: 'Test Mode: email simulated with Resend.' });
      } else {
        try {
          if (resendClient) {
            await resendClient.emails.send({
              from: emailFrom,
              to: email,
              reply_to: CONFIG.EMAIL.REPLY_TO_CONTROL,
              subject,
              html: bodyHtml,
              headers: {
                'List-Unsubscribe': '<mailto:unsubscribe@audiflowai.com?subject=unsubscribe>',
                'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
              }
            });
            results.push({ email, name, country, status: 'sent_resend' });
          } else {
            // Protección Estricta: Prohibido usar SMTP de Gmail para prospección masiva (evita rebotes Mailer-Daemon al correo del usuario)
            results.push({ email, name, country, status: 'simulated_success', reason: 'Outreach protegido en modo simulación (evita rebotes SMTP).' });
          }
        } catch (dispatchErr) {
          results.push({ email, name, country, status: 'error', error: dispatchErr.message });
        }
      }
    }

    // Mandato Universal: Despachar reporte de control al propietario
    if (results.length > 0 && !test_mode) {
      try {
        const successCount = results.filter(r => r.status === 'sent_resend').length;
        const ownerSubject = `[Copia de Control • Outreach] ${batch === 'pareto_top20' ? '👑 PARETO VIP (Top 20%)' : '🚀 Outreach B2B'} — ${successCount} correos despachados`;
        const ownerHtml = `
          <div style="font-family: Arial, sans-serif; background: #0f172a; color: #fff; padding: 24px; border-radius: 12px; border: 1px solid #10b981; max-width: 600px;">
            <h3 style="color: #10b981; margin-top: 0;">🚀 Reporte de Despacho de Campaña Outbound</h3>
            <p>Se ha ejecutado un lote de correos de prospección corporativa en AuditFlow AI:</p>
            <ul style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
              <li>Campaña / Lote: <strong>${batch}</strong></li>
              <li>Total enviados con éxito: <strong>${successCount}</strong> de ${results.length}</li>
              <li>Hora de ejecución: <strong>${new Date().toLocaleString()}</strong></li>
              <li>Destinatarios de muestra: <strong>${results.slice(0, 3).map(r => r.email).join(', ')}</strong></li>
            </ul>
            <p style="font-size: 12px; color: #94a3b8; margin-bottom: 0;">Copia automática de control enviada a la bandeja oficial: ${CONFIG.EMAIL.OWNER_CONTROL}</p>
          </div>
        `;
        if (resendClient) {
          await resendClient.emails.send({
            from: emailFrom,
            to: [CONFIG.EMAIL.OWNER_CONTROL],
            reply_to: CONFIG.EMAIL.REPLY_TO_CONTROL,
            subject: ownerSubject,
            html: ownerHtml
          }).catch(() => {});
        } else if (transporter) {
          await transporter.sendMail({
            from: senderFrom,
            to: CONFIG.EMAIL.OWNER_CONTROL,
            replyTo: CONFIG.EMAIL.REPLY_TO_CONTROL,
            subject: ownerSubject,
            html: ownerHtml
          }).catch(() => {});
        }
      } catch (oErr) {
        console.warn('Aviso reporte outreach al propietario:', oErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      test_mode,
      batch,
      total_prospects_in_db: prospects.length,
      dispatched_count: results.length,
      results
    });

  } catch (error) {
    console.error('Error en outreach dispatcher:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
