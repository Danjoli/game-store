export type AdminUser = {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
};
export type DashboardStats = {
  users: number;
  games: number;
  categories: number;
  activeCarts: number;
  cartItems: number;
};
export type AdminCategory = {
  id: number;
  name: string;
  slug: string;
  gamesCount: number;
};
export type AdminGame = {
  id: number;
  title: string;
  slug: string;
  studio: string;
  description: string;
  category: string;
  categoryId: number;
  categorySlug: string;
  rating: number;
  price: number;
  oldPrice: number | null;
  label: string | null;
  art: string;
  image: string;
  featured: boolean;
};

export type GamePayload = {
  category_id: number;
  title: string;
  studio: string;
  description: string;
  price: number;
  old_price: number | null;
  rating: number;
  label: string | null;
  art: string;
  cover_image: string;
  featured: boolean;
};
