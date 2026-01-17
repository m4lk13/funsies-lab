# Astro

Pixel-gothic natal chart ritual that turns birth data into a monochrome tarot reveal. Provide a date (time and birthplace optional) and the app computes a deterministic natal chart, maps it to three archetypal cards, then animates the reveal in pixel art.

Screenshot placeholder: `docs/screenshot-placeholder.txt`

## Local Development

Node.js 16.8+ is required.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Input Assumptions

- **Date of birth** is required.
- **Time of birth** defaults to 12:00 (noon) if unknown.
- **Birthplace** is optional. If latitude/longitude are missing, the app computes planetary positions but omits houses and rising sign.

## Tech Stack

- Next.js (App Router) + TypeScript
- PixiJS for pixel rendering
- GSAP for flip animation timing
- Zod for validation
- `astronomy-engine` for ephemeris-backed natal calculations

## Determinism

The tarot mapping and pixel seeds are derived from a stable hash of the natal output. The same input will always generate the same chart, cards, and reveal sequence.

## Licensing Notes

This project uses `astronomy-engine` for planetary calculations. If you swap in Swiss Ephemeris tooling such as `swisseph-wasm` (GPL-3.0-or-later), you must comply with GPL obligations for your distribution.

## QA Checklist

- [ ] Mobile and desktop layouts look correct
- [ ] Monochrome palette with a single gray accent
- [ ] Tarot flip animation runs smoothly without tearing
- [ ] Recast resets the state cleanly

## Roadmap

- City-based geocoding for birthplace
- Save and reload previous charts
- More card spreads and animations
