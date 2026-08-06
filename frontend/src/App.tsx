import { BrowserRouter, Routes, Route } from "react-router-dom";
import ATSPage from "./pages/ATS";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ATSPage />} />
        <Route path="/ats" element={<ATSPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
