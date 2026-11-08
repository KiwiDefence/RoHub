export type TeamMember = {
  name: string;
  role: string;
  image: string;
  imageAlt: string;
  /** CSS object-position — keeps faces in frame across square / portrait crops */
  objectPosition: string;
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function photo(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}

export const teamMembers: TeamMember[] = [
  {
    name: "Denis Nedelcu",
    role: "Specialist Marketing",
    image: photo("/team/denis-nedelcu.webp"),
    imageAlt: "Denis Nedelcu, specialist marketing RoHubTravel",
    objectPosition: "center 18%",
  },
  {
    name: "Radu Cătălin Petre",
    role: "Specialist Tehnologie & Digital",
    image: photo("/team/radu-catalin-petre.webp"),
    imageAlt: "Radu Cătălin Petre, specialist tehnologie RoHubTravel",
    objectPosition: "center 22%",
  },
  {
    name: "Larisa Brătianu",
    role: "Specialist Management & Vânzări",
    image: photo("/team/larisa-bratianu.webp"),
    imageAlt: "Larisa Brătianu, specialist management și vânzări RoHubTravel",
    objectPosition: "center 12%",
  },
  {
    name: "Matei Mihai Radu",
    role: "Administrator de firmă",
    image: photo("/team/matei-mihai-radu.webp"),
    imageAlt: "Matei Mihai Radu, administrator firmă RoHubTravel",
    objectPosition: "center 20%",
  },
  {
    name: "Purice Adrian Sebastian",
    role: "Specialist Tehnologie & Securitate",
    image: photo("/team/purice-adrian-sebastian.webp"),
    imageAlt: "Purice Adrian Sebastian, specialist tehnologie și securitate RoHubTravel",
    objectPosition: "center 35%",
  },
];
