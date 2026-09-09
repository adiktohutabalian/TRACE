import React from "react";
import { Home, FolderGit2, Plus, User } from "lucide-react";

export type MobileTab = "home" | "activities" | "profile";

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onChangeTab: (tab: MobileTab) => void;
  onOpenAddCheckpoint: () => void;
  hasActivities: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenAddCheckpoint,
  hasActivities,
}) => {
  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200/80 px-3 py-2 safe-area-pb shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* 1. HOME TAB */}
        <button
          id="mobile-nav-home"
          type="button"
          onClick={() => onChangeTab("home")}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] py-1 transition-colors rounded-xl focus:outline-none ${
            activeTab === "home"
              ? "text-zinc-950 font-semibold"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <div
            className={`p-1 rounded-lg transition-transform ${
              activeTab === "home" ? "bg-zinc-100 scale-110" : ""
            }`}
          >
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">Home</span>
        </button>

        {/* 2. ACTIVITIES TAB */}
        <button
          id="mobile-nav-activities"
          type="button"
          onClick={() => onChangeTab("activities")}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] py-1 transition-colors rounded-xl focus:outline-none ${
            activeTab === "activities"
              ? "text-zinc-950 font-semibold"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <div
            className={`p-1 rounded-lg transition-transform ${
              activeTab === "activities" ? "bg-zinc-100 scale-110" : ""
            }`}
          >
            <FolderGit2 className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">Activities</span>
        </button>

        {/* 3. PRIMARY ACTION (+) BUTTON */}
        <div className="flex flex-col items-center justify-center px-1 -mt-5">
          <button
            id="mobile-nav-add-checkpoint"
            type="button"
            onClick={onOpenAddCheckpoint}
            aria-label="Add new checkpoint"
            className="w-13 h-13 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow-lg shadow-zinc-900/30 active:scale-95 transition-all hover:bg-zinc-800 border-2 border-white focus:outline-none"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="text-[10px] font-medium text-zinc-500 mt-1 tracking-tight">
            Add
          </span>
        </div>

        {/* 4. PROFILE TAB */}
        <button
          id="mobile-nav-profile"
          type="button"
          onClick={() => onChangeTab("profile")}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] py-1 transition-colors rounded-xl focus:outline-none ${
            activeTab === "profile"
              ? "text-zinc-950 font-semibold"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <div
            className={`p-1 rounded-lg transition-transform ${
              activeTab === "profile" ? "bg-zinc-100 scale-110" : ""
            }`}
          >
            <User className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  );
};
