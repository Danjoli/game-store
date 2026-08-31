import { useState } from "react";
import type { FormEvent } from "react";
import { Gamepad2, LockKeyhole } from "lucide-react";
import { login } from "./adminApi";

export function LoginPanel({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await login(email, password);
      if (!result.user.isAdmin)
        throw new Error("Esta conta não possui acesso administrativo.");
      onLogin(result.token);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Não foi possível entrar.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="admin-login">
      <form onSubmit={submit}>
        <div className="admin-mark">
          <Gamepad2 />
        </div>
        <small>GAME STORE</small>
        <h1>Painel administrativo</h1>
        <p>Gerencie jogos, categorias e acompanhe a operação.</p>
        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <div className="admin-error">{error}</div>}
        <button disabled={loading}>
          <LockKeyhole />
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <a href="/">Voltar para a loja</a>
      </form>
    </main>
  );
}
