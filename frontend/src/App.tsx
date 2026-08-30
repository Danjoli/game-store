import { useEffect, useState } from "react";
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
import { AccountPanel } from "./customer/AccountPanel";
import { CheckoutPanel } from "./customer/CheckoutPanel";
import { addCartItem, checkout, getCart, getMe, getOrders, login, logout, register, removeCartItem } from "./customer/customerApi";
import type { CheckoutPayload, Customer, Order } from "./customer/types";

function App() {
  const { games, isLoading, error, reload } = useGames();
  const [cart, setCart] = useState<Game[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("customer_token") ?? "");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [authError, setAuthError] = useState("");
  useEffect(() => { if (!token) return; Promise.all([getMe(token), getCart(token), getOrders(token)]).then(([user, remoteCart, history]) => { setCustomer(user); setCart(remoteCart.items.map((item) => item.game)); setOrders(history); }).catch(() => { localStorage.removeItem("customer_token"); setToken(""); }); }, [token]);
  const addToCart = async (game: Game) => {
    if (token) { const next = await addCartItem(token, game.id); setCart(next.items.map((item) => item.game)); }
    else setCart((items) => items.some((item) => item.id === game.id) ? items : [...items, game]);
  };
  const buyFeaturedGame = (game: Game) => {
    void addToCart(game);
    setCartOpen(true);
  };

  return (
    <main>
      <Header cartCount={cart.length} customerName={customer?.name.split(" ")[0]} onOpenCart={() => setCartOpen(true)} onOpenAccount={() => setAccountOpen(true)} />
      <Hero featuredGame={games[0]} onBuy={buyFeaturedGame} />
      <Benefits />
      <Catalog
        games={games}
        cart={cart}
        isLoading={isLoading}
        error={error}
        onAdd={(game) => void addToCart(game)}
        onRetry={reload}
      />
      <Architecture />
      <SiteFooter />
      <CartDrawer
        cart={cart}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onRemove={(id) => { if (token) void removeCartItem(token, id).then((next) => setCart(next.items.map((item) => item.game))); else setCart((items) => items.filter((item) => item.id !== id)); }}
        onCheckout={() => { setCartOpen(false); if (!customer) setAccountOpen(true); else setCheckoutOpen(true); }}
      />
      <AccountPanel open={accountOpen} user={customer} orders={orders} error={authError} onClose={() => setAccountOpen(false)} onLogin={async (email, password) => { try { setAuthError(""); const result = await login(email, password); for (const game of cart) await addCartItem(result.token, game.id); localStorage.setItem("customer_token", result.token); setToken(result.token); setCustomer(result.user); } catch { setAuthError("E-mail ou senha inválidos."); } }} onRegister={async (name, email, password) => { try { setAuthError(""); const result = await register(name, email, password); for (const game of cart) await addCartItem(result.token, game.id); localStorage.setItem("customer_token", result.token); setToken(result.token); setCustomer(result.user); } catch { setAuthError("Não foi possível criar a conta. Verifique os dados."); } }} onLogout={() => { if (token) void logout(token); localStorage.removeItem("customer_token"); setToken(""); setCustomer(null); setOrders([]); setCart([]); }} />
      <CheckoutPanel open={checkoutOpen} total={cart.reduce((sum, game) => sum + game.price, 0)} onClose={() => setCheckoutOpen(false)} onSubmit={async (payload: CheckoutPayload) => { const order = await checkout(token, payload); setOrders((current) => [order, ...current]); setCart([]); }} />
    </main>
  );
}

export default App;
