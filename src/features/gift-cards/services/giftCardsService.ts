import { apiFetch } from "@/lib/api/client";

export type GiftCardPurchase = {
  amount: string;
  buyer_name: string;
  buyer_email: string;
  recipient_name: string;
  recipient_email: string;
  message: string;
};

export type GiftCardStatus = {
  number: number;
  status: "pending" | "active" | "cancelled";
  amount: string;
  balance: string;
  code: string | null;
  recipient_email: string;
  buyer_email: string;
  expires_at: string | null;
};

export function purchaseGiftCard(body: GiftCardPurchase) {
  return apiFetch<{ token: string; payment_url: string }>("gift-cards/", { method: "POST", body });
}

export function fetchGiftCardStatus(token: string) {
  return apiFetch<GiftCardStatus>(`gift-cards/${encodeURIComponent(token)}/`);
}
