import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccountMenu from "../components/AccountMenu";
import Spinner from "../components/auth/Spinner";
import { useAuth } from "../context/AuthContext";
import { FREE_MONTHLY_LIMIT } from "../services/quota";
import { formatPrice, listPackages, startCheckout, type CreditPackage } from "../services/payments";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";

export default function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState<CreditPackage[] | null>(null);
  const [buying, setBuying] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    listPackages()
      .then(setPackages)
      .catch((err) => {
        setPackages([]);
        setError(err.message);
      });
  }, []);

  const handleBuy = async (pkg: CreditPackage) => {
    if (!user) {
      navigate("/login", { state: { from: "/pricing" } });
      return;
    }
    setBuying(pkg.id);
    setError("");
    try {
      await startCheckout(pkg.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar el pago");
      setBuying(null);
    }
  };

  return (
    <div className="min-h-screen bg-ground">
      <div className="bg-ground border-b-2 border-divider sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-baseline gap-3 min-w-0 mr-auto">
            <Link to="/" className="text-lg font-extrabold tracking-tight">Nexocv</Link>
            <span className="hidden md:block text-xs text-muted truncate">Comprar créditos</span>
          </div>
          <Link to="/ats" className="btn btn-secondary">
            <FactCheckOutlinedIcon sx={{ fontSize: 18 }} />
            Analizador ATS
          </Link>
          <AccountMenu showAtsLink={false} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <div className="lbl mb-2">Créditos</div>
          <h1 className="text-2xl sm:text-3xl">Más análisis ATS</h1>
          <p className="text-sm text-muted mt-2">
            Cada mes tenés {FREE_MONTHLY_LIMIT} análisis gratis. Cada crédito suma un análisis extra y no vence.
          </p>
        </div>

        {error && (
          <div className="bg-accent-100 text-accent-800 text-sm px-3 py-2 border border-accent-300 mb-6">
            {error}
          </div>
        )}

        {packages === null ? (
          <div className="flex justify-center py-12 text-muted">
            <Spinner className="h-6 w-6" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-surface border-2 border-divider p-4 sm:p-6 flex flex-col gap-4">
                <div>
                  <div className="lbl mb-2">{pkg.name}</div>
                  <div className="text-3xl font-extrabold">{formatPrice(pkg.price_amount, pkg.currency)}</div>
                  <div className="text-xs text-muted mt-1">
                    {formatPrice(pkg.price_amount / pkg.credits, pkg.currency)} por análisis
                  </div>
                </div>
                <button
                  className="btn btn-primary w-full mt-auto"
                  disabled={buying !== null}
                  onClick={() => handleBuy(pkg)}
                >
                  {buying === pkg.id ? (
                    <>
                      <Spinner /> Redirigiendo...
                    </>
                  ) : (
                    `Comprar ${pkg.credits} créditos`
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
