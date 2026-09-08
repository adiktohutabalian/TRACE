import React from "react";
import { LogOut, ShieldCheck, Database } from "lucide-react";
import { User as UserType } from "../types";

interface ProfileModalProps {
  user: UserType | null;
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
  activitiesCount: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSignOut,
  activitiesCount,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div
      id="profile-modal-backdrop"
      className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-xs flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="profile-modal-sheet"
        className="w-full md:max-w-md bg-white rounded-t-3xl md:rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden animate-in slide-in-from-bottom-6 duration-200"
      >
        {/* Mobile handle indicator */}
        <div className="w-12 h-1.5 bg-zinc-300 rounded-full mx-auto mt-3 md:hidden" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-zinc-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
                  {user.name || "TRACE User"}
                </h3>
                <p className="text-xs text-zinc-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100"
            >
              Tutup
            </button>
          </div>

          {/* Account Details */}
          <div className="py-4 space-y-3">
            <div className="flex items-center justify-between py-2 px-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="flex items-center gap-2.5 text-xs text-zinc-600">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Cloud Storage</span>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Supabase Connected
              </span>
            </div>

            <div className="flex items-center justify-between py-2 px-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="flex items-center gap-2.5 text-xs text-zinc-600">
                <ShieldCheck className="w-4 h-4 text-zinc-500" />
                <span>Total Active Projects</span>
              </div>
              <span className="text-xs font-bold text-zinc-900">
                {activitiesCount} Activities
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-zinc-100 space-y-2.5">
            <button
              id="mobile-logout-button"
              type="button"
              onClick={() => {
                onClose();
                onSignOut();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 active:scale-[0.98] transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out from TRACE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};