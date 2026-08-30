import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Brand } from "../components/Brand";
import { resetPassword } from "./customerApi";

export function ResetPasswordPage() {
  const [params] = useSearchParams(); const [password, setPassword] = useState(""); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  const email = params.get("email") ?? ""; const token = params.get("token") ?? "";
  return <main className="reset-page"><div className="reset-card"><Brand /><small>RECUPERAÇÃO DE CONTA</small><h1>Crie uma nova senha</h1><form className="account-form" onSubmit={(event) => { event.preventDefault(); setError(""); void resetPassword(email, token, password).then(() => setMessage("Senha redefinida. Você já pode entrar na loja.")).catch(() => setError("O link é inválido ou expirou.")); }}><label>E-mail<input value={email} readOnly /></label><label>Nova senha<input type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required /></label>{error && <p className="account-error">{error}</p>}{message && <p className="account-message">{message}</p>}<button className="account-primary">Redefinir senha</button></form><Link to="/">Voltar para a loja</Link></div></main>;
}
