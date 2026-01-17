import { describe, expect, it } from "vitest";
import { calculateNatal } from "../src/lib/astro/calculateNatal";

describe("calculateNatal", () => {
  it("returns consistent output for same input", async () => {
    const input = {
      dateISO: "1993-04-05",
      timeHHMM: "09:30",
      latitude: 40.7,
      longitude: -74.0
    };

    const first = await calculateNatal(input);
    const second = await calculateNatal(input);

    expect(first).toEqual(second);
    expect(first.planets.Sun).toBeDefined();
  });
});
