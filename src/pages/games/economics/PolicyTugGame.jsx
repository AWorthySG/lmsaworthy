import React, { useState } from 'react';
import { T } from '../../../theme/theme.js';

function PolicyTugGame() {
  const maxRounds = 8;
  const shocks = [
    { label: "Oil prices spike globally!", effect: -20 },
    { label: "Tech boom drives investment surge!", effect: 18 },
    { label: "Consumer confidence crashes after pandemic scare!", effect: -25 },
    { label: "Government wins election — confidence soars!", effect: 15 },
    { label: "Major trading partner enters recession!", effect: -15 },
    { label: "Housing bubble inflates — asset prices soar!", effect: 22 },
    { label: "Supply chain disruption hits manufacturing!", effect: -18 },
    { label: "Central bank signals dovish stance — markets rally!", effect: 12 },
  ];

  const tools = [
    { label: "Increase Govt Spending", effect: 20, type: "fiscal", icon: "⬆️" },
    { label: "Cut Taxes", effect: 15, type: "fiscal", icon: "⬇️" },
    { label: "Lower Interest Rate", effect: 18, type: "monetary", icon: "⬇️" },
    { label: "Increase Money Supply", effect: 12, type: "monetary", icon: "⬆️" },
    { label: "Decrease Govt Spending", effect: -20, type: "fiscal", icon: "⬇️" },
    { label: "Raise Taxes", effect: -15, type: "fiscal", icon: "⬆️" },
    { label: "Raise Interest Rate", effect: -18, type: "monetary", icon: "⬆️" },
    { label: "Reduce Money Supply", effect: -12, type: "monetary", icon: "⬇️" },
  ];

  const [economy, setEconomy] = useState(-30);
  const [round, setRound] = useState(1);
  const [balancedCount, setBalancedCount] = useState(0);
  const [shockMsg, setShockMsg] = useState("");
  const [history, setHistory] = useState([]);

  const isBalanced = Math.abs(economy) <= 15;
  const barLeft = Math.max(2, Math.min(98, 50 + economy / 2));
  const done = round > maxRounds;

  function apply(tool) {
    if (done) return;
    const newVal = Math.max(-100, Math.min(100, economy + tool.effect));
    const wasBalanced = Math.abs(newVal) <= 15;
    const newBalanced = balancedCount + (wasBalanced ? 1 : 0);

    setEconomy(newVal);
    setBalancedCount(newBalanced);
    setHistory(h => [...h, { round, economy: newVal, balanced: wasBalanced }]);

    // Apply random shock if not last round
    if (round < maxRounds) {
      const shock = shocks[Math.floor(Math.random() * shocks.length)];
      const shockedVal = Math.max(-100, Math.min(100, newVal + shock.effect));
      setShockMsg(shock.label + ` (${shock.effect > 0 ? "+" : ""}${shock.effect})`);
      setTimeout(() => {
        setEconomy(shockedVal);
      }, 600);
    } else {
      setShockMsg("");
    }
    setRound(r => r + 1);
  }

  if (done) {
    const grade = balancedCount >= 7 ? "S" : balancedCount >= 5 ? "A" : balancedCount >= 4 ? "B" : balancedCount >= 3 ? "C" : "D";
    const gradeColors = { S: "#D4A24C", A: "#3D9470", B: "#4A7CB8", C: "#C49030", D: "#C04848" };
    return (
      <div className="scale-pop" style={{ background: T.bgCard, borderRadius: T.r3, padding: "36px 28px", textAlign: "center", border: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 30%, ${gradeColors[grade]}15, transparent 60%)` }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>⚖️</div>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: gradeColors[grade] + "22", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: `3px solid ${gradeColors[grade]}44` }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: gradeColors[grade], fontFamily: "'Bricolage Grotesque', sans-serif" }}>{grade}</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: T.text }}>{balancedCount} / {maxRounds}</div>
          <div style={{ fontSize: 14, color: T.textSec, marginTop: 4 }}>rounds stabilised</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 12 }}>
            {history.map((h, i) => (
              <div key={i} style={{ width: 24, height: 24, borderRadius: "50%", background: h.balanced ? T.successBg : T.dangerBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, border: `1px solid ${h.balanced ? T.success + "33" : T.danger + "33"}` }}>
                {h.balanced ? "✓" : "✗"}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: T.textTer, marginTop: 12 }}>
            {balancedCount >= 6 ? "Outstanding policymaker — you kept the economy stable through multiple shocks!" : balancedCount >= 4 ? "Solid performance — anticipate shocks by leaving room for adjustment." : "Keep practising — remember expansionary policy fights recession, contractionary fights overheating."}
          </div>
          {/* Economy history graph */}
          {history.length > 0 && (
            <div style={{ marginTop: 16, background: T.bgMuted, borderRadius: T.r2, padding: "12px", textAlign: "left" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.textSec, marginBottom: 8 }}>Economy History</div>
              <svg width="100%" viewBox="0 0 280 60" style={{ display: "block" }}>
                {/* Balanced zone */}
                <rect x="0" y={60*(50-15)/100} width="280" height={60*30/100} fill="#3BAA7E15" rx="2" />
                {/* Zero line */}
                <line x1="0" y1="30" x2="280" y2="30" stroke={T.border} strokeWidth="0.5" strokeDasharray="4,2" />
                {/* Path */}
                <polyline fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  points={history.map((h, i) => `${(i / (history.length - 1 || 1)) * 260 + 10},${60 * (50 - h.economy / 2) / 100 * 1.5}`).join(" ")} />
                {/* Dots */}
                {history.map((h, i) => (
                  <circle key={i} cx={(i / (history.length - 1 || 1)) * 260 + 10} cy={60 * (50 - h.economy / 2) / 100 * 1.5} r="3" fill={h.balanced ? "#3BAA7E" : T.danger} stroke="#fff" strokeWidth="1" />
                ))}
              </svg>
            </div>
          )}
          <div style={{ marginTop: 12, padding: "10px 14px", background: T.accentLight, borderRadius: T.r2, fontSize: 11, color: T.accentText, textAlign: "left", lineHeight: 1.6 }}>
            📝 <strong>H1 Exam Tip:</strong> In essays on macroeconomic policy, always evaluate: (1) Time lag — fiscal policy takes months to implement, monetary policy acts faster. (2) Side effects — lowering interest rates fights recession but may cause asset bubbles. (3) Crowding out — government spending may displace private investment.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* HUD */}
      <div style={{ background: T.bgMuted, borderRadius: T.r3, padding: "14px 20px", border: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 200, color: T.textTer, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Policy Tug-of-War</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Round {round} of {maxRounds}</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: T.success, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{balancedCount}</div>
              <div style={{ fontSize: 8, color: T.textTer }}>BALANCED</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: T.textSec, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{maxRounds - round + 1}</div>
              <div style={{ fontSize: 8, color: T.textTer }}>LEFT</div>
            </div>
          </div>
        </div>

        {/* Tug bar */}
        <div style={{ background: "rgba(0,0,0,0.06)", borderRadius: 20, height: 24, position: "relative", overflow: "hidden" }}>
          {/* Balanced zone */}
          <div style={{ position: "absolute", left: "35%", right: "35%", top: 0, bottom: 0, background: T.success + "20", borderRadius: 20 }} />
          {/* Economy indicator */}
          <div style={{ position: "absolute", left: `${barLeft}%`, top: 3, width: 18, height: 18, borderRadius: "50%", background: isBalanced ? T.success : economy > 0 ? T.danger : "#4A7CB8", transition: "left 0.4s cubic-bezier(0.22,1,0.36,1)", boxShadow: `0 0 8px ${isBalanced ? T.success + "60" : "rgba(0,0,0,0.2)"}`, transform: "translateX(-50%)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: T.textTer, marginTop: 4 }}>
          <span>Recession</span>
          <span style={{ color: isBalanced ? T.success : T.textTer, fontWeight: isBalanced ? 700 : 400 }}>Balanced</span>
          <span>Overheating</span>
        </div>
      </div>

      {/* Status message */}
      <div style={{ background: isBalanced ? T.successBg : economy > 30 ? T.dangerBg : economy < -30 ? "#E8F4FD" : T.bgMuted, borderRadius: T.r2, padding: "10px 16px", textAlign: "center", fontSize: 13, fontWeight: 700, color: isBalanced ? T.success : economy > 30 ? T.danger : economy < -30 ? "#4A7CB8" : T.textSec, border: `1px solid ${isBalanced ? T.success + "33" : T.border}` }}>
        {isBalanced ? "Economy stabilised! Keep it here." : economy > 50 ? "Economy overheating! Apply contractionary policy." : economy > 0 ? "Economy warming — careful not to overshoot." : economy < -50 ? "Deep recession! Apply expansionary policy." : "Still in recession — apply more stimulus."}
      </div>

      {/* Shock banner */}
      {shockMsg && (
        <div className="fade-up" style={{ background: T.accentLight, borderRadius: T.r2, padding: "10px 16px", fontSize: 13, fontWeight: 700, color: T.accent, textAlign: "center", border: `1px solid ${T.accent}22` }}>
          ⚡ Random Shock: {shockMsg}
        </div>
      )}

      {/* Policy tools */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#4A7CB8", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Fiscal Policy</div>
          {tools.filter(t => t.type === "fiscal").map((t, i) => (
            <button key={i} onClick={() => apply(t)} style={{ width: "100%", marginBottom: 4, padding: "9px 10px", borderRadius: T.r1, border: `1px solid ${T.border}`, background: T.bgCard, cursor: "pointer", fontSize: 11, fontWeight: 600, color: T.text, textAlign: "left", transition: "all 0.15s" }}>
              {t.icon} {t.label} <span style={{ color: T.textTer, fontSize: 10 }}>({t.effect > 0 ? "+" : ""}{t.effect})</span>
            </button>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#3D9470", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Monetary Policy</div>
          {tools.filter(t => t.type === "monetary").map((t, i) => (
            <button key={i} onClick={() => apply(t)} style={{ width: "100%", marginBottom: 4, padding: "9px 10px", borderRadius: T.r1, border: `1px solid ${T.border}`, background: T.bgCard, cursor: "pointer", fontSize: 11, fontWeight: 600, color: T.text, textAlign: "left", transition: "all 0.15s" }}>
              {t.icon} {t.label} <span style={{ color: T.textTer, fontSize: 10 }}>({t.effect > 0 ? "+" : ""}{t.effect})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PolicyTugGame;
