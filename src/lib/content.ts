export type RegionHighlight = {
  title: string;
  text: string;
};

export type Region = {
  slug: string;
  name: string;
  days: string;
  blurb: string;
  image: string;
  heroAlt: string;
  seoTitle: string;
  seoDescription: string;
  /** One or more introductory paragraphs. */
  intro: string[];
  highlights: RegionHighlight[];
  famousFor: string[];
  food: string[];
  attractions: string[];
  experiences: string[];
  sampleDays: string[];
  whenToGo: string;
  howWeWork: string;
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
    blurb:
      "Mănăstiri UNESCO, ceramică de Horezu, crame pe dealuri și gastronomie oltenească autentică.",
    image: asset("/regions/oltenia.jpg"),
    heroAlt: "Mănăstirea Horezu din Oltenia, România",
    seoTitle: "Vacanțe în Oltenia - mănăstiri, crame și gastronomie",
    seoDescription:
      "Vacanțe și circuite în Oltenia cu RoHubTravel: Mănăstirea Horezu UNESCO, Cozia, ceramică, crame și gastronomie oltenească. Experiențe autentice în sud-vestul României.",
    intro: [
      "Oltenia este regiunea din sud-vestul României în care tradiția se citește pe zidurile mănăstirilor, în atelierele de ceramică și pe mesele pensiunilor. Nu este o destinație de trecere: este un teritoriu de ritm lent, peisaje de deal și povești locale pe care le trăiești, nu doar le fotografiezi.",
      "Cu RoHubTravel, construim circuite care îmbină patrimoniul UNESCO de la Horezu, valea Oltului, vizite la producători și degustări la crame. Fiecare itinerariu este adaptat duratei, tipului de grup și nivelului de confort dorit.",
      "Rezultatul este o vacanță coerentă: cultură, gastronomie și natură, cu logistică clară, parteneri verificați și ghidaj local acolo unde adaugă valoare.",
    ],
    highlights: [
      {
        title: "Patrimoniu UNESCO",
        text: "Mănăstirea Horezu și tradiția ceramicii locale sunt puncte de referință ale turismului cultural din România.",
      },
      {
        title: "Crame și gastronomie",
        text: "Dealurile oltenești oferă vinuri de caracter și mese tradiționale pe care le organizăm cu producători și pensiuni selectate.",
      },
      {
        title: "Ritm liniștit",
        text: "Ideală pentru grupuri care vor descoperire fără aglomerație de masă: cultură, peisaj și timp real de dialog cu locul.",
      },
    ],
    famousFor: [
      "Ceramica de Horezu, înscrisă în patrimoniul UNESCO",
      "Ansamblul monahal de la Horezu și mănăstirile de pe valea Oltului",
      "Mănăstirea Cozia și peisajul fluvial al Oltului",
      "Podgorii și crame din zonele viticole oltenești",
      "Meșteșuguri locale, piețe de artizanat și obiceiuri de sat",
      "Gastronomie de casă: ciorbe, sarmale, brânzeturi și dulcețuri",
    ],
    food: [
      "Ciorbă oltenească și ciorbă de potroace, preparate după rețete locale",
      "Sarmale în foi de viță, servite în pensiuni de familie",
      "Pâine de casă, brânzeturi și preparate din ferme din zonă",
      "Plăcinte, dulcețuri și deserturi tradiționale",
      "Vinuri albe și roșii de la crame partenere din Oltenia",
      "Degustări ghidate cu producători, pe traseu sau la cramă",
    ],
    attractions: [
      "Mănăstirea Horezu și ansamblul monahal UNESCO",
      "Mănăstirea Cozia și zona văii Oltului",
      "Ateliere de ceramică din Horezu, cu demonstrații la cerere",
      "Crame și vii pe dealurile oltenești",
      "Trasee scurte pe peisaj de deal și malul Oltului",
      "Piețe locale și meșteșugari, în funcție de sezon și program",
      "Pensiuni cu arhitectură și atmosferă regională",
    ],
    experiences: [
      "Circuit cultural pe valea Oltului, cu mănăstiri și peisaj",
      "Vizită la atelier de ceramică, cu explicații despre tehnica de Horezu",
      "Degustare la cramă, cu producător local",
      "Masă tradițională completă la pensiune selectată",
      "Itinerariu combinat cultură + gastronomie, pe 3–5 zile",
      "Programe pentru familii, cupluri sau grupuri private",
    ],
    sampleDays: [
      "Ziua 1: sosire, acomodare și primă plimbare în zonă, urmată de cină tradițională.",
      "Ziua 2: Mănăstirea Horezu, atelier de ceramică și timp liber pe ritm lent.",
      "Ziua 3: valea Oltului, Mănăstirea Cozia și peisaj, cu masă la o gazdă locală.",
      "Ziua 4: cramă și degustare, apoi întoarcere sau prelungire la cerere.",
    ],
    whenToGo:
      "Sezonul recomandat este aprilie–octombrie, când drumurile și cramele sunt ușor accesibile, iar peisajul de deal este la maximum. Primăvara și toamna oferă temperaturi confortabile pentru vizite culturale; vara este potrivită pentru programe mai lungi, cu pauze de odihnă bine planificate.",
    howWeWork:
      "Confirmăm obiectivele, cazarea și mesele înainte de plecare. Lucrăm cu pensiuni și producători verificați, adaptăm ritmul grupului și rămânem disponibili pe WhatsApp, email și telefon pe tot parcursul sejurului.",
    bestFor:
      "Cupluri, familii și grupuri private care doresc cultură, gastronomie și un ritm liniștit, fără turism de masă.",
  },
  {
    slug: "muntenia",
    name: "Muntenia",
    days: "2–4 zile",
    blurb:
      "Castelul Peleș, București istoric, Valea Prahovei și vinurile de pe Dealu Mare.",
    image: asset("/regions/muntenia.jpg"),
    heroAlt: "Castelul Peleș din Sinaia, Muntenia, România",
    seoTitle: "Vacanțe în Muntenia - Peleș, București și munte",
    seoDescription:
      "Vacanțe în Muntenia cu RoHubTravel: Castelul Peleș, București, Valea Prahovei, Dealu Mare și escapade de weekend. Circuite scurte lângă capitală.",
    intro: [
      "Muntenia este poarta naturală spre România pe care o poți trăi aproape de capitală: palate regale, munte pe Valea Prahovei, centre istorice și podgorii pe Dealu Mare. Este alegerea potrivită pentru weekend-uri dense, oaspeți din diaspora și programe scurte de calitate.",
      "RoHubTravel organizează itinerarii care echilibrează obiectivele majore - Peleș, Sinaia, București - cu timp pentru gastronomie și peisaj. Nu umplem programul până la epuizare: alegem ce merită și lăsăm spațiu pentru odihnă.",
      "Distanțele scurte față de București fac din Muntenia o destinație eficientă pentru sejururi de 2–4 zile, fără compromisuri la nivel de experiență.",
    ],
    highlights: [
      {
        title: "Patrimoniu regal",
        text: "Castelul Peleș și Pelișorul sunt experiențe culturale de prim rang, pe care le integrăm cu logistică clară și rezervări la timp.",
      },
      {
        title: "Aproape de capitală",
        text: "Ideală pentru weekend-uri și oaspeți care aterizează la București și vor munte, cultură și vin în același circuit.",
      },
      {
        title: "Dealu Mare",
        text: "Una dintre cele mai cunoscute zone viticole din România, perfectă pentru degustări ghidate și mese de calitate.",
      },
    ],
    famousFor: [
      "Castelul Peleș și complexul regal de la Sinaia",
      "Valea Prahovei: Sinaia, Bușteni, Azuga",
      "Bucureștiul istoric, cultural și gastronomic",
      "Podgoriile și vinurile de pe Dealu Mare",
      "Peisaj montan accesibil, potrivit pentru plimbări ușoare",
      "Escapade de weekend bine structurate, aproape de aeroport",
    ],
    food: [
      "Ciorbă de burtă și specialități clasice românești, în restaurante selectate",
      "Preparate de munte: brânzeturi, afumături și rețete de pensiune",
      "Mese contemporane în București, cu accent pe produse locale",
      "Vinuri de Dealu Mare, albe, roze și roșii, cu degustare ghidată",
      "Mic dejun și cine la unități verificate pe Valea Prahovei",
      "Meniu adaptat preferințelor grupului, inclusiv opțiuni fără carne la cerere",
    ],
    attractions: [
      "Castelul Peleș și Castelul Pelișor",
      "Centrul istoric al Bucureștiului și zone culturale",
      "Sinaia: mănăstire, promenadă și peisaj de munte",
      "Trasee ușoare în Masivul Bucegi, adaptate condiției grupului",
      "Crame pe Dealu Mare, cu tur și degustare",
      "Bușteni și zona Caraiman, pentru peisaj și aer de munte",
      "Muzee și obiective opționale în București, la cerere",
    ],
    experiences: [
      "Weekend Sinaia cu Peleș, peisaj și cină de calitate",
      "Circuit București cultural + gastronomie",
      "Zi dedicată cramelor de pe Dealu Mare",
      "Program combinat capitală + munte, pe 3–4 zile",
      "Itinerarii pentru oaspeți din diaspora, cu transferuri organizate",
      "Programe private pentru familii sau grupuri restrânse",
    ],
    sampleDays: [
      "Ziua 1: București - tur cultural și cină în zonă selectată.",
      "Ziua 2: transfer pe Valea Prahovei, Castelul Peleș și Sinaia.",
      "Ziua 3: plimbare ușoară în zonă montană sau crame pe Dealu Mare.",
      "Ziua 4: timp liber și plecare, cu transfer organizat la cerere.",
    ],
    whenToGo:
      "Muntenia funcționează tot anul. Primăvara și toamna sunt excelente pentru peisaj și vizite la Peleș fără aglomerație maximă; iarna aduce atmosferă de munte pe Valea Prahovei; vara este potrivită pentru programe complete, cu rezervări din timp la obiectivele majore.",
    howWeWork:
      "Planificăm transferurile din București sau de la aeroport, rezervăm biletele la obiective acolo unde este necesar și confirmăm mesele și cazarea înainte. Pe durata programului aveți un punct clar de contact RoHubTravel.",
    bestFor:
      "Oaspeți din București și din diaspora, familii și grupuri care doresc un sejur scurt, bine organizat, aproape de capitală.",
  },
  {
    slug: "maramures",
    name: "Maramureș",
    days: "4–6 zile",
    blurb:
      "Biserici de lemn UNESCO, Săpânța, porți sculptate, stâne și gastronomie de munte.",
    image: asset("/regions/maramures.jpg"),
    heroAlt: "Cimitirul Vesel din Săpânța, Maramureș, România",
    seoTitle: "Vacanțe în Maramureș - tradiții, stâne și gastronomie",
    seoDescription:
      "Tururi și vacanțe în Maramureș cu RoHubTravel: Săpânța, biserici de lemn UNESCO, stâne, brânzeturi și tradiții autentice. Circuite în nordul României.",
    intro: [
      "Maramureșul este una dintre cele mai autentice regiuni ale României: lemn sculptat, biserici UNESCO, văi liniștite și o cultură rurală care încă se trăiește zi de zi. Nu este un decor de muzeu, ci un teritoriu în care tradiția rămâne parte din viața locală.",
      "RoHubTravel organizează circuite care respectă ritmul locului: Săpânța, bisericile de lemn, mănăstiri, stâne și mese la gazde verificate. Programul lasă loc pentru peisaj, conversație și experiențe reale, nu doar pentru fotografii rapide.",
      "Pentru călătorii care caută autenticitate, Maramureșul oferă una dintre cele mai puternice experiențe culturale din țară.",
    ],
    highlights: [
      {
        title: "Patrimoniu de lemn",
        text: "Bisericile de lemn UNESCO și porțile maramureșene sunt elemente unice în peisajul turistic european.",
      },
      {
        title: "Săpânța",
        text: "Cimitirul Vesel este un reper cultural mondial, pe care îl vizităm cu context și respect pentru loc.",
      },
      {
        title: "Viața de stână",
        text: "Brânzeturi, peisaj de munte și întâlniri cu producători locali completează latura gastronomică a circuitului.",
      },
    ],
    famousFor: [
      "Cimitirul Vesel din Săpânța, cu epitafe pictate și tradiție unică",
      "Bisericile de lemn înscrise în patrimoniul UNESCO",
      "Porțile maramureșene sculptate, simbol al arhitecturii locale",
      "Mănăstirea Bârsana și ansamblurile monahale din zonă",
      "Viața de stână, păstoritul și peisajele de munte",
      "Gastronomie robustă: brânzeturi, balmoș, preparate de casă",
    ],
    food: [
      "Balmoș și mămăligă cu brânză, în preparare locală",
      "Ciorbe de zonă, inclusiv rețete de vacă sau miel după sezon",
      "Caș, urdă și alte brânzeturi de oaie de la producători",
      "Plăcinte, gogoși și deserturi de casă",
      "Horincă sau pălincă locală, servită responsabil, în context cultural",
      "Mese complete la gazde și pensiuni selectate pe văi",
    ],
    attractions: [
      "Săpânța și Cimitirul Vesel",
      "Mănăstirea Bârsana",
      "Biserici de lemn pe văile Izei și Marei",
      "Porți și gospodării tradiționale maramureșene",
      "Piețe și târguri locale, în funcție de sezon",
      "Stâne și peisaje de munte, cu acces organizat",
      "Muzee etnografice și puncte de interpretare culturală",
    ],
    experiences: [
      "Circuit al bisericilor de lemn, cu context istoric",
      "Vizită la stână, cu degustare de brânzeturi",
      "Zi dedicată Săpânței și tradițiilor locale",
      "Masă tradițională la gazdă, pe ritm de familie",
      "Atelier meșteșugăresc, acolo unde partenerii locali o permit",
      "Sejur de 4–6 zile pentru descoperire fără grabă",
    ],
    sampleDays: [
      "Ziua 1: sosire în zonă, acomodare și cină tradițională.",
      "Ziua 2: Săpânța, Cimitirul Vesel și peisaj pe vale.",
      "Ziua 3: biserici de lemn UNESCO și gospodării tradiționale.",
      "Ziua 4: stână, brânzeturi și timp pe munte.",
      "Ziua 5: Mănăstirea Bârsana și ritm liber, apoi plecare sau prelungire.",
    ],
    whenToGo:
      "Mai–octombrie este perioada cea mai confortabilă pentru drumuri, stâne și programe culturale. Primăvara târziu și toamna oferă peisaje deosebite; iarna este posibilă pentru grupuri care acceptă condiții montane și un ritm adaptat.",
    howWeWork:
      "Selectăm cazare cu caracter local, confirmăm vizitele la producători și construim un traseu coerent pe văi, fără transferuri inutile. Pe tot parcursul aveți asistență RoHubTravel.",
    bestFor:
      "Călători care caută autenticitate culturală, familii și grupuri mature care preferă experiența reală în locul unui checklist turistic.",
  },
  {
    slug: "transilvania",
    name: "Transilvania",
    days: "5–7 zile",
    blurb:
      "Bran, Sighișoara UNESCO, Brașov, sate săsești, dealuri și gastronomie ardelenească.",
    image: asset("/regions/transilvania.jpg"),
    heroAlt: "Peisaj și patrimoniu din Transilvania, România",
    seoTitle: "Vacanțe în Transilvania - Bran, Sighișoara și sate săsești",
    seoDescription:
      "Circuite în Transilvania cu RoHubTravel: Castelul Bran, Sighișoara UNESCO, Brașov, sate săsești, vinuri și gastronomie. Vacanțe culturale în inima României.",
    intro: [
      "Transilvania este regiunea pe care lumea o asociază cu legende, castele și orașe medievale - și merită descoperită pe teren, dincolo de clișee. Brașov, Bran, Sighișoara și satele săsești formează un circuit cultural dens, cu peisaj de deal și o gastronomie distinctă.",
      "RoHubTravel construiește itinerarii care echilibrează obiectivele celebre cu sate, crame și timp real de explorare. Nu vindem doar „Dracula”: oferim context istoric, logistică profesionistă și experiențe locale de calitate.",
      "Pentru sejururi de 5–7 zile, Transilvania permite o narațiune completă: cetăți, peisaj, gastronomie și odihnă în locuri cu atmosferă.",
    ],
    highlights: [
      {
        title: "Orașe medievale",
        text: "Sighișoara UNESCO și Brașovul istoric oferă una dintre cele mai puternice experiențe urbane din România.",
      },
      {
        title: "Sate săsești",
        text: "Viscri, Biertan și alte comunități fortificate aduc ritm rural, arhitectură și întâlniri autentice.",
      },
      {
        title: "Cultură și peisaj",
        text: "Circuitul combină castele, dealuri, vinuri și mese lungi - fără a sacrifica confortul și organizarea.",
      },
    ],
    famousFor: [
      "Castelul Bran și zona Bârsei",
      "Cetatea Sighișoara, patrimoniu UNESCO",
      "Centrul istoric al Brașovului",
      "Sate săsești fortificate: Viscri, Biertan și altele",
      "Peisaj de dealuri, pășuni și drumuri pitorești",
      "Gastronomie ardelenească și vinuri din zona Târnavelor",
    ],
    food: [
      "Ciorbă ardelenească și specialități regionale",
      "Varză à la Cluj și preparate de tradiție maghiaro-românească",
      "Kürtőskalács și deserturi locale, în context autentic",
      "Brânzeturi și preparate de munte de la producători din zonă",
      "Vinuri de Târnave și Jidvei, cu degustări organizate",
      "Mese la pensiuni și restaurante cu produs local verificat",
    ],
    attractions: [
      "Castelul Bran",
      "Cetatea și turnurile Sighișoarei",
      "Centrul istoric Brașov, inclusiv Șcheii Brașovului",
      "Sate săsești: Viscri, Biertan sau alte obiective la cerere",
      "Peisaje și trasee ușoare pe dealurile din zonă",
      "Crame și puncte gastronomice pe traseu",
      "Muzee și obiective culturale opționale în orașele principale",
    ],
    experiences: [
      "Circuit Bran + Brașov, cu context istoric",
      "Zi completă în Sighișoara UNESCO",
      "Tur al satelor săsești, pe ritm lent",
      "Degustare de vinuri și masă regională",
      "Sejur de 5–7 zile cultură + peisaj",
      "Programe private pentru oaspeți internaționali și diaspora",
    ],
    sampleDays: [
      "Ziua 1: Brașov - acomodare și tur al centrului istoric.",
      "Ziua 2: Castelul Bran și zona Bârsei.",
      "Ziua 3: Sighișoara UNESCO, pe jos, cu timp pentru detalii.",
      "Ziua 4: sate săsești (Viscri / Biertan) și peisaj de deal.",
      "Ziua 5: cramă sau gastronomie regională, apoi ritm liber.",
      "Ziua 6–7: prelungire pe natură sau întoarcere organizată.",
    ],
    whenToGo:
      "Mai–octombrie este ideal pentru drumuri, sate și plimbări. Decembrie poate fi magic în orașele istorice; vara este sezon de vârf, deci rezervăm din timp. Primăvara și toamna oferă cel mai bun echilibru între vreme și aglomerație.",
    howWeWork:
      "Structurăm traseul pe nopți logice, evităm transferurile inutile și confirmăm obiectivele, cazarea și mesele înainte. Pentru oaspeți internaționali putem asigura context în limba convenită cu grupul.",
    bestFor:
      "Călători români și internaționali care doresc cultură, peisaj și un circuit complet în inima României.",
  },
  {
    slug: "bucovina",
    name: "Bucovina",
    days: "4–6 zile",
    blurb:
      "Mănăstiri pictate UNESCO, albastrul de Voroneț, păduri, aer curat și gastronomie bucovineană.",
    image: asset("/regions/bucovina.jpg"),
    heroAlt: "Mănăstirea Voroneț din Bucovina, România",
    seoTitle: "Vacanțe în Bucovina - mănăstiri pictate și gastronomie",
    seoDescription:
      "Vacanțe în Bucovina cu RoHubTravel: mănăstiri pictate Voroneț, Sucevița, Moldovița, natură și gastronomie locală. Circuite UNESCO în nord-estul României.",
    intro: [
      "Bucovina este regiunea care te încetinește din primul drum: fresce pe exteriorul mănăstirilor, păduri dense, aer de munte și mese care nu se grăbesc. Este una dintre cele mai puternice destinații culturale din România, ideală pentru o săptămână de patrimoniu, peisaj și odihnă reală.",
      "Cu RoHubTravel vizitați Voroneț, Sucevița, Moldovița și alte obiective esențiale într-un circuit coerent, cu cazare confortabilă și gastronomie locală de calitate. Nu tratăm mănăstirile ca pe o listă de bifări: oferim context, timp de contemplare și un ritm care respectă locul.",
      "Pentru familii, cupluri și călători care vor frumos fără agitație, Bucovina rămâne o alegere de referință.",
    ],
    highlights: [
      {
        title: "Mănăstiri pictate UNESCO",
        text: "Voroneț, Sucevița și Moldovița formează un patrimoniu unic în Europa, cu fresce exterioare de o frumusețe excepțională.",
      },
      {
        title: "Albastrul de Voroneț",
        text: "Culoarea emblematică a Bucovinei este parte din identitatea vizuală a regiunii și din experiența culturală a sejurului.",
      },
      {
        title: "Natură și odihnă",
        text: "Pădurile, dealurile și aerul curat completează circuitul cultural cu timp real de recuperare.",
      },
    ],
    famousFor: [
      "Mănăstirile pictate UNESCO: Voroneț, Sucevița, Moldovița",
      "Albastrul de Voroneț și tradiția frescelor exterioare",
      "Peisaje de munte, pădure și sate liniștite",
      "Meșteșuguri locale: ouă încondeiate, țesături, lemn",
      "Gastronomie bucovineană generoasă și de casă",
      "Atmosferă de sejur lent, potrivită pentru cultură și odihnă",
    ],
    food: [
      "Tochitură bucovineană, în preparare de pensiune",
      "Ciorbă rădăuțeană și alte supe regionale",
      "Poale-n brâu și plăcinte tradiționale",
      "Preparate afumate, jumări și specialități de casă",
      "Siropuri, dulcețuri și produse din fructe de pădure",
      "Țuică locală, servită în context tradițional și cu moderație",
    ],
    attractions: [
      "Mănăstirea Voroneț",
      "Mănăstirea Sucevița",
      "Mănăstirea Moldovița",
      "Alte mănăstiri din circuitul pictat, la cerere (Humor, Arbore)",
      "Suceava: cetate, centru și context istoric moldav",
      "Drumeții ușoare și plimbări în zone împădurite",
      "Ateliere și puncte meșteșugărești, în funcție de disponibilitate",
    ],
    experiences: [
      "Circuit complet al mănăstirilor pictate, pe 2–3 zile dedicate",
      "Masă tradițională la pensiune cu produs local",
      "Excursie pe natură, cu ritm adaptat grupului",
      "Atelier meșteșugăresc (ouă, țesături sau lemn), la cerere",
      "Sejur de 4–6 zile cultură + odihnă",
      "Programe pentru familii și călători 50+",
    ],
    sampleDays: [
      "Ziua 1: sosire, acomodare și cină bucovineană.",
      "Ziua 2: Voroneț și context UNESCO, cu timp generos la fața locului.",
      "Ziua 3: Sucevița și Moldovița, pe traseu cultural.",
      "Ziua 4: natură, meșteșug sau Suceava, în funcție de grup.",
      "Ziua 5–6: ritm liber, prelungire sau întoarcere organizată.",
    ],
    whenToGo:
      "Mai–octombrie este perioada recomandată pentru drumuri confortabile și lumină bună pe fresce. Septembrie și începutul de octombrie sunt excelente pentru culori de pădure. Iarna poate fi deosebită vizual, dar necesită flexibilitate pe traseu.",
    howWeWork:
      "Organizaăm un circuit logic al mănăstirilor, evităm aglomerația acolo unde este posibil prin ore de vizită bine alese și confirmăm cazarea și mesele din timp. Asistența RoHubTravel rămâne activă pe tot sejurul.",
    bestFor:
      "Familii, cupluri și călători care doresc cultură UNESCO, peisaj și odihnă, fără un program epuizant.",
  },
  {
    slug: "dobrogea",
    name: "Dobrogea & Delta",
    days: "3–5 zile",
    blurb:
      "Delta Dunării UNESCO, pelicani, canale, sate de pescari și gastronomie de pește.",
    image: asset("/regions/dobrogea.jpg"),
    heroAlt: "Pelicani în Delta Dunării, Dobrogea, România",
    seoTitle: "Vacanțe în Dobrogea și Delta Dunării",
    seoDescription:
      "Vacanțe în Delta Dunării și Dobrogea cu RoHubTravel: canale, birdwatching, pește proaspăt și sate de pescari. Tururi natură UNESCO în estul României.",
    intro: [
      "Dobrogea și Delta Dunării sunt despre apă, lumină, păsări și un ritm complet diferit de restul țării. Aici experiența nu se măsoară în kilometri de autostradă, ci în canale, sate de pescari, pește proaspăt și momente de liniște pe apă.",
      "RoHubTravel organizează sejururi care respectă natura Deltei: croaziere ușoare, birdwatching, mese cu pește local și cazare potrivită zonei. Nu vindem agitație de litoral aglomerat; oferim Delta așa cum merită trăită.",
      "Pentru iubitorii de natură, fotografie și gastronomie de pește, aceasta este una dintre cele mai memorabile experiențe din România.",
    ],
    highlights: [
      {
        title: "Rezervație UNESCO",
        text: "Delta Dunării este unul dintre cele mai valoroase ecosisteme din Europa, cu biodiversitate excepțională.",
      },
      {
        title: "Viața pe canale",
        text: "Croazierele ușoare, satele de pescari și peisajul de apă definesc ritmul sejurului.",
      },
      {
        title: "Gastronomie de pește",
        text: "Storceag, saramură, plachie și grătare cu pește proaspăt sunt parte esențială din experiență.",
      },
    ],
    famousFor: [
      "Delta Dunării, rezervație a biosferei UNESCO",
      "Pelicani, egrete și biodiversitate remarcabilă",
      "Canale, lacuri și peisaj de apă",
      "Sate de pescari și comunități locale (inclusiv lipovenești)",
      "Gastronomie de pește și preparate de mal",
      "Dobrogea continentală și escapade opționale spre litoral",
    ],
    food: [
      "Storceag și ciorbă de pește, după rețete locale",
      "Saramură de pește",
      "Plachie de crap și alte preparate tradiționale",
      "Pește la grătar, servit cu mămăligă și salate simple",
      "Specialități lipovenești, acolo unde partenerii le oferă",
      "Mese pe mal, în unități selectate pentru prospețime și igienă",
    ],
    attractions: [
      "Tur organizat pe canalele Deltei",
      "Zone de birdwatching cu ghid local",
      "Sate de pescari (ex. Mila 23), la cerere și în funcție de sezon",
      "Tulcea, ca poartă de intrare spre Deltă",
      "Puncte de observație și peisaj de apă la răsărit sau apus",
      "Escapade scurte pe litoralul dobrogean, opțional",
      "Muzee și centre de informare despre Deltă, la cerere",
    ],
    experiences: [
      "Croazieră ușoară pe canale, adaptată vremii și grupului",
      "Observare păsări cu ghid, în zone potrivite sezonului",
      "Masă cu pește proaspăt, în locație verificată",
      "Sejur de 3–5 zile natură + gastronomie",
      "Programe pentru cupluri și grupuri mici",
      "Combinare Deltă + Dobrogea, pentru oaspeții cu mai multe zile",
    ],
    sampleDays: [
      "Ziua 1: sosire în Tulcea, transfer spre zonă de cazare, cină cu pește.",
      "Ziua 2: croazieră pe canale și birdwatching.",
      "Ziua 3: sat de pescari, peisaj și timp liber pe ritmul Deltei.",
      "Ziua 4: a doua ieșire pe apă sau escapadă dobrogeană opțională.",
      "Ziua 5: plecare organizată din Tulcea.",
    ],
    whenToGo:
      "Aprilie–octombrie este sezonul principal. Mai–iunie și septembrie sunt excelente pentru păsări și temperaturi confortabile. Vara aduce zile lungi pe apă, dar și nevoie de protecție solară și program matinal. Iarna este posibilă doar pentru grupuri specializate.",
    howWeWork:
      "Lucrăm cu operatori locali de încredere pentru bărci și cazare, urmărim condițiile meteo și adaptăm ieșirile pe apă pentru siguranță și confort. Confirmăm meniurile și logistica înainte de sosire.",
    bestFor:
      "Iubitori de natură, cupluri și grupuri mici care doresc o experiență diferită de litoralul aglomerat.",
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
    text: "Fiecare regiune are o poveste. Construim itinerarii pe ritmul tău, cu obiective, cazare și gastronomie alese atent.",
  },
  {
    title: "Experiențe autentice",
    text: "Gastronomie, crame, stâne, meșteșuguri și activități locale, cu parteneri verificați din fiecare zonă.",
  },
  {
    title: "Aproape pe tot drumul",
    text: "WhatsApp, email și telefon: de la primul mesaj până te întorci acasă, ai un punct clar de contact.",
  },
] as const;

