import { Link } from "react-router-dom";

export function NotFoundPage() { return <main className="fatal-error"><h1>Página não encontrada</h1><p>O endereço informado não existe.</p><Link to="/">Voltar à loja</Link></main>; }
