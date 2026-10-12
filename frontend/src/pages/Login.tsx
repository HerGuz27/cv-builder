import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { auth } from "../services/supabase";
import { useAuth } from "../context/AuthContext";
import AuthLayout, { ErrorBox, GoogleButton, OrDivider, authErrorMessage } from "../components/auth/AuthLayout";
import Spinner from "../components/auth/Spinner";

export default function LoginPage() {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/ats";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!authLoading && user) return <Navigate to={from} replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await auth.signIn(email.trim(), password);
    if (error) setError(authErrorMessage(error.message));
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError("");
    const { error } = await auth.signInWithGoogle();
    if (error) setError(authErrorMessage(error.message));
  };

  return (
    <AuthLayout label="Acceso" title="Ingresá a tu cuenta" subtitle="Necesitás una cuenta para usar el analizador ATS.">
      <GoogleButton onClick={handleGoogle} disabled={loading} />
      <OrDivider />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="field-label" htmlFor="email">Email</label>
          <input id="email" type="email" required autoComplete="email" className="input"
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="password">Contraseña</label>
          <input id="password" type="password" required autoComplete="current-password" className="input"
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <ErrorBox>{error}</ErrorBox>}
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? <Spinner /> : "Ingresar"}
        </button>
      </form>
      <p className="text-sm text-muted mt-6">
        ¿No tenés cuenta? <Link to="/register" className="text-accent-700 font-bold hover:underline">Registrate</Link>
      </p>
    </AuthLayout>
  );
}
