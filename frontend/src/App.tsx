import { useState } from "react";
import "./App.css";
import { Architecture } from "./components/Architecture";
import { Benefits } from "./components/Benefits";
import { CartDrawer } from "./components/CartDrawer";
import { Catalog } from "./components/Catalog";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { SiteFooter } from "./components/SiteFooter";
import { useGames } from "./hooks/useGames";
import type { Game } from "./types/game";

function App() {
  const { games, isLoading, error, reload } = useGames();
  const [cart, setCart] = useState<Game[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const addToCart = (game: Game) =>
    setCart((items) =>
      items.some((item) => item.id === game.id) ? items : [...items, game],
    );
  const buyFeaturedGame = (game: Game) => {
    addToCart(game);
    setCartOpen(true);
  };

  return (
    <main>
      <Header cartCount={cart.length} onOpenCart={() => setCartOpen(true)} />
      <Hero featuredGame={games[0]} onBuy={buyFeaturedGame} />
      <Benefits />
      <Catalog
        games={games}
        cart={cart}
        isLoading={isLoading}
        error={error}
        onAdd={addToCart}
        onRetry={reload}
      />
      <Architecture />
      <SiteFooter />
      <CartDrawer
        cart={cart}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onRemove={(id) =>
          setCart((items) => items.filter((item) => item.id !== id))
        }
      />
    </main>
  );
}

export default App;
