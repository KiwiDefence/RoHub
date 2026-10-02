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
  highlights: string[];
  experiences: string[];
  bestFor: string;
};

export const regions: Region[] = [
  {
    slug: "oltenia",
    name: "Oltenia",
    days: "3–5 zile",
    blurb: "Mănăstiri, dealuri și mese la cramă, aproape de viața satului.",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80",
    heroAlt: "Dealuri verzi și peisaj rural din Oltenia",
    seoTitle: "Vacanțe în Oltenia",
    seoDescription:
      "Tururi și experiențe autentice în Oltenia: mănăstiri, gastronomie locală, crame și natură. Circuit personalizat cu Rohub.",
    intro:
      "Oltenia e o regiune cu ritm lent și povești vechi — de la mănăstirile din nord până la dealurile cu vii. Te ducem acolo unde încă se trăiește: la masă cu gazda, pe poteci și pe la crame mici.",
    highlights: [
      "Mănăstiri și peisaje de deal",
      "Degustări la crame locale",
      "Gastronomie oltenească autentică",
      "Excursii scurte, potrivite și pentru grupuri",
    ],
    experiences: [
      "Tur gastronomic cu producători locali",
      "Vizită la crame și degustare de vinuri",
      "Activități tradiționale în gospodărie",
      "Circuit cultural pe trasee mai puțin aglomerate",
    ],
    bestFor: "Cupluri, familii și team-building-uri mici care vor liniște și gust.",
  },
  {
    slug: "muntenia",
    name: "Muntenia",
    days: "2–4 zile",
    blurb: "De la București la munte: palate, vii și weekend-uri cu sens.",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
    heroAlt: "Peisaj de munte și natură din Muntenia",
    seoTitle: "Vacanțe în Muntenia",
    seoDescription:
      "Vacanțe și circuite în Muntenia: cultură, natură, vii și experiențe aproape de București. Planificate cu Rohub.",
    intro:
      "Muntenia e poarta spre România pe care o trăiești, nu doar o vizitezi. Combinăm orașul cu munte, palate și degustări — ideal pentru weekend-uri scurte sau oaspeți din diaspora.",
    highlights: [
      "Escapade de weekend aproape de București",
      "Palate, castele și patrimoniu",
      "Vii și meniuri locale",
      "Potrivit pentru oaspeți corporate",
    ],
    experiences: [
      "Circuit cultural pe trasee clasice și alternative",
      "Weekend la munte cu ghid local",
      "Degustări și mese la pensiuni partenere",
      "Programe de team-building pe natură",
    ],
    bestFor: "Bucureșteni, diaspora și companii care caută ieșiri scurte, bine structurate.",
  },
  {
    slug: "maramures",
    name: "Maramureș",
    days: "4–6 zile",
    blurb: "Porți de lemn, tradiții vii și mese pe la stână.",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80",
    heroAlt: "Pădure și peisaj tradițional din Maramureș",
    seoTitle: "Vacanțe în Maramureș",
    seoDescription:
      "Vacanțe în Maramureș: tradiții, gastronomie, natură și experiențe la stână. Tururi autentice cu Rohub.",
    intro:
      "În Maramureș, fiecare vale are o poveste. Te ducem unde încă se trăiește: biserici de lemn, gospodării, stâne și mese care nu seamănă cu un meniu de hotel.",
    highlights: [
      "Biserici de lemn și sate autentice",
      "Experiențe la stână și în gospodărie",
      "Trasee pe natură, fără aglomerație",
      "Gastronomie și produse locale",
    ],
    experiences: [
      "Vizită la stână: brânzeturi, oi, ritm de munte",
      "Ateliere și activități tradiționale",
      "Circuit cultural pe sate",
      "Drumeții ușoare cu ghid local",
    ],
    bestFor: "Călători 30–55 și 60+ care vor autenticitate, nu checklist turistic.",
  },
  {
    slug: "transilvania",
    name: "Transilvania",
    days: "5–7 zile",
    blurb: "Sate săsești, castele și mese lungi pe la pensiuni.",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80",
    heroAlt: "Castel și peisaj din Transilvania",
    seoTitle: "Vacanțe în Transilvania",
    seoDescription:
      "Circuite și vacanțe în Transilvania: castele, sate săsești, gastronomie și natură. Experiențe Rohub.",
    intro:
      "Transilvania e regiunea în care poveștile se văd pe stradă: fortificații, case colorate, dealuri și crame. Construim itinerarii personale, nu pachete generice.",
    highlights: [
      "Castele și centre medievale",
      "Sate săsești și pensiuni locale",
      "Vinuri și gastronomie transilvăneană",
      "Circuite flexibile pe ritmul tău",
    ],
    experiences: [
      "Circuit castele + sate",
      "Tur gastronomic și crame",
      "Drumeții ușoare în dealuri",
      "Programe corporate / team-building",
    ],
    bestFor: "Turisti români și internaționali care vor cultură + natură într-un singur drum.",
  },
  {
    slug: "bucovina",
    name: "Bucovina",
    days: "4–6 zile",
    blurb: "Fresce pe exterior, păduri și mese ca acasă.",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
    heroAlt: "Munți și păduri din Bucovina",
    seoTitle: "Vacanțe în Bucovina",
    seoDescription:
      "Vacanțe în Bucovina: mănăstiri pictate, natură, gastronomie locală și tururi personalizate cu Rohub.",
    intro:
      "Bucovina te încetinește frumos: mănăstiri, păduri și oameni care încă păstrează obiceiuri. Ideală pentru o săptămână de liniște, cultură și masă bună.",
    highlights: [
      "Mănăstiri pictate și patrimoniu UNESCO",
      "Natură de munte și aer curat",
      "Mese tradiționale la pensiuni",
      "Ritm relaxat, potrivit și pensionarilor",
    ],
    experiences: [
      "Circuit mănăstiri cu ghid",
      "Excursii pe natură",
      "Ateliere meșteșugărești / tradiționale",
      "Sejur gastronomic regional",
    ],
    bestFor: "Familii, cupluri și călători 60+ care vor frumos fără grabă.",
  },
  {
    slug: "dobrogea",
    name: "Dobrogea & Delta",
    days: "3–5 zile",
    blurb: "Apusuri pe apă, pești la grătar și liniște de deltă.",
    image:
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1600&q=80",
    heroAlt: "Lac și peisaj acvatic din Dobrogea",
    seoTitle: "Vacanțe în Dobrogea și Delta Dunării",
    seoDescription:
      "Vacanțe în Dobrogea și Delta Dunării: natură, gastronomie, croaziere ușoare și experiențe locale cu Rohub.",
    intro:
      "Dobrogea și Delta sunt despre apă, păsări și mese pe mal. Te ducem pe canale, la pește proaspăt și la locuri unde turismul încă respectă ritmul local.",
    highlights: [
      "Delta Dunării și peisaje pe apă",
      "Gastronomie de pește și produse locale",
      "Natură și birdwatching ușor",
      "Sejururi scurte sau de weekend prelungit",
    ],
    experiences: [
      "Tur pe canale cu ghid local",
      "Degustări și mese pe mal",
      "Circuit Dobrogea culturală (unde e cazul)",
      "Programe pentru grupuri mici",
    ],
    bestFor: "Iubitorii de natură, cupluri și grupuri care vor altceva decât litoral aglomerat.",
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

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2400&q=80";

export const ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80";
