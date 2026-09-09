import React, { useState } from "react";
import { X, Plus, Sparkles, Loader2 } from "lucide-react";

interface NewActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    title: string;
    description?: string;
    color: string;
    initial_where?: string;
    initial_important?: string;
    initial_next?: string;
  }) => Promise<void>;
}

const COLORS = [
  { label: "Indigo", value: "#6366f1" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Emerald", value: "#10b981" },
  { label: "Rose", value: "#f43f5e" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Purple", value: "#8b5cf6" },
];

export const NewActivityModal: React.FC<NewActivityModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLORS[0].value);
  const [showInitialCheckpoint, setShowInitialCheckpoint] = useState(false);
  const [initialWhere, setInitialWhere] = useState("");
  const [initialImportant, setInitialImportant] = useState("");
  const [initialNext, setInitialNext] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide an activity title.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onCreate({
        title: title.trim(),
        description: description.trim() || undefined,
        color,
        initial_where: showInitialCheckpoint ? initialWhere.trim() : undefined,
        initial_important: showInitialCheckpoint ? initialImportant.trim() : undefined,
        initial_next: showInitialCheckpoint ? initialNext.trim() : undefined,
      });
      // reset
      setTitle("");
      setDescription("");
      setShowInitialCheckpoint(false);
      setInitialWhere("");
      setInitialImportant("");
      setInitialNext("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create activity");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="new-activity-modal-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full shadow-2xl border border-zinc-200 overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-200">
        {/* Mobile handle indicator */}
        <div className="w-12 h-1.5 bg-zinc-300 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Header */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div>
            <h3 className="text-base font-semibold text-zinc-900 tracking-tight">
              Create New Activity
            </h3>
            <p className="text-xs text-zinc-500">
              A space for your project, subject, or learning track.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 p-2 rounded-xl hover:bg-zinc-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable on small screens */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800">
              Activity Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Japanese Learning, JavaScript Project, College Thesis"
              required
              className="w-full px-3.5 py-2 text-sm text-zinc-900 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 placeholder:text-zinc-400 transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800">
              Description / Goal <span className="text-[11px] text-zinc-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Minna no Nihongo self-study & vocabulary"
              className="w-full px-3.5 py-2 text-sm text-zinc-900 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 placeholder:text-zinc-400 transition-all"
            />
          </div>

          {/* Color Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800">
              Color Identifier
            </label>
            <div className="flex items-center gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-7 h-7 rounded-full transition-all flex items-center justify-center ${
                    color === c.value
                      ? "ring-2 ring-zinc-900 ring-offset-2 scale-110"
                      : "opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Optional: Add first checkpoint right now */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowInitialCheckpoint(!showInitialCheckpoint)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {showInitialCheckpoint
                  ? "— Remove initial checkpoint"
                  : "+ Record where you currently are (Optional)"}
              </span>
            </button>

            {showInitialCheckpoint && (
              <div className="mt-3 p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                    Where did you leave off?
                  </label>
                  <input
                    type="text"
                    value={initialWhere}
                    onChange={(e) => setInitialWhere(e.target.value)}
                    placeholder="e.g. Finished chapter 11"
                    className="w-full px-3 py-1.5 text-xs text-zinc-900 border border-zinc-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                    What is your immediate next step?
                  </label>
                  <input
                    type="text"
                    value={initialNext}
                    onChange={(e) => setInitialNext(e.target.value)}
                    placeholder="e.g. Read chapter 12 grammar"
                    className="w-full px-3 py-1.5 text-xs text-zinc-900 border border-zinc-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all shadow-xs flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-300" />
                  <span>Creating Activity...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Activity</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
