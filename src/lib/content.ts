export type Region = {
  slug: string;
  name: string;
  days: string;
  blurb: string;
  image: string;
  heroAlt: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  famousFor: string[];
  food: string[];
  attractions: string[];
  experiences: string[];
  bestFor: string;
};

/** Prefix public assets for GitHub Pages (next/image unoptimized skips basePath). */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export function asset(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}

export const regions: Region[] = [
  {
    slug: "oltenia",
    name: "Oltenia",
    days: "3–5 zile",
    blurb: "Mănăstiri, ceramică de Horezu și mese pe la crame.",
    image: asset("/regions/oltenia.jpg"),
    heroAlt: "Mănăstirea Horezu din Oltenia, România",
    seoTitle: "Vacanțe în Oltenia — mănăstiri, crame și gastronomie",
    seoDescription:
      "Descoperă Oltenia cu RoHub: Horezu, Cozia, Olteț, vinuri și mâncare oltenească. Circuite autentice în România.",
    intro:
      "Oltenia e regiunea din sud-vestul României unde tradiția se vede pe masă și pe zidurile mănăstirilor. De la Horezu UNESCO la valea Oltului, te ducem acolo unde încă se trăiește — nu doar unde se fotografiază.",
    famousFor: [
      "Ceramica de Horezu (UNESCO)",
      "Mănăstiri pe valea Oltului (Horezu, Cozia)",
      "Vinuri și crame oltenești",
      "Obiceiuri de sat și meșteșuguri",
    ],
    food: [
      "Ciorbă de potroace / ciorbă oltenească",
      "Sarmale în foi de viță",
      "Pâine de casă și brânzeturi locale",
      "Plăcinte și dulcețuri de casă",
      "Vinuri albe și roșii de la crame din zonă",
    ],
    attractions: [
      "Mănăstirea Horezu",
      "Mănăstirea Cozia",
      "Ateliere de ceramică la Horezu",
      "Crame și vii pe dealurile oltenești",
      "Trasee scurte pe valea Oltului",
    ],
    experiences: [
      "Vizită la atelier de ceramică",
      "Degustare la cramă cu producător local",
      "Masă tradițională la pensiune",
      "Circuit mănăstiri pe Olt",
    ],
    bestFor: "Cupluri, familii și grupuri mici care vor cultură, gust și ritm liniștit.",
  },
  {
    slug: "muntenia",
    name: "Muntenia",
    days: "2–4 zile",
    blurb: "Peleș, București și weekend-uri pe Prahova.",
    image: asset("/regions/muntenia.jpg"),
    heroAlt: "Castelul Peleș din Sinaia, Muntenia, România",
    seoTitle: "Vacanțe în Muntenia — Peleș, București și munte",
    seoDescription:
      "Vacanțe în Muntenia cu RoHub: Castelul Peleș, București, Valea Prahovei, gastronomie și escapade de weekend.",
    intro:
      "Muntenia e poarta spre România pe care o trăiești aproape de capitală: palate regale, munte pe Prahova și mese bune. Ideală pentru diaspora, weekend-uri și oaspeți corporate.",
    famousFor: [
      "Castelul Peleș (Sinaia)",
      "București — centre istorice și cultură",
      "Valea Prahovei (Sinaia, Bușteni, Azuga)",
      "Podgorii și vinuri din Dealurile Munteniei",
    ],
    food: [
      "Mici cu muștar",
      "Ciorbă de burtă",
      "Șaorma / street food bucureștean",
      "Brânzeturi și preparate de munte",
      "Vinuri de Dealu Mare",
    ],
    attractions: [
      "Castelul Peleș & Pelișor",
      "Centrul Vechi din București",
      "Palatul Parlamentului (opțional)",
      "Trasee ușoare în Bucegi",
      "Crame pe Dealu Mare",
    ],
    experiences: [
      "Weekend Sinaia + Peleș",
      "Tur gastronomic București",
      "Degustare Dealu Mare",
      "Team-building pe Valea Prahovei",
    ],
    bestFor: "Bucureșteni, oaspeți din diaspora și companii cu programe scurte.",
  },
  {
    slug: "maramures",
    name: "Maramureș",
    days: "4–6 zile",
    blurb: "Porți de lemn, Săpânța și mese pe la stână.",
    image: asset("/regions/maramures.jpg"),
    heroAlt: "Cimitirul Vesel din Săpânța, Maramureș, România",
    seoTitle: "Vacanțe în Maramureș — tradiții, stâne și gastronomie",
    seoDescription:
      "Tururi în Maramureș: Săpânța, biserici de lemn, stâne, brânzeturi și experiențe autentice cu RoHub.",
    intro:
      "Maramureșul e locul în care lemnul, cimitirul vesel și stânele încă spun povești. Te ducem pe văi unde tradiția nu e museum-piece — e viață de zi cu zi.",
    famousFor: [
      "Cimitirul Vesel din Săpânța",
      "Biserici de lemn (UNESCO)",
      "Porți maramureșene sculptate",
      "Viața de stână și păstorit",
    ],
    food: [
      "Balmoș și mămăligă cu brânză",
      "Ciorbă de vacă / de miel",
      "Brânzeturi de oaie (caș, urdă)",
      "Horincă / pălincă locală",
      "Plăcinte și gogoși de casă",
    ],
    attractions: [
      "Săpânța — Cimitirul Vesel",
      "Mănăstirea Bârsana",
      "Biserici de lemn pe văile Izei / Marei",
      "Piețe și târguri locale",
      "Stâne și peisaje de munte",
    ],
    experiences: [
      "Vizită la stână cu degustare de brânzeturi",
      "Circuit biserici de lemn",
      "Atelier meșteșugăresc (unde e posibil)",
      "Masă tradițională la gazdă",
    ],
    bestFor: "Călători 30–55 și 60+ care vor autenticitate, nu checklist.",
  },
  {
    slug: "transilvania",
    name: "Transilvania",
    days: "5–7 zile",
    blurb: "Bran, Sighișoara, sate săsești și mese lungi.",
    image: asset("/regions/transilvania.jpg"),
    heroAlt: "Castelul Bran din Transilvania, România",
    seoTitle: "Vacanțe în Transilvania — Bran, Sighișoara și sate săsești",
    seoDescription:
      "Circuite în Transilvania: Castelul Bran, Sighișoara, Brașov, sate săsești, vinuri și gastronomie cu RoHub.",
    intro:
      "Transilvania e regiunea pe care o cunoști din povești — și merită trăită pe teren: castele, centre medievale, dealuri și mese la pensiuni. Construim itinerarii pe ritmul tău.",
    famousFor: [
      "Castelul Bran",
      "Sighișoara medievală (UNESCO)",
      "Brașov și zona Bârsei",
      "Sate săsești fortificate",
    ],
    food: [
      "Ciorbă ardelenească",
      "Varză a la Cluj",
      "Kurtos kalacs (cozonac secuiesc)",
      "Brânzeturi și preparate de munte",
      "Vinuri de Târnave / Jidvei",
    ],
    attractions: [
      "Castelul Bran",
      "Cetatea Sighișoara",
      "Centrul istoric Brașov",
      "Sate săsești (Viscri, Biertan — la cerere)",
      "Trasee ușoare în dealuri",
    ],
    experiences: [
      "Circuit Bran + Brașov",
      "Zi în Sighișoara",
      "Tur gastronomic / crame",
      "Programe corporate pe natură",
    ],
    bestFor: "Turisti români și internaționali care vor cultură + peisaj.",
  },
  {
    slug: "bucovina",
    name: "Bucovina",
    days: "4–6 zile",
    blurb: "Mănăstiri pictate, păduri și mese ca acasă.",
    image: asset("/regions/bucovina.jpg"),
    heroAlt: "Mănăstirea Voroneț din Bucovina, România",
    seoTitle: "Vacanțe în Bucovina — mănăstiri pictate și gastronomie",
    seoDescription:
      "Vacanțe în Bucovina: Voroneț, Sucevița, Moldovița, natură și mâncare locală. Tururi RoHub.",
    intro:
      "Bucovina te încetinește: fresce pe exterior, păduri și mese care durează. Ideală pentru o săptămână de cultură, aer curat și odihnă fără grabă.",
    famousFor: [
      "Mănăstiri pictate UNESCO (Voroneț, Sucevița, Moldovița)",
      "Albastrul de Voroneț",
      "Peisaje de munte și pădure",
      "Meșteșuguri și tradiții locale",
    ],
    food: [
      "Tochitură bucovineană",
      "Ciorbă rădăuțeană",
      "Poale-n brâu",
      "Jumări și preparate afumate",
      "Țuică și siropuri de casă",
    ],
    attractions: [
      "Mănăstirea Voroneț",
      "Mănăstirea Sucevița",
      "Mănăstirea Moldovița",
      "Suceava — cetate și centru",
      "Drumeții ușoare în zonă",
    ],
    experiences: [
      "Circuit mănăstiri pictate",
      "Masă tradițională la pensiune",
      "Excursie pe natură",
      "Atelier meșteșugăresc (la cerere)",
    ],
    bestFor: "Familii, cupluri și călători 60+ care vor frumos fără agitație.",
  },
  {
    slug: "dobrogea",
    name: "Dobrogea & Delta",
    days: "3–5 zile",
    blurb: "Pelicani, canale și pește pe grătar.",
    image: asset("/regions/dobrogea.jpg"),
    heroAlt: "Pelicani în Delta Dunării, Dobrogea, România",
    seoTitle: "Vacanțe în Dobrogea și Delta Dunării",
    seoDescription:
      "Vacanțe în Delta Dunării și Dobrogea: canale, pelicani, pește proaspăt și natură. Experiențe RoHub.",
    intro:
      "Dobrogea și Delta sunt despre apă, păsări și mese pe mal. Te ducem pe canale, la pește proaspăt și la locuri unde ritmul e al deltei — nu al litoralului aglomerat.",
    famousFor: [
      "Delta Dunării (UNESCO / rezervație)",
      "Pelicani și biodiversitate",
      "Culturi mixte (români, lipoveni, turci, tătari)",
      "Peisaje pe apă și la malul Mării Negre",
    ],
    food: [
      "Storceag / ciorbă de pește",
      "Saramură de pește",
      "Plachie de crap",
      "Pește la grătar cu mămăligă",
      "Preparări lipovenești (unde e cazul)",
    ],
    attractions: [
      "Tur pe canale în Deltă",
      "Zone de birdwatching",
      "Sate de pescari (ex. Mila 23 — la cerere)",
      "Tulcea ca poartă spre Deltă",
      "Escapade scurte pe litoral (opțional)",
    ],
    experiences: [
      "Croazieră ușoară pe canale",
      "Masă cu pește proaspăt",
      "Observare păsări cu ghid",
      "Sejur pentru grupuri mici",
    ],
    bestFor: "Iubitorii de natură și cupluri care vor altceva decât plajă aglomerată.",
  },
];

export function getRegion(slug: string): Region | undefined {
  return regions.find((region) => region.slug === slug);
}

export function getAllRegionSlugs(): string[] {
  return regions.map((region) => region.slug);
}

export const experiences = [
  {
    title: "Tururi personalizate",
    text: "Fiecare regiune are o poveste — construim itinerarii pe ritmul tău, nu pachete generice.",
  },
  {
    title: "Experiențe autentice",
    text: "Gastronomie, crame, stâne, meșteșuguri și activități tradiționale cu localnici.",
  },
  {
    title: "Aproape pe tot drumul",
    text: "WhatsApp, email și telefon — de la primul mesaj până te întorci acasă.",
  },
] as const;

export const HERO_IMAGE = asset("/regions/hero.jpg");
export const ABOUT_IMAGE = asset("/regions/about.jpg");
