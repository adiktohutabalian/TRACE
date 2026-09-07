import React, { useEffect, useState } from "react";
import { Activity, Checkpoint } from "../types";
import { api } from "../api";
import {
  ArrowLeft,
  Compass,
  AlertCircle,
  ArrowRight,
  Plus,
  Edit2,
  Clock,
  Sparkles,
} from "lucide-react";

interface ActivityDetailViewProps {
  activityId: string;
  onBack: () => void;
  onOpenCheckpointModal: (activityId: string, checkpoint?: Checkpoint) => void;
}

export const ActivityDetailView: React.FC<ActivityDetailViewProps> = ({
  activityId,
  onBack,
  onOpenCheckpointModal,
}) => {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await api.getActivityCheckpoints(activityId);
      setActivity(data.activity);
      setCheckpoints(data.checkpoints);
    } catch (err: any) {
      setError(err.message || "Failed to load activity details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [activityId]);

  const formatFullDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-zinc-500">
        Loading context timeline...
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-rose-600 mb-4">{error || "Activity not found"}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Activities</span>
      </button>

      {/* Activity Overview Header */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: activity.color || "#6366f1" }}
            />
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              {activity.title}
            </h1>
          </div>
          {activity.description && (
            <p className="text-sm text-zinc-500 pl-6">{activity.description}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-zinc-400 pl-6 pt-1">
            <span>Created {new Date(activity.created_at).toLocaleDateString()}</span>
            <span>•</span>
            <span>{checkpoints.length} saved checkpoints</span>
          </div>
        </div>

        <button
          onClick={() => onOpenCheckpointModal(activity.id)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl text-xs font-medium transition-all shadow-xs"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>+ Drop New Checkpoint</span>
        </button>
      </div>

      {/* Timeline of Checkpoints */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Timeline History ({checkpoints.length})
          </h2>
          <span className="text-xs text-zinc-400">Newest first</span>
        </div>

        {checkpoints.length === 0 ? (
          <div className="bg-white border border-dashed border-zinc-200 rounded-2xl p-8 text-center">
            <Compass className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-zinc-800">
              No checkpoints recorded yet
            </h3>
            <p className="text-xs text-zinc-500 mt-1 mb-4">
              Leave a checkpoint whenever you pause your work to resume
              seamlessly next time.
            </p>
            <button
              onClick={() => onOpenCheckpointModal(activity.id)}
              className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-medium"
            >
              Drop First Checkpoint
            </button>
          </div>
        ) : (
          <div className="relative border-l-2 border-zinc-200 ml-4 space-y-6 py-2">
            {checkpoints.map((chk, index) => {
              const isLatest = index === 0;

              return (
                <div key={chk.id} className="relative pl-6 sm:pl-8 group">
                  {/* Timeline Dot */}
                  <span
                    className={`absolute -left-[9px] top-4 w-4 h-4 rounded-full border-2 border-white transition-all ${
                      isLatest ? "bg-emerald-500 ring-4 ring-emerald-100" : "bg-zinc-300"
                    }`}
                  />

                  {/* Checkpoint Card */}
                  <div
                    className={`bg-white border rounded-2xl p-5 sm:p-6 transition-all ${
                      isLatest
                        ? "border-zinc-300 shadow-xs ring-1 ring-zinc-200/50"
                        : "border-zinc-200 hover:border-zinc-300 shadow-2xs"
                    }`}
                  >
                    {/* Header line of this checkpoint */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-zinc-100 text-xs">
                      <div className="flex items-center gap-2">
                        {isLatest && (
                          <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full text-[10px] tracking-wide uppercase">
                            Latest Context
                          </span>
                        )}
                        <span className="text-zinc-500 flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {formatFullDate(chk.created_at)}
                        </span>
                      </div>

                      <button
                        onClick={() => onOpenCheckpointModal(activity.id, chk)}
                        className="text-zinc-400 hover:text-zinc-700 p-1 rounded hover:bg-zinc-100 transition-colors flex items-center gap-1 text-[11px]"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>

                    {/* 3 Pillars */}
                    <div className="space-y-3.5">
                      {/* Where */}
                      <div>
                        <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                          <Compass className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Where I Stopped:</span>
                        </div>
                        <p className="text-sm font-medium text-zinc-900 pl-5">
                          {chk.where_left_off}
                        </p>
                      </div>

                      {/* Important / Blocker */}
                      {chk.whats_important && (
                        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs">
                          <div className="text-[11px] font-semibold text-amber-900 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Important Context:</span>
                          </div>
                          <p className="text-amber-950 pl-5">
                            {chk.whats_important}
                          </p>
                        </div>
                      )}

                      {/* Next */}
                      <div className="bg-emerald-50/50 border border-emerald-200/70 rounded-xl p-3 text-xs">
                        <div className="text-[11px] font-semibold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                          <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Next Action:</span>
                        </div>
                        <p className="text-emerald-950 font-semibold pl-5">
                          {chk.whats_next}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
