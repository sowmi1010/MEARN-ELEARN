// src/components/student/PerformanceChart.jsx
import React, { useEffect, useRef } from "react";

/**
 * Minimal Udemy/Coursera style line chart using canvas (no extra library).
 * Clean, elegant, soft colors.
 */
export default function PerformanceChart({ progress }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = (canvas.width = canvas.offsetWidth * devicePixelRatio);
    const height = (canvas.height = 220 * devicePixelRatio);

    ctx.scale(devicePixelRatio, devicePixelRatio);

    // === Background (soft dark) ===
    ctx.clearRect(0, 0, canvas.offsetWidth, 220);
    ctx.fillStyle = "#0b0b14"; // softer than before
    ctx.fillRect(0, 0, canvas.offsetWidth, 220);

    // === Data ===
    const history =
      progress?.history?.length > 0 ? progress.history : generateDummyHistory();

    const values = history.map((d) => d.value || 0);
    const max = Math.max(...values, 10);

    const padding = 35;
    const chartW = canvas.offsetWidth - padding * 2;
    const chartH = 150;
    const step = chartW / (history.length - 1 || 1);
    const baseY = 170;

    // === Minimal Grid ===
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
      const y = (chartH / 4) * i + 10;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.offsetWidth - padding, y);
      ctx.stroke();
    }

    // === Line (thin, soft purple) ===
    ctx.beginPath();
    ctx.strokeStyle = "rgba(168, 85, 247, 0.9)"; // clean purple
    ctx.lineWidth = 2;

    history.forEach((point, i) => {
      const x = padding + i * step;
      const y = 10 + (chartH - (point.value / max) * chartH);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();

    // === Points (small, soft dots) ===
    ctx.fillStyle = "rgba(233, 213, 255, 0.9)";
    history.forEach((point, i) => {
      const x = padding + i * step;
      const y = 10 + (chartH - (point.value / max) * chartH);
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // === Labels (small, minimal) ===
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.font = "11px Inter, sans-serif";

    for (let i = 0; i < history.length; i += Math.ceil(history.length / 6) || 1) {
      const p = history[i];
      const x = padding + i * step;
      ctx.fillText(p.label || p.date || "", x - 10, baseY + 20);
    }

    function generateDummyHistory() {
      const arr = [];
      for (let i = 6; i >= 0; i--) {
        arr.push({
          date: `Day-${i}`,
          value: Math.round(20 + Math.random() * 80),
          label: `${i}d`,
        });
      }
      return arr;
    }
  }, [progress]);

  return (
    <div className="
      bg-[#0d0d17] 
      p-5 
      rounded-2xl 
      border border-purple-900/20 
      shadow-md
      w-full
    ">
      <h3 className="text-lg font-semibold mb-4 text-purple-300">
        Performance Overview
      </h3>

      <div className="rounded-xl overflow-hidden border border-purple-900/20">
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: 220, display: "block" }}
        />
      </div>
    </div>
  );
}
