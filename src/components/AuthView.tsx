import React, { useState } from "react";
import { api } from "../api";
import { User } from "../types";
import { BookmarkCheck, ArrowRight, ShieldCheck } from "lucide-react";

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error("Please enter your name.");
        const res = await api.register(name, email, password);
        onAuthSuccess(res.user);
      } else {
        const res = await api.login(email, password);
        onAuthSuccess(res.user);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center px-4 py-12">
      {/* Brand Header */}
      <div className="text-center mb-8 max-w-md">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mx-auto mb-4 shadow-md">
          <BookmarkCheck className="w-6 h-6 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-wider">
          TRACE
        </h1>
        <p className="text-sm text-zinc-500 mt-1.5 font-medium tracking-tight">
          Find your way back.
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-7 sm:p-8 max-w-md w-full shadow-xs">
        {/* Toggle Sign In / Register */}
        <div className="flex p-1 bg-zinc-100 rounded-xl mb-6 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              !isRegister
                ? "bg-white text-zinc-900 shadow-2xs font-semibold"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              isRegister
                ? "bg-white text-zinc-900 shadow-2xs font-semibold"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rian Pratama"
                required
                className="w-full px-3.5 py-2 text-sm text-zinc-900 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rian@example.com"
              required
              className="w-full px-3.5 py-2 text-sm text-zinc-900 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2 text-sm text-zinc-900 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-zinc-900 text-white rounded-xl text-xs font-medium hover:bg-zinc-800 transition-colors shadow-xs flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            <span>{loading ? "Processing..." : isRegister ? "Sign Up" : "Sign In"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Value note */}
      <div className="mt-8 flex items-center gap-2 text-xs text-zinc-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Strict user data isolation enforced at the database level.</span>
      </div>
    </div>
  );
};
