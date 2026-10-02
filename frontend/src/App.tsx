import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ATSPage from "./pages/ATS";
import { CVBuilderPage } from "./pages/CVBuilder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* MVP: la app es el generador de CV. */}
        <Route path="/" element={<CVBuilderPage />} />
        <Route path="/cv-builder" element={<CVBuilderPage />} />

        {/* Funcionalidades todavía no lanzadas: siguen andando por URL directa,
            pero no se linkean desde ningún lado de la interfaz. */}
        <Route path="/ats" element={<ATSPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
