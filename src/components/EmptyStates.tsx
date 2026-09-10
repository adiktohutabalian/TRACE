import React from "react";
import { Plus, Compass, Zap, MapPin, ArrowRight } from "lucide-react";

interface DashboardEmptyStateProps {
  onAction: () => void;
}

export const DashboardEmptyState: React.FC<DashboardEmptyStateProps> = ({ onAction }) => {
  return (
    <div
      id="dashboard-empty-state"
      className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden p-6 sm:p-10 text-center space-y-8 animate-in fade-in duration-300"
    >
      {/* Header Badge & Title */}
      <div className="max-w-md mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold tracking-wide">
          <Compass className="w-3.5 h-3.5 text-zinc-500" />
          <span>Welcome to TRACE</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
          Preserve your mental context before switching tasks
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
          Never waste 20 minutes wondering <em className="text-zinc-700 font-medium">"Where was I?"</em> again. Track your active projects and drop checkpoints whenever you step away.
        </p>
      </div>

      {/* 3 Pillars / Feature Value Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl mx-auto text-left">
        <div className="p-4 rounded-xl bg-zinc-50/80 border border-zinc-100/90 space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200/80 flex items-center justify-center text-zinc-700 shadow-2xs mb-2">
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-xs font-semibold text-zinc-900">Zero Context Loss</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Record what was in your head in under 15 seconds before taking a break or attending a meeting.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-50/80 border border-zinc-100/90 space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200/80 flex items-center justify-center text-zinc-700 shadow-2xs mb-2">
            <MapPin className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-xs font-semibold text-zinc-900">3 Gold Questions</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            What was I doing? Why does it matter? What is the exact next step to resume?
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-50/80 border border-zinc-100/90 space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200/80 flex items-center justify-center text-zinc-700 shadow-2xs mb-2">
            <Compass className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-xs font-semibold text-zinc-900">Instant Resume</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Open TRACE tomorrow or next week and immediately hit deep work flow state without friction.
          </p>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl shadow-xs transition-all cursor-pointer group"
        >
          <Plus className="w-4 h-4" />
          <span>Create Your First Activity</span>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

interface TimelineEmptyStateProps {
  onAction: () => void;
}

export const TimelineEmptyState: React.FC<TimelineEmptyStateProps> = ({ onAction }) => {
  return (
    <div
      id="timeline-empty-state"
      className="p-8 sm:p-10 text-center rounded-2xl bg-zinc-50/80 border border-dashed border-zinc-200 max-w-lg mx-auto space-y-5 animate-in fade-in duration-200"
    >
      <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200/80 text-zinc-600 flex items-center justify-center mx-auto shadow-2xs">
        <MapPin className="w-6 h-6 text-zinc-700" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-sm font-semibold text-zinc-900">
          No checkpoints dropped yet
        </h3>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
          Preserve your thought process before stepping away. When you return, you will know exactly where to pick up without hesitation.
        </p>
      </div>

      <button
        onClick={onAction}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl shadow-xs transition-all cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Drop First Checkpoint</span>
      </button>
    </div>
  );
};
