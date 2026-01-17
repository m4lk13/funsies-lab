import type { NatalOutput } from "@/lib/astro/calculateNatal";

const aspectPhrases: Record<string, string> = {
  conjunction: "converging currents",
  opposition: "mirrored tensions",
  trine: "harmonic openings",
  square: "friction sparks",
  sextile: "quiet alliances"
};

export const buildHoroscope = (natal: NatalOutput) => {
  const { bigThree, summarySeeds, aspects } = natal;
  const topAspect = aspects[0];
  const aspectPhrase = topAspect
    ? aspectPhrases[topAspect.type]
    : "gentle undercurrents";

  const risingPhrase = bigThree.rising
    ? `People may read you through the lens of ${bigThree.rising}`
    : "Your outer signal remains intentionally mysterious";

  return `Your chart suggests a ${summarySeeds.dominantElement.toLowerCase()}-leaning temperament with ${summarySeeds.dominantModality.toLowerCase()} momentum. Sun in ${
    bigThree.sun
  } brings a steady purpose, while Moon in ${bigThree.moon} colours the inner tides. ${risingPhrase}. Expect ${aspectPhrase} to highlight how you balance intention and instinct. A useful experiment is to slow down before decisive moves and listen for the quieter signal beneath.`;
};
