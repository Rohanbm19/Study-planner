import { useState } from "react";
import { loginUser } from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await loginUser({ email, password });
    nav("/dashboard");
  };

  return (
    <>
      <form onSubmit={submit}>
        <h2>Login</h2>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button>Login</button>
      </form>
      <Link to="/register">New user? Register</Link>
    </>
  );
}
