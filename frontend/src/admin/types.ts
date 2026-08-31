export type AdminUser = {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
};
export type AdminCustomer = AdminUser & { ordersCount?: number };
export type AdminCoupon = { id: number; code: string; type: "percentage" | "fixed"; value: string; minimum_total: string; usage_limit: number | null; times_used: number; active: boolean };
export type DashboardStats = {
  users: number;
  games: number;
  categories: number;
  activeCarts: number;
  cartItems: number;
  orders: number;
  revenue: number;
};

export type AdminOrder = {
  id: number; status: "pending" | "paid" | "processing" | "completed" | "cancelled" | "refunded";
  total: number; paymentMethod: string; recipientName: string; createdAt: string;
  customer: AdminUser; items: { id: number; title: string; quantity: number; subtotal: number }[];
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
  stock: number | null;
  available: boolean;
  active: boolean;
  downloadUrl?: string | null;
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
  stock?: number | null;
  download_url?: string | null;
  active?: boolean;
};
