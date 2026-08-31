import axios from "axios";
import type { Address, AddressPayload, Cart, CheckoutPayload, Customer, Order } from "./types";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000" });
const auth = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });
const data = <T>(response: { data: { data: T } }) => response.data.data;

export async function login(email: string, password: string) {
  return (await api.post<{ user: Customer; token: string }>("/api/login", { email, password, device_name: "storefront" })).data;
}
export async function register(name: string, email: string, password: string) {
  return (await api.post<{ user: Customer; token: string }>("/api/register", { name, email, password, password_confirmation: password, device_name: "storefront" })).data;
}
export async function getMe(token: string) { return data<Customer>(await api.get("/api/me", auth(token))); }
export async function logout(token: string) { await api.post("/api/logout", {}, auth(token)); }
export async function getCart(token: string) { return data<Cart>(await api.get("/api/cart", auth(token))); }
export async function addCartItem(token: string, gameId: number) { return data<Cart>(await api.post("/api/cart/items", { game_id: gameId }, auth(token))); }
export async function removeCartItem(token: string, gameId: number) { return data<Cart>(await api.delete(`/api/cart/items/${gameId}`, auth(token))); }
export async function updateCartItem(token: string, gameId: number, quantity: number) { return data<Cart>(await api.put(`/api/cart/items/${gameId}`, { quantity }, auth(token))); }
export async function getOrders(token: string) { return data<Order[]>(await api.get("/api/orders", auth(token))); }
export async function checkout(token: string, payload: CheckoutPayload) { return data<Order>(await api.post("/api/orders", payload, auth(token))); }
export async function cancelOrder(token: string, id: number) { return data<Order>(await api.post(`/api/orders/${id}/cancel`, {}, auth(token))); }
export async function downloadOrderItem(token: string, orderId: number, itemId: number) { const response = await api.get(`/api/orders/${orderId}/items/${itemId}/download`, { ...auth(token), responseType: "blob" }); const url = URL.createObjectURL(response.data); window.open(url, "_blank", "noopener,noreferrer"); window.setTimeout(() => URL.revokeObjectURL(url), 60000); }
export async function updateProfile(token: string, name: string, email: string) { return data<Customer>(await api.put("/api/profile", { name, email }, auth(token))); }
export async function updatePassword(token: string, currentPassword: string, password: string) { await api.put("/api/profile/password", { current_password: currentPassword, password, password_confirmation: password }, auth(token)); }
export async function getAddresses(token: string) { return data<Address[]>(await api.get("/api/addresses", auth(token))); }
export async function createAddress(token: string, payload: AddressPayload) { return data<Address>(await api.post("/api/addresses", payload, auth(token))); }
export async function updateAddress(token: string, id: number, payload: AddressPayload) { return data<Address>(await api.put(`/api/addresses/${id}`, payload, auth(token))); }
export async function deleteAddress(token: string, id: number) { await api.delete(`/api/addresses/${id}`, auth(token)); }
export async function forgotPassword(email: string) { return (await api.post<{ message: string }>("/api/forgot-password", { email })).data; }
export async function resetPassword(email: string, token: string, password: string) { return (await api.post<{ message: string }>("/api/reset-password", { email, token, password, password_confirmation: password })).data; }
export async function exportProfile(token: string) { const response = await api.get("/api/profile/export", auth(token)); const url = URL.createObjectURL(new Blob([JSON.stringify(response.data, null, 2)], { type: "application/json" })); const link = document.createElement("a"); link.href = url; link.download = "game-store-dados.json"; link.click(); URL.revokeObjectURL(url); }
export async function deleteProfile(token: string, password: string) { await api.delete("/api/profile", { ...auth(token), data: { password } }); }
