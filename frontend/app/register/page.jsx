"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/axios";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // 1. Register the user
      await api.post("/users/register", { username: username.trim(), email: email.trim(), password });
      
      // 2. Automatically log them in
      const res = await api.post("/auth/login", { username: username.trim(), email: email.trim(), password });
      const token = res.data?.token ?? res.data?.accessToken ?? res.data;
      if (token) {
        localStorage.setItem("token", typeof token === "string" ? token : JSON.stringify(token));
        router.push("/feed");
      } else {
        router.push("/login"); // Fallback if no token returned
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(err?.response?.data?.message || err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full glass squircle card-shadow p-8 bg-theme">
        <h1 className="text-3xl font-bold mb-4 text-theme">Create account</h1>
        <p className="muted mb-6">Join the community and share beautiful photos.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-theme">Username</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full rounded-md input-theme p-3 placeholder-theme focus:outline-none" placeholder="choose a username" />
          </div>

          <div>
            <label className="block text-sm font-medium text-theme">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md input-theme p-3 placeholder-theme focus:outline-none" placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-theme">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md input-theme p-3 placeholder-theme focus:outline-none" placeholder="strong password" />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <button type="submit" disabled={loading} className="w-full inline-flex justify-center items-center px-4 py-3 rounded-md btn-accent shadow-lg transform hover:-translate-y-0.5 transition">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <a href="/login" className="text-sm muted hover:text-theme">Already have an account? Sign in</a>
        </div>
      </div>
    </div>
  );
}
