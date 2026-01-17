import { calculateAspects } from "@/lib/astro/aspects";
import { getSignFromLongitude, SIGNS, type Element, type Modality } from "@/lib/astro/signs";

export type NatalInput = {
  dateISO: string;
  timeHHMM?: string;
  latitude?: number;
  longitude?: number;
  timezoneOffsetMinutes?: number;
};

export type NatalOutput = {
  planets: Record<string, { lon: number; sign: string; degree: number }>;
  houses?: { asc: number; mc: number; cusps: number[] };
  aspects: Array<{
    a: string;
    b: string;
    type: "conjunction" | "opposition" | "trine" | "square" | "sextile";
    orb: number;
  }>;
  bigThree: { sun: string; moon: string; rising?: string };
  summarySeeds: {
    dominantElement: Element;
    dominantModality: Modality;
    intensityScore: number;
  };
};

const PLANET_KEYS = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Pluto"
];

const pseudoPlanetLongitudes = (timestamp: number) => {
  const base = (timestamp / 86400000) % 360;
  return PLANET_KEYS.reduce<Record<string, number>>((acc, planet, index) => {
    acc[planet] = (base * (index + 1) + index * 37) % 360;
    return acc;
  }, {});
};

const buildPlanetData = (longitudes: Record<string, number>) => {
  return PLANET_KEYS.reduce<Record<string, { lon: number; sign: string; degree: number }>>(
    (acc, planet) => {
      const lon = longitudes[planet] ?? 0;
      const sign = getSignFromLongitude(lon);
      const degree = ((lon - sign.startDegree + 360) % 360).toFixed(2);
      acc[planet] = {
        lon,
        sign: sign.name,
        degree: Number(degree)
      };
      return acc;
    },
    {}
  );
};

const resolveDominants = (
  planets: Record<string, { sign: string }>
): { dominantElement: Element; dominantModality: Modality } => {
  const elementCount: Record<Element, number> = {
    Fire: 0,
    Earth: 0,
    Air: 0,
    Water: 0
  };
  const modalityCount: Record<Modality, number> = {
    Cardinal: 0,
    Fixed: 0,
    Mutable: 0
  };

  Object.values(planets).forEach((planet) => {
    const sign = SIGNS.find((item) => item.name === planet.sign);
    if (!sign) return;
    elementCount[sign.element] += 1;
    modalityCount[sign.modality] += 1;
  });

  const dominantElement = (Object.keys(elementCount) as Element[]).sort(
    (a, b) => elementCount[b] - elementCount[a]
  )[0];
  const dominantModality = (Object.keys(modalityCount) as Modality[]).sort(
    (a, b) => modalityCount[b] - modalityCount[a]
  )[0];

  return { dominantElement, dominantModality };
};

const buildDate = (
  dateISO: string,
  timeHHMM?: string,
  timezoneOffsetMinutes?: number
) => {
  const [year, month, day] = dateISO.split("-").map(Number);
  const [hours, minutes] = (timeHHMM || "12:00").split(":").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  const offset = timezoneOffsetMinutes ?? new Date().getTimezoneOffset();
  date.setUTCMinutes(date.getUTCMinutes() + offset);
  return date;
};

export const calculateNatal = async (input: NatalInput): Promise<NatalOutput> => {
  const date = buildDate(
    input.dateISO,
    input.timeHHMM,
    input.timezoneOffsetMinutes
  );
  const timestamp = date.getTime();
  let longitudes = pseudoPlanetLongitudes(timestamp);
  let houses: NatalOutput["houses"] | undefined;

  const astronomyModule: any = await import("astronomy-engine").catch(() => null);
  const Astronomy = astronomyModule?.default ?? astronomyModule;

  if (Astronomy?.GeoVector && Astronomy?.Ecliptic) {
    longitudes = PLANET_KEYS.reduce<Record<string, number>>((acc, planet) => {
      const vector = Astronomy.GeoVector(planet, date, true);
      const ecliptic = Astronomy.Ecliptic(vector);
      const normalized = ((ecliptic.elon % 360) + 360) % 360;
      acc[planet] = normalized;
      return acc;
    }, {});
  }

  const planets = buildPlanetData(longitudes);
  const aspects = calculateAspects(planets);

  const { dominantElement, dominantModality } = resolveDominants(planets);
  const intensityScore = Math.min(
    100,
    Math.round(
      (aspects.filter((aspect) => aspect.type === "square").length * 12 +
        aspects.filter((aspect) => aspect.type === "opposition").length * 10 +
        aspects.filter((aspect) => aspect.type === "trine").length * 8) /
        2
    )
  );

  const sunSign = planets.Sun.sign;
  const moonSign = planets.Moon.sign;
  const rising = houses?.asc ? getSignFromLongitude(houses.asc).name : undefined;

  return {
    planets,
    houses,
    aspects,
    bigThree: { sun: sunSign, moon: moonSign, rising },
    summarySeeds: { dominantElement, dominantModality, intensityScore }
  };
};
