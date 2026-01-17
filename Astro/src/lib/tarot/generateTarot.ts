import type { NatalOutput } from "@/lib/astro/calculateNatal";
import { hashStringToSeeds } from "@/lib/tarot/hash";
import { buildKeywords, buildSubtitle, pickBaseTitle } from "@/lib/tarot/sigils";
import { SIGNS } from "@/lib/astro/signs";

export type TarotCard = {
  id: "core" | "tide" | "mask";
  title: string;
  subtitle: string;
  keywords: string[];
  sprites: {
    frameSeed: number;
    sigilSeed: number;
    noiseSeed: number;
  };
  lore: string;
};

const getSignMeta = (signName: string) =>
  SIGNS.find((sign) => sign.name === signName) ?? SIGNS[0];

const buildCard = (
  id: TarotCard["id"],
  signName: string,
  seedOffset: number,
  natal: NatalOutput
): TarotCard => {
  const sign = getSignMeta(signName);
  const seedBase = JSON.stringify({ signName, id, summary: natal.summarySeeds });
  const seeds = hashStringToSeeds(seedBase).map((value) => value + seedOffset);
  const title = `${pickBaseTitle(sign.element, seeds[0])} of ${sign.name}`;
  const subtitle = buildSubtitle(sign.modality);
  const keywords = buildKeywords(sign.element, sign.modality);
  const tension = natal.aspects.filter(
    (aspect) => aspect.type === "square" || aspect.type === "opposition"
  ).length;
  const harmony = natal.aspects.filter(
    (aspect) => aspect.type === "trine" || aspect.type === "sextile"
  ).length;

  const lore =
    tension > harmony
      ? "The glyph fractures at the edges, asking you to refine the signal before it speaks."
      : "The sigil glows with steady cadence, inviting you to trust the rhythm already present.";

  return {
    id,
    title,
    subtitle,
    keywords,
    sprites: {
      frameSeed: seeds[0],
      sigilSeed: seeds[1],
      noiseSeed: seeds[2]
    },
    lore
  };
};

export const generateTarot = (natal: NatalOutput): TarotCard[] => {
  const core = buildCard("core", natal.bigThree.sun, 11, natal);
  const tide = buildCard("tide", natal.bigThree.moon, 29, natal);
  const maskSign = natal.bigThree.rising ?? natal.bigThree.sun;
  const mask = buildCard("mask", maskSign, 47, natal);

  return [core, tide, mask];
};
