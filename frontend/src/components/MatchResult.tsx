import type { MatchResult } from "../services/types";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";

const getColorForPercentage = (percentage: number): string => {
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 60) return "text-yellow-600";
  if (percentage >= 40) return "text-orange-600";
  return "text-red-600";
};

const getBgColorForPercentage = (percentage: number): string => {
  if (percentage >= 80) return "bg-green-50 border-green-200";
  if (percentage >= 60) return "bg-yellow-50 border-yellow-200";
  if (percentage >= 40) return "bg-orange-50 border-orange-200";
  return "bg-red-50 border-red-200";
};

export default function MatchResultDisplay({
  result,
}: {
  result: MatchResult;
}) {
  return (
    <div className={`border rounded-lg p-6 ${getBgColorForPercentage(result.porcentajeMatch)}`}>
      {/* Match Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">Porcentaje de Match</h2>
          <span className={`text-4xl font-bold ${getColorForPercentage(result.porcentajeMatch)}`}>
            {result.porcentajeMatch}%
          </span>
        </div>
        <p className="text-gray-700">{result.razonamiento}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              result.porcentajeMatch >= 80
                ? "bg-green-500"
                : result.porcentajeMatch >= 60
                  ? "bg-yellow-500"
                  : result.porcentajeMatch >= 40
                    ? "bg-orange-500"
                    : "bg-red-500"
            }`}
            style={{ width: `${result.porcentajeMatch}%` }}
          ></div>
        </div>
      </div>

      {/* Strengths */}
      {result.fortalezas.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-1.5">
            <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />
            Fortalezas
          </h3>
          <ul className="space-y-1">
            {result.fortalezas.map((strength, i) => (
              <li key={i} className="text-sm text-gray-700">
                • {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gaps */}
      {result.brechas.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-1.5">
            <CancelOutlinedIcon sx={{ fontSize: 20 }} />
            Brechas de Habilidades
          </h3>
          <ul className="space-y-1">
            {result.brechas.map((gap, i) => (
              <li key={i} className="text-sm text-gray-700">
                • {gap}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {result.recomendaciones.length > 0 && (
        <div>
          <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-1.5">
            <LightbulbOutlinedIcon sx={{ fontSize: 20 }} />
            Recomendaciones
          </h3>
          <ul className="space-y-1">
            {result.recomendaciones.map((rec, i) => (
              <li key={i} className="text-sm text-gray-700">
                • {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
