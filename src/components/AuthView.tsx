import React, { useState } from "react";
import { api } from "../api";
import { User } from "../types";
import { BookmarkCheck, ArrowRight, ShieldCheck, ArrowLeft, UserCheck } from "lucide-react";

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
  onBackToLanding?: () => void;
  initialMode?: "login" | "register";
}

export const AuthView: React.FC<AuthViewProps> = ({
  onAuthSuccess,
  onBackToLanding,
  initialMode = "login",
}) => {
  const [isRegister, setIsRegister] = useState(initialMode === "register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
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

  // Demo user quick login for interviewers / testing
  const handleQuickDemo = async () => {
    setError(null);
    setGuestLoading(true);
    try {
      try {
        const res = await api.login("demo@trace.dev", "demo1234");
        onAuthSuccess(res.user);
      } catch {
        const res = await api.register("Demo Developer", "demo@trace.dev", "demo1234");
        onAuthSuccess(res.user);
      }
    } catch (err: any) {
      setError("Failed to enter demo mode: " + (err.message || "Unknown error"));
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center px-4 py-12 relative">
      {/* Back to Landing Page button */}
      {onBackToLanding && (
        <div className="absolute top-6 left-4 sm:left-8">
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-950 bg-white hover:bg-zinc-100 border border-zinc-200/80 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      )}

      {/* Brand Header */}
      <div className="text-center mb-8 max-w-md">
        <div className="flex items-center justify-center mx-auto mb-3">
          <img
            src="/logo/trace.png"
            alt="TRACE Logo"
            className="w-13 h-13 rounded-2xl object-contain shadow-xs"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback = document.getElementById("auth-logo-fallback");
              if (fallback) fallback.style.display = "flex";
            }}
          />
          <div
            id="auth-logo-fallback"
            style={{ display: "none" }}
            className="w-12 h-12 rounded-2xl bg-zinc-900 text-white items-center justify-center shadow-md"
          >
            <BookmarkCheck className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-wider">
          TRACE
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-medium tracking-tight">
          Find your way back.
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xs">
        {/* Toggle Sign In / Register */}
        <div className="flex p-1 bg-zinc-100 rounded-xl mb-6 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              !isRegister
                ? "bg-white text-zinc-900 shadow-2xs font-semibold"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Masuk (Sign In)
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              isRegister
                ? "bg-white text-zinc-900 shadow-2xs font-semibold"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Daftar (Register)
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
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rian Pratama"
                required
                className="w-full px-3.5 py-2 text-sm text-zinc-900 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 bg-white"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700">
              Alamat Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@perusahaan.com"
              required
              className="w-full px-3.5 py-2 text-sm text-zinc-900 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 bg-white"
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
              className="w-full px-3.5 py-2 text-sm text-zinc-900 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading || guestLoading}
            className="w-full py-2.5 px-4 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-xs flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? "Memproses..." : isRegister ? "Daftar Akun Baru" : "Masuk"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200/80" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-zinc-400 font-medium">atau coba instan</span>
          </div>
        </div>

        {/* Quick Demo Access Button */}
        <button
          type="button"
          onClick={handleQuickDemo}
          disabled={loading || guestLoading}
          className="w-full py-2.5 px-4 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border border-zinc-200/90 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <span>{guestLoading ? "Membuka demo..." : "Masuk Cepat Sebagai Guest Demo"}</span>
        </button>
      </div>

      {/* Value note */}
      <div className="mt-6 flex items-center gap-2 text-xs text-zinc-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Strict user data isolation enforced at the database level.</span>
      </div>
    </div>
  );
};