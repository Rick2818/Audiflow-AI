/**
 * ==============================================================================
 * AUDITFLOW AI — MASTER LEGAL JURISDICTIONS REGISTRY
 * ==============================================================================
 * Mapeo exhaustivo y fiduciario de marcos civiles, comerciales y de privacidad
 * para Centroamérica, Países Nórdicos, Región DACH y Mercados Globales.
 *
 * Principio Fiduciario Inmutable:
 * - Cero simulación: Citas reales a leyes, decretos y artículos vigentes.
 * - Cuidado especial nórdico: Avtalslagen § 36 y RGPD UE Art. 28 (Memoria RAM volátil).
 * - Cero retención permanente en disco en todas las jurisdicciones.
 * ==============================================================================
 */

export const LEGAL_JURISDICTIONS = {
  // 🇸🇻 EL SALVADOR
  sv: {
    id: 'sv',
    code: 'SV',
    countryName: 'El Salvador',
    countryNameEn: 'El Salvador',
    flag: '🇸🇻',
    currency: 'USD',
    language: 'es',
    region: 'Centroamérica',
    commercialCode: 'Código de Comercio de El Salvador',
    commercialArticles: 'Arts. 945 y ss. (Obligaciones Mercantiles y Contratos), Art. 964 (Intereses moratorios), Art. 992 (Prescripción mercantil)',
    consumerLaw: 'Ley de Protección al Consumidor (Art. 17: Cláusulas abusivas e ineficaces de pleno derecho)',
    taxFramework: 'IVA 13% (Ley de IVA Art. 1), Retención de Renta del 10% a servicios no domiciliados (Art. 158 Código Tributario)',
    accountingStandard: 'Normas Internacionales de Información Financiera (NIIF) adoptadas por el CVPCPA',
    privacyStandard: 'Principio de Secreto Comercial y Confidencialidad en Memoria RAM Volátil (0 Retención en Disco)',
    disputeForum: 'Tribunales de San Salvador o Centro de Mediación y Arbitraje de la Cámara de Comercio de El Salvador (CAMARASAL)'
  },

  // 🇬🇹 GUATEMALA
  gt: {
    id: 'gt',
    code: 'GT',
    countryName: 'Guatemala',
    countryNameEn: 'Guatemala',
    flag: '🇬🇹',
    currency: 'GTQ / USD',
    language: 'es',
    region: 'Centroamérica',
    commercialCode: 'Código de Comercio de Guatemala (Decreto 2-70 del Congreso de la República)',
    commercialArticles: 'Arts. 669 y ss. (Principios: verdad sabida y buena fe guardada), Art. 688 (Teoría de la imprevisión), Art. 691 (Mora y cláusula penal)',
    consumerLaw: 'Ley de Protección al Consumidor y Usuario (Decreto 006-2003, Art. 47: Cláusulas abusivas en contratos por adhesión)',
    taxFramework: 'Retención de IVA 12% (Decreto 27-92) y Régimen de Factura Especial con 5% de retención definitiva de ISR (Decreto 10-2012)',
    accountingStandard: 'NIIF Completas y NIIF para PYMES adoptadas por el IGCPA',
    privacyStandard: 'Custodia fiduciaria en memoria RAM efímera con destrucción inmediata de buffers (0 Disco)',
    disputeForum: 'Tribunales de la Ciudad de Guatemala o Comisión de Resolución de Conflictos de la Cámara de Industria de Guatemala (CRECIG / CENAC)'
  },

  // 🇨🇷 COSTA RICA
  cr: {
    id: 'cr',
    code: 'CR',
    countryName: 'Costa Rica',
    countryNameEn: 'Costa Rica',
    flag: '🇨🇷',
    currency: 'CRC / USD',
    language: 'es',
    region: 'Centroamérica',
    commercialCode: 'Código de Comercio de Costa Rica (Ley N° 3284)',
    commercialArticles: 'Arts. 411 y ss. (Obligaciones y contratos mercantiles), Art. 418 (Validez de pactos y límites a la usura), Art. 450 (Cláusulas penales)',
    consumerLaw: 'Ley de Promoción de la Competencia y Defensa Efectiva del Consumidor (Ley N° 7472, Art. 42: Cláusulas abusivas nulas en contratos de adhesión)',
    taxFramework: 'Ley N° 9635 (Fortalecimiento de las Finanzas Públicas: IVA 13% sobre servicios y retenciones en la fuente)',
    accountingStandard: 'NIIF adoptadas por el Colegio de Contadores Públicos de Costa Rica',
    privacyStandard: 'Ley N° 8968 (Protección de la Persona frente al Tratamiento de sus Datos Personales) & RAM Volátil',
    disputeForum: 'Centro de Conciliación y Arbitraje de la Cámara de Comercio de Costa Rica (CCA)'
  },

  // 🇵🇦 PANAMÁ
  pa: {
    id: 'pa',
    code: 'PA',
    countryName: 'Panamá',
    countryNameEn: 'Panama',
    flag: '🇵🇦',
    currency: 'USD',
    language: 'es',
    region: 'Centroamérica',
    commercialCode: 'Código de Comercio de la República de Panamá (Ley de 2 de junio de 1916 y reformas)',
    commercialArticles: 'Arts. 196 y ss. (De los Contratos Mercantiles en general), Art. 219 (Teoría de la buena fe comercial), Ley 131 de 2013 (Arbitraje Comercial)',
    consumerLaw: 'Ley 45 de 31 de octubre de 2007 (ACODECO - Protección al Consumidor y Defensa de la Competencia, Arts. 74 y 75: Nulidad absoluta de cláusulas abusivas y leoninas)',
    taxFramework: 'ITBMS 7% (Impuesto de Transferencia de Bienes Muebles y Servicios) y retención fiscal a proveedores no domiciliados',
    accountingStandard: 'NIIF adoptadas por la Junta Técnica de Contabilidad de Panamá',
    privacyStandard: 'Ley 81 de 2019 (Protección de Datos Personales) & Procesamiento en RAM efímera con borrado instantáneo',
    disputeForum: 'Centro de Conciliación y Arbitraje de Panamá (CeCAP - Cámara de Comercio de Panamá)'
  },

  // 🇭🇳 HONDURAS
  hn: {
    id: 'hn',
    code: 'HN',
    countryName: 'Honduras',
    countryNameEn: 'Honduras',
    flag: '🇭🇳',
    currency: 'HNL / USD',
    language: 'es',
    region: 'Centroamérica',
    commercialCode: 'Código de Comercio de Honduras (Decreto N° 73-1950)',
    commercialArticles: 'Arts. 712 y ss. (Obligaciones y Contratos Mercantiles), Art. 740 (Prohibición de estipulaciones leoninas)',
    consumerLaw: 'Ley de Protección al Consumidor (Decreto 24-2008, Arts. 31 y 32: Ineficacia de cláusulas desproporcionadas)',
    taxFramework: 'Impuesto Sobre Ventas (ISV 15%) y régimen de retenciones fiscales SAR',
    accountingStandard: 'NIIF adoptadas por la Junta Técnica de Normas de Contabilidad y Auditoría (JUNTEC)',
    privacyStandard: 'Garantía fiduciaria de memoria volátil y confidencialidad comercial sin almacenamiento permanente',
    disputeForum: 'Centro de Conciliación y Arbitraje de la Cámara de Comercio e Industria de Tegucigalpa (CCIT)'
  },

  // 🇳🇮 NICARAGUA
  ni: {
    id: 'ni',
    code: 'NI',
    countryName: 'Nicaragua',
    countryNameEn: 'Nicaragua',
    flag: '🇳🇮',
    currency: 'NIO / USD',
    language: 'es',
    region: 'Centroamérica',
    commercialCode: 'Código de Comercio de Nicaragua',
    commercialArticles: 'Arts. 248 y ss. (Actos de comercio y obligaciones mercantiles)',
    consumerLaw: 'Ley N° 842 (Ley de Protección de los Derechos de las Personas Consumidoras y Usuarias)',
    taxFramework: 'Ley N° 822 (Ley de Concertación Tributaria - IVA 15% y retenciones definitivas)',
    accountingStandard: 'NIIF adoptadas por el Colegio de Contadores Públicos de Nicaragua',
    privacyStandard: 'Buffer efímero en RAM con destrucción de datos de sesión',
    disputeForum: 'Centro de Mediación y Arbitraje de la Cámara de Comercio y Servicios de Nicaragua (CACONIC)'
  },

  // 🇸🇪 SUECIA (SWEDEN) — ATENCIÓN ESPECIAL NÓRDICA
  se: {
    id: 'se',
    code: 'SE',
    countryName: 'Suecia',
    countryNameEn: 'Sweden',
    nativeName: 'Sverige',
    flag: '🇸🇪',
    currency: 'SEK / EUR',
    language: 'nordic',
    region: 'Nórdicos',
    commercialCode: 'Avtalslagen (Lag 1915:218 om avtal och andra rättshandlingar på förmögenhetsrättens område)',
    commercialArticles: '§ 36 Avtalslagen (Generalklausulen: Jämkning eller åsidosättande av oskäliga avtalsvillkor / Unfair Contract Terms Doctrine), Köplagen (1990:931) för kommersiella köp, FN:s konvention om internationella köp (CISG)',
    consumerLaw: 'Lag (1994:1512) om avtalsvillkor i konsumentförhållanden & Allmänna reklamationsnämnden (ARN) praxis',
    taxFramework: 'Mervärdesskatt (Moms 25%) & EU VAT Reverse Charge Mechanism under Council Directive 2006/112/EC',
    accountingStandard: 'BFNAR / Bokföringsnämndens normgivning (K3 / K2) & IFRS / IAS standards',
    privacyStandard: 'EU GDPR (Förordning 2016/679) Article 28 Data Processor Compliance. 100% Volatile RAM Buffer (Ingen datalagring på disk, automatisk rensning efter revision, ingen AI-modellträning)',
    disputeForum: 'Stockholms Handelskammares Skiljedomsinstitut (SCC Arbitration Institute Rules) / Stockholms tingsrätt'
  },

  // 🇳🇴 NORUEGA (NORWAY) — ATENCIÓN ESPECIAL NÓRDICA
  no: {
    id: 'no',
    code: 'NO',
    countryName: 'Noruega',
    countryNameEn: 'Norway',
    nativeName: 'Norge',
    flag: '🇳🇴',
    currency: 'NOK / EUR',
    language: 'nordic',
    region: 'Nórdicos',
    commercialCode: 'Avtaleloven (Lov om avslutning av avtaler mv. av 1918)',
    commercialArticles: '§ 36 Avtaleloven (Tilsidesettelse eller lemping av urimelige avtalevilkår / Unconscionable terms doctrine), Kjøpsloven (Lov om kjøp av 1988), CISG',
    consumerLaw: 'Forbrukerkjøpsloven av 2002 & Markedsføringsloven',
    taxFramework: 'Merverdiavgift (MVA 25%) & EØS-tilpasset avgiftsrett',
    accountingStandard: 'God regnskapsskikk (GRS / Norsk RegnskapsStiftelse) & IFRS for foretak',
    privacyStandard: 'Personopplysningsloven & EU GDPR Art. 28 Databehandlergaranti. 100% flyktig RAM-minne uten lagring',
    disputeForum: 'Oslo tingrett / Nordisk Institutt for Sjørett og Voldgift'
  },

  // 🇩🇰 DINAMARCA (DENMARK) — ATENCIÓN ESPECIAL NÓRDICA
  dk: {
    id: 'dk',
    code: 'DK',
    countryName: 'Dinamarca',
    countryNameEn: 'Denmark',
    nativeName: 'Danmark',
    flag: '🇩🇰',
    currency: 'DKK / EUR',
    language: 'nordic',
    region: 'Nórdicos',
    commercialCode: 'Aftaleloven (Lov om aftaler og andre retshandler på formuerettens område LBK nr 193)',
    commercialArticles: '§ 36 Aftaleloven (Urimelige aftalevilkår kan ændres eller tilsidesættes helt eller delvist), Købeloven (LBK nr 140) for handelsskøb, CISG',
    consumerLaw: 'Forbrugeraftaleloven (LBK nr 1457) & Markedsføringsloven',
    taxFramework: 'Moms (25%) & EU Momsdirektiv',
    accountingStandard: 'Årsregnskabsloven (Regnskabsklasse B, C, D) & IFRS',
    privacyStandard: 'Databeskyttelsesloven & EU GDPR Art. 28 Databehandleraftale (DPA) standard. Ren flygtig RAM-behandling',
    disputeForum: 'Københavns Byret / Det Danske Voldgiftsinstitut (Danish Institute of Arbitration)'
  },

  // 🇫🇮 FINLANDIA (FINLAND) — ATENCIÓN ESPECIAL NÓRDICA
  fi: {
    id: 'fi',
    code: 'FI',
    countryName: 'Finlandia',
    countryNameEn: 'Finland',
    nativeName: 'Suomi',
    flag: '🇫🇮',
    currency: 'EUR',
    language: 'nordic',
    region: 'Nórdicos',
    commercialCode: 'Lag om rättshandlingar på förmögenhetsrättens område (Oikeustoimilaki 228/1929)',
    commercialArticles: '36 § Oikeustoimilaki (Kohtuuttoman sopimusehdon sovittelu tai huomiotta jättäminen / Adjustment of unreasonable terms), Köplag / Kauppalaki (355/1987), CISG',
    consumerLaw: 'Kuluttajansuojalaki (38/1978)',
    taxFramework: 'Arvonlisävero (ALV 25.5%) & EU VAT rules',
    accountingStandard: 'Kirjanpitolaki (KPL) & IFRS / FAS standards',
    privacyStandard: 'Tietosuojalaki (1050/2018) & EU GDPR Art. 28. Käsittely 100% haihtuvassa RAM-muistissa ilman levytallennusta',
    disputeForum: 'Helsingin käräjäoikeus / Keskuskauppakamarin välimieslautakunta (FAI Arbitration Rules)'
  },

  // 🇩🇪 ALEMANIA (GERMANY) — REGIÓN DACH
  de: {
    id: 'de',
    code: 'DE',
    countryName: 'Alemania',
    countryNameEn: 'Germany',
    nativeName: 'Deutschland',
    flag: '🇩🇪',
    currency: 'EUR',
    language: 'de',
    region: 'DACH',
    commercialCode: 'Bürgerliches Gesetzbuch (BGB) & Handelsgesetzbuch (HGB)',
    commercialArticles: '§§ 305–310 BGB (AGB-Recht: Inhaltskontrolle Allgemeiner Geschäftsbedingungen), § 307 BGB (Unangemessene Benachteiligung und Treu und Glauben), §§ 343 ff. HGB (Kaufmännische Geschäfte)',
    consumerLaw: '§ 312 BGB (Besondere Vertriebsformen) & Gesetz gegen den unlauteren Wettbewerb (UWG)',
    taxFramework: 'Umsatzsteuergesetz (UStG 19%) & Reverse-Charge-Verfahren gem. § 13b UStG',
    accountingStandard: 'Handelsgesetzbuch (HGB Bilanzrecht) & IFRS für kapitalmarktorientierte Unternehmen',
    privacyStandard: 'EU-DSGVO Art. 28 (Auftragsverarbeitungsvertrag AVV). Flüchtiger Arbeitsspeicher (RAM-Puffer), keine permanente Festplattenspeicherung, 0-Retention',
    disputeForum: 'Landgericht Frankfurt am Main / DIS (Deutsche Institution für Schiedsgerichtsbarkeit)'
  },

  // 🇦🇹 AUSTRIA — REGIÓN DACH
  at: {
    id: 'at',
    code: 'AT',
    countryName: 'Austria',
    countryNameEn: 'Austria',
    nativeName: 'Österreich',
    flag: '🇦🇹',
    currency: 'EUR',
    language: 'de',
    region: 'DACH',
    commercialCode: 'Allgemeines bürgerliches Gesetzbuch (ABGB) & Unternehmensgesetzbuch (UGB)',
    commercialArticles: '§ 879 Abs. 3 ABGB (Sittenwidrigkeit gröblich benachteiligender AGB-Klauseln), UGB Drittes Buch (Handelsgeschäfte)',
    consumerLaw: 'Konsumentenschutzgesetz (KSchG)',
    taxFramework: 'Umsatzsteuer (USt 20%) & EU VAT Directive',
    accountingStandard: 'UGB Rechnungslegung & IFRS',
    privacyStandard: 'Datenschutzgesetz (DSG) & EU-DSGVO Art. 28. Flüchtige RAM-Verarbeitung',
    disputeForum: 'Handelsgericht Wien / VIAC (Vienna International Arbitral Centre)'
  },

  // 🇨🇭 SUIZA — REGIÓN DACH
  ch: {
    id: 'ch',
    code: 'CH',
    countryName: 'Suiza',
    countryNameEn: 'Switzerland',
    nativeName: 'Schweiz',
    flag: '🇨🇭',
    currency: 'CHF',
    language: 'de',
    region: 'DACH',
    commercialCode: 'Schweizerisches Obligationenrecht (OR)',
    commercialArticles: 'Art. 1 ff. OR (Entstehung der Obligationen), Art. 8 UWG (Verwendung missbräuchlicher Geschäftsbedingungen zum Nachteil der Vertragspartei)',
    consumerLaw: 'Bundesgesetz über den unlauteren Wettbewerb (UWG Art. 8)',
    taxFramework: 'Mehrwertsteuer (MWST 8.1%)',
    accountingStandard: 'Schweizer Rechnungslegungsrecht (Art. 957 ff. OR) & Swiss GAAP FER',
    privacyStandard: 'Bundesgesetz über den Datenschutz (nDSG) & Flüchtiger RAM-Puffer mit sofortiger Datenvernichtung',
    disputeForum: 'Handelsgericht Zürich / Swiss Arbitration Centre (Swiss Rules of International Arbitration)'
  },

  // 🇲🇽 MÉXICO
  mx: {
    id: 'mx',
    code: 'MX',
    countryName: 'México',
    countryNameEn: 'Mexico',
    flag: '🇲🇽',
    currency: 'MXN / USD',
    language: 'es',
    region: 'Norteamérica',
    commercialCode: 'Código de Comercio de los Estados Unidos Mexicanos & Código Civil Federal',
    commercialArticles: 'Arts. 77 y ss. (De los Contratos Mercantiles en General), Art. 84 (Mora comercial), Art. 1840 Código Civil Federal (Límites a la pena convencional)',
    consumerLaw: 'Ley Federal de Protección al Consumidor (PROFECO - Arts. 85 a 90 bis: Cláusulas abusivas, desproporcionadas o leoninas en contratos por adhesión)',
    taxFramework: 'Ley del IVA 16% y retenciones de ISR e IVA a prestadores de servicios digitales y transfronterizos',
    accountingStandard: 'Normas de Información Financiera (NIF emitidas por el CINIF)',
    privacyStandard: 'Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) & Buffer volátil en RAM',
    disputeForum: 'Tribunales de la Ciudad de México / Centro de Arbitraje de México (CAM)'
  },

  // 🇨🇴 COLOMBIA
  co: {
    id: 'co',
    code: 'CO',
    countryName: 'Colombia',
    countryNameEn: 'Colombia',
    flag: '🇨🇴',
    currency: 'COP / USD',
    language: 'es',
    region: 'Sudamérica',
    commercialCode: 'Código de Comercio de Colombia (Decreto 410 de 1971)',
    commercialArticles: 'Arts. 822 y ss. (De las Obligaciones Mercantiles y Contratos), Art. 868 (Teoría de la imprevisión por circunstancias extraordinarias e imprevistas)',
    consumerLaw: 'Ley 1480 de 2011 (Estatuto del Consumidor, Arts. 42 y 43: Cláusulas de ineficacia de pleno derecho y estipulaciones abusivas)',
    taxFramework: 'Estatuto Tributario (IVA 19% y retención en la fuente a no residentes Art. 408)',
    accountingStandard: 'NIIF Grupo 1 y 2 reguladas por la Ley 1314 de 2009 y Decretos Reglamentarios',
    privacyStandard: 'Ley Estatutaria 1581 de 2012 (Régimen General de Protección de Datos Personales) & Procesamiento efímero en RAM',
    disputeForum: 'Centro de Arbitraje y Conciliación de la Cámara de Comercio de Bogotá (CAC)'
  },

  // 🇪🇸 ESPAÑA
  es: {
    id: 'es',
    code: 'ES',
    countryName: 'España',
    countryNameEn: 'Spain',
    flag: '🇪🇸',
    currency: 'EUR',
    language: 'es',
    region: 'Europa',
    commercialCode: 'Código de Comercio de 1885 & Código Civil Español',
    commercialArticles: 'Arts. 50 y ss. Código de Comercio (De los Contratos Mercantiles), Ley 7/1998 sobre Condiciones Generales de la Contratación (LCGC)',
    consumerLaw: 'Real Decreto Legislativo 1/2007 (TRLGDCU, Arts. 80 a 91: Nulidad radical de cláusulas abusivas en la contratación)',
    taxFramework: 'IVA 21% (Ley 37/1992) y Directivas Comunitarias de Inversión del Sujeto Pasivo',
    accountingStandard: 'Plan General de Contabilidad (PGC) adaptado a NIIF de la UE',
    privacyStandard: 'Reglamento General de Protección de Datos (RGPD UE 2016/679) Art. 28 & LOPDGDD 3/2018. 100% Memoria RAM Volátil',
    disputeForum: 'Corte de Arbitraje de Madrid (CAM) / Juzgados de lo Mercantil de Madrid'
  },

  // 🌐 GLOBAL / ESTADOS UNIDOS / INTERNACIONAL
  global: {
    id: 'global',
    code: 'US',
    countryName: 'Estados Unidos / Global',
    countryNameEn: 'United States / Global',
    flag: '🌐',
    currency: 'USD',
    language: 'en',
    region: 'Global',
    commercialCode: 'Uniform Commercial Code (UCC) & Restatement (Second) of Contracts',
    commercialArticles: 'UCC Section 2-302 (Unconscionable Contract or Clause), Restatement § 208, United Nations CISG (Contracts for the International Sale of Goods)',
    consumerLaw: 'FTC Unfair and Deceptive Trade Practices & UK Consumer Rights Act / UCTA 1977 principles',
    taxFramework: 'US W-8BEN/W-8BEN-E Tax Withholding Protocol & International Cross-Border Invoicing',
    accountingStandard: 'US GAAP (FASB ASC 606 & ASC 842) / PCAOB Auditing Standards / IFRS',
    privacyStandard: 'SOC-2 Type II Certified Process & EU GDPR Art. 28 Standard Contractual Clauses (SCC). Pure Volatile RAM Execution with zero persistent storage',
    disputeForum: 'American Arbitration Association (AAA) / ICC International Court of Arbitration'
  }
};

