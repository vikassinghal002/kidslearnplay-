"use client";

import { useRef, useState, useEffect } from "react";

interface Props {
  children: React.ReactNode;
  title: string;
  howToPlay: string[];
  skills: string[];
}

export default function GameScreen({ children, title, howToPlay, skills }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFS, setIsFS]       = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFS(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-gray-950 ${isFS ? "fixed inset-0 z-[9999] overflow-hidden" : "w-full h-full"}`}
    >
      {/* ── Game area ──────────────────────────────────────────────────── */}
      <div className={`relative flex items-center justify-center bg-gray-950 w-full ${isFS ? "flex-1 min-h-0 overflow-hidden" : ""}`}>

        {/* Game component — fills width; each game constrains own max-size */}
        <div className={isFS ? "w-full h-full flex items-center justify-center" : "w-full flex items-center justify-center"}>
          {children}
        </div>

        {/* Fullscreen toggle button */}
        <button
          onClick={toggleFullscreen}
          title={isFS ? "Exit fullscreen" : "Enter fullscreen"}
          className="absolute top-2 right-2 z-10 w-9 h-9 flex items-center justify-center rounded-lg bg-black/60 text-white text-lg hover:bg-black/80 active:scale-95 transition-all backdrop-blur-sm border border-white/10"
        >
          {isFS ? "✕" : "⛶"}
          <span className="sr-only">{isFS ? "Exit Fullscreen" : "Fullscreen"}</span>
        </button>
      </div>

      {/* ── Info bar (hidden in fullscreen) ────────────────────────────── */}
      {!isFS && (
        <div className="bg-gray-900 border-t border-gray-800">
          <button
            onClick={() => setInfoOpen(!infoOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <span className="font-semibold text-gray-300">How to Play & Skills</span>
            <span className="text-base">{infoOpen ? "▲" : "▼"}</span>
          </button>
          {infoOpen && (
            <div className="px-4 pb-4 grid sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">How to Play</h4>
                <ul className="space-y-1">
                  {howToPlay.map((tip, i) => (
                    <li key={i} className="text-sm text-gray-300 flex gap-2">
                      <span className="text-purple-400 flex-shrink-0">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Skills Practised</h4>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span key={s} className="text-xs bg-purple-900/60 text-purple-300 border border-purple-700/50 px-2 py-0.5 rounded-full capitalize">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
