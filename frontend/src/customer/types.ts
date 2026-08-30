import type { Game } from "../types/game";

export type Customer = { id: number; name: string; email: string; isAdmin: boolean };
export type CartItem = { id: number; quantity: number; unitPrice: number; subtotal: number; game: Game };
export type Cart = { id: number; items: CartItem[]; itemCount: number; total: number };
export type OrderItem = { id: number; gameId: number | null; title: string; unitPrice: number; quantity: number; subtotal: number };
export type Order = {
  id: number; status: "paid" | "processing" | "completed" | "cancelled";
  total: number; paymentMethod: string; recipientName: string; postalCode: string;
  address: string; city: string; state: string; createdAt: string; items: OrderItem[];
  customer?: Customer;
};
export type CheckoutPayload = {
  payment_method: "pix" | "credit_card"; recipient_name: string; postal_code: string;
  address: string; city: string; state: string;
};
