import React from "react";
import { ResumeData } from "../types";
import {
  Compass,
  AlertCircle,
  ArrowRight,
  Plus,
  History,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface ResumeCardProps {
  resumeData: ResumeData | null;
  onOpenCheckpointModal: (activityId: string) => void;
  onViewActivityDetail: (activityId: string) => void;
  onOpenCreateActivity: () => void;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({
  resumeData,
  onOpenCheckpointModal,
  onViewActivityDetail,
  onOpenCreateActivity,
}) => {
  if (!resumeData) {
    return (
      <div className="bg-white border border-dashed border-zinc-300 rounded-2xl p-8 sm:p-10 text-center max-w-3xl mx-auto shadow-xs">
        <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-500">
          <Compass className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 mb-1">
          No checkpoints saved yet
        </h3>
        <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">
          Create your first activity and drop a checkpoint before taking a break,
          so you can return knowing exactly where you left off.
        </p>
        <button
          onClick={onOpenCreateActivity}
          className="inline-flex items-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 text-sm font-medium px-5 py-2.5 rounded-xl shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          Create First Activity
        </button>
      </div>
    );
  }

  const { activity, checkpoint } = resumeData;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} minutes ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs overflow-hidden transition-all">
      {/* Top Banner: Context Header */}
      <div className="bg-zinc-900 text-white px-5 sm:px-7 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: activity.color || "#6366f1" }}
          />
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
            Continue Where You Left Off
          </span>
          <span className="text-zinc-600">/</span>
          <h2 className="text-sm font-semibold text-white tracking-tight">
            {activity.title}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>Last checkpoint: {formatDate(checkpoint.created_at)}</span>
        </div>
      </div>

      {/* Main 3-Pillar Context Body */}
      <div className="p-5 sm:p-7 space-y-5">
        {/* Pillar 1: Where I left off */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 uppercase tracking-wide">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>Where I Left Off</span>
          </div>
          <p className="text-base sm:text-lg font-medium text-zinc-900 leading-relaxed pl-6 border-l-2 border-indigo-200">
            {checkpoint.where_left_off}
          </p>
        </div>

        {/* Pillar 2: What's important? (Optional) */}
        {checkpoint.whats_important && (
          <div className="space-y-1.5 bg-amber-50/70 border border-amber-200/80 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 uppercase tracking-wide">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>What Matters / Context to Remember</span>
            </div>
            <p className="text-sm text-amber-950 font-normal leading-relaxed pl-6">
              {checkpoint.whats_important}
            </p>
          </div>
        )}

        {/* Pillar 3: What's next? */}
        <div className="space-y-1.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 uppercase tracking-wide">
            <ArrowRight className="w-4 h-4 text-emerald-600" />
            <span>Immediate Next Step</span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-emerald-950 leading-relaxed pl-6">
            {checkpoint.whats_next}
          </p>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="bg-zinc-50 border-t border-zinc-200/80 px-5 sm:px-7 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-zinc-500 font-normal">
          Keep this open, or minimize while doing your work. Drop a new checkpoint
          when you stop.
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onViewActivityDetail(activity.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 hover:text-zinc-900 transition-colors shadow-2xs"
          >
            <History className="w-3.5 h-3.5 text-zinc-500" />
            <span>View Timeline</span>
          </button>

          <button
            onClick={() => onOpenCheckpointModal(activity.id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Drop New Checkpoint</span>
          </button>
        </div>
      </div>
    </div>
  );
};
