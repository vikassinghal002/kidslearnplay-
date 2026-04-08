"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const COLORS = [
  "#e63946", "#f4a261", "#e9c46a", "#2a9d8f",
  "#457b9d", "#a8dadc", "#6a4c93", "#f72585",
  "#ff9f1c", "#2ec4b6", "#8ecae6", "#ffbf69",
  "#000000", "#ffffff", "#6b7280", "#92400e",
];

const COLOR_LABELS: Record<string, string> = {
  "#e63946": "Red", "#f4a261": "Orange", "#e9c46a": "Yellow", "#2a9d8f": "Teal",
  "#457b9d": "Blue", "#a8dadc": "Sky", "#6a4c93": "Purple", "#f72585": "Pink",
  "#ff9f1c": "Amber", "#2ec4b6": "Mint", "#8ecae6": "Light Blue", "#ffbf69": "Peach",
  "#000000": "Black", "#ffffff": "Eraser", "#6b7280": "Grey", "#92400e": "Brown",
};

type Props = { slug: string; title: string; emoji: string };

export default function ColoringCanvas({ slug, title, emoji }: Props) {
  const [selectedColor, setSelectedColor] = useState("#e63946");
  const [hasImage, setHasImage] = useState(false);
  const [imageChecked, setImageChecked] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const imageSrc = `/images/coloring/${slug}.png`;

  // Check if PNG image exists
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setHasImage(true);
      setImageChecked(true);
      imageRef.current = img;
    };
    img.onerror = () => {
      setHasImage(false);
      setImageChecked(true);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Once image loads, draw it onto canvas
  useEffect(() => {
    if (!hasImage || !imageRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = imageRef.current.naturalWidth || 800;
    canvas.height = imageRef.current.naturalHeight || 1000;
    ctx.drawImage(imageRef.current, 0, 0);
  }, [hasImage, imageChecked]);

  // Flood fill algorithm for interactive coloring
  function hexToRgb(hex: string): [number, number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b, 255];
  }

  function floodFill(canvas: HTMLCanvasElement, x: number, y: number, fillColor: string) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const idx = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
    const targetR = data[idx];
    const targetG = data[idx + 1];
    const targetB = data[idx + 2];

    const [fillR, fillG, fillB] = hexToRgb(fillColor);

    // Don't fill if clicking on a black outline
    if (targetR < 50 && targetG < 50 && targetB < 50) return;
    // Don't fill if already this color
    if (targetR === fillR && targetG === fillG && targetB === fillB) return;

    const tolerance = 40;
    function matches(i: number) {
      return (
        Math.abs(data[i] - targetR) <= tolerance &&
        Math.abs(data[i + 1] - targetG) <= tolerance &&
        Math.abs(data[i + 2] - targetB) <= tolerance
      );
    }

    const stack = [[Math.floor(x), Math.floor(y)]];
    const visited = new Uint8Array(canvas.width * canvas.height);

    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!;
      if (cx < 0 || cy < 0 || cx >= canvas.width || cy >= canvas.height) continue;
      const i = (cy * canvas.width + cx) * 4;
      if (visited[cy * canvas.width + cx]) continue;
      if (!matches(i)) continue;

      visited[cy * canvas.width + cx] = 1;
      data[i] = fillR;
      data[i + 1] = fillG;
      data[i + 2] = fillB;
      data[i + 3] = 255;

      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  }

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const fillColor = selectedColor === "#ffffff" ? "#ffffff" : selectedColor;
    floodFill(canvas, x, y, fillColor);
  }

  function handleReset() {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageRef.current, 0, 0);
  }

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${slug}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  if (!imageChecked) {
    return (
      <div className="bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading coloring page...</div>
      </div>
    );
  }

  // ── PNG image exists → interactive canvas coloring ──────────────────────────
  if (hasImage) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5 p-3 bg-gray-50 border-b border-gray-200">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              title={COLOR_LABELS[color] ?? color}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 flex-shrink-0 ${
                selectedColor === color
                  ? "border-gray-900 scale-125 shadow-md"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color === "#ffffff" ? "#f9fafb" : color,
                       boxShadow: color === "#ffffff" ? "inset 0 0 0 1px #d1d5db" : undefined }}
            />
          ))}
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            <div
              className="w-8 h-8 rounded-full border-2 border-gray-400"
              style={{ backgroundColor: selectedColor === "#ffffff" ? "#f9fafb" : selectedColor }}
              title="Current colour"
            />
            <button onClick={handleReset} className="text-xs text-gray-500 hover:text-red-500 border border-gray-200 rounded-lg px-2 py-1 hover:border-red-200 transition-colors">
              Reset
            </button>
            <button onClick={handleDownload} className="text-xs bg-purple-600 text-white rounded-lg px-3 py-1 hover:bg-purple-700 transition-colors">
              Save PNG
            </button>
          </div>
        </div>

        {/* Interactive canvas */}
        <div className="p-4 bg-white">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full rounded-xl cursor-crosshair border border-gray-100"
            style={{ imageRendering: "pixelated", touchAction: "none" }}
          />
        </div>

        <div className="px-4 pb-3 text-xs text-gray-400 flex gap-4">
          <span>🖱️ Click any area to fill with colour</span>
          <span>⬜ White = eraser</span>
          <span>💾 Save PNG to download your coloured version</span>
        </div>
      </div>
    );
  }

  // ── No PNG yet → show placeholder with SVG fallback ─────────────────────────
  return (
    <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden">
      <div className="flex flex-col items-center justify-center py-16 text-center px-6">
        <div className="text-[100px] leading-none mb-6">{emoji}</div>
        <h3 className="font-bold text-gray-700 mb-2">{title}</h3>
        <p className="text-gray-400 text-sm max-w-sm mb-4">
          High-quality coloring image coming soon! Click <strong>Print Page</strong> to print
          a simple version now.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-700 text-left max-w-sm">
          <strong>For site owners:</strong> Run the image generator to create AI images:
          <code className="block mt-1 bg-amber-100 rounded p-1 font-mono">
            GEMINI_API_KEY=your_key node scripts/generate-images.mjs {slug}
          </code>
        </div>
      </div>
    </div>
  );
}
