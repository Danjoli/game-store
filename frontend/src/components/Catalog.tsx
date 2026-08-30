import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { categories } from "../data/games";
import type { Game } from "../types/game";
import { GameCard } from "./GameCard";

type CatalogProps = {
  games: Game[];
  cart: Game[];
  isLoading: boolean;
  error: string | null;
  onAdd: (game: Game) => void;
  onRetry: () => void;
};

export function Catalog({
  games,
  cart,
  isLoading,
  error,
  onAdd,
  onRetry,
}: CatalogProps) {
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      games.filter((game) => {
        const term = query.trim().toLocaleLowerCase("pt-BR");
        return (
          (category === "Todos" || game.category === category) &&
          (!term ||
            `${game.title} ${game.studio} ${game.category}`
              .toLocaleLowerCase("pt-BR")
              .includes(term))
        );
      }),
    [category, games, query],
  );

  return (
    <section className="catalog" id="catalogo">
      <div className="section-title">
        <div>
          <p>EXPLORE O CATÁLOGO</p>
          <h2>
            JOGOS EM <em>DESTAQUE</em>
          </h2>
        </div>
        <a href="#ofertas">
          Ver todos <ArrowRight />
        </a>
      </div>
      <div className="tools">
        <div
          className="filters"
          role="group"
          aria-label="Filtrar por categoria"
        >
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "selected" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="search">
          <Search />
          <input
            placeholder="Buscar jogos..."
            aria-label="Buscar jogos"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      {isLoading ? (
        <div className="catalog-state" role="status">
          <span className="loader" />
          <p>Carregando catálogo...</p>
        </div>
      ) : error ? (
        <div className="catalog-state error-state" role="alert">
          <h3>Catálogo indisponível</h3>
          <p>{error}</p>
          <button onClick={onRetry}>Tentar novamente</button>
        </div>
      ) : filtered.length ? (
        <div className="game-grid" id="ofertas">
          {filtered.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              added={cart.some((item) => item.id === game.id)}
              onAdd={onAdd}
            />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <Search />
          <h3>Nenhum jogo encontrado</h3>
          <p>Tente buscar por outro título ou categoria.</p>
        </div>
      )}
    </section>
  );
}
