"use client";

import type { TarotCard } from "@/lib/tarot/generateTarot";
import type { NatalOutput } from "@/lib/astro/calculateNatal";

type Props = {
  natal: NatalOutput;
  cards: TarotCard[];
  horoscope: string;
  onRecast: () => void;
};

export default function ResultsPanel({ natal, cards, horoscope, onRecast }: Props) {
  return (
    <section className="results-panel">
      <div className="big-three">
        <div>
          <h3>Sun</h3>
          <p>{natal.bigThree.sun}</p>
        </div>
        <div>
          <h3>Moon</h3>
          <p>{natal.bigThree.moon}</p>
        </div>
        <div>
          <h3>Rising</h3>
          <p>{natal.bigThree.rising ?? "Unknown"}</p>
        </div>
      </div>
      <p className="horoscope">{horoscope}</p>
      <div className="card-text">
        {cards.map((card) => (
          <article key={card.id}>
            <h4>{card.title}</h4>
            <p className="subtitle">{card.subtitle}</p>
            <p className="keywords">{card.keywords.join(" • ")}</p>
            <p>{card.lore}</p>
          </article>
        ))}
      </div>
      <button type="button" onClick={onRecast}>
        Recast
      </button>
    </section>
  );
}
