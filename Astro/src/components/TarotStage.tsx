"use client";

import { useEffect, useMemo, useRef } from "react";
import type { TarotCard } from "@/lib/tarot/generateTarot";

const CARD_WIDTH = 160;
const CARD_HEIGHT = 240;

const palette = {
  background: 0x0b0b0d,
  foreground: 0xf3f1eb,
  accent: 0x8c8a84
};

type Props = {
  cards: TarotCard[];
  running: boolean;
};

export default function TarotStage({ cards, running }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const cardData = useMemo(() => cards, [cards]);

  useEffect(() => {
    if (!containerRef.current) return;

    let app: import("pixi.js").Application | null = null;
    let dispose = false;

    const setup = async () => {
      const pixi = await import("pixi.js");
      const { Application, Container, Graphics, Text, TextStyle, Sprite } = pixi;
      pixi.settings.SCALE_MODE = pixi.SCALE_MODES.NEAREST;

      app = new Application({
        background: palette.background,
        antialias: false,
        width: 720,
        height: 360,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
      });

      if (dispose || !containerRef.current) {
        app.destroy(true, { children: true });
        return;
      }

      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(app.canvas);

      const stage = app.stage;
      const cardContainer = new Container();
      stage.addChild(cardContainer);

      const makeCardTexture = (card: TarotCard, flipped: boolean) => {
        const graphics = new Graphics();
        graphics.rect(0, 0, CARD_WIDTH, CARD_HEIGHT);
        graphics.fill(flipped ? palette.accent : palette.background);
        graphics.rect(6, 6, CARD_WIDTH - 12, CARD_HEIGHT - 12);
        graphics.stroke({ color: palette.foreground, width: 2, alpha: 0.8 });

        for (let y = 20; y < CARD_HEIGHT - 20; y += 18) {
          graphics.moveTo(16, y);
          graphics.lineTo(CARD_WIDTH - 16, y + (flipped ? 4 : 0));
          graphics.stroke({ color: palette.accent, width: 1, alpha: 0.5 });
        }

        if (!flipped) {
          const title = new Text({
            text: card.title.toUpperCase(),
            style: new TextStyle({
              fill: palette.foreground,
              fontSize: 12,
              fontFamily: "var(--font-gothic)",
              letterSpacing: 2,
              align: "center"
            })
          });
          title.anchor.set(0.5, 0);
          title.position.set(CARD_WIDTH / 2, 16);
          graphics.addChild(title);

          const sigil = new Graphics();
          sigil.circle(CARD_WIDTH / 2, CARD_HEIGHT / 2, 38);
          sigil.stroke({ color: palette.foreground, width: 2, alpha: 0.9 });
          sigil.moveTo(CARD_WIDTH / 2, CARD_HEIGHT / 2 - 24);
          sigil.lineTo(CARD_WIDTH / 2, CARD_HEIGHT / 2 + 24);
          sigil.moveTo(CARD_WIDTH / 2 - 20, CARD_HEIGHT / 2);
          sigil.lineTo(CARD_WIDTH / 2 + 20, CARD_HEIGHT / 2);
          sigil.stroke({ color: palette.accent, width: 1, alpha: 0.8 });
          graphics.addChild(sigil);

          const subtitle = new Text({
            text: card.subtitle,
            style: new TextStyle({
              fill: palette.accent,
              fontSize: 10,
              fontFamily: "var(--font-body)",
              align: "center"
            })
          });
          subtitle.anchor.set(0.5, 1);
          subtitle.position.set(CARD_WIDTH / 2, CARD_HEIGHT - 18);
          graphics.addChild(subtitle);
        } else {
          const back = new Text({
            text: "ASTRO",
            style: new TextStyle({
              fill: palette.background,
              fontSize: 16,
              fontFamily: "var(--font-gothic)",
              letterSpacing: 4,
              align: "center"
            })
          });
          back.anchor.set(0.5, 0.5);
          back.position.set(CARD_WIDTH / 2, CARD_HEIGHT / 2);
          graphics.addChild(back);
        }

        return app?.renderer.generateTexture(graphics) ?? null;
      };

      const cardSprites = cardData.map((card, index) => {
        const texture = makeCardTexture(card, true);
        const sprite = new Sprite(texture ?? pixi.Texture.WHITE);
        sprite.anchor.set(0.5);
        sprite.x = 140 + index * 220;
        sprite.y = 220;
        sprite.scale.set(1.1);
        sprite.alpha = 0;
        cardContainer.addChild(sprite);
        return { card, sprite };
      });

      const gsapModule = await import("gsap");
      const timeline = gsapModule.gsap.timeline();

      timeline.to(cardSprites.map((item) => item.sprite), {
        y: 180,
        alpha: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      });

      cardSprites.forEach((item, index) => {
        timeline.to(
          item.sprite.scale,
          {
            x: 0,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
              const face = makeCardTexture(item.card, false);
              if (face) item.sprite.texture = face;
            }
          },
          ">0.2"
        );
        timeline.to(
          item.sprite.scale,
          {
            x: 1.1,
            duration: 0.35,
            ease: "back.out(1.8)"
          },
          ">"
        );
        timeline.to(
          item.sprite,
          {
            y: 170,
            duration: 0.4,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut"
          },
          ">"
        );
        if (index < cardSprites.length - 1) {
          timeline.to({}, { duration: 0.2 });
        }
      });

      if (running) {
        timeline.restart();
      }
    };

    setup();

    return () => {
      dispose = true;
      if (app) {
        app.destroy(true, { children: true });
      }
    };
  }, [cardData, running]);

  return (
    <div className="tarot-stage">
      <div ref={containerRef} className="canvas-shell" />
      <div className="fallback">
        {cardData.map((card) => (
          <div key={card.id}>
            <h4>{card.title}</h4>
            <p>{card.keywords.join(", ")}</p>
            <p>{card.lore}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
