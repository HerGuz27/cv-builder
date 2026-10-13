import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Spinner from "../components/auth/Spinner";
import { getOrder, type PaymentOrder } from "../services/payments";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 60_000;

/**
 * Página de vuelta del checkout. El estado sale de la orden en la base (que
 * actualiza el webhook), nunca de los parámetros que agrega el proveedor a la URL.
 */
export default function CheckoutResultPage() {
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    const startedAt = Date.now();

    const poll = async () => {
      try {
        const current = await getOrder(orderId);
        if (cancelled) return;
        setOrder(current);
        if (current && current.status !== "pending") return;
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "No se pudo consultar la orden");
      }
      if (Date.now() - startedAt >= POLL_TIMEOUT_MS) {
        setTimedOut(true);
        return;
      }
      timer = setTimeout(poll, POLL_INTERVAL_MS);
    };

    let timer = setTimeout(poll, 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [orderId]);

  const status = order?.status;
  const success = status === "paid";
  const failed = status === "failed" || status === "cancelled" || status === "refunded";

  return (
    <div className="min-h-screen bg-ground flex items-center justify-center px-4">
      <div className="bg-surface border-2 border-divider p-6 sm:p-8 max-w-md w-full text-center space-y-4">
        {!orderId ? (
          <p>No encontramos la orden de pago.</p>
        ) : success ? (
          <>
            <CheckCircleOutlinedIcon className="text-accent-700" sx={{ fontSize: 48 }} />
            <h1 className="text-2xl">¡Pago acreditado!</h1>
            <p className="text-sm text-muted">Sumamos {order?.credits} créditos a tu cuenta.</p>
          </>
        ) : failed ? (
          <>
            <ErrorOutlineOutlinedIcon className="text-accent-700" sx={{ fontSize: 48 }} />
            <h1 className="text-2xl">El pago no se completó</h1>
            <p className="text-sm text-muted">No se acreditaron créditos. Podés intentar de nuevo.</p>
          </>
        ) : timedOut ? (
          <>
            <h1 className="text-2xl">Estamos procesando tu pago</h1>
            <p className="text-sm text-muted">
              Puede tardar unos minutos. Los créditos se suman solos cuando se confirme.
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center text-muted">
              <Spinner className="h-8 w-8" />
            </div>
            <h1 className="text-2xl">Confirmando tu pago...</h1>
          </>
        )}

        {error && <p className="text-sm text-accent-800">{error}</p>}

        <div className="flex gap-2 justify-center pt-2">
          {failed && (
            <Link to="/pricing" className="btn btn-secondary">
              Volver a intentar
            </Link>
          )}
          <Link to="/ats" className="btn btn-primary">
            Ir al analizador
          </Link>
        </div>
      </div>
    </div>
  );
}
