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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200/80 px-2 py-1.5 shadow-[0_-2px_15px_rgba(0,0,0,0.03)] safe-area-pb"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 items-center">
        {/* 1. HOME TAB */}
        <button
          id="mobile-nav-home"
          type="button"
          onClick={() => onChangeTab("home")}
          className={`flex flex-col items-center justify-center py-1 transition-colors rounded-xl focus:outline-none cursor-pointer ${
            activeTab === "home"
              ? "text-zinc-950 font-semibold"
              : "text-zinc-400 hover:text-zinc-700"
          }`}
        >
          <div className="h-7 flex items-center justify-center">
            <Home
              className={`w-5 h-5 transition-transform ${
                activeTab === "home" ? "stroke-[2.2] scale-105" : "stroke-[1.8]"
              }`}
            />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Home</span>
        </button>

        {/* 2. ACTIVITIES TAB */}
        <button
          id="mobile-nav-activities"
          type="button"
          onClick={() => onChangeTab("activities")}
          className={`flex flex-col items-center justify-center py-1 transition-colors rounded-xl focus:outline-none cursor-pointer ${
            activeTab === "activities"
              ? "text-zinc-950 font-semibold"
              : "text-zinc-400 hover:text-zinc-700"
          }`}
        >
          <div className="h-7 flex items-center justify-center">
            <FolderGit2
              className={`w-5 h-5 transition-transform ${
                activeTab === "activities"
                  ? "stroke-[2.2] scale-105"
                  : "stroke-[1.8]"
              }`}
            />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Activities</span>
        </button>

        {/* 3. PRIMARY ACTION (+) BUTTON - Symmetrically Aligned in Grid */}
        <button
          id="mobile-nav-add-checkpoint"
          type="button"
          onClick={onOpenAddCheckpoint}
          aria-label="Add new checkpoint"
          className="flex flex-col items-center justify-center py-1 transition-all group focus:outline-none cursor-pointer"
        >
          <div className="h-7 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow-xs group-active:scale-90 group-hover:bg-zinc-800 transition-all">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <span className="text-[10px] font-semibold text-zinc-900 mt-0.5 tracking-tight">
            Add
          </span>
        </button>

        {/* 4. PROFILE TAB */}
        <button
          id="mobile-nav-profile"
          type="button"
          onClick={() => onChangeTab("profile")}
          className={`flex flex-col items-center justify-center py-1 transition-colors rounded-xl focus:outline-none cursor-pointer ${
            activeTab === "profile"
              ? "text-zinc-950 font-semibold"
              : "text-zinc-400 hover:text-zinc-700"
          }`}
        >
          <div className="h-7 flex items-center justify-center">
            <User
              className={`w-5 h-5 transition-transform ${
                activeTab === "profile"
                  ? "stroke-[2.2] scale-105"
                  : "stroke-[1.8]"
              }`}
            />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Profile</span>
        </button>
      </div>
    </nav>
  );
};