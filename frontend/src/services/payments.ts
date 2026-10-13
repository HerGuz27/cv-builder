import { supabase } from "./supabase";

// No conoce al proveedor de pago: el backend devuelve una URL de checkout y acá
// solo se redirige. Cambiar de proveedor no toca este archivo.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price_amount: number;
  currency: string;
}

export type OrderStatus = "pending" | "paid" | "failed" | "refunded" | "cancelled";

export interface PaymentOrder {
  id: string;
  status: OrderStatus;
  credits: number;
}

export async function listPackages(): Promise<CreditPackage[]> {
  const { data, error } = await supabase
    .from("credit_packages")
    .select("id, name, credits, price_amount, currency")
    .order("sort");

  if (error) throw new Error("No se pudieron cargar los paquetes");
  return (data ?? []).map((p) => ({ ...p, price_amount: Number(p.price_amount) }));
}

/** Crea la orden en el servidor y redirige al checkout del proveedor. */
export async function startCheckout(packageId: string): Promise<void> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Iniciá sesión para comprar créditos");

  const response = await fetch(`${SUPABASE_URL}/functions/v1/payments-checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ packageId }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok || typeof body.checkoutUrl !== "string") {
    throw new Error(body.error || "No se pudo iniciar el pago");
  }
  window.location.href = body.checkoutUrl;
}

export async function getOrder(orderId: string): Promise<PaymentOrder | null> {
  const { data, error } = await supabase
    .from("payment_orders")
    .select("id, status, credits")
    .eq("id", orderId)
    .maybeSingle();

  if (error) throw new Error("No se pudo consultar la orden");
  return data;
}

export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("es", { style: "currency", currency }).format(amount);
}
