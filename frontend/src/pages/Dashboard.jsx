import { useState } from "react";
import { generateAIPlan } from "../api/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [topic, setTopic] = useState("");
  const [weeks, setWeeks] = useState(4); // ✅ weeks state
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

      // ✅ CORRECT API CALL (NO OBJECT WRAP)
      const res = await generateAIPlan(topic, weeks);

      const rawText = res?.data?.planText;

      if (!rawText) {
        setError("No response from AI");
        return;
      }

      // -------- CLEAN --------
      const cleaned = rawText
        .replace(/\*\*/g, "")
        .replace(/^- /gm, "")
        .trim();

      // -------- SPLIT WEEKS --------
      const weekBlocks = cleaned.match(
        /Week \d+:[\s\S]*?(?=Week \d+:|$)/g
      );

      if (!weekBlocks) {
        setError("AI response format invalid. Try again.");
        return;
      }

      const parsed = weekBlocks.map((block, index) => {
        const getValue = (label) => {
  const lines = block.split("\n");
  const startIndex = lines.findIndex((l) =>
    l.toLowerCase().startsWith(label)
  );

  if (startIndex === -1) return "";

  let value = lines[startIndex].split(":").slice(1).join(":").trim();

  // collect bullet points below the label
  for (let i = startIndex + 1; i < lines.length; i++) {
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
    <div className="dashboard-page">
      <div className="dashboard-card">
        <h1 className="dashboard-title">📘 AI Study Planner</h1>

        {/* INPUT ROW */}
        <div className="input-row">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic (React, DBMS, Maths)"
          />

          {/* ✅ Weeks input */}
          <input
            type="number"
            min="1"
            max="12"
            value={weeks}
            onChange={(e) => setWeeks(Number(e.target.value))}
            placeholder="Weeks"
            className="weeks-input"
          />

          <button onClick={generate} disabled={loading}>
            {loading ? "Generating..." : "Generate Plan"}
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
                {rows.map((row, i) => (
                  <tr key={i}>
                    <td>{row.week}</td>
                    <td>{row.topic}</td>
                    <td>{row.subtopics}</td>
                    <td>{row.tasks}</td>
                    <td>{row.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
