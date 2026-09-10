import React from "react";
import { User } from "../types";
import { BookmarkCheck, LogOut, Command } from "lucide-react";

interface NavbarProps {
  user: User;
  onLogout: () => void;
  onNavigateHome: () => void;
  onOpenShortcuts?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  onNavigateHome,
  onOpenShortcuts,
}) => {
  return (
    <header className="border-b border-zinc-200 bg-white sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
        >
          <img
            src="/logo/trace.png"
            alt="TRACE Logo"
            className="w-9 h-9 rounded-xl object-contain shadow-xs group-hover:scale-105 transition-transform"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback = document.getElementById("nav-logo-fallback");
              if (fallback) fallback.style.display = "flex";
            }}
          />
          <div
            id="nav-logo-fallback"
            style={{ display: "none" }}
            className="w-9 h-9 rounded-xl bg-zinc-900 text-white items-center justify-center font-bold tracking-wider shadow-sm group-hover:bg-zinc-800 transition-colors"
          >
            <BookmarkCheck className="w-5 h-5 text-emerald-400" />
          </div>
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
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenShortcuts && (
            <button
              onClick={onOpenShortcuts}
              title="Keyboard Shortcuts (?)"
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Command className="w-4 h-4 text-zinc-600" />
              <span className="hidden sm:inline font-medium">Shortcuts</span>
              <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 rounded text-zinc-500">
                ?
              </kbd>
            </button>
          )}

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
              {(user.name || user.name || user.email).charAt(0).toUpperCase()}
            </div>
            <span className="max-w-[140px] truncate">
              {user.name || user.name || user.email}
            </span>
          </div>

          <button
            onClick={onLogout}
            title="Log Out"
            className="hidden md:flex p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors text-xs items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
