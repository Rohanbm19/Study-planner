import { useState } from "react";
import { registerUser } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await registerUser({ email, password });
    nav("/");
  };

  return (
    <form onSubmit={submit}>
      <h2>Register</h2>
      <input value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button>Register</button>
    </form>
  );
}
