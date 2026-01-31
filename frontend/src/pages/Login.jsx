import { useState } from "react";
import { loginUser } from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser({ email, password });

      // ✅ SAVE JWT TOKEN (THIS FIXES 401 ERROR)
      localStorage.setItem("token", res.data.token);

      nav("/dashboard");
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <>
      <form onSubmit={submit}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      <Link to="/register">New user? Register</Link>
    </>
  );
}
