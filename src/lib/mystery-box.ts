export type MysteryTheme = {
  id: string;
  title: string;
  teaser: string;
  duration: string;
  priceFrom: string;
  /** Shown only as progressive clues — never the city name */
  clues: {
    label: string;
    text: string;
  }[];
  whatsappSeed: string;
};

export const mysteryThemes: MysteryTheme[] = [
  {
    id: "drumul-vinului",
    title: "Drumul Vinului",
    teaser:
      "Un traseu pe dealuri cu crame, degustări și peisaj — destinația rămâne secretă până aproape de plecare.",
    duration: "36–48h",
    priceFrom: "de la 1.150 RON / persoană",
    clues: [
      {
        label: "Indiciul 1 · acum",
        text: "Veți merge acolo unde strugurii se fac poveste și paharul se umple pe înserat.",
      },
      {
        label: "Indiciul 2 · cu 7 zile înainte",
        text: "Drumul trece pe lângă vii pe deal, iar cina are gust de brânză locală și pâine caldă.",
      },
      {
        label: "Indiciul 3 · cu 48h înainte",
        text: "Bagajul e de dealuri blânde, nu de mare. Pregătiți-vă pentru o cramă cu miros de stejar.",
      },
    ],
    whatsappSeed:
      "Bună ziua! Vreau Mystery Box — tema Drumul Vinului. Aștept detalii despre date și grup.",
  },
  {
    id: "capitale-povesti",
    title: "Capitale & povești",
    teaser:
      "Orașe cu straturi de istorie, muzee vii și plimbări pe străzi care încă șoptesc. Destinația e secretă.",
    duration: "24–36h",
    priceFrom: "de la 750 RON / persoană",
    clues: [
      {
        label: "Indiciul 1 · acum",
        text: "Veți păși pe pietre pe care au calcăt scriitori, soldați și turiști de secole.",
      },
      {
        label: "Indiciul 2 · cu 7 zile înainte",
        text: "Există o piață mare, o cetate sau un bulevard pe care merită să-l străbați fără grabă.",
      },
      {
        label: "Indiciul 3 · cu 48h înainte",
        text: "Pregătiți pantofi comodi și curiozitate urbană. Nu e munte, nu e deltă — e oraș cu povești.",
      },
    ],
    whatsappSeed:
      "Bună ziua! Vreau Mystery Box — tema Capitale & povești. Trimiteți-mi opțiunile de date.",
  },
  {
    id: "delta-lent",
    title: "Delta & ritm lent",
    teaser:
      "Apă, păsări, liniște și mese cu pește. Destinația se dezvăluie abia când e timpul să împachetați.",
    duration: "48h+",
    priceFrom: "de la 1.450 RON / persoană",
    clues: [
      {
        label: "Indiciul 1 · acum",
        text: "Veți auzi aripile înainte să vedeți orizontul. Aici timpul se măsoară în canale, nu în semafoare.",
      },
      {
        label: "Indiciul 2 · cu 7 zile înainte",
        text: "Luați ochelari de soare și răbdare. Mic dejunul miroase a pește proaspăt și a stuf.",
      },
      {
        label: "Indiciul 3 · cu 48h înainte",
        text: "Nu e un resort de munte. E apă, bărci și o liniște pe care biroul nu o cunoaște.",
      },
    ],
    whatsappSeed:
      "Bună ziua! Vreau Mystery Box — tema Delta & ritm lent. Spuneți-mi disponibilitatea.",
  },
];

export function getMysteryTheme(id: string): MysteryTheme | undefined {
  return mysteryThemes.find((t) => t.id === id);
}
