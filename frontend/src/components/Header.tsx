import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { Brand } from "./Brand";

type HeaderProps = { cartCount: number; onOpenCart: () => void };
const links = [
  { label: "Início", href: "#inicio" },
  { label: "Loja", href: "#catalogo" },
  { label: "Ofertas", href: "#ofertas" },
  { label: "Tecnologia", href: "#arquitetura" },
];

export function Header({ cartCount, onOpenCart }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="header">
      <Brand />
      <nav className="desktop-nav" aria-label="Navegação principal">
        {links.map((link, index) => (
          <a
            className={index === 0 ? "active" : ""}
            href={link.href}
            key={link.href}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <button
          className="menu-button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        <button
          className="cart-button"
          aria-label={`Carrinho com ${cartCount} itens`}
          onClick={onOpenCart}
        >
          <ShoppingBag />
          <span>Carrinho</span>
          <b>{cartCount}</b>
        </button>
      </div>
      {menuOpen && (
        <nav className="mobile-nav">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
