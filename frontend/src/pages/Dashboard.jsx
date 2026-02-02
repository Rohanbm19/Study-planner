import { useState } from "react";
import { generateAIPlan } from "../api/api";
import Todo from "../components/Todo/Todo";
import Profile from "../components/Profile/Profile";
import "./Dashboard.css";
import AIChat from "../components/AIChat/AIChat";

export default function Dashboard() {
  const [topic, setTopic] = useState("");
  const [weeks, setWeeks] = useState(4);
  const [rows, setRows] = useState([]); // ✅ FIX
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  const userName = localStorage.getItem("userName") || "Student";

  const handleGenerate = async () => {
    if (!topic) {
      setError("Please enter a topic");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await generateAIPlan(topic, weeks);

      // Convert text → rows
      const lines = res.data.planText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      setRows(lines);
    } catch (err) {
      setError("Failed to generate timetable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* HEADER */}
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

      {/* MAIN */}
      <main className="dashboard-main">
        <section className="study-planner">
          <h3>📅 Study Timetable</h3>

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
            <button onClick={handleGenerate} disabled={loading}>
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          {error && <p className="dashboard-error">{error}</p>}

          {rows.length > 0 && (
            <table className="timetable">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Study Plan</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  if (row.startsWith("Week")) {
                    return (
                      <tr key={index}>
                        <td colSpan="2">
                          <strong>{row}</strong>
                        </td>
                      </tr>
                    );
                  }

                  const parts = row.split(":");
                  if (parts.length < 2) return null;

                  return (
                    <tr key={index}>
                      <td>{parts[0]}</td>
                      <td>{parts.slice(1).join(":")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>

        <aside className="right-panel">
          <div className="todo-box">
            <h3>📝 Todo List</h3>
            <Todo />
          </div>
          <div className="ai-chat-box">
  <h3>🤖 AI Study Assistant</h3>
  <AIChat />
</div>

        </aside>
      </main>

      <footer className="dashboard-footer">© 2026 Study Planner</footer>
    </div>
  );
}
