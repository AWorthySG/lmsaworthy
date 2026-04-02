import React, { useState } from 'react';
import { T } from '../../../theme/theme.js';

function TradeWindsGame() {
  const challenges = [
    { instruction: "Specialise: Set Country A to produce ≥80 goods. Set Country B to produce ≥80 services.", check: (aG, aS, bG, bS, trading, tradeVol, aPPF) => aG >= 80 && bS >= 80, hint: "Slide Country A's production toward goods, and Country B toward services." },
    { instruction: "Enable trading. Set trade volume so both countries consume >100 total units each.", check: (aG, aS, bG, bS, trading, tradeVol, aPPF) => {
      if (!trading) return false;
      const aCG = aG - tradeVol + tradeVol * 0.5;
      const aCS = aS + tradeVol * 1.2;
      const bCG = bG + tradeVol;
      const bCS = bS - tradeVol * 0.8;
      return (aCG + aCS) > 100 && (bCG + bCS) > 100;
    }, hint: "Enable trade, then adjust trade volume until both countries' total consumption exceeds 100." },
    { instruction: "A 30% tariff reduces trade gains. Both countries must still consume >90 total each.", check: (aG, aS, bG, bS, trading, tradeVol, aPPF) => {
      if (!trading) return false;
      const tariff = 0.7; // 30% reduction
      const aCG = aG - tradeVol + tradeVol * 0.5 * tariff;
      const aCS = aS + tradeVol * 1.2 * tariff;
      const bCG = bG + tradeVol * tariff;
      const bCS = bS - tradeVol * 0.8 * tariff;
      return (aCG + aCS) > 90 && (bCG + bCS) > 90;
    }, hint: "With tariffs reducing trade gains by 30%, you need higher production specialisation and trade volume." },
    { instruction: "Country A's productivity doubles (PPF = 200). Re-optimise production and trade for >150 total each.", check: (aG, aS, bG, bS, trading, tradeVol, aPPF) => {
      if (!trading) return false;
      const aCG = aG - tradeVol + tradeVol * 0.5;
      const aCS = aS + tradeVol * 1.2;
      const bCG = bG + tradeVol;
      const bCS = bS - tradeVol * 0.8;
      return (aCG + aCS) > 150 && (bCG + bCS) > 150;
    }, hint: "Country A can now produce up to 200 total. Produce heavily in goods and trade surplus." },
    { instruction: "Free trade restored. Maximize total consumption across BOTH countries combined (target: >350).", check: (aG, aS, bG, bS, trading, tradeVol, aPPF) => {
      if (!trading) return false;
      const aCG = aG - tradeVol + tradeVol * 0.5;
      const aCS = aS + tradeVol * 1.2;
      const bCG = bG + tradeVol;
      const bCS = bS - tradeVol * 0.8;
      return (aCG + aCS + bCG + bCS) > 350;
    }, hint: "Maximize specialisation advantage and trade volume. Country A's doubled PPF is key." },
  ];

  const [round, setRound] = useState(0);
  const [countryA, setCountryA] = useState({ goods: 60, services: 40 });
  const [countryB, setCountryB] = useState({ goods: 40, services: 60 });
  const [trading, setTrading] = useState(false);
  const [tradeGoods, setTradeGoods] = useState(15);
  const [roundScores, setRoundScores] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const ch = challenges[round];
  const done = round >= challenges.length;

  // PPF limits
  const aPPF = round >= 3 ? 200 : 100;
  const bPPF = 100;
  const tariffActive = round === 2;

  // Consumption calculations
  const tariffMult = tariffActive ? 0.7 : 1;
  const aConsGoods = trading ? countryA.goods - tradeGoods + tradeGoods * 0.5 * tariffMult : countryA.goods;
  const aConsSvc = trading ? countryA.services + tradeGoods * 1.2 * tariffMult : countryA.services;
  const bConsGoods = trading ? countryB.goods + tradeGoods * tariffMult : countryB.goods;
  const bConsSvc = trading ? countryB.services - tradeGoods * 0.8 * tariffMult : countryB.services;

  const aTotal = Math.round(aConsGoods + aConsSvc);
  const bTotal = Math.round(bConsGoods + bConsSvc);

  function submitRound() {
    const passed = ch.check(countryA.goods, countryA.services, countryB.goods, countryB.services, trading, tradeGoods, aPPF);
    setRoundScores(rs => [...rs, passed]);
    setSubmitted(true);
  }

  function nextRound() {
    setRound(r => r + 1);
    // Keep settings from previous round as starting point but reset submitted
    if (round + 1 < 3) {
      // Reset for rounds 1-3
      setCountryA({ goods: 60, services: 40 });
      setCountryB({ goods: 40, services: 60 });
      setTrading(false);
      setTradeGoods(15);
    }
    setSubmitted(false);
  }

  const totalPassed = roundScores.filter(Boolean).length;

  if (done) {
    const grade = totalPassed >= 5 ? "S" : totalPassed >= 4 ? "A" : totalPassed >= 3 ? "B" : totalPassed >= 2 ? "C" : "D";
    const gradeColors = { S: "#D4A24C", A: "#3D9470", B: "#4A7CB8", C: "#C49030", D: "#C04848" };
    return (
      <div className="scale-pop" style={{ background: T.bgCard, borderRadius: T.r3, padding: "36px 28px", textAlign: "center", border: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 30%, ${gradeColors[grade]}15, transparent 60%)` }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🌊</div>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: gradeColors[grade] + "22", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: `3px solid ${gradeColors[grade]}44` }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: gradeColors[grade], fontFamily: "'Bricolage Grotesque', sans-serif" }}>{grade}</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: T.text }}>{totalPassed} / 5</div>
          <div style={{ fontSize: 14, color: T.textSec, marginTop: 4 }}>trade challenges completed</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
            {roundScores.map((passed, i) => (
              <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: passed ? T.successBg : T.dangerBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, border: `1px solid ${passed ? T.success + "33" : T.danger + "33"}` }}>
                {passed ? "✅" : "❌"}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: T.textTer, marginTop: 12 }}>
            {totalPassed >= 4 ? "International trade expert — you understand comparative advantage, gains from trade, and tariff effects!" : totalPassed >= 3 ? "Good understanding — review how tariffs affect trade gains." : "Keep practising — focus on how specialisation and trade lets countries consume beyond their PPF."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Round HUD */}
      <div style={{ background: T.bgMuted, borderRadius: T.r3, padding: "14px 20px", border: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 200, color: T.textTer, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Round {round + 1} of 5</div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {roundScores.map((passed, i) => (
              <div key={i} style={{ width: 18, height: 18, borderRadius: "50%", background: passed ? T.successBg : T.dangerBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{passed ? "✓" : "✗"}</div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.text, lineHeight: 1.5 }}>{ch.instruction}</div>
        {/* Progress */}
        <div style={{ height: 4, background: T.border, borderRadius: 10, overflow: "hidden", marginTop: 8 }}>
          <div style={{ height: "100%", borderRadius: 10, background: T.accent, width: `${((round + 1) / 5) * 100}%`, transition: "width 0.4s" }} />
        </div>
      </div>

      {/* Tariff banner */}
      {tariffActive && (
        <div style={{ background: T.dangerBg, borderRadius: T.r2, padding: "8px 14px", fontSize: 12, fontWeight: 700, color: T.danger, textAlign: "center", border: `1px solid ${T.danger}33` }}>
          30% Tariff Active — trade gains reduced
        </div>
      )}

      {/* Country panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { name: `Country A (PPF: ${aPPF})`, goods: countryA.goods, svc: countryA.services, consG: aConsGoods, consS: aConsSvc, total: aTotal, set: setCountryA, color: "#4A7CB8", ppf: aPPF },
          { name: "Country B (PPF: 100)", goods: countryB.goods, svc: countryB.services, consG: bConsGoods, consS: bConsSvc, total: bTotal, set: setCountryB, color: "#3D9470", ppf: bPPF },
        ].map((c, i) => (
          <div key={i} style={{ background: T.bgCard, borderRadius: T.r2, padding: "14px", border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: c.color, marginBottom: 8 }}>{c.name}</div>
            <div style={{ fontSize: 11, color: T.textSec, marginBottom: 4 }}>Goods: <strong style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{c.goods}</strong></div>
            <input type="range" min={0} max={c.ppf} value={c.goods} onChange={e => { if (submitted) return; c.set({ goods: +e.target.value, services: c.ppf - +e.target.value }); }} style={{ width: "100%", accentColor: c.color }} disabled={submitted} />
            <div style={{ fontSize: 11, color: T.textSec }}>Services: <strong style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{c.svc}</strong></div>
            {trading && (
              <div className="fade-up" style={{ marginTop: 8, background: c.color + "10", borderRadius: T.r1, padding: "6px 8px", fontSize: 11 }}>
                <div style={{ color: c.color, fontWeight: 700 }}>After trade:</div>
                <div style={{ color: T.text }}>G: {Math.round(c.consG)} · S: {Math.round(c.consS)}</div>
                <div style={{ color: c.total > c.ppf ? T.success : T.textSec, fontWeight: 600, fontSize: 10 }}>Total: {c.total} {c.total > c.ppf ? "(beyond PPF!)" : ""}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Trade controls */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={() => { if (!submitted) setTrading(t => !t); }} style={{ padding: "10px 20px", borderRadius: T.r5, background: trading ? T.danger : T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 12, border: "none", cursor: submitted ? "default" : "pointer", opacity: submitted ? 0.6 : 1 }}>
          {trading ? "Stop Trade" : "Enable Trade"}
        </button>
        {trading && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: T.textSec, whiteSpace: "nowrap" }}>Volume: {tradeGoods}</span>
            <input type="range" min={5} max={60} value={tradeGoods} onChange={e => { if (!submitted) setTradeGoods(+e.target.value); }} style={{ flex: 1, accentColor: T.accent }} disabled={submitted} />
          </div>
        )}
      </div>

      {/* Combined totals */}
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1, background: T.bgCard, borderRadius: T.r2, padding: "10px", textAlign: "center", border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: T.textTer }}>A Total</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#4A7CB8", fontFamily: "'Bricolage Grotesque', sans-serif" }}>{aTotal}</div>
        </div>
        <div style={{ flex: 1, background: T.bgCard, borderRadius: T.r2, padding: "10px", textAlign: "center", border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: T.textTer }}>B Total</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#3D9470", fontFamily: "'Bricolage Grotesque', sans-serif" }}>{bTotal}</div>
        </div>
        <div style={{ flex: 1, background: T.bgCard, borderRadius: T.r2, padding: "10px", textAlign: "center", border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: T.textTer }}>Combined</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: T.accent, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{aTotal + bTotal}</div>
        </div>
      </div>

      {/* Submit / Result */}
      {!submitted ? (
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={submitRound} style={{ padding: "12px 24px", borderRadius: T.r5, background: T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
            Check Goal
          </button>
          <div style={{ fontSize: 11, color: T.textTer }}>{ch.hint}</div>
        </div>
      ) : (
        <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: roundScores[roundScores.length - 1] ? T.successBg : T.dangerBg, borderRadius: T.r2, padding: "16px 18px", textAlign: "center", border: `1px solid ${roundScores[roundScores.length - 1] ? T.success + "33" : T.danger + "33"}` }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: roundScores[roundScores.length - 1] ? T.success : T.danger }}>
              {roundScores[roundScores.length - 1] ? "Goal Achieved!" : "Goal Not Met"}
            </div>
            <div style={{ fontSize: 12, color: T.textSec, marginTop: 4 }}>A total: {aTotal} · B total: {bTotal} · Combined: {aTotal + bTotal}</div>
          </div>
          <button onClick={nextRound} style={{ padding: "10px 24px", borderRadius: T.r5, background: T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", alignSelf: "flex-start" }}>
            {round + 1 >= challenges.length ? "See Final Results" : "Next Challenge →"}
          </button>
        </div>
      )}
    </div>
  );
}

export default TradeWindsGame;
