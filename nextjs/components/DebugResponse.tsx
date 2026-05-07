"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { BugIcon, X } from "lucide-react";

interface DebugResponseProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  buttonTitle?: string;
  title?: string;
  placement?: "right" | "left";
}

export default function DebugResponse({
  data,
  buttonTitle = "Debug",
  title = "Debug Data",
  placement = "right",
}: DebugResponseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const panel = (
    <>
      {/* Backdrop — klik untuk tutup */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/50 z-998 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 h-full w-full max-w-sm md:max-w-lg z-999 bg-base-100 shadow-2xl flex flex-col
          transition-transform duration-300 ease-in-out
          ${placement === "right" ? "right-0" : "left-0"}
          ${isOpen
            ? "translate-x-0"
            : placement === "right"
              ? "translate-x-full"
              : "-translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-4 py-3 border-b border-base-200 shrink-0">
          <div>
            <p className="font-semibold">{title}</p>
            <p className="text-xs text-base-content/40 italic">Development Debug Only</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto bg-neutral p-4">
          {data !== undefined && data !== null ? (
            <pre className="font-mono text-xs text-neutral-content whitespace-pre-wrap break-all">
              {JSON.stringify(data, null, 2)}
            </pre>
          ) : (
            <p className="italic text-sm text-neutral-content/50">
              Tidak ada data untuk ditampilkan!
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-base-200 flex justify-end shrink-0">
          <button
            onClick={() => setIsOpen(false)}
            className="btn btn-error btn-outline btn-sm gap-1"
          >
            <X className="w-4 h-4" />
            Tutup
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Trigger — dirender inline, ikut posisi parent */}
      <button
        onClick={() => setIsOpen(true)}
        className={`btn btn-warning btn-sm shadow-lg gap-1 ${placement === "right" ? "rounded-r-none" : "rounded-l-none"
          }`}
      >
        <BugIcon className="w-4 h-4" />
        {buttonTitle}
      </button>

      {/* Panel diportal ke document.body — bebas dari transform/z-index parent */}
      {mounted && createPortal(panel, document.body)}
    </>
  );
}
