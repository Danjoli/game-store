import type { Game } from "../types/game";

export type Customer = { id: number; name: string; email: string; isAdmin: boolean };
export type CartItem = { id: number; quantity: number; unitPrice: number; subtotal: number; game: Game };
export type Cart = { id: number; items: CartItem[]; itemCount: number; total: number };
export type OrderItem = { id: number; gameId: number | null; title: string; unitPrice: number; quantity: number; subtotal: number };
export type Order = {
  id: number; status: "pending" | "paid" | "processing" | "completed" | "cancelled" | "refunded";
  total: number; paymentMethod: string; recipientName: string; postalCode: string;
  address: string; city: string; state: string; createdAt: string; items: OrderItem[];
  customer?: Customer;
  paymentUrl?: string | null; couponCode?: string | null; discount: number;
};
export type CheckoutPayload = {
  payment_method: "pix" | "credit_card"; recipient_name: string; postal_code: string;
  address: string; city: string; state: string;
  coupon_code?: string;
};
export type Address = { id: number; label: string; recipientName: string; postalCode: string; address: string; city: string; state: string; isDefault: boolean };
export type AddressPayload = { label: string; recipient_name: string; postal_code: string; address: string; city: string; state: string; is_default?: boolean };
