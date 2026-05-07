"use client";

import { X } from "lucide-react";

export type ErrorPayload =
  | string
  | { message?: string; errors?: Record<string, string[]> }
  | Record<string, string[]>;

interface ErrorAlertProps {
  error: ErrorPayload;
  onClose?: () => void;
}

export default function ErrorAlert({ error, onClose }: ErrorAlertProps) {
  let title = "Ups..!";
  let messages: string[] = [];

  if (typeof error === "string") {
    messages = [error];
  } else if ("errors" in error && error.errors) {
    // Laravel 422: { message, errors: { field: [msg, ...] } }
    title = (error as { message?: string }).message ?? "Ups..!";
    messages = Object.values(error.errors).flat();
  } else {
    // Record<string, string[]> langsung
    messages = Object.values(error as Record<string, string[]>).flat();
  }

  // if (messages.length === 0) return null;

  return (
    <div role="alert" className="alert alert-error relative pr-10">
      <div className="flex-1">
        <p className="font-semibold text-sm">{title}</p>
        <ul className="list-disc pl-4 text-sm mt-1 space-y-0.5">
          {messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 btn btn-ghost btn-xs btn-circle"
          aria-label="Tutup"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
