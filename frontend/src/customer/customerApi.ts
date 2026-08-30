import axios from "axios";
import type { Cart, CheckoutPayload, Customer, Order } from "./types";

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
export async function getOrders(token: string) { return data<Order[]>(await api.get("/api/orders", auth(token))); }
export async function checkout(token: string, payload: CheckoutPayload) { return data<Order>(await api.post("/api/orders", payload, auth(token))); }
