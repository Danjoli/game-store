import axios from "axios";
import type {
  AdminCategory,
  AdminGame,
  AdminUser,
  AdminCustomer,
  AdminCoupon,
  DashboardStats,
  GamePayload,
  AdminOrder,
} from "./types";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000",
});
const auth = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export async function login(email: string, password: string) {
  const { data } = await api.post<{ user: AdminUser; token: string }>(
    "/api/login",
    { email, password, device_name: "admin-panel" },
  );
  return data;
}
export async function getMe(token: string) {
  return (await api.get<{ data: AdminUser }>("/api/me", auth(token))).data.data;
}
export async function logout(token: string) {
  await api.post("/api/logout", {}, auth(token));
}
export async function getDashboard(token: string) {
  return (
    await api.get<{ data: DashboardStats }>("/api/admin/dashboard", auth(token))
  ).data.data;
}
export async function getAdminCategories(token: string) {
  return (
    await api.get<{ data: AdminCategory[] }>(
      "/api/admin/categories",
      auth(token),
    )
  ).data.data;
}
export async function createCategory(token: string, name: string) {
  return (
    await api.post<{ data: AdminCategory }>(
      "/api/admin/categories",
      { name },
      auth(token),
    )
  ).data.data;
}
export async function updateCategory(token: string, id: number, name: string) {
  return (
    await api.put<{ data: AdminCategory }>(
      `/api/admin/categories/${id}`,
      { name },
      auth(token),
    )
  ).data.data;
}
export async function deleteCategory(token: string, id: number) {
  await api.delete(`/api/admin/categories/${id}`, auth(token));
}
export async function getAdminGames(token: string) {
  return (await api.get<{ data: AdminGame[] }>("/api/admin/games", auth(token)))
    .data.data;
}
export async function createGame(token: string, payload: GamePayload) {
  return (
    await api.post<{ data: AdminGame }>(
      "/api/admin/games",
      payload,
      auth(token),
    )
  ).data.data;
}
export async function updateGame(
  token: string,
  id: number,
  payload: GamePayload,
) {
  return (
    await api.put<{ data: AdminGame }>(
      `/api/admin/games/${id}`,
      payload,
      auth(token),
    )
  ).data.data;
}
export async function deleteGame(token: string, id: number) {
  await api.delete(`/api/admin/games/${id}`, auth(token));
}
export async function uploadCover(token: string, image: File) {
  const body = new FormData(); body.append("image", image);
  return (await api.post<{ data: { url: string } }>("/api/admin/uploads/covers", body, auth(token))).data.data.url;
}
export async function getAdminOrders(token: string) {
  return (await api.get<{ data: AdminOrder[] }>("/api/admin/orders", auth(token))).data.data;
}
export async function updateOrderStatus(token: string, id: number, status: AdminOrder["status"]) {
  return (await api.patch<{ data: AdminOrder }>(`/api/admin/orders/${id}/status`, { status }, auth(token))).data.data;
}
export async function refundOrder(token: string, id: number) { return (await api.post<{ data: AdminOrder }>(`/api/admin/orders/${id}/refund`, {}, auth(token))).data.data; }
export async function getAdminUsers(token: string) { return (await api.get<{ data: AdminCustomer[] }>("/api/admin/users", auth(token))).data.data; }
export async function updateAdminUser(token: string, id: number, payload: Partial<Pick<AdminCustomer, "isActive" | "isAdmin">>) { return (await api.patch<{ data: AdminCustomer }>(`/api/admin/users/${id}`, { is_active: payload.isActive, is_admin: payload.isAdmin }, auth(token))).data.data; }
export async function getAdminCoupons(token: string) { const result = await api.get<{ data: { data: AdminCoupon[] } }>("/api/admin/coupons", auth(token)); return result.data.data.data; }
export async function createAdminCoupon(token: string, payload: object) { await api.post("/api/admin/coupons", payload, auth(token)); }
export async function deleteAdminCoupon(token: string, id: number) { await api.delete(`/api/admin/coupons/${id}`, auth(token)); }
