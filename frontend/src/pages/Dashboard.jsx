import { useState, useEffect } from "react";
import { generateAIPlan } from "../api/api";
import Todo from "../components/Todo/Todo";
import Profile from "../components/Profile/Profile";
import "./Dashboard.css";
import AIChat from "../components/AIChat/AIChat";

export default function Dashboard() {
  const [topic, setTopic] = useState("");
  const [weeks, setWeeks] = useState(4);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  const userName = localStorage.getItem("userName") || "Student";

  useEffect(() => {
    const dark = localStorage.getItem("darkMode") === "true";
    document.body.classList.toggle("dark", dark);
  }, []);

  return (
    <div className="dashboard-container">
      {/* ===== HEADER ===== */}
      <header className="dashboard-header">
        <div className="header-title">STUDY - PLANNER</div>

        <div
          className="profile-area"
          onClick={() => setShowProfile(!showProfile)}
        >
          <span className="profile-text">{userName}</span>
          <div className="profile-avatar"></div>
        </div>

        {showProfile && <Profile close={() => setShowProfile(false)} />}
      </header>

      {/* ===== MAIN ===== */}
      <main className="dashboard-main">
        <section className="study-planner">
          <h3>Study Time Table</h3>

          <div className="input-row">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic"
            />
            <input
              type="number"
              min="1"
              max="12"
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="weeks-input"
            />
            <button disabled={loading}>
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          {error && <p className="dashboard-error">{error}</p>}
        </section>

        <aside className="right-panel">
          <div className="todo-box">
            <h3>📝 Todo List</h3>
            <Todo />
          </div>

          <div className="ai-chat-box">
            <h3>🤖 AI Chat Assistant</h3>
            <AIChat />
          </div>
        </aside>
      </main>

      <footer className="dashboard-footer">© 2026 Study Planner</footer>
    </div>
  );
}
