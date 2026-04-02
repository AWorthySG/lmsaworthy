import React, { useState } from 'react';
import { T } from '../../../theme/theme.js';

function InflationFighterGame() {
  const maxQ = 8;
  const tools = [
    { label: "Raise Interest Rate (+0.5%)", infEffect: -1.2, gdpEffect: -0.4, unempEffect: 0.3, icon: "📈" },
    { label: "Lower Interest Rate (-0.5%)", infEffect: 0.8, gdpEffect: 0.5, unempEffect: -0.2, icon: "📉" },
    { label: "Cut Government Spending", infEffect: -0.7, gdpEffect: -0.6, unempEffect: 0.4, icon: "✂️" },
    { label: "Increase Government Spending", infEffect: 0.6, gdpEffect: 0.7, unempEffect: -0.3, icon: "💸" },
    { label: "Raise Income Tax", infEffect: -0.5, gdpEffect: -0.3, unempEffect: 0.2, icon: "🏛️" },
    { label: "Hold Steady (No Change)", infEffect: -0.1, gdpEffect: 0.1, unempEffect: 0.0, icon: "⏸️" },
  ];
  const shocks = [
    { label: "🛢️ Oil prices surge!", infEffect: 1.5, gdpEffect: -0.3 },
    { label: "📱 Tech boom boosts productivity!", infEffect: -0.5, gdpEffect: 0.8 },
    { label: "🦠 Pandemic fears reduce spending!", infEffect: -1.0, gdpEffect: -0.8 },
    { label: "🏠 Housing demand spikes!", infEffect: 0.8, gdpEffect: 0.3 },
    { label: "🌾 Good harvest lowers food prices!", infEffect: -0.7, gdpEffect: 0.2 },
    { label: "💵 Wages surge across sectors!", infEffect: 1.2, gdpEffect: 0.1 },
    { label: "📦 Supply chain disruption!", infEffect: 0.9, gdpEffect: -0.4 },
    { label: "🎓 Education reform boosts human capital!", infEffect: 0.0, gdpEffect: 0.5 },
  ];

  const [inflation, setInflation] = useState(5.0);
  const [gdp, setGdp] = useState(2.0);
  const [unemployment, setUnemp] = useState(5.0);
  const [quarter, setQuarter] = useState(1);
  const [onTarget, setOnTarget] = useState(0);
  const [shockMsg, setShockMsg] = useState("");
  const [history, setHistory] = useState([{ q: 0, inf: 5.0, gdp: 2.0, unemp: 5.0, onTarget: false }]);

  const done = quarter > maxQ;
  const inTarget = inflation >= 2.0 && inflation <= 3.0;

  function applyTool(tool) {
    if (done) return;
    let newInf = Math.round((inflation + tool.infEffect) * 10) / 10;
    let newGdp = Math.round((gdp + tool.gdpEffect) * 10) / 10;
    let newUnemp = Math.max(0, Math.round((unemployment + tool.unempEffect) * 10) / 10);

    // Random shock
    const shock = shocks[Math.floor(Math.random() * shocks.length)];
    newInf = Math.round((newInf + shock.infEffect) * 10) / 10;
    newGdp = Math.round((newGdp + shock.gdpEffect) * 10) / 10;
    setShockMsg(shock.label);

    newInf = Math.max(-1, Math.min(10, newInf));
    newGdp = Math.max(-3, Math.min(6, newGdp));
    const wasOnTarget = newInf >= 2.0 && newInf <= 3.0;

    setInflation(newInf);
    setGdp(newGdp);
    setUnemp(newUnemp);
    setOnTarget(ot => ot + (wasOnTarget ? 1 : 0));
    setHistory(h => [...h, { q: quarter, inf: newInf, gdp: newGdp, unemp: newUnemp, onTarget: wasOnTarget }]);
    setQuarter(q => q + 1);
  }

  if (done) {
    const grade = onTarget >= 7 ? "S" : onTarget >= 5 ? "A" : onTarget >= 3 ? "B" : onTarget >= 2 ? "C" : "D";
    const gradeColors = { S: "#D4A254", A: "#3BAA7E", B: "#3D7DD6", C: "#E5A832", D: "#E05262" };
    return (
      <div className="scale-pop" style={{ background: T.bgCard, borderRadius: T.r3, padding: "36px 28px", textAlign: "center", border: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 30%, ${gradeColors[grade]}15, transparent 60%)` }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏛️</div>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: gradeColors[grade] + "22", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: `3px solid ${gradeColors[grade]}44` }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: gradeColors[grade], fontFamily: "'Bricolage Grotesque', sans-serif" }}>{grade}</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: T.text }}>{onTarget} / {maxQ}</div>
          <div style={{ fontSize: 14, color: T.textSec, marginTop: 4 }}>quarters on target (2-3%)</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 12 }}>
            {history.slice(1).map((h, i) => (
              <div key={i} style={{ width: 24, height: 24, borderRadius: "50%", background: h.onTarget ? T.successBg : T.dangerBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, border: `1px solid ${h.onTarget ? T.success + "33" : T.danger + "33"}` }}>
                {h.onTarget ? "✓" : "✗"}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: T.textTer, marginTop: 12 }}>
            Final: Inflation {inflation}% · GDP {gdp}% · Unemployment {unemployment}%
          </div>
        </div>
      </div>
    );
  }

  const infBarPos = Math.max(2, Math.min(98, ((inflation + 1) / 11) * 100));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* HUD */}
      <div className="grain" style={{ background: "linear-gradient(135deg, #2D1010, #4A1818)", borderRadius: T.r3, padding: "16px 20px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>Inflation Fighter</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Q{quarter} of {maxQ}</div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: inTarget ? "#51cf66" : inflation > 3 ? "#ff6b6b" : "#4A9EF5", fontFamily: "'JetBrains Mono', monospace" }}>{inflation}%</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>CPI</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: gdp >= 0 ? "#51cf66" : "#ff6b6b" }}>{gdp}%</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>GDP</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: unemployment <= 6 ? "#D4A254" : "#ff6b6b" }}>{unemployment}%</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>UNEMP</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#51cf66" }}>{onTarget}</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>ON TARGET</div>
          </div>
        </div>
      </div>

      {/* Inflation gauge */}
      <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "14px 18px", border: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: T.textSec, marginBottom: 8 }}>Inflation Rate</div>
        <div style={{ height: 24, borderRadius: 20, background: T.bgMuted, position: "relative", overflow: "hidden" }}>
          {/* Target zone */}
          <div style={{ position: "absolute", left: `${(3/11)*100}%`, width: `${(1/11)*100}%`, top: 0, bottom: 0, background: T.success + "25", borderRadius: 20 }} />
          {/* Indicator */}
          <div style={{ position: "absolute", left: `${infBarPos}%`, top: 2, width: 20, height: 20, borderRadius: "50%", background: inTarget ? T.success : inflation > 3 ? T.danger : "#4A9EF5", transform: "translateX(-50%)", transition: "left 0.5s cubic-bezier(0.22,1,0.36,1)", boxShadow: `0 0 8px ${inTarget ? T.success : T.danger}60` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: T.textTer, marginTop: 4 }}>
          <span>Deflation</span>
          <span style={{ color: T.success, fontWeight: 700 }}>Target: 2-3%</span>
          <span>Hyperinflation</span>
        </div>
      </div>

      {/* Shock message */}
      {shockMsg && <div className="fade-up" style={{ background: T.accentLight, borderRadius: T.r2, padding: "10px 16px", fontSize: 13, fontWeight: 700, color: T.accent, textAlign: "center", border: `1px solid ${T.accent}22` }}>⚡ {shockMsg}</div>}

      {/* Policy tools */}
      <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: 0.5 }}>Choose a policy action:</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {tools.map((t, i) => (
          <button key={i} onClick={() => applyTool(t)} className="card-hover"
            style={{ padding: "12px 14px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgCard, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 4 }}>{t.icon} {t.label}</div>
            <div style={{ display: "flex", gap: 8, fontSize: 10 }}>
              <span style={{ color: t.infEffect < 0 ? T.success : T.danger }}>CPI {t.infEffect > 0 ? "+" : ""}{t.infEffect}</span>
              <span style={{ color: t.gdpEffect > 0 ? T.success : T.danger }}>GDP {t.gdpEffect > 0 ? "+" : ""}{t.gdpEffect}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default InflationFighterGame;
