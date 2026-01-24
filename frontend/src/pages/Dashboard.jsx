import { useState } from "react";
import { generateAIPlan } from "../api/api";

export default function Dashboard() {
  const [topic, setTopic] = useState("");
  const [aiPlan, setAiPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!topic) {
      alert("Please enter a topic");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await generateAIPlan(topic);

      // 🔴 THIS matches your Postman response
      setAiPlan(res.data.plan);
    } catch (err) {
      console.error(err);
      setError("Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📘 AI Study Planner</h1>

      <input
        type="text"
        placeholder="Enter subject (e.g. Operating Systems)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{ padding: "8px", width: "300px" }}
      />

      <br /><br />

      <button onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Generate AI Plan"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {aiPlan && (
        <pre
          style={{
            marginTop: "20px",
            background: "#f4f4f4",
            padding: "15px",
            whiteSpace: "pre-wrap"
          }}
        >
          {aiPlan}
        </pre>
      )}
    </div>
  );
}
