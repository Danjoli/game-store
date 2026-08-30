import { useState } from "react";
import { LogOut, Package, UserRound, X } from "lucide-react";
import { formatCurrency } from "../utils/currency";
import type { Customer, Order } from "./types";

type Props = {
  open: boolean; user: Customer | null; orders: Order[]; error: string;
  onClose: () => void; onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (name: string, email: string, password: string) => Promise<void>;
  onLogout: () => void;
};
const labels = { paid: "Pago", processing: "Em processamento", completed: "Concluído", cancelled: "Cancelado" };

export function AccountPanel({ open, user, orders, error, onClose, onLogin, onRegister, onLogout }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  if (!open) return null;
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true);
    try { if (mode === "login") await onLogin(email, password); else await onRegister(name, email, password); } finally { setBusy(false); }
  };
  return <div className="account-overlay" onMouseDown={onClose}>
    <section className="account-panel" onMouseDown={(e) => e.stopPropagation()}>
      <header><div><small>MINHA CONTA</small><h2>{user ? `Olá, ${user.name}` : "Entre na Game Store"}</h2></div><button onClick={onClose} aria-label="Fechar"><X /></button></header>
      {!user ? <>
        <div className="account-tabs"><button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Entrar</button><button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Criar conta</button></div>
        <form className="account-form" onSubmit={submit}>
          {mode === "register" && <label>Nome<input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} /></label>}
          <label>E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label>Senha<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} /></label>
          {error && <p className="account-error">{error}</p>}
          <button className="account-primary" disabled={busy}>{busy ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar minha conta"}</button>
        </form>
      </> : <div className="profile-content">
        <div className="profile-card"><UserRound /><div><strong>{user.name}</strong><span>{user.email}</span></div><button onClick={onLogout}><LogOut /> Sair</button></div>
        <h3><Package /> Meus pedidos</h3>
        {orders.length === 0 ? <p className="empty-orders">Você ainda não realizou nenhum pedido.</p> : orders.map((order) => <article className="customer-order" key={order.id}>
          <header><div><strong>Pedido #{order.id}</strong><span>{new Date(order.createdAt).toLocaleDateString("pt-BR")}</span></div><b className={`status-${order.status}`}>{labels[order.status]}</b></header>
          {order.items.map((item) => <div className="order-line" key={item.id}><span>{item.quantity}× {item.title}</span><strong>{formatCurrency(item.subtotal)}</strong></div>)}
          <footer><span>{order.paymentMethod === "pix" ? "PIX" : "Cartão de crédito"}</span><strong>{formatCurrency(order.total)}</strong></footer>
        </article>)}
      </div>}
    </section>
  </div>;
}
