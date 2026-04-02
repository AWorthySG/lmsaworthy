import React, { useState, useEffect } from 'react';
import { T } from '../../../theme/theme.js';
import { ConfettiEffect } from '../../../components/gamification';

function DdSsShifterGame() {
  const scenarios = [
    { event: "A severe drought destroys 40% of the wheat harvest.", curve: "S", direction: "left", priceEffect: "rise", qtyEffect: "fall", explain: "Drought reduces the ability of farmers to supply wheat → S shifts left → higher price, lower quantity." },
    { event: "The government imposes a new tax on cigarette producers.", curve: "S", direction: "left", priceEffect: "rise", qtyEffect: "fall", explain: "Tax increases production costs → S shifts left → price rises, quantity falls." },
    { event: "A viral TikTok trend makes matcha incredibly popular among teens.", curve: "D", direction: "right", priceEffect: "rise", qtyEffect: "rise", explain: "Change in tastes/preferences increases demand → D shifts right → both price and quantity rise." },
    { event: "Average household income in Singapore rises by 8% this year.", curve: "D", direction: "right", priceEffect: "rise", qtyEffect: "rise", explain: "Higher income increases demand for normal goods → D shifts right → price and quantity both increase." },
    { event: "A new automated factory halves the cost of producing electric scooters.", curve: "S", direction: "right", priceEffect: "fall", qtyEffect: "rise", explain: "Technological improvement reduces production costs → S shifts right → price falls, quantity rises." },
    { event: "The price of beef rises sharply. What happens in the market for chicken (a substitute)?", curve: "D", direction: "right", priceEffect: "rise", qtyEffect: "rise", explain: "Beef is a substitute for chicken. Higher beef prices → consumers switch to chicken → D for chicken shifts right → price and quantity rise." },
    { event: "The government removes import tariffs on Korean electronics.", curve: "S", direction: "right", priceEffect: "fall", qtyEffect: "rise", explain: "Removing tariffs reduces the cost of importing → increases supply in the domestic market → S shifts right → lower price, higher quantity." },
    { event: "Consumers expect the price of petrol to rise sharply next month.", curve: "D", direction: "right", priceEffect: "rise", qtyEffect: "rise", explain: "Expectation of future price increase → consumers buy more NOW → D shifts right → current price and quantity rise." },
    { event: "A major earthquake damages factories AND workers lose their jobs, reducing incomes.", curve: "both", direction: "left", priceEffect: "indeterminate", qtyEffect: "fall", explain: "Earthquake: S shifts left (less production). Job losses: D shifts left (less income). Both shift left → quantity definitely falls, but price effect depends on which shifts more — indeterminate." },
    { event: "New subsidies for solar panel producers AND a government campaign promotes green energy.", curve: "both", direction: "right", priceEffect: "indeterminate", qtyEffect: "rise", explain: "Subsidies: S shifts right (cheaper to produce). Campaign: D shifts right (more people want solar). Both shift right → quantity definitely rises, but price depends on relative magnitude — indeterminate." },
  ];

  const [deck] = useState(() => [...scenarios].sort(() => Math.random() - 0.5));
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState("curve"); // curve → direction → effects → result
  const [answers, setAnswers] = useState({ curve: null, direction: null, price: null, qty: null });
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const s = deck[current];
  const done = current >= deck.length;

  function selectCurve(c) { setAnswers(a => ({ ...a, curve: c })); setPhase("direction"); }
  function selectDirection(d) { setAnswers(a => ({ ...a, direction: d })); setPhase("effects"); }
  function selectEffects(price, qty) {
    const a = { ...answers, price, qty };
    setAnswers(a);
    // Score
    let pts = 0;
    if (a.curve === s.curve) pts++;
    if (a.direction === s.direction) pts++;
    if (a.price === s.priceEffect) pts++;
    if (a.qty === s.qtyEffect) pts++;
    setTotalPoints(tp => tp + pts);
    if (pts === 4) { setScore(sc => sc + 1); setStreak(st => st + 1); }
    else setStreak(0);
    setShowResult(true);
  }
  function nextScenario() {
    setCurrent(c => c + 1);
    setPhase("curve");
    setAnswers({ curve: null, direction: null, price: null, qty: null });
    setShowResult(false);
  }

  const pct = deck.length > 0 ? Math.round((totalPoints / (deck.length * 4)) * 100) : 0;
  const grade = pct >= 80 ? "A" : pct >= 65 ? "B" : pct >= 50 ? "C" : "D";
  useEffect(() => { if (done && grade === 'A') setShowConfetti(true); }, [done]);

  if (done) {
    return (
      <div className="scale-pop" style={{ background: T.bgCard, borderRadius: T.r3, padding: "36px 28px", color: T.text, textAlign: "center", position: "relative", overflow: "hidden", border: `1px solid ${T.border}` }}>
        <ConfettiEffect active={showConfetti} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 30%, rgba(59,170,123,0.15), transparent 60%)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(59,170,123,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: "2px solid rgba(59,170,123,0.3)" }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: "#51cf66", fontFamily: "'Bricolage Grotesque', sans-serif" }}>{grade}</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{totalPoints} / {deck.length * 4}</div>
          <div style={{ fontSize: 13, color: T.textSec, marginTop: 4 }}>{score} perfect rounds out of {deck.length}</div>
          <div style={{ fontSize: 11, color: T.textTer, marginTop: 8 }}>
            {pct >= 80 ? "Excellent — you understand D/S shifts and their effects!" : pct >= 50 ? "Good foundation — review the scenarios you missed." : "Keep practising — focus on identifying whether buyers or sellers are affected."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* HUD */}
      <div className="grain" style={{ background: "linear-gradient(135deg, #1A3A2A, #2B7A5B)", borderRadius: T.r3, padding: "14px 18px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", overflow: "hidden", position: "relative" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>Shift & Solve</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Scenario {current + 1} / {deck.length}</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {streak > 1 && <div className="scale-pop" style={{ background: "rgba(248,181,90,0.2)", borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 800, color: "#D4A254" }}>🔥 {streak}x</div>}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#51cf66" }}>{totalPoints}</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>POINTS</div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ height: 6, background: T.bgMuted, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 10, background: "linear-gradient(90deg, #2B7A5B, #3BAA7E)", width: `${((current + 1) / deck.length) * 100}%`, transition: "width 0.4s" }} />
      </div>

      {/* Event card */}
      <div className="card-enter" style={{ background: "#FFFEF8", borderRadius: T.r3, padding: "24px 22px", border: "1px solid #E8E4D8", boxShadow: T.shadow2 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "#2B7A5B", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>📰 Breaking News</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.text, lineHeight: 1.55, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{s.event}</div>
      </div>

      {/* Phase 1: Which curve? */}
      {phase === "curve" && !showResult && (
        <div className="fade-up">
          <div style={{ fontSize: 12, fontWeight: 700, color: T.textSec, marginBottom: 8 }}>Step 1: Which curve shifts?</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { id: "D", label: "Demand (D)", color: "#3D7DD6", emoji: "🛒" },
              { id: "S", label: "Supply (S)", color: "#3BAA7E", emoji: "🏭" },
              { id: "both", label: "Both D & S", color: "#7C6FDB", emoji: "🔄" },
            ].map(opt => (
              <button key={opt.id} onClick={() => selectCurve(opt.id)} className="card-hover"
                style={{ flex: 1, padding: "16px 10px", borderRadius: T.r2, border: `2px solid ${opt.color}33`, background: T.bgCard, cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{opt.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: opt.color }}>{opt.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Phase 2: Direction? */}
      {phase === "direction" && !showResult && (
        <div className="fade-up">
          <div style={{ fontSize: 12, fontWeight: 700, color: T.textSec, marginBottom: 8 }}>Step 2: Which direction does it shift?</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => selectDirection("left")} className="card-hover"
              style={{ flex: 1, padding: "16px", borderRadius: T.r2, border: `2px solid ${T.danger}33`, background: T.bgCard, cursor: "pointer", textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>⬅️</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.danger }}>Shift LEFT (Decrease)</div>
            </button>
            <button onClick={() => selectDirection("right")} className="card-hover"
              style={{ flex: 1, padding: "16px", borderRadius: T.r2, border: `2px solid ${T.success}33`, background: T.bgCard, cursor: "pointer", textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>➡️</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.success }}>Shift RIGHT (Increase)</div>
            </button>
          </div>
        </div>
      )}

      {/* Phase 3: Price & Quantity effects? */}
      {phase === "effects" && !showResult && (
        <div className="fade-up">
          <div style={{ fontSize: 12, fontWeight: 700, color: T.textSec, marginBottom: 8 }}>Step 3: What happens to equilibrium?</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {[
              { p: "rise", q: "rise", label: "P↑ Q↑", desc: "Price rises, Qty rises" },
              { p: "rise", q: "fall", label: "P↑ Q↓", desc: "Price rises, Qty falls" },
              { p: "fall", q: "rise", label: "P↓ Q↑", desc: "Price falls, Qty rises" },
              { p: "fall", q: "fall", label: "P↓ Q↓", desc: "Price falls, Qty falls" },
              { p: "indeterminate", q: "rise", label: "P? Q↑", desc: "Price indeterminate, Qty rises" },
              { p: "indeterminate", q: "fall", label: "P? Q↓", desc: "Price indeterminate, Qty falls" },
            ].map((opt, i) => (
              <button key={i} onClick={() => selectEffects(opt.p, opt.q)} className="card-hover"
                style={{ padding: "12px 8px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgCard, cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: T.text, fontFamily: "'JetBrains Mono', monospace" }}>{opt.label}</div>
                <div style={{ fontSize: 9, color: T.textTer, marginTop: 2 }}>{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result with animated DD-SS diagram */}
      {showResult && (() => {
        const pts = (answers.curve === s.curve ? 1 : 0) + (answers.direction === s.direction ? 1 : 0) + (answers.price === s.priceEffect ? 1 : 0) + (answers.qty === s.qtyEffect ? 1 : 0);
        const perfect = pts === 4;
        // Calculate diagram shifts for visualization
        const gW = 240, gH = 160, gP = 28;
        const toX = q => gP + (q / 100) * (gW - gP * 2);
        const toY = p => gP + ((100 - p) / 100) * (gH - gP * 2);
        const dShift = (s.curve === "D" || s.curve === "both") ? (s.direction === "right" ? 20 : -20) : 0;
        const sShift = (s.curve === "S" || s.curve === "both") ? (s.direction === "right" ? 20 : -20) : 0;
        return (
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Score banner */}
            <div style={{ background: perfect ? T.successBg : T.bgCard, borderRadius: T.r2, padding: "14px 18px", textAlign: "center", border: `1px solid ${perfect ? "#51cf6633" : T.border}` }}>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: perfect ? T.success : T.text }}>{perfect ? "🎯 Perfect!" : `${pts}/4 points`}</div>
            </div>

            {/* Animated DD-SS Diagram */}
            <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "12px", border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, textAlign: "center" }}>Market Diagram</div>
              <svg width="100%" viewBox={`0 0 ${gW} ${gH}`} style={{ display: "block" }}>
                {/* Grid */}
                {[20,40,60,80].map(v => <line key={`g${v}`} x1={gP} y1={toY(v)} x2={gW-gP} y2={toY(v)} stroke="#F0EDE8" strokeWidth="0.5" />)}
                {/* Axes */}
                <line x1={gP} y1={gP} x2={gP} y2={gH-gP} stroke={T.textTer} strokeWidth="1.5" />
                <line x1={gP} y1={gH-gP} x2={gW-gP} y2={gH-gP} stroke={T.textTer} strokeWidth="1.5" />
                <text x={gW/2} y={gH-4} textAnchor="middle" fill={T.textTer} fontSize="8" fontWeight="600">Quantity</text>
                <text x={6} y={gH/2} textAnchor="middle" fill={T.textTer} fontSize="8" fontWeight="600" transform={`rotate(-90,6,${gH/2})`}>Price</text>
                {/* Original D curve (dashed) */}
                {dShift !== 0 && <line x1={toX(0)} y1={toY(90)} x2={toX(90)} y2={toY(0)} stroke="#3D7DD688" strokeWidth="1.5" strokeDasharray="4,3" />}
                {/* Original S curve (dashed) */}
                {sShift !== 0 && <line x1={toX(0)} y1={toY(10)} x2={toX(80)} y2={toY(90)} stroke="#3BAA7E88" strokeWidth="1.5" strokeDasharray="4,3" />}
                {/* New D curve */}
                <line x1={toX(Math.max(0, 0+dShift))} y1={toY(90)} x2={toX(Math.min(100, 90+dShift))} y2={toY(0)} stroke="#3D7DD6" strokeWidth="2.5" strokeLinecap="round" style={{ transition: "all 0.8s ease" }} />
                <text x={toX(Math.min(95, 80+dShift))} y={toY(5)} fill="#3D7DD6" fontSize="10" fontWeight="700">{dShift !== 0 ? "D'" : "D"}</text>
                {dShift !== 0 && <text x={toX(80)} y={toY(5)} fill="#3D7DD688" fontSize="9">D</text>}
                {/* New S curve */}
                <line x1={toX(Math.max(0, 0+sShift))} y1={toY(10)} x2={toX(Math.min(100, 80+sShift))} y2={toY(90)} stroke="#3BAA7E" strokeWidth="2.5" strokeLinecap="round" style={{ transition: "all 0.8s ease" }} />
                <text x={toX(Math.min(95, 72+sShift))} y={toY(85)} fill="#3BAA7E" fontSize="10" fontWeight="700">{sShift !== 0 ? "S'" : "S"}</text>
                {sShift !== 0 && <text x={toX(72)} y={toY(85)} fill="#3BAA7E88" fontSize="9">S</text>}
                {/* Old equilibrium dot */}
                <circle cx={toX(45)} cy={toY(45)} r="4" fill="#EF835466" stroke="#EF835488" strokeWidth="1" />
                {/* New equilibrium dot */}
                <circle cx={toX(45 + (dShift + sShift) / 2)} cy={toY(45 + (dShift - sShift) / 2)} r="5" fill="#EF8354" stroke="#fff" strokeWidth="1.5">
                  <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="3" />
                </circle>
                {/* Shift arrows */}
                {dShift !== 0 && <text x={toX(45)} y={toY(50)} fill="#3D7DD6" fontSize="14" textAnchor="middle">{dShift > 0 ? "→" : "←"}</text>}
                {sShift !== 0 && <text x={toX(35)} y={toY(55)} fill="#3BAA7E" fontSize="14" textAnchor="middle">{sShift > 0 ? "→" : "←"}</text>}
              </svg>
            </div>

            {/* Breakdown */}
            <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "14px 16px", border: `1px solid ${T.border}` }}>
              {[
                { label: "Curve", yours: answers.curve === "both" ? "Both" : answers.curve, correct: s.curve === "both" ? "Both" : s.curve, ok: answers.curve === s.curve },
                { label: "Direction", yours: answers.direction, correct: s.direction, ok: answers.direction === s.direction },
                { label: "Price", yours: answers.price, correct: s.priceEffect, ok: answers.price === s.priceEffect },
                { label: "Quantity", yours: answers.qty, correct: s.qtyEffect, ok: answers.qty === s.qtyEffect },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < 3 ? 6 : 0 }}>
                  <span style={{ fontSize: 14 }}>{r.ok ? "✅" : "❌"}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.textSec, width: 60 }}>{r.label}:</span>
                  {!r.ok && <span style={{ fontSize: 12, color: T.danger, textDecoration: "line-through" }}>{r.yours}</span>}
                  <span style={{ fontSize: 12, fontWeight: 700, color: r.ok ? T.success : T.accent }}>{r.correct}</span>
                </div>
              ))}
            </div>

            {/* Explanation */}
            <div style={{ background: "#EAF6F2", borderRadius: T.r2, padding: "12px 16px", borderLeft: `3px solid #2B7A5B` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#2B7A5B", marginBottom: 4 }}>Explanation</div>
              <div style={{ fontSize: 12, color: T.text, lineHeight: 1.7 }}>{s.explain}</div>
            </div>

            {/* Exam tip */}
            <div style={{ padding: "8px 14px", background: T.accentLight, borderRadius: T.r2, fontSize: 11, color: T.accentText, lineHeight: 1.6 }}>
              📝 <strong>H2 Exam Tip:</strong> Always draw the diagram. Show the original and new curves, label the shift direction, and mark old (E₁) and new (E₂) equilibrium points with P and Q changes.
            </div>

            <button onClick={nextScenario} style={{ padding: "10px 24px", borderRadius: T.r5, background: T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", alignSelf: "flex-start" }}>
              {current + 1 >= deck.length ? "See Final Score" : "Next Scenario →"}
            </button>
          </div>
        );
      })()}
    </div>
  );
}

export default DdSsShifterGame;
