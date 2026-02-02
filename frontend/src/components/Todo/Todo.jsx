import { useEffect, useState } from "react";
import "./Todo.css";

export default function Todo() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  /* Load todos from localStorage */
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  /* Save todos to localStorage */
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!task.trim()) return;

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: task,
        completed: false,
      },
    ]);

    setTask("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div className="todo-container">
      {/* INPUT */}
      <div className="todo-input-row">
        <input
          type="text"
          placeholder="Add a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* LIST */}
      <ul className="todo-list">
        {todos.length === 0 && (
          <p className="todo-empty">No tasks yet</p>
        )}

        {todos.map((t) => (
          <li key={t.id} className={t.completed ? "done" : ""}>
            <label>
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggleTodo(t.id)}
              />
              <span>{t.text}</span>
            </label>

            <button
              className="delete-btn"
              onClick={() => deleteTodo(t.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
