import { useState } from "react";
import { sendChatMessage } from "../../api/api";
import "./AIChat.css";

export default function AIChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      setLoading(true);
      const res = await sendChatMessage(input);

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: res.data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ AI failed to respond" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "chat-user" : "chat-ai"}
          >
            {m.text}
          </div>
        ))}
        {loading && <div className="chat-ai">Typing...</div>}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
