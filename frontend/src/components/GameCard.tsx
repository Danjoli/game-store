import { ShoppingBag, Star } from "lucide-react";
import type { Game } from "../types/game";
import { formatCurrency } from "../utils/currency";

type GameCardProps = {
  game: Game;
  added: boolean;
  onAdd: (game: Game) => void;
};

export function GameCard({ game, added, onAdd }: GameCardProps) {
  return (
    <article className="game-card">
      <div className={`game-art ${game.art}`}>
        <img className="game-cover" src={game.image} alt="" />
        {game.label && <span className="label">{game.label}</span>}
        <button
          className={`quick ${added ? "added" : ""}`}
          aria-label={game.available === false ? `${game.title} indisponível` : `Adicionar ${game.title} ao carrinho`}
          disabled={game.available === false}
          onClick={() => onAdd(game)}
        >
          <ShoppingBag />
        </button>
        <div className="cover-title">
          <span>{game.first}</span>
          <b>{game.second}</b>
        </div>
      </div>
      <div className="game-info">
        <div>
          <span>{game.category}</span>
          <span>
            <Star fill="currentColor" />
            {game.rating}
          </span>
        </div>
        <h3>{game.title}</h3>
        <p>{game.studio}</p>
        {game.available === false && <span className="out-of-stock">Indisponível</span>}
        <footer>
          {game.oldPrice && <del>{formatCurrency(game.oldPrice)}</del>}
          <strong>{formatCurrency(game.price)}</strong>
        </footer>
      </div>
    </article>
  );
}
