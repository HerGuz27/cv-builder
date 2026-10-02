import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ATSForm from "../components/ATSForm";
import MatchHistory from "../components/MatchHistory";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";

export default function ATSPage() {
  const [activeTab, setActiveTab] = useState<"analyzer" | "history">("analyzer");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Job Search ATS</h1>
        </div>
      </nav>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("analyzer")}
            className={`px-6 py-2 rounded-lg font-medium transition inline-flex items-center gap-2 ${
              activeTab === "analyzer"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ArticleOutlinedIcon sx={{ fontSize: 20 }} />
            Analizador
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2 rounded-lg font-medium transition inline-flex items-center gap-2 ${
              activeTab === "history"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <HistoryOutlinedIcon sx={{ fontSize: 20 }} />
            Historial
          </button>
          <button
            onClick={() => navigate("/cv-builder")}
            className="px-6 py-2 rounded-lg font-medium transition inline-flex items-center gap-2 bg-green-500 text-white hover:bg-green-600"
          >
            <EditNoteOutlinedIcon sx={{ fontSize: 20 }} />
            Mi CV
          </button>
        </div>

        {/* Content */}
        {activeTab === "analyzer" ? <ATSForm /> : <MatchHistory />}
      </div>
    </div>
  );
}
