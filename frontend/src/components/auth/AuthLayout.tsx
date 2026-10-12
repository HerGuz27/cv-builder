import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export default function AuthLayout({
  label,
  title,
  subtitle,
  children,
}: {
  label: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ground flex flex-col">
      <header className="border-b-2 border-divider">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-6 py-3 flex items-baseline justify-between">
          <Link to="/" className="text-lg font-extrabold tracking-tight">Nexocv</Link>
          <Link to="/" className="text-xs text-muted hover:text-ink">Volver al CV Builder</Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-surface border-2 border-divider p-6 sm:p-8">
          <div className="lbl mb-3">{label}</div>
          <h1 className="text-2xl mb-1">{title}</h1>
          {subtitle ? <p className="text-sm text-muted mb-6">{subtitle}</p> : <div className="mb-6" />}
          {children}
        </div>
      </main>
    </div>
  );
}

export function GoogleButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button type="button" className="btn btn-secondary w-full" onClick={onClick} disabled={disabled}>
      <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
        <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 010-9.4l-7.9-6.1a24 24 0 000 21.6l7.9-6.1z" />
        <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
      </svg>
      Continuar con Google
    </button>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 border-t border-divider" />
      <span className="lbl">o</span>
      <div className="flex-1 border-t border-divider" />
    </div>
  );
}

export function ErrorBox({ children }: { children: ReactNode }) {
  return <div className="bg-accent-100 text-accent-800 text-sm px-3 py-2 border border-accent-300">{children}</div>;
}

export function authErrorMessage(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Email o contraseña incorrectos.";
  if (m.includes("email not confirmed")) return "Todavía no confirmaste tu email. Revisá tu correo.";
  if (m.includes("already registered")) return "Ya existe una cuenta con ese email.";
  if (m.includes("password should be")) return "La contraseña debe tener al menos 8 caracteres.";
  if (m.includes("rate limit")) return "Demasiados intentos. Probá de nuevo en unos minutos.";
  return "No pudimos completar la operación. Intentá de nuevo.";
}
