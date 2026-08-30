import { Brand } from "./Brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Brand />
      <p>
        Projeto de portfólio · Laravel REST API + React + TypeScript +
        PostgreSQL
      </p>
      <span>© 2026 GAME STORE</span>
    </footer>
  );
}
