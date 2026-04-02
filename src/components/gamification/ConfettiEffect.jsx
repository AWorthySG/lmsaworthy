import React from 'react';

export default function ConfettiEffect({ active }) {
  if (!active) return null;
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    color: ["#2D3A8C", "#D4A254", "#0D9488", "#4F5BD5", "#818CF8", "#16A34A"][i % 6],
    size: 6 + Math.random() * 8,
    shape: i % 3,
  }));
  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`,
          animationDelay: `${p.delay}s`,
          background: p.color,
          width: p.shape === 2 ? p.size * 1.5 : p.size,
          height: p.shape === 2 ? p.size * 0.5 : p.size,
          borderRadius: p.shape === 1 ? "50%" : "2px",
        }} />
      ))}
    </div>
  );
}