export const HERO_IMAGE = asset("/regions/hero.jpg");
export const ABOUT_IMAGE = asset("/regions/about.jpg");

/** Romania-only imagery for the Servicii / retreats page. */
export const SERVICE_IMAGES = {
  hero: {
    src: asset("/regions/hero.jpg"),
    alt: "Transfăgărășan în Munții Făgăraș, România - drum de munte pentru retreat-uri",
  },
  escape: {
    src: asset("/regions/oltenia.jpg"),
    alt: "Mănăstirea Horezu din Oltenia, România - experiență culturală de o zi",
  },
  experience: {
    src: asset("/regions/muntenia.jpg"),
    alt: "Castelul Peleș din Sinaia, Muntenia, România - retreat de o noapte",
  },
  retreat: {
    src: asset("/regions/dobrogea.jpg"),
    alt: "Pelicani în Delta Dunării, Dobrogea, România - deconectare în natură",
  },
  custom: {
    src: asset("/regions/about.jpg"),
    alt: "Piața Mare din Sibiu, Transilvania, România - experiență custom pentru companii",
  },
  why: {
    src: asset("/regions/bucovina.jpg"),
    alt: "Mănăstirea Voroneț din Bucovina, România - cultură și tradiție",
  },
  gallery: [
    {
      src: asset("/regions/maramures.jpg"),
      alt: "Cimitirul Vesel din Săpânța, Maramureș, România",
    },
    {
      src: asset("/regions/transilvania.jpg"),
      alt: "Cruce de piatră tradițională în Transilvania, România",
    },
    {
      src: asset("/regions/bucovina.jpg"),
      alt: "Mănăstire pictată din Bucovina, România",
    },
    {
      src: asset("/regions/oltenia.jpg"),
      alt: "Complex monahal în Oltenia, România",
    },
  ],
} as const;