/**
 * Resuelve inteligentemente la jurisdicción legal adecuada a partir de:
 * - Código de país ('sv', 'gt', 'se', 'no', etc.)
 * - Nombre de país ('El Salvador', 'Sweden', 'Suecia', 'Guatemala')
 * - Correo electrónico institucional (tld .sv, .gt, .se, .no, etc.)
 */
export function resolveJurisdiction(candidate = '') {
  if (!candidate) return LEGAL_JURISDICTIONS.sv;

  const clean = candidate.toString().trim().toLowerCase();

  // 1. Coincidencia directa por id o código
  if (LEGAL_JURISDICTIONS[clean]) return LEGAL_JURISDICTIONS[clean];

  // 2. Coincidencias nórdicas (CUIDADO ESPECIAL)
  if (clean.includes('suecia') || clean.includes('sweden') || clean.includes('sverige') || clean.endsWith('.se')) {
    return LEGAL_JURISDICTIONS.se;
  }
  if (clean.includes('noruega') || clean.includes('norway') || clean.includes('norge') || clean.endsWith('.no')) {
    return LEGAL_JURISDICTIONS.no;
  }
  if (clean.includes('dinamarca') || clean.includes('denmark') || clean.includes('danmark') || clean.endsWith('.dk')) {
    return LEGAL_JURISDICTIONS.dk;
  }
  if (clean.includes('finlandia') || clean.includes('finland') || clean.includes('suomi') || clean.endsWith('.fi')) {
    return LEGAL_JURISDICTIONS.fi;
  }

  // 3. Coincidencias Centroamérica & Panamá
  if (clean.includes('salvador') || clean.endsWith('.sv')) {
    return LEGAL_JURISDICTIONS.sv;
  }
  if (clean.includes('guatemala') || clean.endsWith('.gt')) {
    return LEGAL_JURISDICTIONS.gt;
  }
  if (clean.includes('costa rica') || clean.includes('costarica') || clean.endsWith('.cr')) {
    return LEGAL_JURISDICTIONS.cr;
  }
  if (clean.includes('panam') || clean.endsWith('.pa')) {
    return LEGAL_JURISDICTIONS.pa;
  }
  if (clean.includes('honduras') || clean.endsWith('.hn')) {
    return LEGAL_JURISDICTIONS.hn;
  }
  if (clean.includes('nicaragua') || clean.endsWith('.ni')) {
    return LEGAL_JURISDICTIONS.ni;
  }

  // 4. DACH
  if (clean.includes('alemania') || clean.includes('germany') || clean.includes('deutschland') || clean.endsWith('.de')) {
    return LEGAL_JURISDICTIONS.de;
  }
  if (clean.includes('austria') || clean.includes('österreich') || clean.endsWith('.at')) {
    return LEGAL_JURISDICTIONS.at;
  }
  if (clean.includes('suiza') || clean.includes('switzerland') || clean.includes('schweiz') || clean.endsWith('.ch')) {
    return LEGAL_JURISDICTIONS.ch;
  }

  // 5. LatAm & España
  if (clean.includes('méxico') || clean.includes('mexico') || clean.endsWith('.mx')) {
    return LEGAL_JURISDICTIONS.mx;
  }
  if (clean.includes('colombia') || clean.endsWith('.co')) {
    return LEGAL_JURISDICTIONS.co;
  }
  if (clean.includes('españa') || clean.includes('spain') || clean.endsWith('.es')) {
    return LEGAL_JURISDICTIONS.es;
  }
  if (clean.includes('usa') || clean.includes('united states') || clean.includes('global') || clean.endsWith('.com')) {
    return LEGAL_JURISDICTIONS.global;
  }

  return LEGAL_JURISDICTIONS.sv;
}

