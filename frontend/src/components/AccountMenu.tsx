import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useAuth } from "../context/AuthContext";
import { getCredits } from "../services/quota";

/** Botón "Ingresar" o menú de usuario; mismo lenguaje visual que el header del builder. */
export default function AccountMenu({ showAtsLink = true }: { showAtsLink?: boolean }) {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [credits, setCredits] = useState<number | null>(null);

  // Se refresca cada vez que se abre el menú.
  useEffect(() => {
    if (!open || !user) return;
    getCredits()
      .then(setCredits)
      .catch(() => setCredits(null));
  }, [open, user]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  if (!user) {
    return (
      <Link to="/login" className="btn btn-secondary">
        <PersonOutlinedIcon sx={{ fontSize: 18 }} />
        Ingresar
      </Link>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button className="btn btn-secondary" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <PersonOutlinedIcon sx={{ fontSize: 18 }} />
        <span className="hidden sm:inline max-w-[160px] truncate">{user.email}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-surface shadow-md border-2 border-divider py-2 z-50">
          <p className="lbl px-4 pb-2 truncate">{user.email}</p>
          {showAtsLink && (
            <Link to="/ats" className="menu-item" onClick={() => setOpen(false)}>
              <FactCheckOutlinedIcon className="text-muted" sx={{ fontSize: 18 }} />
              Analizador ATS
            </Link>
          )}
          <Link to="/pricing" className="menu-item" onClick={() => setOpen(false)}>
            <ShoppingCartOutlinedIcon className="text-muted" sx={{ fontSize: 18 }} />
            Comprar créditos
            {credits !== null && <span className="tag tag-neutral ml-auto">{credits}</span>}
          </Link>
          <button
            className="menu-item"
            onClick={async () => {
              setOpen(false);
              await signOut();
            }}
          >
            <LogoutOutlinedIcon className="text-muted" sx={{ fontSize: 18 }} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
