import { useState } from "react";
import { CheckCircle2, CreditCard, X } from "lucide-react";
import { formatCurrency } from "../utils/currency";
import type { Address, CheckoutPayload } from "./types";

type Props = { open: boolean; total: number; addresses: Address[]; onClose: () => void; onSubmit: (payload: CheckoutPayload) => Promise<void> };
export function CheckoutPanel({ open, total, addresses, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CheckoutPayload>({ payment_method: "pix", recipient_name: "", postal_code: "", address: "", city: "", state: "", coupon_code: "" });
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [done, setDone] = useState(false);
  if (!open) return null;
  const field = (key: keyof CheckoutPayload, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setBusy(true); setError(""); try { await onSubmit(form); setDone(true); } catch { setError("Não foi possível concluir o pedido. Revise os dados."); } finally { setBusy(false); } };
  return <div className="account-overlay"><section className="account-panel checkout-panel">
    <header><div><small>CHECKOUT SEGURO</small><h2>Finalizar compra</h2></div><button onClick={onClose} aria-label="Fechar"><X /></button></header>
    {done ? <div className="checkout-success"><CheckCircle2 /><h3>Compra concluída!</h3><p>Seu pagamento foi aprovado e o pedido já aparece no seu perfil.</p><button className="account-primary" onClick={() => { setDone(false); onClose(); }}>Continuar</button></div> : <form className="account-form" onSubmit={submit}>
      <div className="checkout-total"><span>Total do pedido</span><strong>{formatCurrency(total)}</strong></div>
      {addresses.length > 0 && <label>Usar endereço salvo<select defaultValue="" onChange={(event) => { const saved = addresses.find((address) => address.id === Number(event.target.value)); if (saved) setForm((current) => ({ ...current, recipient_name: saved.recipientName, postal_code: saved.postalCode, address: saved.address, city: saved.city, state: saved.state })); }}><option value="">Preencher manualmente</option>{addresses.map((address) => <option key={address.id} value={address.id}>{address.label} — {address.address}</option>)}</select></label>}
      <label>Nome do destinatário<input value={form.recipient_name} onChange={(e) => field("recipient_name", e.target.value)} required /></label>
      <div className="form-pair"><label>CEP<input value={form.postal_code} onChange={(e) => field("postal_code", e.target.value)} required /></label><label>UF<input value={form.state} maxLength={2} onChange={(e) => field("state", e.target.value.toUpperCase())} required /></label></div>
      <label>Endereço completo<input value={form.address} onChange={(e) => field("address", e.target.value)} required /></label>
      <label>Cidade<input value={form.city} onChange={(e) => field("city", e.target.value)} required /></label>
      <label>Pagamento<select value={form.payment_method} onChange={(e) => field("payment_method", e.target.value)}><option value="pix">PIX</option><option value="credit_card">Cartão de crédito</option></select></label>
      <label>Cupom de desconto<input value={form.coupon_code ?? ""} onChange={(e) => field("coupon_code", e.target.value.toUpperCase())} placeholder="Opcional" /></label>
      {error && <p className="account-error">{error}</p>}<button className="account-primary" disabled={busy}><CreditCard /> {busy ? "Processando..." : "Confirmar pagamento"}</button>
    </form>}
  </section></div>;
}
