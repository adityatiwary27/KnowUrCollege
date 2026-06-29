"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
      try {
        const res = await api.post("/auth/login", { identifier: identifier.trim(), password });
        const token = res.data?.token ?? res.data?.accessToken ?? res.data;
        if (!token) throw new Error("No token returned from server");
        localStorage.setItem("token", typeof token === "string" ? token : JSON.stringify(token));
        router.push("/feed");
      } catch (err) {
        console.error("Login error:", err);
        // Network errors give err.message === 'Network Error'
        if (err?.message === "Network Error") {
          setError("Cannot reach backend. Is http://localhost:8081 running?");
        } else if (typeof err?.response?.data === "string") {
          setError(err.response.data);
        } else {
          setError(err?.response?.data?.error || err?.response?.data?.message || err?.message || "Login failed");
        }
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full glass squircle card-shadow p-8 bg-theme">
        <h1 className="text-3xl font-bold mb-4 text-theme">Welcome Back</h1>
        <p className="muted mb-6">Login to access your photos and feed.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-theme">Username or Email</label>
            <input type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="mt-1 block w-full rounded-md input-theme p-3 placeholder-theme focus:outline-none" placeholder="Username or you@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-theme">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md input-theme p-3 placeholder-theme focus:outline-none" placeholder="••••••••" />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <button type="submit" disabled={loading} className="w-full inline-flex justify-center items-center px-4 py-3 rounded-md btn-accent shadow-lg transform hover:-translate-y-0.5 transition">
              {loading ? "Logging in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <a href="/register" className="text-sm muted hover:text-white">Don't have an account? Sign up</a>
        </div>
      </div>
    </div>
  );
}
