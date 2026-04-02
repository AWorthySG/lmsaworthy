import React, { useState } from 'react';
import { T } from '../../../theme/theme.js';

function MarketPlaygroundGame() {
  const [price, setPrice] = useState(50);
  const [shock, setShock] = useState(null);
  const [shockLabel, setShockLabel] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [eqFlash, setEqFlash] = useState(false);
  const dShift = shock === "demand-up" ? 20 : shock === "demand-down" ? -20 : 0;
  const sShift = shock === "supply-up" ? 20 : shock === "supply-down" ? -20 : 0;
  const qd = Math.max(0, 100 - price + dShift);
  const qs = Math.max(0, price - 10 + sShift);
  const eqPrice = Math.round((110 + dShift - sShift) / 2);
  const eqQty = Math.round(100 - eqPrice + dShift);
  const surplus = qs - qd;
  const isEq = Math.abs(price - eqPrice) <= 3;
  // Graph dimensions
  const gW = 280, gH = 180, gPad = 30;
  const toX = q => gPad + (q / 120) * (gW - gPad * 2);
  const toY = p => gPad + ((100 - p) / 100) * (gH - gPad * 2);

  function applyShock() {
    const shocks = [
      { id: "demand-up", label: "🔥 Viral trend — demand surges!" },
      { id: "demand-down", label: "📉 Recession fears — demand drops!" },
      { id: "supply-up", label: "🏭 New tech — supply increases!" },
      { id: "supply-down", label: "⛈️ Natural disaster — supply falls!" },
    ];
    const s = shocks[Math.floor(Math.random() * shocks.length)];
    if (isEq) { setScore(sc => sc + 1); setEqFlash(true); setTimeout(() => setEqFlash(false), 1000); }
    setShock(s.id); setShockLabel(s.label); setRound(r => r + 1);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* HUD */}
      <div className="grain" style={{ background: "linear-gradient(135deg, #0F172A, #1E2A4A)", borderRadius: T.r3, padding: "16px 20px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", overflow: "hidden", position: "relative" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>Market Playground</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: isEq ? "#51cf66" : "#fff" }}>${price}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>/ eq ${eqPrice}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#D4A254", fontFamily: "'Bricolage Grotesque', sans-serif" }}>{score}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>SCORE</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{round}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>ROUND</div>
          </div>
        </div>
        {eqFlash && <div style={{ position: "absolute", inset: 0, background: "rgba(81,207,102,0.15)", animation: "fadeSlideIn 0.3s ease" }} />}
      </div>

      {/* SVG Graph + Slider side by side */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {/* Live D/S Graph */}
        <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "12px", border: `1px solid ${T.border}`, flex: "1 1 260px" }}>
          <svg width="100%" viewBox={`0 0 ${gW} ${gH}`} style={{ display: "block" }}>
            {/* Grid */}
            {[20,40,60,80].map(p => <line key={`gy${p}`} x1={gPad} y1={toY(p)} x2={gW-gPad} y2={toY(p)} stroke="#E8E6E1" strokeWidth="0.5" />)}
            {[20,40,60,80,100].map(q => <line key={`gx${q}`} x1={toX(q)} y1={gPad} x2={toX(q)} y2={gH-gPad} stroke="#E8E6E1" strokeWidth="0.5" />)}
            {/* Axes */}
            <line x1={gPad} y1={gPad} x2={gPad} y2={gH-gPad} stroke={T.textTer} strokeWidth="1.5" />
            <line x1={gPad} y1={gH-gPad} x2={gW-gPad} y2={gH-gPad} stroke={T.textTer} strokeWidth="1.5" />
            <text x={gW/2} y={gH-4} textAnchor="middle" fill={T.textTer} fontSize="9" fontWeight="600">Quantity</text>
            <text x={8} y={gH/2} textAnchor="middle" fill={T.textTer} fontSize="9" fontWeight="600" transform={`rotate(-90,8,${gH/2})`}>Price</text>
            {/* Demand curve (blue) */}
            <line x1={toX(0 + dShift)} y1={toY(100)} x2={toX(100 + dShift)} y2={toY(0)} stroke="#3D7DD6" strokeWidth="2.5" strokeLinecap="round" style={{ transition: "all 0.5s ease" }} />
            <text x={toX(85 + dShift)} y={toY(10)} fill="#3D7DD6" fontSize="10" fontWeight="700">D</text>
            {/* Supply curve (green) */}
            <line x1={toX(0 + sShift)} y1={toY(10)} x2={toX(90 + sShift)} y2={toY(100)} stroke="#3BAA8B" strokeWidth="2.5" strokeLinecap="round" style={{ transition: "all 0.5s ease" }} />
            <text x={toX(80 + sShift)} y={toY(88)} fill="#3BAA8B" fontSize="10" fontWeight="700">S</text>
            {/* Current price line */}
            <line x1={gPad} y1={toY(price)} x2={gW-gPad} y2={toY(price)} stroke={isEq ? "#51cf66" : "#EF8354"} strokeWidth="1.5" strokeDasharray={isEq ? "0" : "4,3"} style={{ transition: "all 0.2s" }} />
            {/* Equilibrium dot */}
            <circle cx={toX(eqQty)} cy={toY(eqPrice)} r={isEq ? 6 : 4} fill={isEq ? "#51cf66" : "rgba(239,131,84,0.4)"} stroke={isEq ? "#fff" : "none"} strokeWidth="2" style={{ transition: "all 0.3s" }}>
              {isEq && <animate attributeName="r" values="4;7;4" dur="1s" repeatCount="indefinite" />}
            </circle>
            {/* Labels */}
            <text x={gPad - 4} y={toY(price) + 3} textAnchor="end" fill={isEq ? "#51cf66" : "#EF8354"} fontSize="9" fontWeight="700">${price}</text>
          </svg>
        </div>

        {/* Controls + Market Status */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: "1 1 200px" }}>
          {/* Price dial */}
          <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px 18px", border: `1px solid ${isEq ? T.success + "44" : T.border}`, transition: "border-color 0.3s" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.textSec, marginBottom: 6 }}>Adjust Price</div>
            <input type="range" min={10} max={100} value={price} onChange={e => setPrice(+e.target.value)} style={{ width: "100%", accentColor: isEq ? T.success : T.accent, height: 6 }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.textTer, marginTop: 4 }}><span>$10</span><span>$100</span></div>
          </div>

          {/* Market status cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ background: "#EAF2FB", borderRadius: T.r2, padding: "12px", textAlign: "center" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#3D7DD6", textTransform: "uppercase" }}>Buyers</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#3D7DD6", fontFamily: "'Bricolage Grotesque', sans-serif" }}>{qd}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap", marginTop: 4 }}>{Array.from({ length: Math.min(Math.round(qd / 8), 10) }, (_, i) => <span key={i} style={{ fontSize: 11, transition: "all 0.3s", transitionDelay: `${i * 30}ms` }}>🛒</span>)}</div>
            </div>
            <div style={{ background: "#EAF6F2", borderRadius: T.r2, padding: "12px", textAlign: "center" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#3BAA8B", textTransform: "uppercase" }}>Sellers</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#3BAA8B", fontFamily: "'Bricolage Grotesque', sans-serif" }}>{qs}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap", marginTop: 4 }}>{Array.from({ length: Math.min(Math.round(qs / 8), 10) }, (_, i) => <span key={i} style={{ fontSize: 11, transition: "all 0.3s", transitionDelay: `${i * 30}ms` }}>🏭</span>)}</div>
            </div>
          </div>

          {/* Status badge */}
          <div className={isEq ? "scale-pop" : ""} style={{ background: isEq ? T.successBg : surplus > 0 ? T.warningBg : T.dangerBg, borderRadius: T.r2, padding: "12px 16px", textAlign: "center", color: isEq ? "#fff" : T.text, border: `1px solid ${isEq ? "#51cf6633" : surplus > 0 ? T.warning + "33" : T.danger + "33"}`, transition: "all 0.3s" }}>
            <div style={{ fontSize: isEq ? 18 : 14, fontWeight: 800 }}>{isEq ? "⚡ EQUILIBRIUM!" : surplus > 0 ? `📦 Surplus of ${Math.abs(surplus)}` : `🔥 Shortage of ${Math.abs(surplus)}`}</div>
            <div style={{ fontSize: 10, marginTop: 2, color: T.textSec }}>{isEq ? "Qd = Qs — market clears perfectly" : surplus > 0 ? "Qs > Qd — lower the price!" : "Qd > Qs — raise the price!"}</div>
          </div>
        </div>
      </div>

      {/* Shock event */}
      {shockLabel && <div className="fade-up" style={{ background: "linear-gradient(135deg, rgba(239,131,84,0.08), rgba(248,181,90,0.08))", borderRadius: T.r2, padding: "12px 16px", fontSize: 13, fontWeight: 700, color: T.accent, textAlign: "center", border: `1px solid ${T.accent}22` }}>{shockLabel}</div>}

      <button onClick={applyShock} className="glow-pulse" style={{ padding: "12px 24px", borderRadius: T.r5, background: T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 8 }}>
        🎲 Random Shock — Round {round + 1}
      </button>
    </div>
  );
}

export default MarketPlaygroundGame;
