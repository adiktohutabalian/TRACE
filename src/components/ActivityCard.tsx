import React, { useState } from "react";
import { Activity } from "../types";
import {
  Compass,
  ArrowRight,
  Plus,
  Trash2,
  Clock,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface ActivityCardProps {
  activity: Activity;
  onOpenCheckpointModal: (activityId: string) => void;
  onViewActivityDetail: (activityId: string) => void;
  onDeleteActivity: (activityId: string) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onOpenCheckpointModal,
  onViewActivityDetail,
  onDeleteActivity,
}) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const formatRelativeTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const checkpoint = activity.latest_checkpoint;

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-zinc-300 transition-all shadow-2xs flex flex-col justify-between group">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: activity.color || "#6366f1" }}
            />
            <h3
              onClick={() => onViewActivityDetail(activity.id)}
              className="font-semibold text-zinc-900 text-base hover:text-indigo-600 cursor-pointer transition-colors leading-tight"
            >
              {activity.title}
            </h3>
          </div>

          {/* Delete Action with inline confirm */}
          <div className="relative">
            {isConfirmingDelete ? (
              <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 rounded-lg p-1 text-xs">
                <button
                  onClick={() => onDeleteActivity(activity.id)}
                  className="px-2 py-0.5 font-medium bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsConfirmingDelete(false)}
                  className="px-2 py-0.5 text-zinc-600 hover:text-zinc-900"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsConfirmingDelete(true)}
                title="Delete Activity"
                className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-600 transition-all rounded hover:bg-zinc-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        {activity.description && (
          <p className="text-xs text-zinc-500 mb-4 line-clamp-1">
            {activity.description}
          </p>
        )}

        {/* Latest Context Preview or Empty State */}
        {checkpoint ? (
          <div className="space-y-2.5 my-3 bg-zinc-50/80 rounded-lg p-3.5 border border-zinc-100">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                <Compass className="w-3 h-3 text-zinc-500" />
                <span>Last Left Off:</span>
              </div>
              <p className="text-xs font-medium text-zinc-900 line-clamp-2">
                {checkpoint.where_left_off}
              </p>
            </div>

            <div className="pt-2 border-t border-zinc-200/60">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                <ArrowRight className="w-3 h-3 text-emerald-600" />
                <span>Next:</span>
              </div>
              <p className="text-xs text-zinc-800 line-clamp-1 font-medium">
                {checkpoint.whats_next}
              </p>
            </div>
          </div>
        ) : (
          <div className="my-3 py-4 px-3 bg-zinc-50 rounded-lg border border-dashed border-zinc-200 text-center">
            <p className="text-xs text-zinc-500">
              No checkpoints yet. Record where you stop today.
            </p>
          </div>
        )}
      </div>

      {/* Footer controls: Quick Action & Details */}
      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
          <Clock className="w-3 h-3" />
          <span>
            {checkpoint
              ? `Updated ${formatRelativeTime(checkpoint.created_at)}`
              : "New"}
          </span>
          <span className="text-zinc-300">•</span>
          <span>{activity.checkpoint_count || 0} checkpoints</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenCheckpointModal(activity.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors"
          >
            <Plus className="w-3 h-3 text-zinc-600" />
            <span>Checkpoint</span>
          </button>

          <button
            onClick={() => onViewActivityDetail(activity.id)}
            className="inline-flex items-center gap-0.5 px-2 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors"
          >
            <span>Timeline</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
