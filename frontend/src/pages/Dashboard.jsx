import { useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [topic, setTopic] = useState("");
  const [plan, setPlan] = useState("");
  const [error, setError] = useState("");

  const generate = async () => {
    try {
      setError("");
      setPlan("");

      // ✅ GET TOKEN FROM LOCAL STORAGE
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in");
        return;
      }

      // ✅ CALL BACKEND WITH AUTH HEADER
      const res = await axios.post(
        "http://localhost:5000/api/ai/plan",
        { topic },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ SET PLAN
      setPlan(res.data.plan);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to generate plan");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>AI Study Planner</h2>

      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter topic"
      />

      <br />
      <br />

      <button onClick={generate}>Generate AI Plan</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {plan && <pre>{plan}</pre>}
    </div>
  );
}
