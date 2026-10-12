import type { MatchResult } from "../services/types";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";

/** Alto match = tinta oscura; bajo = acento rojo. Sin colores fuera del sistema. */
export const matchTextClass = (pct: number): string =>
  pct >= 60 ? "text-ink" : "text-accent-700";
export const matchBarClass = (pct: number): string =>
  pct >= 60 ? "bg-ink" : "bg-accent";

function Section({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-base mb-2 flex items-center gap-1.5">
        {icon}
        {title}
      </h3>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-muted">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MatchResultDisplay({ result }: { result: MatchResult }) {
  return (
    <div className="bg-surface border-2 border-divider p-4 sm:p-6">
      <div className="mb-6">
        <div className="lbl mb-2">Resultado</div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl">Porcentaje de Match</h2>
          <span className={`text-4xl font-extrabold ${matchTextClass(result.porcentajeMatch)}`}>
            {result.porcentajeMatch}%
          </span>
        </div>
        <p className="text-sm text-muted">{result.razonamiento}</p>
      </div>

      <div className="mb-6 w-full bg-neutral-300 h-2">
        <div
          className={`h-2 transition-all ${matchBarClass(result.porcentajeMatch)}`}
          style={{ width: `${result.porcentajeMatch}%` }}
        />
      </div>

      <Section
        icon={<CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />}
        title="Fortalezas"
        items={result.fortalezas}
      />
      <Section
        icon={<CancelOutlinedIcon className="text-accent-700" sx={{ fontSize: 20 }} />}
        title="Brechas de Habilidades"
        items={result.brechas}
      />
      <Section
        icon={<LightbulbOutlinedIcon sx={{ fontSize: 20 }} />}
        title="Recomendaciones"
        items={result.recomendaciones}
      />
    </div>
  );
}
