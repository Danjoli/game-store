import { useMemo, useState } from "react";
import {
  ArrowRight,
  Gamepad2,
  Headphones,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import "./App.css";

type Game = {
  id: number;
  title: string;
  first: string;
  second: string;
  studio: string;
  category: string;
  rating: number;
  price: number;
  oldPrice?: number;
  label?: string;
  art: string;
};

const games: Game[] = [
  {
    id: 1,
    title: "Neon Horizon",
    first: "Neon",
    second: "Horizon",
    studio: "Black Arc Studio",
    category: "Ação",
    rating: 4.9,
    price: 149.9,
    oldPrice: 249.9,
    label: "-40%",
    art: "neon",
  },
  {
    id: 2,
    title: "Ashen Crown",
    first: "Ashen",
    second: "Crown",
    studio: "Northfall Games",
    category: "RPG",
    rating: 4.8,
    price: 189.9,
    label: "NOVO",
    art: "ashen",
  },
  {
    id: 3,
    title: "Velocity Zero",
    first: "Velocity",
    second: "Zero",
    studio: "Redline Works",
    category: "Corrida",
    rating: 4.7,
    price: 99.9,
    oldPrice: 199.9,
    label: "-50%",
    art: "velocity",
  },
  {
    id: 4,
    title: "Shadow Protocol",
    first: "Shadow",
    second: "Protocol",
    studio: "Cipher Interactive",
    category: "Estratégia",
    rating: 4.6,
    price: 79.9,
    art: "shadow",
  },
  {
    id: 5,
    title: "Wild Orbit",
    first: "Wild",
    second: "Orbit",
    studio: "Nova Forge",
    category: "Aventura",
    rating: 4.8,
    price: 129.9,
    label: "DESTAQUE",
    art: "orbit",
  },
  {
    id: 6,
    title: "Final Sector",
    first: "Final",
    second: "Sector",
    studio: "Iron Fox",
    category: "Ação",
    rating: 4.5,
    price: 59.9,
    oldPrice: 119.9,
    label: "-50%",
    art: "sector",
  },
];

const categories = [
  "Todos",
  "Ação",
  "RPG",
  "Aventura",
  "Estratégia",
  "Corrida",
];
const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function Brand() {
  return (
    <a href="#inicio" className="brand" aria-label="Game Store — início">
      <i>
        <Gamepad2 />
      </i>
      <b>
        GAME<span>STORE</span>
      </b>
    </a>
  );
}

function App() {
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Game[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const filtered = useMemo(
    () =>
      games.filter((game) => {
        const term = query.trim().toLocaleLowerCase("pt-BR");
        return (
          (category === "Todos" || game.category === category) &&
          (!term ||
            `${game.title} ${game.studio} ${game.category}`
              .toLocaleLowerCase("pt-BR")
              .includes(term))
        );
      }),
    [category, query],
  );
  const addToCart = (game: Game) =>
    setCart((items) =>
      items.some((item) => item.id === game.id) ? items : [...items, game],
    );

  return (
    <main>
      <header className="header">
        <Brand />
        <nav className="desktop-nav" aria-label="Navegação principal">
          <a className="active" href="#inicio">
            Início
          </a>
          <a href="#catalogo">Loja</a>
          <a href="#ofertas">Ofertas</a>
          <a href="#arquitetura">Tecnologia</a>
        </nav>
        <div className="header-actions">
          <button
            className="menu-button"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
          <button
            className="cart-button"
            aria-label={`Carrinho com ${cart.length} itens`}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag />
            <span>Carrinho</span>
            <b>{cart.length}</b>
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-nav">
            {["Início", "Loja", "Ofertas", "Tecnologia"].map((item, index) => (
              <a
                key={item}
                href={
                  ["#inicio", "#catalogo", "#ofertas", "#arquitetura"][index]
                }
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </nav>
        )}
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles /> Lançamento da semana
          </span>
          <p className="kicker">BLACK ARC STUDIO APRESENTA</p>
          <h1>
            NEON
            <br />
            <em>HORIZON</em>
          </h1>
          <p className="description">
            Sobreviva à cidade que nunca dorme. Explore um mundo aberto
            cyberpunk onde cada decisão altera o seu destino.
          </p>
          <div className="hero-meta">
            <span>
              <Star fill="currentColor" />
              4.9
            </span>
            <span>RPG DE AÇÃO</span>
            <span>18+</span>
          </div>
          <div className="hero-cta">
            <button
              onClick={() => {
                addToCart(games[0]);
                setCartOpen(true);
              }}
            >
              Comprar agora <ArrowRight />
            </button>
            <div>
              <small>POR APENAS</small>
              <strong>{money.format(149.9)}</strong>
            </div>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-shade" />
          <span>WELCOME TO THE EDGE</span>
          <code>
            GS — 001
            <br />
            NIGHT CITY
            <br />
            2089
          </code>
        </div>
      </section>

      <section className="benefits" aria-label="Benefícios">
        <div>
          <Zap />
          <span>
            <b>Entrega instantânea</b>
            <small>Receba sua key na hora</small>
          </span>
        </div>
        <div>
          <ShieldCheck />
          <span>
            <b>Compra protegida</b>
            <small>Pagamento 100% seguro</small>
          </span>
        </div>
        <div>
          <Headphones />
          <span>
            <b>Suporte gamer</b>
            <small>Atendimento todos os dias</small>
          </span>
        </div>
      </section>

      <section className="catalog" id="catalogo">
        <div className="section-title">
          <div>
            <p>EXPLORE O CATÁLOGO</p>
            <h2>
              JOGOS EM <em>DESTAQUE</em>
            </h2>
          </div>
          <a href="#ofertas">
            Ver todos <ArrowRight />
          </a>
        </div>
        <div className="tools">
          <div
            className="filters"
            role="group"
            aria-label="Filtrar por categoria"
          >
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "selected" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="search">
            <Search />
            <input
              placeholder="Buscar jogos..."
              aria-label="Buscar jogos"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
        {filtered.length ? (
          <div className="game-grid" id="ofertas">
            {filtered.map((game) => {
              const added = cart.some((item) => item.id === game.id);
              return (
                <article className="game-card" key={game.id}>
                  <div className={`game-art ${game.art}`}>
                    {game.label && <span className="label">{game.label}</span>}
                    <button
                      className={`quick ${added ? "added" : ""}`}
                      aria-label={`Adicionar ${game.title} ao carrinho`}
                      onClick={() => addToCart(game)}
                    >
                      <ShoppingBag />
                    </button>
                    <div className="cover-title">
                      <span>{game.first}</span>
                      <b>{game.second}</b>
                    </div>
                  </div>
                  <div className="game-info">
                    <div>
                      <span>{game.category}</span>
                      <span>
                        <Star fill="currentColor" />
                        {game.rating}
                      </span>
                    </div>
                    <h3>{game.title}</h3>
                    <p>{game.studio}</p>
                    <footer>
                      {game.oldPrice && (
                        <del>{money.format(game.oldPrice)}</del>
                      )}
                      <strong>{money.format(game.price)}</strong>
                    </footer>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="no-results">
            <Search />
            <h3>Nenhum jogo encontrado</h3>
            <p>Tente buscar por outro título ou categoria.</p>
          </div>
        )}
      </section>

      <section className="stack" id="arquitetura">
        <div className="stack-copy">
          <p>PROJETO FULL-STACK</p>
          <h2>
            UMA LOJA.
            <br />
            <em>DUAS CAMADAS.</em>
          </h2>
          <span>
            Frontend e backend independentes, conectados por uma API REST
            documentada e prontos para evoluir separadamente.
          </span>
        </div>
        <div className="flow">
          <div>
            <small>FRONTEND</small>
            <b>React + TypeScript</b>
            <span>Interface reativa e tipada</span>
          </div>
          <ArrowRight />
          <div className="api">
            <small>CONTRATO</small>
            <b>REST API</b>
            <span>JSON · Sanctum · OpenAPI</span>
          </div>
          <ArrowRight />
          <div>
            <small>BACKEND</small>
            <b>Laravel + PostgreSQL</b>
            <span>Regras, dados e segurança</span>
          </div>
        </div>
      </section>
      <footer className="site-footer">
        <Brand />
        <p>
          Projeto de portfólio · Laravel REST API + React + TypeScript +
          PostgreSQL
        </p>
        <span>© 2026 GAME STORE</span>
      </footer>

      {cartOpen && (
        <div className="cart-overlay" onMouseDown={() => setCartOpen(false)}>
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
              <button
                aria-label="Fechar carrinho"
                onClick={() => setCartOpen(false)}
              >
                <X />
              </button>
            </header>
            <div className="cart-list">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <ShoppingBag />
                  <span>Seu carrinho está vazio.</span>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      document
                        .querySelector("#catalogo")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Explorar jogos
                  </button>
                </div>
              ) : (
                cart.map((game) => (
                  <div className="cart-item" key={game.id}>
                    <div className={`mini-art ${game.art}`} />
                    <div>
                      <strong>{game.title}</strong>
                      <span>{money.format(game.price)}</span>
                    </div>
                    <button
                      aria-label={`Remover ${game.title}`}
                      onClick={() =>
                        setCart((items) =>
                          items.filter((item) => item.id !== game.id),
                        )
                      }
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
                    {money.format(
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
      )}
    </main>
  );
}

export default App;
