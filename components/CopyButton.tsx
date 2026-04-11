"use client";

import { useState } from "react";

/**
 * Tiny clipboard button used by /for-teachers to let visitors copy badge HTML
 * snippets in one click. Falls back to a select-and-Ctrl+C hint if the
 * Clipboard API is unavailable (older browsers, file:// contexts).
 */
export default function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onClick() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Older browsers — surface a hint instead of silently failing.
      setCopied(false);
      alert("Couldn't copy automatically — please select the snippet and press Ctrl+C.");
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
        copied
          ? "bg-emerald-100 text-emerald-700"
          : "bg-emerald-600 text-white hover:bg-emerald-700"
      }`}
      aria-live="polite"
    >
      {copied ? "✓ Copied" : label}
    </button>
  );
}
