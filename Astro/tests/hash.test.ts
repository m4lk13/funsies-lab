import { describe, expect, it } from "vitest";
import { hashStringToSeeds } from "../src/lib/tarot/hash";

describe("hashStringToSeeds", () => {
  it("returns deterministic seeds", () => {
    const seedsA = hashStringToSeeds("same-input");
    const seedsB = hashStringToSeeds("same-input");
    expect(seedsA).toEqual(seedsB);
  });

  it("changes when input changes", () => {
    const seedsA = hashStringToSeeds("input-a");
    const seedsB = hashStringToSeeds("input-b");
    expect(seedsA).not.toEqual(seedsB);
  });
});
