import { useState } from "react";
import { generateAIPlan } from "../api/api";
import Todo from "../components/Todo/Todo";
import "./Dashboard.css";

export default function Dashboard() {
  const [topic, setTopic] = useState("");
  const [weeks, setWeeks] = useState(4);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setRows([]);

      const res = await generateAIPlan(topic, weeks);
      const rawText = res?.data?.planText;

      if (!rawText) {
        setError("No response from AI");
        return;
      }

      const cleaned = rawText.replace(/\*\*/g, "").trim();

      const weekBlocks = cleaned.match(
        /Week \d+:[\s\S]*?(?=Week \d+:|$)/g
      );

      if (!weekBlocks) {
        setError("Invalid AI format");
        return;
      }

      const parsed = weekBlocks.map((block, index) => {
        const getValue = (label) => {
          const lines = block.split("\n");
          const start = lines.findIndex((l) =>
            l.toLowerCase().startsWith(label)
          );
          if (start === -1) return "";

          let value = lines[start].split(":").slice(1).join(":").trim();

          for (let i = start + 1; i < lines.length; i++) {
            if (
              lines[i].toLowerCase().startsWith("topic") ||
              lines[i].toLowerCase().startsWith("subtopics") ||
              lines[i].toLowerCase().startsWith("daily tasks") ||
              lines[i].toLowerCase().startsWith("hours")
            ) {
              break;
            }
            value += " " + lines[i].replace(/^-/, "").trim();
          }

          return value.trim();
        };

        return {
          week: `Week ${index + 1}`,
          topic: getValue("topic"),
          subtopics: getValue("subtopics"),
          tasks: getValue("daily tasks"),
          hours: getValue("hours"),
        };
      });

      setRows(parsed);
    } catch (err) {
      console.error(err);
      setError("Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* ===== HEADER ===== */}
      <header className="dashboard-header">
        <div className="header-title">STUDY - PLANNER</div>
        <div className="profile-area">
          <span className="profile-text">Profile</span>
          <div className="profile-avatar"></div>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="dashboard-main">
        {/* LEFT → STUDY PLANNER */}
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
              placeholder="Weeks"
            />
            <button onClick={generate} disabled={loading}>
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          {error && <p className="dashboard-error">{error}</p>}

          {rows.length > 0 && (
            <div className="plan-table-wrapper">
              <table className="plan-table">
                <thead>
                  <tr>
                    <th>Week</th>
                    <th>Topic</th>
                    <th>Subtopics</th>
                    <th>Daily Tasks</th>
                    <th>Hours / Day</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td>{r.week}</td>
                      <td>{r.topic}</td>
                      <td>{r.subtopics}</td>
                      <td>{r.tasks}</td>
                      <td>{r.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* RIGHT → TODO + AI CHAT */}
        <aside className="right-panel">
          <div className="todo-box">
            <h3>📝 Todo List</h3>
            <Todo />
          </div>

          <div className="ai-chat-box">
            <h3>🤖 AI Chat Assistant</h3>
            <p>Coming soon…</p>
          </div>
        </aside>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="dashboard-footer">
        © 2026 Study Planner
      </footer>
    </div>
  );
}
