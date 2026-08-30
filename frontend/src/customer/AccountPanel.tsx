import { useState } from "react";
import { LogOut, MapPin, Package, Settings, UserRound, X } from "lucide-react";
import { formatCurrency } from "../utils/currency";
import { createAddress, deleteAddress, forgotPassword, getAddresses, updatePassword, updateProfile } from "./customerApi";
import type { Address, AddressPayload, Customer, Order } from "./types";

type Props = {
  open: boolean; user: Customer | null; orders: Order[]; error: string;
  onClose: () => void; onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (name: string, email: string, password: string) => Promise<void>;
  onLogout: () => void;
  token: string; addresses: Address[]; onUserChange: (user: Customer) => void; onAddressesChange: (addresses: Address[]) => void;
};
const labels = { paid: "Pago", processing: "Em processamento", completed: "Concluído", cancelled: "Cancelado" };

export function AccountPanel({ open, user, orders, error, onClose, onLogin, onRegister, onLogout, token, addresses, onUserChange, onAddressesChange }: Props) {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [profileTab, setProfileTab] = useState<"orders" | "settings" | "addresses">("orders");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  if (!open) return null;
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true);
    try { if (mode === "login") await onLogin(email, password); else if (mode === "register") await onRegister(name, email, password); else { const response = await forgotPassword(email); setMessage(response.message); } } finally { setBusy(false); }
  };
  return <div className="account-overlay" onMouseDown={onClose}>
    <section className="account-panel" onMouseDown={(e) => e.stopPropagation()}>
      <header><div><small>MINHA CONTA</small><h2>{user ? `Olá, ${user.name}` : "Entre na Game Store"}</h2></div><button onClick={onClose} aria-label="Fechar"><X /></button></header>
      {!user ? <>
        <div className="account-tabs"><button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Entrar</button><button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Criar conta</button></div>
        <form className="account-form" onSubmit={submit}>
          {mode === "register" && <label>Nome<input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} /></label>}
          <label>E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          {mode !== "forgot" && <label>Senha<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} /></label>}
          {mode === "login" && <button type="button" className="forgot-link" onClick={() => setMode("forgot")}>Esqueci minha senha</button>}
          {mode === "forgot" && <button type="button" className="forgot-link" onClick={() => setMode("login")}>Voltar ao login</button>}
          {error && <p className="account-error">{error}</p>}
          {message && <p className="account-message">{message}</p>}
          <button className="account-primary" disabled={busy}>{busy ? "Aguarde..." : mode === "login" ? "Entrar" : mode === "register" ? "Criar minha conta" : "Enviar link"}</button>
        </form>
      </> : <div className="profile-content">
        <div className="profile-card"><UserRound /><div><strong>{user.name}</strong><span>{user.email}</span></div><button onClick={onLogout}><LogOut /> Sair</button></div>
        <div className="profile-tabs"><button className={profileTab === "orders" ? "active" : ""} onClick={() => setProfileTab("orders")}><Package />Pedidos</button><button className={profileTab === "addresses" ? "active" : ""} onClick={() => setProfileTab("addresses")}><MapPin />Endereços</button><button className={profileTab === "settings" ? "active" : ""} onClick={() => setProfileTab("settings")}><Settings />Dados</button></div>
        {profileTab === "orders" && (orders.length === 0 ? <p className="empty-orders">Você ainda não realizou nenhum pedido.</p> : orders.map((order) => <article className="customer-order" key={order.id}>
          <header><div><strong>Pedido #{order.id}</strong><span>{new Date(order.createdAt).toLocaleDateString("pt-BR")}</span></div><b className={`status-${order.status}`}>{labels[order.status]}</b></header>
          {order.items.map((item) => <div className="order-line" key={item.id}><span>{item.quantity}× {item.title}</span><strong>{formatCurrency(item.subtotal)}</strong></div>)}
          <footer><span>{order.paymentMethod === "pix" ? "PIX" : "Cartão de crédito"}</span><strong>{formatCurrency(order.total)}</strong></footer>
        </article>))}
        {profileTab === "settings" && <SettingsForm token={token} user={user} onUserChange={onUserChange} />}
        {profileTab === "addresses" && <Addresses token={token} addresses={addresses} onChange={onAddressesChange} />}
      </div>}
    </section>
  </div>;
}

function SettingsForm({ token, user, onUserChange }: { token: string; user: Customer; onUserChange: (user: Customer) => void }) {
  const [name, setName] = useState(user.name); const [email, setEmail] = useState(user.email); const [current, setCurrent] = useState(""); const [next, setNext] = useState(""); const [message, setMessage] = useState("");
  return <div className="settings-stack"><form className="account-form" onSubmit={(e) => { e.preventDefault(); void updateProfile(token, name, email).then((updated) => { onUserChange(updated); setMessage("Dados atualizados."); }); }}><h3>Dados pessoais</h3><label>Nome<input value={name} onChange={(e) => setName(e.target.value)} /></label><label>E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label><button className="account-primary">Salvar dados</button></form><form className="account-form" onSubmit={(e) => { e.preventDefault(); void updatePassword(token, current, next).then(() => { setCurrent(""); setNext(""); setMessage("Senha atualizada."); }); }}><h3>Alterar senha</h3><label>Senha atual<input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required /></label><label>Nova senha<input type="password" minLength={8} value={next} onChange={(e) => setNext(e.target.value)} required /></label><button className="account-primary">Atualizar senha</button></form>{message && <p className="account-message">{message}</p>}</div>;
}

function Addresses({ token, addresses, onChange }: { token: string; addresses: Address[]; onChange: (addresses: Address[]) => void }) {
  const empty: AddressPayload = { label: "Casa", recipient_name: "", postal_code: "", address: "", city: "", state: "" }; const [form, setForm] = useState(empty); const field = (key: keyof AddressPayload, value: string) => setForm((current) => ({ ...current, [key]: value })); const refresh = () => getAddresses(token).then(onChange);
  return <div className="address-section"><form className="account-form" onSubmit={(e) => { e.preventDefault(); void createAddress(token, form).then(() => { setForm(empty); return refresh(); }); }}><h3>Novo endereço</h3><div className="form-pair"><label>Identificação<input value={form.label} onChange={(e) => field("label", e.target.value)} required /></label><label>CEP<input value={form.postal_code} onChange={(e) => field("postal_code", e.target.value)} required /></label></div><label>Destinatário<input value={form.recipient_name} onChange={(e) => field("recipient_name", e.target.value)} required /></label><label>Endereço<input value={form.address} onChange={(e) => field("address", e.target.value)} required /></label><div className="form-pair"><label>Cidade<input value={form.city} onChange={(e) => field("city", e.target.value)} required /></label><label>UF<input maxLength={2} value={form.state} onChange={(e) => field("state", e.target.value.toUpperCase())} required /></label></div><button className="account-primary">Salvar endereço</button></form><div className="address-list">{addresses.map((address) => <article key={address.id}><MapPin /><div><strong>{address.label} {address.isDefault && <small>PADRÃO</small>}</strong><span>{address.address} — {address.city}/{address.state}</span></div><button onClick={() => void deleteAddress(token, address.id).then(refresh)}>Excluir</button></article>)}</div></div>;
}
