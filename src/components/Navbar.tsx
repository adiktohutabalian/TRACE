import React from "react";
import { User } from "../types";
import { authStorage } from "../api";
import { BookmarkCheck, LogOut, Sparkles, User as UserIcon } from "lucide-react";

interface NavbarProps {
  user: User;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigateHome }) => {
  return (
    <header className="border-b border-zinc-200 bg-white sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-left group focus:outline-none">
            
          {/* LOGO BARU */}
          <img
            src="/logo/trace.png"
            alt="TRACE Logo"
            className="w-9 h-9 rounded-xl object-contain shadow-xs group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-zinc-900 text-lg tracking-wider">
                TRACE
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 hidden sm:block tracking-tight">
              Find your way back.
            </p>
          </div>
        </button>

        {/* User profile & actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="max-w-[120px] truncate">{user.name}</span>
          </div>

          <button
            onClick={onLogout}
            title="Log Out"
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors text-xs flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
