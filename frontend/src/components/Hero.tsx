import { ArrowRight, Sparkles, Star } from "lucide-react";
import type { Game } from "../types/game";
import { formatCurrency } from "../utils/currency";

type HeroProps = { featuredGame?: Game; onBuy: (game: Game) => void };

export function Hero({ featuredGame, onBuy }: HeroProps) {
  return (
    <section className="hero" id="inicio">
      <div className="hero-copy">
        <span className="eyebrow">
          <Sparkles /> Lançamento da semana
        </span>
        <p className="kicker">BLACK ARC STUDIO APRESENTA</p>
        <h1>
          NEON
          <br />
          <em>HORIZON</em>
        </h1>
        <p className="description">
          Sobreviva à cidade que nunca dorme. Explore um mundo aberto cyberpunk
          onde cada decisão altera o seu destino.
        </p>
        <div className="hero-meta">
          <span>
            <Star fill="currentColor" />
            4.9
          </span>
          <span>RPG DE AÇÃO</span>
          <span>18+</span>
        </div>
        <div className="hero-cta">
          <button
            disabled={!featuredGame}
            onClick={() => featuredGame && onBuy(featuredGame)}
          >
            Comprar agora <ArrowRight />
          </button>
          <div>
            <small>POR APENAS</small>
            <strong>{formatCurrency(featuredGame?.price ?? 149.9)}</strong>
          </div>
        </div>
      </div>
      <div className="hero-art">
        <div className="hero-shade" />
        <span>WELCOME TO THE EDGE</span>
        <code>
          GS — 001
          <br />
          NIGHT CITY
          <br />
          2089
        </code>
      </div>
    </section>
  );
}
