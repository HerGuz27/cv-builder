import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ATSPage from "./pages/ATS";
import { CVBuilderPage } from "./pages/CVBuilder";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import PricingPage from "./pages/Pricing";
import CheckoutResultPage from "./pages/CheckoutResult";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* El generador de CV es público. */}
          <Route path="/" element={<CVBuilderPage />} />
          <Route path="/cv-builder" element={<CVBuilderPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* El ATS (analizador + historial) requiere sesión. */}
          <Route
            path="/ats"
            element={
              <ProtectedRoute>
                <ATSPage />
              </ProtectedRoute>
            }
          />

          {/* Pagos: los precios son públicos, el resultado del checkout requiere sesión. */}
          <Route path="/pricing" element={<PricingPage />} />
          <Route
            path="/checkout/result"
            element={
              <ProtectedRoute>
                <CheckoutResultPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
