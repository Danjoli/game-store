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
import { addCartItem, checkout, getAddresses, getCart, getMe, getOrders, login, logout, register, removeCartItem, updateCartItem } from "./customer/customerApi";
import type { Address, CartItem, CheckoutPayload, Customer, Order } from "./customer/types";

function App() {
  const { games, isLoading, error, reload } = useGames();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("customer_token") ?? "");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [authError, setAuthError] = useState("");
  useEffect(() => { if (!token) return; Promise.all([getMe(token), getCart(token), getOrders(token), getAddresses(token)]).then(([user, remoteCart, history, savedAddresses]) => { setCustomer(user); setCart(remoteCart.items); setOrders(history); setAddresses(savedAddresses); }).catch(() => { localStorage.removeItem("customer_token"); setToken(""); }); }, [token]);
  const addToCart = async (game: Game) => {
    if (game.available === false) return;
    if (token) { const next = await addCartItem(token, game.id); setCart(next.items); }
    else setCart((items) => items.some((item) => item.game.id === game.id) ? items.map((item) => item.game.id === game.id ? { ...item, quantity: item.quantity + 1, subtotal: item.subtotal + game.price } : item) : [...items, { id: -game.id, game, quantity: 1, unitPrice: game.price, subtotal: game.price }]);
  };
  const buyFeaturedGame = (game: Game) => {
    void addToCart(game);
    setCartOpen(true);
  };

  return (
    <main>
      <Header cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} customerName={customer?.name.split(" ")[0]} onOpenCart={() => setCartOpen(true)} onOpenAccount={() => setAccountOpen(true)} />
      <Hero featuredGame={games[0]} onBuy={buyFeaturedGame} />
      <Benefits />
      <Catalog
        games={games}
        cart={cart.map((item) => item.game)}
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
        onRemove={(id) => { if (token) void removeCartItem(token, id).then((next) => setCart(next.items)); else setCart((items) => items.filter((item) => item.game.id !== id)); }}
        onQuantity={(id, quantity) => { if (token) void updateCartItem(token, id, quantity).then((next) => setCart(next.items)); else setCart((items) => items.map((item) => item.game.id === id ? { ...item, quantity, subtotal: item.unitPrice * quantity } : item)); }}
        onCheckout={() => { setCartOpen(false); if (!customer) setAccountOpen(true); else setCheckoutOpen(true); }}
      />
      <AccountPanel open={accountOpen} user={customer} orders={orders} addresses={addresses} token={token} onUserChange={setCustomer} onAddressesChange={setAddresses} onOrdersChange={setOrders} error={authError} onClose={() => setAccountOpen(false)} onLogin={async (email, password) => { try { setAuthError(""); const result = await login(email, password); for (const item of cart) for (let count = 0; count < item.quantity; count += 1) await addCartItem(result.token, item.game.id); localStorage.setItem("customer_token", result.token); setToken(result.token); setCustomer(result.user); } catch { setAuthError("E-mail ou senha inválidos."); } }} onRegister={async (name, email, password) => { try { setAuthError(""); const result = await register(name, email, password); for (const item of cart) for (let count = 0; count < item.quantity; count += 1) await addCartItem(result.token, item.game.id); localStorage.setItem("customer_token", result.token); setToken(result.token); setCustomer(result.user); } catch { setAuthError("Não foi possível criar a conta. Verifique os dados."); } }} onLogout={() => { if (token) void logout(token); localStorage.removeItem("customer_token"); setToken(""); setCustomer(null); setOrders([]); setAddresses([]); setCart([]); }} />
      <CheckoutPanel open={checkoutOpen} addresses={addresses} total={cart.reduce((sum, item) => sum + item.subtotal, 0)} onClose={() => setCheckoutOpen(false)} onSubmit={async (payload: CheckoutPayload) => { const order = await checkout(token, payload); setOrders((current) => [order, ...current]); setCart([]); if (order.paymentUrl) window.location.assign(order.paymentUrl); }} />
    </main>
  );
}

export default App;
