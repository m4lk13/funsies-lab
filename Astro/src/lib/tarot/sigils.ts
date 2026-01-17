import type { Element, Modality } from "@/lib/astro/signs";

const elementTitles: Record<Element, string[]> = {
  Fire: ["Torch", "Crown", "Forge"],
  Earth: ["Gate", "Stone", "Root"],
  Air: ["Bell", "Key", "Mirror"],
  Water: ["Chalice", "Abyss", "Veil"]
};

const modalityDescriptors: Record<Modality, string> = {
  Cardinal: "the First Motion",
  Fixed: "the Still Axis",
  Mutable: "the Shifting Veil"
};

export const pickBaseTitle = (element: Element, seed: number) => {
  const options = elementTitles[element];
  return options[seed % options.length];
};

export const buildSubtitle = (modality: Modality) => {
  return modalityDescriptors[modality];
};

export const buildKeywords = (element: Element, modality: Modality) => {
  const base = {
    Fire: ["ember", "signal", "edge"],
    Earth: ["anchor", "stone", "pattern"],
    Air: ["breath", "lens", "whisper"],
    Water: ["tide", "mirror", "depth"]
  };
  const mod = {
    Cardinal: "spark",
    Fixed: "anchor",
    Mutable: "echo"
  };
  return [...base[element], mod[modality]];
};
