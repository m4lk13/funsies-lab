import { describe, expect, it } from "vitest";
import { generateTarot } from "../src/lib/tarot/generateTarot";
import type { NatalOutput } from "../src/lib/astro/calculateNatal";

const sampleNatal: NatalOutput = {
  planets: {
    Sun: { lon: 15, sign: "Aries", degree: 15 },
    Moon: { lon: 88, sign: "Gemini", degree: 28 },
    Mercury: { lon: 120, sign: "Leo", degree: 0 },
    Venus: { lon: 210, sign: "Scorpio", degree: 0 },
    Mars: { lon: 300, sign: "Aquarius", degree: 0 },
    Jupiter: { lon: 45, sign: "Taurus", degree: 15 },
    Saturn: { lon: 180, sign: "Libra", degree: 0 },
    Uranus: { lon: 270, sign: "Capricorn", degree: 0 },
    Neptune: { lon: 330, sign: "Pisces", degree: 0 },
    Pluto: { lon: 240, sign: "Sagittarius", degree: 0 }
  },
  aspects: [],
  bigThree: { sun: "Aries", moon: "Gemini", rising: "Libra" },
  summarySeeds: {
    dominantElement: "Fire",
    dominantModality: "Cardinal",
    intensityScore: 42
  }
};

describe("generateTarot", () => {
  it("returns deterministic cards", () => {
    const first = generateTarot(sampleNatal);
    const second = generateTarot(sampleNatal);
    expect(first).toEqual(second);
  });
});
