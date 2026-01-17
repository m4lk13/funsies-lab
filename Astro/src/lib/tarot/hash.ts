export const hashStringToSeeds = (input: string) => {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;

  for (let i = 0; i < input.length; i += 1) {
    const k = input.charCodeAt(i);
    h1 = (h2 ^ Math.imul(h1 ^ k, 597399067)) >>> 0;
    h2 = (h3 ^ Math.imul(h2 ^ k, 2869860233)) >>> 0;
    h3 = (h4 ^ Math.imul(h3 ^ k, 951274213)) >>> 0;
    h4 = (h1 ^ Math.imul(h4 ^ k, 2716044179)) >>> 0;
  }

  return [h1, h2, h3, h4].map((value) => value >>> 0);
};
