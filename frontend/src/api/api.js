import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

// ✅ FIXED PATH (remove extra /api)
export const generateAIPlan = (topic, weeks) =>
  API.post("/ai/plan", { topic, weeks });


export const sendChatMessage = (messages) => {
  return axios.post("http://localhost:5000/api/chat", {
    messages,
  });
};

