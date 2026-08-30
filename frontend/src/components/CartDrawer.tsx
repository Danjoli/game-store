import { ArrowRight, ShoppingBag, Trash2, X } from "lucide-react";
import type { CartItem } from "../customer/types";
import { formatCurrency } from "../utils/currency";

type CartDrawerProps = {
  cart: CartItem[];
  open: boolean;
  onClose: () => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
  onQuantity: (gameId: number, quantity: number) => void;
};

export function CartDrawer({ cart, open, onClose, onRemove, onCheckout, onQuantity }: CartDrawerProps) {
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
            cart.map((item) => (
              <div className="cart-item" key={item.game.id}>
                <div
                  className={`mini-art ${item.game.art}`}
                  style={{ backgroundImage: `url(${item.game.image})` }}
                />
                <div>
                  <strong>{item.game.title}</strong>
                  <span>{formatCurrency(item.subtotal)}</span>
                  <div className="cart-quantity"><button onClick={() => onQuantity(item.game.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button><b>{item.quantity}</b><button onClick={() => onQuantity(item.game.id, item.quantity + 1)} disabled={item.quantity >= 99}>+</button></div>
                </div>
                <button
                  aria-label={`Remover ${item.game.title}`}
                  onClick={() => onRemove(item.game.id)}
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
                  cart.reduce((total, item) => total + item.subtotal, 0),
                )}
              </strong>
            </div>
            <button onClick={onCheckout}>
              Finalizar compra <ArrowRight />
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
