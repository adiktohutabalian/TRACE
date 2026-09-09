import React from "react";
import { FolderGit2, Plus, X, ArrowRight } from "lucide-react";
import { Activity } from "../types";

interface ActivitySelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
  onSelectActivity: (activity: Activity) => void;
  onCreateNewActivity: () => void;
}

export const ActivitySelectModal: React.FC<ActivitySelectModalProps> = ({
  isOpen,
  onClose,
  activities,
  onSelectActivity,
  onCreateNewActivity,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="activity-select-modal-backdrop"
      className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-xs flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="activity-select-sheet"
        className="w-full md:max-w-md bg-white rounded-t-3xl md:rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200"
      >
        {/* Mobile handle indicator */}
        <div className="w-12 h-1.5 bg-zinc-300 rounded-full mx-auto mt-3 md:hidden" />

        <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">
              Create New Checkpoint
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Choose which activity you want to trace
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of activities */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {activities.map((act) => (
            <button
              key={act.id}
              type="button"
              onClick={() => {
                onSelectActivity(act);
                onClose();
              }}
              className="w-full text-left p-3.5 rounded-xl border border-zinc-200 hover:border-zinc-400 bg-white hover:bg-zinc-50 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-100 group-hover:bg-zinc-200 flex items-center justify-center text-zinc-700 transition-colors">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <div>
                <h4 className="text-sm font-semibold text-zinc-900 line-clamp-1">
                {act.title}
                </h4>
                <p className="text-[11px] text-zinc-500 line-clamp-1">
                {act.description || "Activity"}
                </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-800 transition-colors" />
            </button>
          ))}

          {/* Option to create a new activity directly */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onCreateNewActivity();
            }}
            className="w-full mt-2 p-3.5 rounded-xl border border-dashed border-zinc-300 hover:border-zinc-400 bg-zinc-50/70 hover:bg-zinc-100 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            Start a Brand New Activity
          </button>
        </div>
      </div>
    </div>
  );
};
