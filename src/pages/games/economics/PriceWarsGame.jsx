import React, { useState } from 'react';
import { T } from '../../../theme/theme.js';

function PriceWarsGame() {
  const maxRounds = 8;
  const priceOpts = [
    { label: "Low ($5)", price: 5, emoji: "🔻" },
    { label: "Medium ($8)", price: 8, emoji: "➖" },
    { label: "High ($12)", price: 12, emoji: "🔺" },
  ];

  // Payoff matrix: [yourProfit, rivalAProfit, rivalBProfit] based on price levels
  function calcProfits(myP, aP, bP) {
    const avgRival = (aP + bP) / 2;
    const diff = avgRival - myP;
    const baseProfit = myP * 8; // base units × price
    const shareBonus = diff > 0 ? diff * 12 : diff * 6; // undercut bonus / premium penalty
    return Math.max(0, Math.round(baseProfit + shareBonus));
  }

  const [round, setRound] = useState(1);
  const [myTotal, setMyTotal] = useState(0);
  const [rivalATotal, setRivalATotal] = useState(0);
  const [rivalBTotal, setRivalBTotal] = useState(0);
  const [myHistory, setMyHistory] = useState([]);
  const [rivalAHistory, setRivalAHistory] = useState([]);
  const [rivalBHistory, setRivalBHistory] = useState([]);
  const [lastResult, setLastResult] = useState(null);
  const [rivalAMood, setRivalAMood] = useState("cooperative"); // cooperative | retaliating
  const [rivalBMood, setRivalBMood] = useState("cooperative");

  const done = round > maxRounds;

  function aiDecide(history, mood) {
    if (history.length === 0) return 12; // start cooperative
    const lastPlayerPrice = myHistory[myHistory.length - 1];
    // Tit-for-tat with forgiveness
    if (mood === "retaliating") {
      return Math.random() > 0.3 ? 5 : 8; // mostly aggressive, sometimes medium
    }
    if (lastPlayerPrice <= 5) return 5; // retaliate
    if (lastPlayerPrice >= 12) return Math.random() > 0.2 ? 12 : 8; // cooperate mostly
    return 8; // match medium
  }

  function play(myPrice) {
    if (done) return;
    const aPrice = aiDecide(rivalAHistory, rivalAMood);
    const bPrice = aiDecide(rivalBHistory, rivalBMood);

    const myProfit = calcProfits(myPrice, aPrice, bPrice);
    const aProfit = calcProfits(aPrice, myPrice, bPrice);
    const bProfit = calcProfits(bPrice, myPrice, aPrice);

    // Update AI moods
    if (myPrice <= 5) { setRivalAMood("retaliating"); setRivalBMood("retaliating"); }
    else if (myPrice >= 12 && round > 2) { setRivalAMood("cooperative"); setRivalBMood("cooperative"); }

    setMyTotal(t => t + myProfit);
    setRivalATotal(t => t + aProfit);
    setRivalBTotal(t => t + bProfit);
    setMyHistory(h => [...h, myPrice]);
    setRivalAHistory(h => [...h, aPrice]);
    setRivalBHistory(h => [...h, bPrice]);
    setLastResult({ myPrice, aPrice, bPrice, myProfit, aProfit, bProfit });
    setRound(r => r + 1);
  }

  if (done) {
    const rank = [{ name: "You", total: myTotal }, { name: "Rival A", total: rivalATotal }, { name: "Rival B", total: rivalBTotal }].sort((a, b) => b.total - a.total);
    const myRank = rank.findIndex(r => r.name === "You") + 1;
    const grade = myRank === 1 && myTotal > 500 ? "S" : myRank === 1 ? "A" : myRank === 2 ? "B" : "C";
    const gradeColors = { S: "#D4A254", A: "#3BAA7E", B: "#3D7DD6", C: "#E5A832" };
    return (
      <div className="scale-pop" style={{ background: T.bgCard, borderRadius: T.r3, padding: "36px 28px", textAlign: "center", border: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 30%, ${gradeColors[grade]}15, transparent 60%)` }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{myRank === 1 ? "🏆" : "📊"}</div>
          <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: T.text }}>Final Standings</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16, textAlign: "left", maxWidth: 300, margin: "16px auto 0" }}>
            {rank.map((r, i) => (
              <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: T.r2, background: r.name === "You" ? T.accentLight : T.bgMuted, border: `1px solid ${r.name === "You" ? T.accent + "33" : T.border}` }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: [T.accent, T.textSec, T.textTer][i] }}>#{i + 1}</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: r.name === "You" ? 700 : 500, color: T.text }}>{r.name}</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: T.text, fontFamily: "'JetBrains Mono', monospace" }}>${r.total}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: T.textTer, marginTop: 16 }}>
            {myRank === 1 ? "You dominated the market! Did you cooperate or undercut?" : "The AI firms outperformed you. Try building trust with high prices early, then holding firm."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* HUD */}
      <div className="grain" style={{ background: "linear-gradient(135deg, #0F172A, #1E2A4A)", borderRadius: T.r3, padding: "16px 20px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>Price Wars — Round {round}/{maxRounds}</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>3-Player Oligopoly</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {[{ label: "You", total: myTotal, color: "#D4A254" }, { label: "Rival A", total: rivalATotal, color: "rgba(255,255,255,0.6)" }, { label: "Rival B", total: rivalBTotal, color: "rgba(255,255,255,0.6)" }].map(p => (
            <div key={p.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: p.color, fontFamily: "'JetBrains Mono', monospace" }}>${p.total}</div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>{p.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Last round result */}
      {lastResult && (
        <div className="fade-up" style={{ background: T.bgMuted, borderRadius: T.r2, padding: "14px 18px", border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, marginBottom: 8 }}>Last Round Results</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "You", price: lastResult.myPrice, profit: lastResult.myProfit, highlight: true },
              { label: "Rival A", price: lastResult.aPrice, profit: lastResult.aProfit },
              { label: "Rival B", price: lastResult.bPrice, profit: lastResult.bProfit },
            ].map(p => (
              <div key={p.label} style={{ textAlign: "center", padding: "8px", borderRadius: T.r1, background: p.highlight ? T.accentLight : T.bgCard, border: `1px solid ${p.highlight ? T.accent + "33" : T.border}` }}>
                <div style={{ fontSize: 10, color: T.textTer }}>{p.label}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>${p.price}</div>
                <div style={{ fontSize: 11, color: T.success, fontWeight: 700 }}>+${p.profit}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI mood indicator */}
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1, background: rivalAMood === "cooperative" ? T.successBg : T.dangerBg, borderRadius: T.r1, padding: "6px 12px", fontSize: 11, fontWeight: 600, color: rivalAMood === "cooperative" ? T.success : T.danger, textAlign: "center" }}>
          Rival A: {rivalAMood === "cooperative" ? "🤝 Cooperative" : "😤 Retaliating"}
        </div>
        <div style={{ flex: 1, background: rivalBMood === "cooperative" ? T.successBg : T.dangerBg, borderRadius: T.r1, padding: "6px 12px", fontSize: 11, fontWeight: 600, color: rivalBMood === "cooperative" ? T.success : T.danger, textAlign: "center" }}>
          Rival B: {rivalBMood === "cooperative" ? "🤝 Cooperative" : "😤 Retaliating"}
        </div>
      </div>

      {/* Price choices */}
      <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: 0.5 }}>Set your price this round:</div>
      <div style={{ display: "flex", gap: 10 }}>
        {priceOpts.map(opt => (
          <button key={opt.price} onClick={() => play(opt.price)} className="card-lift"
            style={{ flex: 1, padding: "20px 12px", borderRadius: T.r2, background: T.bgCard, border: `2px solid ${T.border}`, cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>{opt.emoji}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif" }}>${opt.price}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.textTer }}>{opt.label.split("(")[0]}</div>
          </button>
        ))}
      </div>

      <div style={{ fontSize: 11, color: T.textTer, padding: "8px 12px", background: T.bgMuted, borderRadius: T.r1, lineHeight: 1.6 }}>
        💡 <strong>Prisoner's Dilemma:</strong> If everyone prices high, profits are shared. If you undercut, you profit short-term but rivals may retaliate. Sustained cooperation maximises total industry profit.
      </div>
    </div>
  );
}

export default PriceWarsGame;
