import React from 'react';

export default function BurstAnimation({ type }) {
  const color = type === "coins" ? "#D4A254" : type === "streak" ? "#818CF8" : "#22C55E";
  return (
    <div style={{ width: 120, height: 120, position: "relative" }}>
      <style>{`
        @keyframes burstRing { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(1.8); opacity: 0; } }
        @keyframes burstGlow { 0% { transform: scale(0.3); opacity: 0; } 30% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(0.9); opacity: 0.7; } }
        @keyframes burstSpin { 0% { transform: rotate(0deg) scale(0); } 40% { transform: rotate(120deg) scale(1.2); } 100% { transform: rotate(200deg) scale(0.85); opacity: 0.5; } }
      `}</style>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid ${color}`, animation: "burstRing 0.8s ease-out forwards" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${color}88`, animation: "burstRing 0.8s ease-out 0.15s forwards", opacity: 0 }} />
      <div style={{ position: "absolute", inset: "15%", borderRadius: "50%", background: `radial-gradient(circle, ${color}33, transparent 70%)`, animation: "burstGlow 0.6s ease-out forwards" }} />
      {[0, 60, 120, 180, 240, 300].map(deg => (
        <div key={deg} style={{ position: "absolute", top: "50%", left: "50%", width: 6, height: 6, borderRadius: "50%", background: color, transform: `rotate(${deg}deg) translateY(-45px)`, animation: "burstSpin 0.7s ease-out forwards", animationDelay: `${deg / 1200}s` }} />
      ))}
    </div>
  );
}
