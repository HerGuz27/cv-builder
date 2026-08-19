import { BrowserRouter, Routes, Route } from "react-router-dom";
import ATSPage from "./pages/ATS";
import { CVBuilderPage } from "./pages/CVBuilder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ATSPage />} />
        <Route path="/ats" element={<ATSPage />} />
        <Route path="/cv-builder" element={<CVBuilderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
