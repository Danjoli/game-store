import { useState } from "react";
import { CheckCircle2, CreditCard, X } from "lucide-react";
import { formatCurrency } from "../utils/currency";
import type { CheckoutPayload } from "./types";

type Props = { open: boolean; total: number; onClose: () => void; onSubmit: (payload: CheckoutPayload) => Promise<void> };
export function CheckoutPanel({ open, total, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CheckoutPayload>({ payment_method: "pix", recipient_name: "", postal_code: "", address: "", city: "", state: "" });
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [done, setDone] = useState(false);
  if (!open) return null;
  const field = (key: keyof CheckoutPayload, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setBusy(true); setError(""); try { await onSubmit(form); setDone(true); } catch { setError("Não foi possível concluir o pedido. Revise os dados."); } finally { setBusy(false); } };
  return <div className="account-overlay"><section className="account-panel checkout-panel">
    <header><div><small>CHECKOUT SEGURO</small><h2>Finalizar compra</h2></div><button onClick={onClose} aria-label="Fechar"><X /></button></header>
    {done ? <div className="checkout-success"><CheckCircle2 /><h3>Compra concluída!</h3><p>Seu pagamento foi aprovado e o pedido já aparece no seu perfil.</p><button className="account-primary" onClick={() => { setDone(false); onClose(); }}>Continuar</button></div> : <form className="account-form" onSubmit={submit}>
      <div className="checkout-total"><span>Total do pedido</span><strong>{formatCurrency(total)}</strong></div>
      <label>Nome do destinatário<input value={form.recipient_name} onChange={(e) => field("recipient_name", e.target.value)} required /></label>
      <div className="form-pair"><label>CEP<input value={form.postal_code} onChange={(e) => field("postal_code", e.target.value)} required /></label><label>UF<input value={form.state} maxLength={2} onChange={(e) => field("state", e.target.value.toUpperCase())} required /></label></div>
      <label>Endereço completo<input value={form.address} onChange={(e) => field("address", e.target.value)} required /></label>
      <label>Cidade<input value={form.city} onChange={(e) => field("city", e.target.value)} required /></label>
      <label>Pagamento<select value={form.payment_method} onChange={(e) => field("payment_method", e.target.value)}><option value="pix">PIX (aprovação imediata)</option><option value="credit_card">Cartão de crédito (simulado)</option></select></label>
      {error && <p className="account-error">{error}</p>}<button className="account-primary" disabled={busy}><CreditCard /> {busy ? "Processando..." : "Confirmar pagamento"}</button>
    </form>}
  </section></div>;
}
