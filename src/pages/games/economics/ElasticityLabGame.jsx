import React, { useState } from 'react';
import { T } from '../../../theme/theme.js';

function ElasticityLabGame() {
  const products = [
    { name: "Insulin (Necessity)", elasticity: 0.2, baseP: 50, baseQ: 100 },
    { name: "Designer Handbag (Luxury)", elasticity: 2.5, baseP: 200, baseQ: 50 },
    { name: "Rice (Staple)", elasticity: 0.3, baseP: 5, baseQ: 500 },
    { name: "Streaming Service (Close Substitutes)", elasticity: 1.8, baseP: 15, baseQ: 200 },
  ];

  const challengeQuestions = [
    { q: "If price rises 10% and quantity demanded falls 20%, what is the PED?", options: ["0.5", "1.0", "2.0", "20"], answer: "2.0", explain: "PED = %ΔQd / %ΔP = 20% / 10% = 2.0" },
    { q: "A good has PED = 0.3. Is it elastic or inelastic?", options: ["Elastic", "Inelastic", "Unit elastic", "Perfectly elastic"], answer: "Inelastic", explain: "PED < 1 means demand is inelastic — quantity is relatively unresponsive to price changes." },
    { q: "If demand is inelastic (PED = 0.4), what happens to total revenue when price increases?", options: ["Revenue increases", "Revenue decreases", "Revenue stays the same", "Cannot determine"], answer: "Revenue increases", explain: "When PED < 1, the % fall in Qd is smaller than the % rise in P, so total revenue (P × Q) increases." },
    { q: "Which good likely has a MORE elastic demand?", options: ["Insulin", "Designer handbag", "Water", "Electricity"], answer: "Designer handbag", explain: "Luxury goods with many substitutes have highly elastic demand — consumers easily switch or do without." },
    { q: "Price falls from $10 to $8. Quantity demanded rises from 100 to 140 units. What is PED?", options: ["0.5", "1.0", "2.0", "4.0"], answer: "2.0", explain: "PED = (%ΔQd / %ΔP) = (40/100) / (2/10) = 40% / 20% = 2.0" },
    { q: "A firm sells a product with PED = 1.5. To increase revenue, it should:", options: ["Raise price", "Lower price", "Keep price the same", "Stop selling"], answer: "Lower price", explain: "When PED > 1, demand is elastic. Lowering price causes a proportionally larger increase in Qd, raising revenue." },
    { q: "What PED value indicates unit elasticity?", options: ["0", "0.5", "1.0", "Infinity"], answer: "1.0", explain: "PED = 1 means the percentage change in quantity demanded exactly equals the percentage change in price." },
    { q: "A 15% price increase causes a 5% drop in quantity demanded. What is PED?", options: ["0.33", "0.5", "3.0", "10"], answer: "0.33", explain: "PED = %ΔQd / %ΔP = 5% / 15% = 0.33 (inelastic)." },
  ];

  const [tab, setTab] = useState("explore"); // "explore" | "challenge"
  const [prodIdx, setProdIdx] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [deck] = useState(() => [...challengeQuestions].sort(() => Math.random() - 0.5));
  const [current, setCurrent] = useState(0);
  const [cScore, setCScore] = useState(0);
  const [cAnswered, setCAnswered] = useState(null);

  // Explore calculations
  const prod = products[prodIdx];
  const newP = prod.baseP * (1 + priceChange / 100);
  const newQ = Math.max(0, Math.round(prod.baseQ * (1 - prod.elasticity * priceChange / 100)));
  const revenue = Math.round(newP * newQ);
  const baseRevenue = prod.baseP * prod.baseQ;
  const ped = priceChange !== 0 ? Math.abs(((newQ - prod.baseQ) / prod.baseQ) / (priceChange / 100)).toFixed(2) : "—";

  // Challenge
  const cQuestion = deck[current];
  const cDone = current >= deck.length;
  const cPct = deck.length > 0 ? Math.round((cScore / deck.length) * 100) : 0;
  const cGrade = cPct >= 90 ? "S" : cPct >= 75 ? "A" : cPct >= 60 ? "B" : cPct >= 40 ? "C" : "D";
  const gradeColors = { S: "#D4A24C", A: "#3D9470", B: "#4A7CB8", C: "#C49030", D: "#C04848" };

  function cAnswer(opt) {
    if (cAnswered) return;
    setCAnswered(opt);
    if (opt === cQuestion.answer) setCScore(s => s + 1);
  }
  function cNext() { setCurrent(c => c + 1); setCAnswered(null); }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 4, background: T.bgMuted, borderRadius: T.r2, padding: 3 }}>
        {[{ id: "explore", label: "🔬 Explore" }, { id: "challenge", label: "🏆 Challenge" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: "8px 12px", borderRadius: T.r1, border: "none", background: tab === t.id ? T.bgCard : "transparent", color: tab === t.id ? T.text : T.textSec, fontWeight: tab === t.id ? 700 : 500, fontSize: 13, cursor: "pointer", transition: "all 0.2s", boxShadow: tab === t.id ? T.shadow1 : "none" }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "explore" ? (
        <>
          {/* Product selector */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {products.map((p, i) => (
              <button key={i} onClick={() => { setProdIdx(i); setPriceChange(0); }} style={{ padding: "6px 12px", borderRadius: 20, border: `2px solid ${prodIdx === i ? T.accent : T.border}`, background: prodIdx === i ? T.accentLight : T.bgCard, cursor: "pointer", fontSize: 11, fontWeight: 600, color: prodIdx === i ? T.accent : T.text }}>{p.name}</button>
            ))}
          </div>
          {/* Price slider */}
          <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px", border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.textSec, marginBottom: 8 }}>Price Change: <strong style={{ color: priceChange > 0 ? T.danger : priceChange < 0 ? T.success : T.text, fontSize: 16 }}>{priceChange > 0 ? "+" : ""}{priceChange}%</strong></div>
            <input type="range" min={-50} max={50} value={priceChange} onChange={e => setPriceChange(+e.target.value)} style={{ width: "100%", accentColor: T.accent }} />
          </div>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "Qty Demanded", value: newQ, color: "#4A7CB8" },
              { label: "Revenue", value: `${revenue.toLocaleString()}`, color: revenue > baseRevenue ? T.success : revenue < baseRevenue ? T.danger : T.text },
              { label: "PED", value: ped, color: "#7268C0" },
            ].map(m => (
              <div key={m.label} style={{ background: T.bgCard, borderRadius: T.r2, padding: "12px", textAlign: "center", border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: T.textTer }}>{m.label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: m.color, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{m.value}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: T.textTer, lineHeight: 1.6 }}>
            {prod.elasticity < 1 ? "Inelastic demand — price increase raises revenue because quantity barely drops." : "Elastic demand — price increase drops revenue because buyers switch to alternatives."}
          </div>
        </>
      ) : (
        /* Challenge tab */
        <>
          {!cDone ? (
            <>
              {/* HUD */}
              <div style={{ background: T.bgMuted, borderRadius: T.r2, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Question {current + 1} / {deck.length}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.success, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{cScore} correct</div>
              </div>
              {/* Progress */}
              <div style={{ height: 6, background: T.bgMuted, borderRadius: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 10, background: `linear-gradient(90deg, #7268C0, ${T.accent})`, width: `${((current + 1) / deck.length) * 100}%`, transition: "width 0.4s" }} />
              </div>
              {/* Question */}
              <div className="card-enter" style={{ background: T.bgCard, borderRadius: T.r3, padding: "22px 20px", border: `1px solid ${T.border}`, boxShadow: T.shadow2 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.text, lineHeight: 1.55 }}>{cQuestion.q}</div>
              </div>
              {/* Options */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {cQuestion.options.map(opt => {
                  const isCorrect = cAnswered && opt === cQuestion.answer;
                  const isWrong = cAnswered === opt && opt !== cQuestion.answer;
                  return (
                    <button key={opt} onClick={() => cAnswer(opt)}
                      style={{ padding: "14px 12px", borderRadius: T.r2, border: `2px solid ${isCorrect ? T.success : isWrong ? T.danger : cAnswered ? "transparent" : T.border}`, background: isCorrect ? T.successBg : isWrong ? T.dangerBg : cAnswered ? T.bgMuted : T.bgCard, cursor: cAnswered ? "default" : "pointer", fontSize: 13, fontWeight: 700, color: isCorrect ? T.success : isWrong ? T.danger : T.text, transition: "all 0.2s", opacity: cAnswered && !isCorrect && !isWrong ? 0.4 : 1 }}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {/* Explanation */}
              {cAnswered && (
                <div className="fade-up" style={{ background: cAnswered === cQuestion.answer ? T.successBg : T.dangerBg, borderRadius: T.r2, padding: "14px 18px", borderLeft: `4px solid ${cAnswered === cQuestion.answer ? T.success : T.danger}` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: cAnswered === cQuestion.answer ? T.success : T.danger, marginBottom: 4 }}>
                    {cAnswered === cQuestion.answer ? "Correct!" : `Wrong — the answer is ${cQuestion.answer}`}
                  </div>
                  <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6 }}>{cQuestion.explain}</div>
                </div>
              )}
              {cAnswered && (
                <button onClick={cNext} style={{ padding: "10px 24px", borderRadius: T.r5, background: T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", alignSelf: "flex-start" }}>
                  {current + 1 >= deck.length ? "See Results" : "Next →"}
                </button>
              )}
            </>
          ) : (
            /* Challenge results */
            <div className="scale-pop" style={{ background: T.bgCard, borderRadius: T.r3, padding: "36px 28px", textAlign: "center", border: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 30%, ${gradeColors[cGrade]}15, transparent 60%)` }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: gradeColors[cGrade] + "22", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: `3px solid ${gradeColors[cGrade]}44` }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: gradeColors[cGrade], fontFamily: "'Bricolage Grotesque', sans-serif" }}>{cGrade}</span>
                </div>
                <div style={{ fontSize: 42, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: T.text, letterSpacing: "-0.04em" }}>{cPct}%</div>
                <div style={{ fontSize: 14, color: T.textSec, marginTop: 4 }}>{cScore} / {deck.length} correct</div>
                <div style={{ fontSize: 12, color: T.textTer, marginTop: 8 }}>
                  {cPct >= 90 ? "Elasticity master — you understand PED, revenue effects, and real-world applications!" : cPct >= 60 ? "Good grasp — review the revenue relationship with elastic vs inelastic goods." : "Keep practising — focus on the formula: PED = %ΔQd / %ΔP."}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ElasticityLabGame;
