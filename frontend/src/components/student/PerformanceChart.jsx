// src/components/student/PerformanceChart.jsx
import React, { useEffect, useRef } from "react";

/**
 * Lightweight chart using canvas (no extra library).
 * Accepts progress.history array: [{ date:'2025-11-01', value: 20 }, ...]
 * If no history is available, it draws a simple placeholder.
 */
export default function PerformanceChart({ progress }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    const h = canvas.height = 220 * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // background
    ctx.clearRect(0, 0, canvas.offsetWidth, 220);
    ctx.fillStyle = "#061226";
    ctx.fillRect(0, 0, canvas.offsetWidth, 220);

    // sample history or generated
    const history = (progress && progress.history && Array.isArray(progress.history) && progress.history.length)
      ? progress.history
      : generateDummyHistory();

    // normalize values
    const values = history.map((d) => d.value || 0);
    const max = Math.max(...values, 10);
    const pad = 30;
    const availableW = canvas.offsetWidth - pad * 2;
    const step = availableW / (history.length - 1 || 1);
    const baseY = 200;

    // draw grid
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (baseY / 4) * i + 10;
      ctx.beginPath();
      ctx.moveTo(pad, y);
      ctx.lineTo(canvas.offsetWidth - pad, y);
      ctx.stroke();
    }

    // draw curve
    ctx.beginPath();
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 2;
    history.forEach((d, i) => {
      const x = pad + i * step;
      const y = 10 + (baseY - (d.value / max) * baseY);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // draw points
    ctx.fillStyle = "#c084fc";
    history.forEach((d, i) => {
      const x = pad + i * step;
      const y = 10 + (baseY - (d.value / max) * baseY);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // draw labels (few)
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "12px Arial";
    for (let i = 0; i < history.length; i += Math.ceil(history.length / 6) || 1) {
      const d = history[i];
      const x = pad + i * step;
      ctx.fillText(d.label || d.date || "", x - 15, baseY + 25);
    }

    function generateDummyHistory() {
      const arr = [];
      for (let i = 6; i >= 0; i--) {
        arr.push({ date: `Day-${i}`, value: Math.round(20 + Math.random() * 80), label: `${i}d` });
      }
      return arr;
    }
  }, [progress]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Performance</h3>
      <div className="rounded-xl overflow-hidden">
        <canvas ref={canvasRef} style={{ width: "100%", height: 220, display: "block" }} />
      </div>
    </div>
  );
}
