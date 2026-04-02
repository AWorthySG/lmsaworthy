import React, { useState, useEffect } from 'react';
import ConfettiCanvas from './ConfettiCanvas.jsx';
import BurstAnimation from './BurstAnimation.jsx';

export function CelebrationOverlay({ type, onComplete }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); onComplete?.(); }, type === "coins" ? 2200 : type === "streak" ? 3000 : 2500);
    return () => clearTimeout(t);
  }, [type, onComplete]);

  if (!visible) return null;

  const label = type === "coins" ? "Coins Earned!" : type === "streak" ? "Streak Milestone!" : type === "levelup" ? "Level Up!" : "Achievement!";
  const emoji = type === "coins" ? "\uD83E\uDE99" : type === "streak" ? "\uD83D\uDD25" : type === "levelup" ? "\u2B50" : "\uD83C\uDFC6";

  return (
    <>
      <ConfettiCanvas active={true} duration={type === "streak" ? 3000 : 2200} particleCount={type === "streak" ? 80 : 50} />
      <div style={{ position: "fixed", inset: 0, zIndex: 10002, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <div className="scale-pop" style={{ textAlign: "center" }}>
          <div style={{ width: 120, height: 120, margin: "0 auto" }}>
            <BurstAnimation type={type} />
          </div>
          <div style={{ fontSize: 48, marginTop: -8 }}>{emoji}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.5)", fontFamily: "'Bricolage Grotesque', sans-serif", marginTop: 4 }}>{label}</div>
        </div>
      </div>
    </>
  );
}

// Global celebration trigger — call from any component
export function triggerCelebration(type = "coins") {
  window.dispatchEvent(new CustomEvent("aworthy-celebrate", { detail: { type } }));
}

export default CelebrationOverlay;
