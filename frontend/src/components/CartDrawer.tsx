import { ArrowRight, ShoppingBag, Trash2, X } from "lucide-react";
import type { Game } from "../types/game";
import { formatCurrency } from "../utils/currency";

type CartDrawerProps = {
  cart: Game[];
  open: boolean;
  onClose: () => void;
  onRemove: (id: number) => void;
};

export function CartDrawer({ cart, open, onClose, onRemove }: CartDrawerProps) {
  if (!open) return null;
  const exploreGames = () => {
    onClose();
    document.querySelector("#catalogo")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="cart-overlay" onMouseDown={onClose}>
      <aside
        className="cart-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <small>SEU PEDIDO</small>
            <h2>Carrinho</h2>
          </div>
          <button aria-label="Fechar carrinho" onClick={onClose}>
            <X />
          </button>
        </header>
        <div className="cart-list">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag />
              <span>Seu carrinho está vazio.</span>
              <button onClick={exploreGames}>Explorar jogos</button>
            </div>
          ) : (
            cart.map((game) => (
              <div className="cart-item" key={game.id}>
                <div
                  className={`mini-art ${game.art}`}
                  style={{ backgroundImage: `url(${game.image})` }}
                />
                <div>
                  <strong>{game.title}</strong>
                  <span>{formatCurrency(game.price)}</span>
                </div>
                <button
                  aria-label={`Remover ${game.title}`}
                  onClick={() => onRemove(game.id)}
                >
                  <Trash2 />
                </button>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <footer className="cart-footer">
            <div>
              <span>Total</span>
              <strong>
                {formatCurrency(
                  cart.reduce((total, item) => total + item.price, 0),
                )}
              </strong>
            </div>
            <button>
              Finalizar compra <ArrowRight />
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
