import { useCallback, useEffect, useState } from "react";
import {
  Boxes,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  ShoppingCart,
  Tags,
  Users,
} from "lucide-react";
import {
  createCategory,
  createGame,
  deleteCategory,
  deleteGame,
  getAdminCategories,
  getAdminGames,
  getDashboard,
  getMe,
  logout,
  updateCategory,
  updateGame,
} from "./adminApi";
import { LoginPanel } from "./LoginPanel";
import type {
  AdminCategory,
  AdminGame,
  AdminUser,
  DashboardStats,
  GamePayload,
} from "./types";
import "./admin.css";

type Tab = "dashboard" | "games" | "categories";
const emptyGame = (categoryId = 0): GamePayload => ({
  category_id: categoryId,
  title: "",
  studio: "",
  description: "",
  price: 0,
  old_price: null,
  rating: 4.5,
  label: null,
  art: "neon",
  cover_image: "/covers/neon-horizon.png",
  featured: false,
});

export function AdminApp() {
  const [token, setToken] = useState(
    () => localStorage.getItem("admin_token") ?? "",
  );
  const [user, setUser] = useState<AdminUser | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [games, setGames] = useState<AdminGame[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");

  const load = useCallback(async (accessToken: string) => {
    setLoading(true);
    setError("");
    try {
      const currentUser = await getMe(accessToken);
      if (!currentUser.isAdmin)
        throw new Error("Acesso administrativo não autorizado.");
      const [dashboard, gameList, categoryList] = await Promise.all([
        getDashboard(accessToken),
        getAdminGames(accessToken),
        getAdminCategories(accessToken),
      ]);
      setUser(currentUser);
      setStats(dashboard);
      setGames(gameList);
      setCategories(categoryList);
    } catch (reason) {
      localStorage.removeItem("admin_token");
      setToken("");
      setUser(null);
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível carregar o painel.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const timeoutId = window.setTimeout(() => void load(token), 0);

    return () => window.clearTimeout(timeoutId);
  }, [load, token]);
  const signedIn = (accessToken: string) => {
    localStorage.setItem("admin_token", accessToken);
    setToken(accessToken);
  };
  const signOut = async () => {
    try {
      await logout(token);
    } finally {
      localStorage.removeItem("admin_token");
      setToken("");
      setUser(null);
    }
  };
  const refresh = () => load(token);

  if (!token) return <LoginPanel onLogin={signedIn} />;
  if (loading && !user)
    return <main className="admin-loading">Carregando painel...</main>;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/">
          <i>
            <Gamepad2 />
          </i>
          <b>
            GAME<span>STORE</span>
          </b>
        </a>
        <nav>
          <button
            className={tab === "dashboard" ? "active" : ""}
            onClick={() => setTab("dashboard")}
          >
            <LayoutDashboard />
            Visão geral
          </button>
          <button
            className={tab === "games" ? "active" : ""}
            onClick={() => setTab("games")}
          >
            <Boxes />
            Jogos
          </button>
          <button
            className={tab === "categories" ? "active" : ""}
            onClick={() => setTab("categories")}
          >
            <Tags />
            Categorias
          </button>
        </nav>
        <div className="admin-user">
          <span>{user?.name}</span>
          <small>{user?.email}</small>
          <button onClick={signOut}>
            <LogOut />
            Sair
          </button>
        </div>
      </aside>
      <main className="admin-content">
        <header>
          <div>
            <small>PAINEL ADMINISTRATIVO</small>
            <h1>
              {tab === "dashboard"
                ? "Visão geral"
                : tab === "games"
                  ? "Jogos"
                  : "Categorias"}
            </h1>
          </div>
          <a href="/">Ver loja</a>
        </header>
        {error && <div className="admin-error">{error}</div>}
        {tab === "dashboard" && <Dashboard stats={stats} />}
        {tab === "games" && (
          <GamesPanel
            token={token}
            games={games}
            categories={categories}
            onChange={refresh}
          />
        )}
        {tab === "categories" && (
          <CategoriesPanel
            token={token}
            categories={categories}
            onChange={refresh}
          />
        )}
      </main>
    </div>
  );
}

function Dashboard({ stats }: { stats: DashboardStats | null }) {
  const cards = [
    { label: "Usuários", value: stats?.users, icon: Users },
    { label: "Jogos", value: stats?.games, icon: Gamepad2 },
    { label: "Categorias", value: stats?.categories, icon: Tags },
    {
      label: "Carrinhos ativos",
      value: stats?.activeCarts,
      icon: ShoppingCart,
    },
    { label: "Itens em carrinhos", value: stats?.cartItems, icon: Boxes },
  ];
  return (
    <section className="stat-grid">
      {cards.map(({ label, value, icon: Icon }) => (
        <article key={label}>
          <Icon />
          <span>{label}</span>
          <strong>{value ?? "—"}</strong>
        </article>
      ))}
    </section>
  );
}

function CategoriesPanel({
  token,
  categories,
  onChange,
}: {
  token: string;
  categories: AdminCategory[];
  onChange: () => void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const add = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createCategory(token, name);
      setName("");
      onChange();
    } catch {
      setError("Não foi possível criar a categoria.");
    }
  };
  const rename = async (category: AdminCategory) => {
    const next = window.prompt("Novo nome da categoria", category.name);
    if (!next || next === category.name) return;
    try {
      await updateCategory(token, category.id, next);
      onChange();
    } catch {
      setError("Não foi possível renomear a categoria.");
    }
  };
  const remove = async (category: AdminCategory) => {
    if (!window.confirm(`Excluir ${category.name}?`)) return;
    try {
      await deleteCategory(token, category.id);
      onChange();
    } catch {
      setError("Remova ou transfira os jogos antes de excluir esta categoria.");
    }
  };
  return (
    <section>
      <form className="admin-inline-form" onSubmit={add}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nova categoria"
          required
        />
        <button>Adicionar</button>
      </form>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-table">
        <div className="admin-row admin-head">
          <span>Nome</span>
          <span>Slug</span>
          <span>Jogos</span>
          <span>Ações</span>
        </div>
        {categories.map((category) => (
          <div className="admin-row" key={category.id}>
            <strong>{category.name}</strong>
            <code>{category.slug}</code>
            <span>{category.gamesCount}</span>
            <div>
              <button onClick={() => rename(category)}>Editar</button>
              <button className="danger" onClick={() => remove(category)}>
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function GamesPanel({
  token,
  games,
  categories,
  onChange,
}: {
  token: string;
  games: AdminGame[];
  categories: AdminCategory[];
  onChange: () => void;
}) {
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<GamePayload>(() =>
    emptyGame(categories[0]?.id),
  );
  const [error, setError] = useState("");
  const select = (game: AdminGame) => {
    setEditing(game.id);
    setForm({
      category_id: game.categoryId,
      title: game.title,
      studio: game.studio,
      description: game.description,
      price: game.price,
      old_price: game.oldPrice,
      rating: game.rating,
      label: game.label,
      art: game.art,
      cover_image: game.image,
      featured: game.featured,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const reset = () => {
    setEditing(null);
    setForm(emptyGame(categories[0]?.id));
    setError("");
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (editing) await updateGame(token, editing, form);
      else await createGame(token, form);
      reset();
      onChange();
    } catch {
      setError(
        "Revise os campos. O título deve ser único e o preço anterior maior que o atual.",
      );
    }
  };
  const remove = async (game: AdminGame) => {
    if (!window.confirm(`Excluir ${game.title}?`)) return;
    await deleteGame(token, game.id);
    onChange();
  };
  const field = <K extends keyof GamePayload>(key: K, value: GamePayload[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  return (
    <section>
      <form className="game-form" onSubmit={save}>
        <div className="form-title">
          <h2>{editing ? "Editar jogo" : "Novo jogo"}</h2>
          {editing && (
            <button type="button" onClick={reset}>
              Cancelar
            </button>
          )}
        </div>
        {error && <div className="admin-error">{error}</div>}
        <div className="form-grid">
          <label>
            Título
            <input
              value={form.title}
              onChange={(e) => field("title", e.target.value)}
              required
            />
          </label>
          <label>
            Estúdio
            <input
              value={form.studio}
              onChange={(e) => field("studio", e.target.value)}
              required
            />
          </label>
          <label>
            Categoria
            <select
              value={form.category_id}
              onChange={(e) => field("category_id", Number(e.target.value))}
            >
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Estilo
            <select
              value={form.art}
              onChange={(e) => field("art", e.target.value)}
            >
              {["neon", "ashen", "velocity", "shadow", "orbit", "sector"].map(
                (art) => (
                  <option key={art}>{art}</option>
                ),
              )}
            </select>
          </label>
          <label>
            Preço
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => field("price", Number(e.target.value))}
            />
          </label>
          <label>
            Preço anterior
            <input
              type="number"
              step="0.01"
              value={form.old_price ?? ""}
              onChange={(e) =>
                field(
                  "old_price",
                  e.target.value ? Number(e.target.value) : null,
                )
              }
            />
          </label>
          <label>
            Avaliação
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={form.rating}
              onChange={(e) => field("rating", Number(e.target.value))}
            />
          </label>
          <label>
            Selo
            <input
              value={form.label ?? ""}
              onChange={(e) => field("label", e.target.value || null)}
            />
          </label>
          <label className="wide">
            Caminho da capa
            <input
              value={form.cover_image}
              onChange={(e) => field("cover_image", e.target.value)}
              required
            />
          </label>
          <label className="wide">
            Descrição
            <textarea
              value={form.description}
              onChange={(e) => field("description", e.target.value)}
              required
            />
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => field("featured", e.target.checked)}
            />
            Jogo em destaque
          </label>
        </div>
        <button className="primary">
          {editing ? "Salvar alterações" : "Criar jogo"}
        </button>
      </form>
      <div className="game-admin-grid">
        {games.map((game) => (
          <article key={game.id}>
            <img src={game.image} alt="" />
            <div>
              <small>{game.category}</small>
              <h3>{game.title}</h3>
              <p>{game.studio}</p>
              <strong>
                {game.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
              <footer>
                <button onClick={() => select(game)}>Editar</button>
                <button className="danger" onClick={() => remove(game)}>
                  Excluir
                </button>
              </footer>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
