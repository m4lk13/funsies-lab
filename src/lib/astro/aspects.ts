export type AspectType = "conjunction" | "opposition" | "trine" | "square" | "sextile";

export type Aspect = {
  a: string;
  b: string;
  type: AspectType;
  orb: number;
};

const ASPECT_ANGLES: Record<AspectType, number> = {
  conjunction: 0,
  opposition: 180,
  trine: 120,
  square: 90,
  sextile: 60
};

const ORB_BY_BODY: Record<string, number> = {
  Sun: 6,
  Moon: 6
};

const defaultOrb = 4;

const angularDistance = (a: number, b: number) => {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
};

export const calculateAspects = (
  planets: Record<string, { lon: number }>
): Aspect[] => {
  const names = Object.keys(planets);
  const aspects: Aspect[] = [];

  for (let i = 0; i < names.length; i += 1) {
    for (let j = i + 1; j < names.length; j += 1) {
      const aName = names[i];
      const bName = names[j];
      const aLon = planets[aName].lon;
      const bLon = planets[bName].lon;
      const separation = angularDistance(aLon, bLon);
      const maxOrb = Math.max(
        ORB_BY_BODY[aName] ?? defaultOrb,
        ORB_BY_BODY[bName] ?? defaultOrb
      );

      (Object.keys(ASPECT_ANGLES) as AspectType[]).forEach((type) => {
        const angle = ASPECT_ANGLES[type];
        const orb = Math.abs(separation - angle);
        if (orb <= maxOrb) {
          aspects.push({ a: aName, b: bName, type, orb });
        }
      });
    }
  }

  return aspects;
};
