"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors text-sm shadow-sm"
    >
      🖨️ Print Page
    </button>
  );
}
