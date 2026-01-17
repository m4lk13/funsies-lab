export type Element = "Fire" | "Earth" | "Air" | "Water";
export type Modality = "Cardinal" | "Fixed" | "Mutable";

export type SignInfo = {
  name: string;
  element: Element;
  modality: Modality;
  startDegree: number;
};

export const SIGNS: SignInfo[] = [
  { name: "Aries", element: "Fire", modality: "Cardinal", startDegree: 0 },
  { name: "Taurus", element: "Earth", modality: "Fixed", startDegree: 30 },
  { name: "Gemini", element: "Air", modality: "Mutable", startDegree: 60 },
  { name: "Cancer", element: "Water", modality: "Cardinal", startDegree: 90 },
  { name: "Leo", element: "Fire", modality: "Fixed", startDegree: 120 },
  { name: "Virgo", element: "Earth", modality: "Mutable", startDegree: 150 },
  { name: "Libra", element: "Air", modality: "Cardinal", startDegree: 180 },
  { name: "Scorpio", element: "Water", modality: "Fixed", startDegree: 210 },
  { name: "Sagittarius", element: "Fire", modality: "Mutable", startDegree: 240 },
  { name: "Capricorn", element: "Earth", modality: "Cardinal", startDegree: 270 },
  { name: "Aquarius", element: "Air", modality: "Fixed", startDegree: 300 },
  { name: "Pisces", element: "Water", modality: "Mutable", startDegree: 330 }
];

export const getSignFromLongitude = (lon: number) => {
  const normalized = ((lon % 360) + 360) % 360;
  const sign = SIGNS.slice().reverse().find((entry) => normalized >= entry.startDegree);
  return sign ?? SIGNS[0];
};
