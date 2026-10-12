import { useState } from "react";
import { Link } from "react-router-dom";
import ATSForm from "../components/ATSForm";
import MatchHistory from "../components/MatchHistory";
import AccountMenu from "../components/AccountMenu";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";

export default function ATSPage() {
  const [activeTab, setActiveTab] = useState<"analyzer" | "history">("analyzer");

  return (
    <div className="min-h-screen bg-ground">
      {/* Header */}
      <div className="bg-ground border-b-2 border-divider sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-baseline gap-3 min-w-0 mr-auto">
            <span className="text-lg font-extrabold tracking-tight">Nexocv</span>
            <span className="hidden md:block text-xs text-muted truncate">Analizador ATS</span>
          </div>
          <Link to="/cv-builder" className="btn btn-secondary">
            <EditNoteOutlinedIcon sx={{ fontSize: 18 }} />
            Mi CV
          </Link>
          <AccountMenu showAtsLink={false} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("analyzer")}
            className={`btn ${activeTab === "analyzer" ? "btn-primary" : "btn-secondary"}`}
          >
            <ArticleOutlinedIcon sx={{ fontSize: 18 }} />
            Analizador
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`btn ${activeTab === "history" ? "btn-primary" : "btn-secondary"}`}
          >
            <HistoryOutlinedIcon sx={{ fontSize: 18 }} />
            Historial
          </button>
        </div>

        {activeTab === "analyzer" ? <ATSForm /> : <MatchHistory />}
      </div>
    </div>
  );
}
