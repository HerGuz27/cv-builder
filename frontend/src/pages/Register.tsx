import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import { auth } from "../services/supabase";
import { useAuth } from "../context/AuthContext";
import AuthLayout, { ErrorBox, GoogleButton, OrDivider, authErrorMessage } from "../components/auth/AuthLayout";
import Spinner from "../components/auth/Spinner";

export default function RegisterPage() {
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  if (!authLoading && user) return <Navigate to="/ats" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
    if (password !== confirm) return setError("Las contraseñas no coinciden.");

    setLoading(true);
    const { data, error } = await auth.signUp(email.trim(), password);
    setLoading(false);
    if (error) return setError(authErrorMessage(error.message));
    // Un usuario sin identidades indica que el email ya estaba registrado.
    if (data.user && data.user.identities?.length === 0)
      return setError("Ya existe una cuenta con ese email.");
    // Con confirmación de email activa no hay sesión hasta que confirma.
    if (!data.session) setSent(true);
  };

  const handleGoogle = async () => {
    setError("");
    const { error } = await auth.signInWithGoogle();
    if (error) setError(authErrorMessage(error.message));
  };

  if (sent) {
    return (
      <AuthLayout label="Casi listo" title="Revisá tu correo">
        <div className="flex items-start gap-3 text-sm">
          <MarkEmailReadOutlinedIcon className="text-accent-700" />
          <p>
            Te enviamos un enlace de confirmación a <strong>{email}</strong>. Al abrirlo vas a entrar
            directo al analizador ATS.
          </p>
        </div>
        <Link to="/login" className="btn btn-secondary w-full mt-6">Ir a ingresar</Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout label="Nueva cuenta" title="Creá tu cuenta" subtitle="Gratis. Incluye el analizador ATS y el historial de postulaciones.">
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
          <input id="password" type="password" required autoComplete="new-password" className="input"
            value={password} onChange={(e) => setPassword(e.target.value)} />
          <p className="text-xs text-muted mt-1">Mínimo 8 caracteres.</p>
        </div>
        <div>
          <label className="field-label" htmlFor="confirm">Repetir contraseña</label>
          <input id="confirm" type="password" required autoComplete="new-password" className="input"
            value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        {error && <ErrorBox>{error}</ErrorBox>}
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? <Spinner /> : "Crear cuenta"}
        </button>
      </form>
      <p className="text-sm text-muted mt-6">
        ¿Ya tenés cuenta? <Link to="/login" className="text-accent-700 font-bold hover:underline">Ingresá</Link>
      </p>
    </AuthLayout>
  );
}
