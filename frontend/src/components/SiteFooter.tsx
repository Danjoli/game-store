import { Brand } from "./Brand";
import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Brand />
      <p>
        Projeto de portfólio · Laravel REST API + React + TypeScript +
        PostgreSQL
      </p>
      <span>© 2026 GAME STORE</span>
      <nav><Link to="/termos">Termos</Link><Link to="/privacidade">Privacidade</Link></nav>
    </footer>
  );
}
