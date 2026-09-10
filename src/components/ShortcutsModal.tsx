import React from "react";
import { X, Command } from "lucide-react";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    {
      keys: ["C"],
      label: "Drop Checkpoint",
      description: "Quickly record your current mental state before leaving",
    },
    {
      keys: ["N"],
      label: "New Activity",
      description: "Create a new project or task to track",
    },
    {
      keys: ["?"],
      label: "Keyboard Shortcuts",
      description: "Open this cheat sheet dialog",
    },
    {
      keys: ["Esc"],
      label: "Close Modal",
      description: "Dismiss any active popover or dialog window",
    },
  ];

  return (
    <div
      id="shortcuts-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
              <Command className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-zinc-900">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close shortcuts modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 space-y-3">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.label}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 transition-colors"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-zinc-900">
                  {shortcut.label}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {shortcut.description}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((k) => (
                  <kbd
                    key={k}
                    className="min-w-[24px] h-6 px-1.5 flex items-center justify-center text-[11px] font-mono font-semibold text-zinc-700 bg-zinc-100 border border-zinc-200 rounded shadow-2xs"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 bg-zinc-50 border-t border-zinc-100 text-center">
          <p className="text-[11px] text-zinc-500">
            Shortcuts are disabled while typing inside forms or text areas.
          </p>
        </div>
      </div>
    </div>
  );
};
