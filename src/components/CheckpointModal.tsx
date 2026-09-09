import React, { useState, useEffect } from "react";
import { Checkpoint, Activity } from "../types";
import { X, Compass, AlertCircle, ArrowRight, Check, Loader2 } from "lucide-react";

interface CheckpointModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  editingCheckpoint?: Checkpoint | null;
  onSave: (data: {
    where_left_off: string;
    whats_important?: string;
    whats_next: string;
  }) => Promise<void>;
}

export const CheckpointModal: React.FC<CheckpointModalProps> = ({
  isOpen,
  onClose,
  activity,
  editingCheckpoint,
  onSave,
}) => {
  const [whereLeftOff, setWhereLeftOff] = useState("");
  const [whatsImportant, setWhatsImportant] = useState("");
  const [whatsNext, setWhatsNext] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingCheckpoint) {
      setWhereLeftOff(editingCheckpoint.where_left_off);
      setWhatsImportant(editingCheckpoint.whats_important || "");
      setWhatsNext(editingCheckpoint.whats_next);
    } else {
      setWhereLeftOff("");
      setWhatsImportant("");
      setWhatsNext("");
    }
    setError(null);
  }, [editingCheckpoint, isOpen]);

  if (!isOpen || !activity) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whereLeftOff.trim()) {
      setError("Please describe where you left off.");
      return;
    }
    if (!whatsNext.trim()) {
      setError("Please specify what your immediate next step will be.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSave({
        where_left_off: whereLeftOff.trim(),
        whats_important: whatsImportant.trim() || undefined,
        whats_next: whatsNext.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save checkpoint");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="checkpoint-modal-backdrop"
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
          <div className="flex items-center gap-2.5">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: activity.color || "#6366f1" }}
            />
            <div>
              <h3 className="text-base font-semibold text-zinc-900 tracking-tight">
                {editingCheckpoint ? "Edit Checkpoint" : "Drop Checkpoint"}
              </h3>
              <p className="text-xs text-zinc-500 font-medium line-clamp-1">{activity.title}</p>
            </div>
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
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Field 1: Where I left off */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              <span>Where did you leave off?</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>
            <textarea
              value={whereLeftOff}
              onChange={(e) => setWhereLeftOff(e.target.value)}
              placeholder="e.g. Completed Chapter 12 Grammar section, fixed bug in auth redirection route..."
              rows={2}
              required
              className="w-full px-3.5 py-2 text-sm text-zinc-900 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 placeholder:text-zinc-400 transition-all resize-none"
            />
          </div>

          {/* Field 2: What's important (Optional) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>What's important / blocking?</span>
              </label>
              <span className="text-[11px] text-zinc-400">Optional</span>
            </div>
            <textarea
              value={whatsImportant}
              onChange={(e) => setWhatsImportant(e.target.value)}
              placeholder="e.g. Still unclear why particle で is used here, or link to relevant docs..."
              rows={2}
              className="w-full px-3.5 py-2 text-sm text-zinc-900 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 placeholder:text-zinc-400 transition-all resize-none"
            />
          </div>

          {/* Field 3: What's next */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800">
              <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
              <span>What is your exact next step?</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>
            <textarea
              value={whatsNext}
              onChange={(e) => setWhatsNext(e.target.value)}
              placeholder="e.g. Write unit test for authentication, or review particle cheat sheet..."
              rows={2}
              required
              className="w-full px-3.5 py-2 text-sm text-zinc-900 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 placeholder:text-zinc-400 transition-all resize-none"
            />
          </div>

          {/* Helper note */}
          <p className="text-[11px] text-zinc-400">
            Tip: Writing a concrete next step makes it 80% easier to jump back in
            tomorrow.
          </p>

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
                  <span>Saving Checkpoint...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {editingCheckpoint ? "Update Checkpoint" : "Save Checkpoint"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
