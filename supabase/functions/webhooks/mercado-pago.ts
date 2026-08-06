import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const MP_ACCESS_TOKEN = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.json();

  // Handle payment notifications from Mercado Pago
  if (body.type === "payment") {
    const paymentId = body.data.id;

    try {
      // Get payment details
      const mpResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
        }
      );

      const payment = await mpResponse.json();

      if (payment.status === "approved") {
        const userId = payment.external_reference;

        // Update user subscription
        await supabase
          .from("subscriptions")
          .update({
            status: "active",
            payment_id: paymentId,
            paid_at: new Date(),
          })
          .eq("user_id", userId);

        console.log(`Payment approved for user ${userId}`);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      return new Response("Error processing payment", { status: 500 });
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
