"use client";

import { useState } from "react";
import InputRitualForm, { RitualInput } from "@/components/InputRitualForm";
import TarotStage from "@/components/TarotStage";
import ResultsPanel from "@/components/ResultsPanel";
import { calculateNatal, type NatalOutput } from "@/lib/astro/calculateNatal";
import { generateTarot, type TarotCard } from "@/lib/tarot/generateTarot";
import { buildHoroscope } from "@/lib/astro/horoscopeText";

const initialCards: TarotCard[] = [
  {
    id: "core",
    title: "The Veiled Flame",
    subtitle: "Awaiting the cast",
    keywords: ["embers", "ink", "silence"],
    sprites: { frameSeed: 1, sigilSeed: 2, noiseSeed: 3 },
    lore: "The cards sleep until summoned by birth and breath."
  },
  {
    id: "tide",
    title: "The Quiet Tide",
    subtitle: "Awaiting the cast",
    keywords: ["stillness", "echo", "tide"],
    sprites: { frameSeed: 4, sigilSeed: 5, noiseSeed: 6 },
    lore: "A mirror of lunar waters, waiting to awaken."
  },
  {
    id: "mask",
    title: "The Masked Path",
    subtitle: "Awaiting the cast",
    keywords: ["veil", "gate", "horizon"],
    sprites: { frameSeed: 7, sigilSeed: 8, noiseSeed: 9 },
    lore: "A threshold drawn in monochrome."
  }
];

export default function Home() {
  const [isCasting, setIsCasting] = useState(false);
  const [natal, setNatal] = useState<NatalOutput | null>(null);
  const [cards, setCards] = useState<TarotCard[]>(initialCards);
  const [horoscope, setHoroscope] = useState("");
  const [stageKey, setStageKey] = useState(0);

  const handleSubmit = async (input: RitualInput) => {
    setIsCasting(true);
    const natalOutput = await calculateNatal({
      dateISO: input.dateISO,
      timeHHMM: input.timeHHMM,
      latitude: input.latitude,
      longitude: input.longitude,
      timezoneOffsetMinutes: input.timezoneOffsetMinutes
    });

    const tarotCards = generateTarot(natalOutput);
    const text = buildHoroscope(natalOutput);

    setTimeout(() => {
      setNatal(natalOutput);
      setCards(tarotCards);
      setHoroscope(text);
      setStageKey((prev) => prev + 1);
      setIsCasting(false);
    }, 1200);
  };

  const handleRecast = () => {
    setNatal(null);
    setCards(initialCards);
    setHoroscope("");
    setStageKey((prev) => prev + 1);
  };

  return (
    <main>
      <header className="hero">
        <h1>Astro</h1>
        <p>Pixel-gothic natal chart + tarot animation ritual.</p>
      </header>

      <section className="panel">
        <h2>Ritual Intake</h2>
        <InputRitualForm onSubmit={handleSubmit} disabled={isCasting} />
      </section>

      <section className="panel">
        <h2>Sigil Chamber</h2>
        <div className={`loading-sigil ${isCasting ? "active" : ""}`}>
          {isCasting ? "Casting…" : ""}
        </div>
        <TarotStage cards={cards} running={stageKey > 0} key={stageKey} />
      </section>

      {natal && (
        <section className="panel">
          <h2>Reveal</h2>
          <ResultsPanel
            natal={natal}
            cards={cards}
            horoscope={horoscope}
            onRecast={handleRecast}
          />
        </section>
      )}
    </main>
  );
}