/**
 * Genera el distintivo / caja de notificación fiduciaria para correos salientes (HTML)
 * adaptada al país y lenguaje del lead.
 */
export function getLegalNoticeForOutbound(lead = {}, lang = 'es') {
  const jurisdiction = resolveJurisdiction(lead.country || lead.email || '');
  const isNordic = (jurisdiction.region === 'Nórdicos' || lang === 'nordic');
  const isDe = (jurisdiction.region === 'DACH' || lang === 'de');

  if (isNordic) {
    return `
      <div style="background-color: #0f172a; border-left: 4px solid #0284c7; padding: 14px 18px; border-radius: 6px; margin: 18px 0; font-size: 13px; color: #f1f5f9; line-height: 1.5;">
        <p style="margin: 0 0 6px 0; font-weight: 700; color: #38bdf8;">
          ${jurisdiction.flag} Fiduciary Governance under ${jurisdiction.countryNameEn} Law &amp; EU GDPR Art. 28:
        </p>
        <p style="margin: 0 0 6px 0; color: #cbd5e1; font-size: 12px;">
          • <strong>Contract Code:</strong> ${jurisdiction.commercialCode} (${jurisdiction.commercialArticles}).
        </p>
        <p style="margin: 0; color: #34d399; font-size: 12px;">
          • <strong>Zero Data Retention:</strong> Processed 100% in volatile RAM buffer. No permanent storage on disk, automatic memory purge upon analysis completion.
        </p>
      </div>
    `;
  }

  if (isDe) {
    return `
      <div style="background-color: #0f172a; border-left: 4px solid #3b82f6; padding: 14px 18px; border-radius: 6px; margin: 18px 0; font-size: 13px; color: #f1f5f9; line-height: 1.5;">
        <p style="margin: 0 0 6px 0; font-weight: 700; color: #60a5fa;">
          ${jurisdiction.flag} Rechtssicherheit nach deutschem/DACH-Recht &amp; EU-DSGVO Art. 28:
        </p>
        <p style="margin: 0 0 6px 0; color: #cbd5e1; font-size: 12px;">
          • <strong>Rechtsrahmen:</strong> ${jurisdiction.commercialCode} (${jurisdiction.commercialArticles}).
        </p>
        <p style="margin: 0; color: #34d399; font-size: 12px;">
          • <strong>Flüchtiger RAM-Puffer:</strong> 0 Speicherung auf Festplatten, vollständige Löschung nach der Sitzung.
        </p>
      </div>
    `;
  }

  // Versión en Español (Centroamérica, México, Colombia, España)
  return `
    <div style="background-color: #0f172a; border-left: 4px solid #10b981; padding: 14px 18px; border-radius: 6px; margin: 18px 0; font-size: 13px; color: #f1f5f9; line-height: 1.5;">
      <p style="margin: 0 0 6px 0; font-weight: 700; color: #34d399;">
        ${jurisdiction.flag} Blindaje Legal Bajo Normas Civiles y Comerciales de ${jurisdiction.countryName}:
      </p>
      <p style="margin: 0 0 6px 0; color: #cbd5e1; font-size: 12px;">
        • <strong>Marco Legal Mercantil:</strong> ${jurisdiction.commercialCode} (${jurisdiction.commercialArticles}).
      </p>
      <p style="margin: 0; color: #38bdf8; font-size: 12px;">
        • <strong>Privacidad Fiduciaria:</strong> Procesamiento 100% en memoria RAM volátil efímera (cero retención en disco, SOC-2 y RGPD Art. 28).
      </p>
    </div>
  `;
}

