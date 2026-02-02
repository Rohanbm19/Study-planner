import { useState } from "react";
import "./Profile.css";

export default function Profile({ close }) {
  const [name, setName] = useState(
    localStorage.getItem("userName") || "Student"
  );

  const [dark, setDark] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const saveName = () => {
    localStorage.setItem("userName", name);
    window.location.reload();
  };

  const toggleDark = () => {
    const newMode = !dark;
    setDark(newMode);
    localStorage.setItem("darkMode", newMode);
    document.body.classList.toggle("dark", newMode);
  };

  const clearTodos = () => {
    localStorage.removeItem("todos");
    window.location.reload();
  };

  return (
    <div className="profile-dropdown">
      <label>Name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={saveName}>Save</button>

      <div className="profile-row">
        <span>Dark Mode</span>
        <input type="checkbox" checked={dark} onChange={toggleDark} />
      </div>

      <button className="danger" onClick={clearTodos}>
        Clear Todos
      </button>

      <button className="logout">Logout</button>
    </div>
  );
}
