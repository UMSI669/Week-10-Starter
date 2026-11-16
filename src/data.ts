export type Atmosphere = "electric" | "sunset" | "midnight";
export type Artist = {
  id: string;
  name: string;
  genre: string;
  stage: string;
  time: string;
  end: string;
  atmosphere: Atmosphere;
  initials: string;
  description: string;
  setlist: string[];
};
export const artists: Artist[] = [
  {
    id: "nova",
    name: "NOVA / NOIR",
    genre: "Electronic · future bass",
    stage: "Main hall",
    time: "21:00",
    end: "22:15",
    atmosphere: "electric",
    initials: "N/N",
    description:
      "Heavy bass. Weightless melodies. A neon-lit headline show made for getting lost together.",
    setlist: [
      "Signal / intro",
      "City After Dark",
      "Gravity Is Optional",
      "Electric Bloom",
      "We Are the Afterglow",
    ],
  },
  {
    id: "sol",
    name: "SOL THEORY",
    genre: "Indie soul · alternative",
    stage: "Garden amphitheatre",
    time: "19:30",
    end: "20:45",
    atmosphere: "sunset",
    initials: "ST",
    description:
      "Warm guitars and velvet vocals drifting through the last light. Your golden-hour soundtrack.",
    setlist: [
      "Golden Hour People",
      "Peach Skies",
      "Stay a Little Longer",
      "Wildflower Radio",
      "Somewhere Soft",
    ],
  },
  {
    id: "luna",
    name: "LUNA TIDE",
    genre: "Dream pop · ambient",
    stage: "The observatory",
    time: "20:00",
    end: "21:15",
    atmosphere: "midnight",
    initials: "LT",
    description:
      "An intimate constellation of hazy synths and floating vocals. Step out of the noise and into the blue.",
    setlist: [
      "Blue Orbit",
      "Underwater Letters",
      "Satellite Heart",
      "The Quiet Between",
      "Until the Morning",
    ],
  },
  {
    id: "static",
    name: "STATIC GARDEN",
    genre: "Synthwave",
    stage: "Main hall",
    time: "20:00",
    end: "20:40",
    atmosphere: "electric",
    initials: "SG",
    description: "A bright, restless opening set to get the night moving.",
    setlist: ["Neon Roots", "Frequency Garden", "Run With the Signal"],
  },
  {
    id: "peach",
    name: "PEACH PARADE",
    genre: "Indie folk",
    stage: "Garden amphitheatre",
    time: "18:30",
    end: "19:10",
    atmosphere: "sunset",
    initials: "PP",
    description: "Sun-drenched harmonies and stories for the way home.",
    setlist: ["Sunday Windows", "Small Town Sun", "Take the Long Way"],
  },
  {
    id: "echo",
    name: "ECHO ATLAS",
    genre: "Ambient pop",
    stage: "The observatory",
    time: "19:00",
    end: "19:40",
    atmosphere: "midnight",
    initials: "EA",
    description:
      "Quiet rhythms and wide-open soundscapes to start the evening.",
    setlist: ["A Map of Silence", "Slow Satellites", "Homeward"],
  },
];
export type Concert = {
  artistId: string;
  title: string;
  date: string;
  shortDate: string;
  venue: string;
  city: string;
  doors: string;
  lineup: string[];
  section: string;
  row: string;
  seat: string;
  gate: string;
  reference: string;
};
export const concerts: Concert[] = [
  {
    artistId: "nova",
    title: "Electric Bloom Tour",
    date: "Friday, May 14, 2027",
    shortDate: "MAY 14",
    venue: "Foundry Hall",
    city: "Detroit, MI",
    doors: "19:00",
    lineup: ["static", "nova"],
    section: "B",
    row: "04",
    seat: "12",
    gate: "North entrance",
    reference: "AG-NOVA-DEMO",
  },
  {
    artistId: "sol",
    title: "Golden Hour Sessions",
    date: "Saturday, June 5, 2027",
    shortDate: "JUN 05",
    venue: "Riverside Gardens",
    city: "Ann Arbor, MI",
    doors: "17:30",
    lineup: ["peach", "sol"],
    section: "A",
    row: "02",
    seat: "08",
    gate: "Garden entrance",
    reference: "AG-SOL-DEMO",
  },
  {
    artistId: "luna",
    title: "Under a Different Moon",
    date: "Saturday, July 17, 2027",
    shortDate: "JUL 17",
    venue: "The Observatory",
    city: "Detroit, MI",
    doors: "18:00",
    lineup: ["echo", "luna"],
    section: "C",
    row: "06",
    seat: "21",
    gate: "East entrance",
    reference: "AG-LUNA-DEMO",
  },
];
export const atmosphereNames: Record<Atmosphere, string> = {
  electric: "Electric",
  sunset: "Golden hour",
  midnight: "Moonlight",
};
export function toggleFavorite(ids: string[], id: string) {
  return ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id];
}