/**
 * Construye el prompt estricto y dinámico para Gemini 2.5 Flash adaptado
 * a la jurisdicción específica del cliente/documento.
 */
export function buildAiJurisdictionPrompt(countryCandidate = '', documentName = 'documento.pdf', partyStance = 'buyer') {
  const jur = resolveJurisdiction(countryCandidate);

  return `
Eres el motor de auditoría jurídica y financiera de AuditFlow AI, operando estrictamente bajo las normas civiles, comerciales y contables de ${jur.countryName} (${jur.countryNameEn}).

================================================================================
MARCO LEGAL Y JURISDICCIONAL APLICABLE OBLIGATORIO:
- País / Jurisdicción: ${jur.flag} ${jur.countryName} (${jur.countryNameEn}) - Región: ${jur.region}
- Código Mercantil y Civil: ${jur.commercialCode}
- Artículos y Doctrinas Clave: ${jur.commercialArticles}
- Régimen de Cláusulas Abusivas / Consumo: ${jur.consumerLaw}
- Régimen Fiscal / Retenciones: ${jur.taxFramework}
- Estándar Contable Fiduciario: ${jur.accountingStandard}
- Salvaguarda de Privacidad: ${jur.privacyStandard}
================================================================================

TU MISIÓN FIDUCIARIA:
1. Realizar una auditoría profunda del documento (${documentName}, postura: ${partyStance}) evaluándolo bajo el marco legal de ${jur.countryName}.
2. Identificar EXACTAMENTE las contingencias contractuales reales del texto, citando las cláusulas donde ocurren y fundamentando el vicio conforme a las leyes mercantiles de ${jur.countryName} (por ejemplo, si es Suecia o Nórdicos cita la doctrina de Avtalslagen § 36; si es Guatemala el Decreto 2-70 y Art. 688; si es El Salvador los Arts. 945 y ss. del Código de Comercio y Art. 17 LPC; si es Costa Rica Ley 3284 y Ley 7472 Art. 42; si es Panamá Ley 45 Arts. 74-75; si es Alemania BGB §§ 305-310).
3. Cuantificar el impacto económico estimado en dólares americanos ($ USD) o moneda local equivalente.
4. Generar cláusulas de contra-propuesta para redline en Word (.docx con Control de Cambios) redactadas conforme al lenguaje legal aplicable en ${jur.countryName}.
5. Confirmar que el procesamiento se realiza en memoria RAM volátil efímera conforme a los estándares fiduciarios de confidencialidad.

Responde EXCLUSIVAMENTE con un objeto JSON estricto sin delimitadores markdown adicionales fuera del JSON, con esta estructura exacta:
{
  "document_type": "Categoría exacta del documento mercantil auditado",
  "company_estimate": "Nombre de las partes contratantes detectadas",
  "party_stance": "${partyStance}",
  "jurisdiction_applied": {
    "country": "${jur.countryName}",
    "iso_code": "${jur.code}",
    "commercial_code": "${jur.commercialCode}",
    "protective_statute": "${jur.consumerLaw}",
    "privacy_guarantee": "100% Ephemeral Volatile RAM Buffer (EU GDPR Art. 28 / SOC-2 Compliant - Zero Disk Storage)"
  },
  "total_financial_leakage": 14500.00,
  "leakage_detected_usd": "$14,500 USD",
  "risk_level": "CRÍTICO",
  "lead_score": 88,
  "findings": [
    {
      "id": 1,
      "title": "Nombre conciso de la contingencia o cláusula leonina detectada",
      "clause_reference": "Cita textual de la cláusula o párrafo",
      "severity": "CRITICAL",
      "financial_impact": 8500.00,
      "teaser_preview": "Fundamentación fiduciaria del daño patrimonial citando la norma aplicable de ${jur.countryName}.",
      "actionable_solution": "Acción correctiva concreta recomendada.",
      "fallbacks": {
        "standard": "Redacción equilibrada de mercado.",
        "maximum": "Redacción de máxima protección fiduciaria.",
        "fast_close": "Redacción de cierre pragmático."
      },
      "negotiation_pitch": "Argumento persuasivo para renegociar con la contraparte."
    }
  ],
  "missing_provisions": [
    {
      "id": "mp_1",
      "title": "Tope de Responsabilidad Mutua (Mutual Liability Cap)",
      "status": "MISSING",
      "severity": "CRITICAL",
      "risk_explanation": "Evaluación del tope máximo de daños acumulados.",
      "suggested_clause": "Texto sugerido para incorporar al contrato."
    },
    {
      "id": "mp_2",
      "title": "Cláusula de Confidencialidad y Custodia de Datos",
      "status": "MISSING",
      "severity": "HIGH",
      "risk_explanation": "Evaluación de salvaguarda de secretos comerciales.",
      "suggested_clause": "Texto sugerido para incorporar al contrato."
    },
    {
      "id": "mp_3",
      "title": "Fuerza Mayor y Continuidad Operativa",
      "status": "MISSING",
      "severity": "MEDIUM",
      "risk_explanation": "Evaluación de eventos fortuitos e imprevistos.",
      "suggested_clause": "Texto sugerido para incorporar al contrato."
    },
    {
      "id": "mp_4",
      "title": "Resolución de Disputas y Fuero Competente",
      "status": "PRESENT",
      "severity": "LOW",
      "risk_explanation": "Evaluación de fuero (${jur.disputeForum}).",
      "suggested_clause": "Texto sugerido para jurisdicción clara."
    }
  ],
  "cfo_approval_memo": {
    "financial_risk_usd": 14500.00,
    "auditflow_cost_usd": 19,
    "traditional_lawfirm_cost_usd": 850,
    "net_roi_multiple": "763x",
    "roi_percentage": "76,315%",
    "governing_law_notice": "Dictamen procesado bajo ${jur.commercialCode} de ${jur.countryName} en memoria RAM efímera.",
    "recommendation": "Dictamen ejecutivo para el Director Financiero (CFO) / General Counsel."
  }
}
`;
}
