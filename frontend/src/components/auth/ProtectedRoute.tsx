import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
import Spinner from "./Spinner";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-ground flex items-center justify-center text-muted">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  // Se conserva el query string para que /login pueda mostrar errores de OAuth
  // (?error_description=...) que Supabase devuelve al volver de Google.
  if (!user) return <Navigate to={`/login${location.search}`} state={{ from: location.pathname }} replace />;

  return <>{children}</>;
}
