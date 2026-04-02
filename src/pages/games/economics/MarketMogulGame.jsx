import React, { useState, useEffect } from 'react';
import { T } from '../../../theme/theme.js';
import { ConfettiEffect } from '../../../components/gamification';

function MarketMogulGame() {
  // Clue-by-clue reveal: each question has 3 progressive clues
  const questions = [
    { clues: ["This industry has thousands of identical producers.", "No single firm can influence the market price.", "The product is homogeneous — wheat, rice, or raw commodities."], answer: "Perfect Competition", explain: "Homogeneous product, many sellers, price-taking behaviour — textbook perfect competition.", simResult: "You set price at $5.01 (1¢ above market). Result: ZERO sales — buyers instantly switch to identical competitors." },
    { clues: ["This market has many competitors.", "Each firm offers a slightly differentiated product.", "New firms enter and exit freely — some coffee shops thrive, others close."], answer: "Monopolistic Competition", explain: "Many firms with differentiated products — each has a small degree of pricing power from branding/differentiation.", simResult: "You raise your coffee price by $1. Result: You lose 30% of customers but keep loyal regulars who love your ambience." },
    { clues: ["Only 3-4 dominant firms control this market.", "When one firm changes prices, rivals respond strategically.", "There is a strong temptation to collude, but also to cheat on agreements."], answer: "Oligopoly", explain: "Few dominant firms, high market concentration, interdependent pricing — classic oligopoly with strategic behaviour.", simResult: "You cut prices by 10%. Result: Both rivals match immediately — a price war erupts, everyone's profit drops 40%." },
    { clues: ["There is only ONE seller in this entire market.", "Legal barriers prevent any new firm from entering.", "The firm has enormous pricing power."], answer: "Monopoly", explain: "Single seller with legal barriers to entry (statutory monopoly) — natural monopoly due to high infrastructure costs.", simResult: "You raise prices by 20%. Result: Customers complain but have no alternative — your revenue jumps, but regulators take notice." },
    { clues: ["Firms in this structure earn zero supernormal profit in the long run.", "Entry and exit are completely free.", "Each firm faces a perfectly elastic (horizontal) demand curve."], answer: "Perfect Competition", explain: "In perfect competition, free entry/exit drives price to P = MC = AC in the long run, eliminating supernormal profit.", simResult: "You try to earn above-normal profit. Result: New firms flood in, price drops back to P = MC = AC. Profit: zero." },
    { clues: ["This firm worries that cutting prices will trigger retaliation.", "The industry shows a kinked demand curve.", "Think: Samsung, Apple, Huawei watching each other's every move."], answer: "Oligopoly", explain: "Interdependence in pricing decisions and fear of retaliation — hallmarks of oligopolistic competition (kinked demand curve).", simResult: "You try non-price competition instead: better cameras, brand marketing. Result: Market share grows without triggering a price war." },
    { clues: ["Dozens of restaurants in a small town.", "Each offers different cuisines — Japanese, Italian, Thai.", "New restaurants open frequently; unsuccessful ones close."], answer: "Monopolistic Competition", explain: "Many firms, product differentiation (different cuisines), low barriers to entry/exit — monopolistic competition.", simResult: "You invest in better décor and a unique menu. Result: You can charge 15% more than the average restaurant." },
    { clues: ["A pharmaceutical company holds a 20-year patent.", "No generic alternatives are legally permitted.", "The firm charges $500 per dose."], answer: "Monopoly", explain: "Patent creates a legal barrier to entry, giving the firm sole supply and significant pricing power.", simResult: "Patent expires in 2 years. Result: 5 generic firms prepare to enter — your long-run supernormal profit will vanish." },
    { clues: ["OPEC members agree to restrict oil output.", "Each member faces a temptation to secretly increase production.", "If caught cheating, other members retaliate by flooding the market."], answer: "Oligopoly", explain: "Collusion (cartel), output restriction, and the prisoner's dilemma of cheating — defining features of an oligopoly.", simResult: "You secretly increase output by 5%. Result: Oil prices fall 12%, cartel members suspect you — trust collapses." },
    { clues: ["This firm can sell as much as it wants at the prevailing price.", "If it charges even 1¢ above market price, it sells nothing.", "Product is completely undifferentiated."], answer: "Perfect Competition", explain: "A price taker faces perfectly elastic demand — if it raises price above market level, it loses all customers.", simResult: "You try to brand your wheat as 'premium'. Result: Buyers don't care — it's identical to every other farm's output." },
  ];

  const [deck] = useState(() => [...questions].sort(() => Math.random() - 0.5));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [cluesRevealed, setCluesRevealed] = useState(1); // start with 1 clue
  const [streak, setStreak] = useState(0);

  const structures = [
    { id: "Perfect Competition", label: "Perfect Competition", color: "#4A7CB8", emoji: "🌾" },
    { id: "Monopolistic Competition", label: "Monopolistic Comp.", color: "#7268C0", emoji: "☕" },
    { id: "Oligopoly", label: "Oligopoly", color: "#D97042", emoji: "✈️" },
    { id: "Monopoly", label: "Monopoly", color: "#C04848", emoji: "💧" },
  ];

  // Points: more points for answering with fewer clues
  const cluePoints = { 1: 3, 2: 2, 3: 1 };

  function answer(id) {
    if (answered) return;
    setAnswered(id);
    if (id === deck[current].answer) {
      setScore(s => s + cluePoints[cluesRevealed]);
      setStreak(s => s + 1);
    } else { setStreak(0); }
  }

  function revealNextClue() {
    if (cluesRevealed < 3) setCluesRevealed(c => c + 1);
  }

  function next() {
    setCurrent(c => c + 1);
    setAnswered(null);
    setCluesRevealed(1);
  }

  const question = deck[current];
  const done = current >= deck.length;
  const maxScore = deck.length * 3; // 3 pts per question if answered on clue 1
  const pct = maxScore > 0 ? Math.min(100, Math.round((score / maxScore) * 100)) : 0;
  const grade = score >= 25 ? "S" : score >= 20 ? "A" : score >= 14 ? "B" : score >= 8 ? "C" : "D";
  const gradeColors = { S: "#D4A24C", A: "#3D9470", B: "#4A7CB8", C: "#C49030", D: "#C04848" };
  useEffect(() => { if (done && (grade === 'S' || grade === 'A')) setShowConfetti(true); }, [done]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* HUD */}
      <div className="grain" style={{ background: "linear-gradient(135deg, #0F172A, #1E2A4A)", borderRadius: T.r3, padding: "14px 20px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 28 }}>🏛️</div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>Market Mogul</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{done ? "Complete" : `${current + 1} / ${deck.length}`}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {streak > 1 && <div className="scale-pop" style={{ background: "rgba(248,181,90,0.2)", borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 800, color: "#D4A254" }}>🔥 {streak}x</div>}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#D4A254", fontFamily: "'JetBrains Mono', monospace" }}>{score}</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>PTS</div>
          </div>
        </div>
      </div>

      {!done ? (
        <>
          {/* Progress bar */}
          <div style={{ height: 6, background: T.bgMuted, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 10, background: `linear-gradient(90deg, #7268C0, ${T.accent})`, width: `${((current + 1) / deck.length) * 100}%`, transition: "width 0.4s" }} />
          </div>

          {/* Clue card — progressive reveal */}
          <div className="card-enter" style={{ background: T.bgCard, borderRadius: T.r3, padding: "24px 22px", border: `1px solid ${T.border}`, boxShadow: T.shadow2 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 1 }}>🔍 Clue {cluesRevealed} of 3</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: cluePoints[cluesRevealed] === 3 ? "#D4A254" : cluePoints[cluesRevealed] === 2 ? T.success : T.textTer }}>
                Worth {cluePoints[cluesRevealed]} pt{cluePoints[cluesRevealed] > 1 ? "s" : ""}
              </div>
            </div>
            {question.clues.slice(0, cluesRevealed).map((clue, i) => (
              <div key={i} className={i === cluesRevealed - 1 ? "fade-up" : ""} style={{ fontSize: 14, fontWeight: 600, color: T.text, lineHeight: 1.6, marginBottom: i < cluesRevealed - 1 ? 8 : 0, paddingLeft: 12, borderLeft: `3px solid ${i === 0 ? "#7268C0" : i === 1 ? "#D97042" : "#4A7CB8"}` }}>
                {clue}
              </div>
            ))}
            {/* Reveal more clues button */}
            {cluesRevealed < 3 && !answered && (
              <button onClick={revealNextClue} style={{ marginTop: 12, padding: "6px 16px", borderRadius: 20, background: T.bgMuted, border: `1px solid ${T.border}`, fontSize: 11, fontWeight: 600, color: T.textSec, cursor: "pointer" }}>
                Need another clue? (−1 pt)
              </button>
            )}
          </div>

          {/* Answer buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {structures.map(st => {
              const isCorrect = answered && st.id === question.answer;
              const isWrong = answered === st.id && st.id !== question.answer;
              return (
                <button key={st.id} onClick={() => answer(st.id)}
                  style={{ padding: "16px 14px", borderRadius: T.r2, border: `2px solid ${isCorrect ? st.color : isWrong ? T.danger : answered ? "transparent" : st.color + "30"}`, background: isCorrect ? st.color + "12" : isWrong ? T.dangerBg : answered ? T.bgMuted : T.bgCard, cursor: answered ? "default" : "pointer", textAlign: "center", transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)", transform: isCorrect ? "scale(1.03)" : isWrong ? "scale(0.97)" : "scale(1)", opacity: answered && !isCorrect && !isWrong ? 0.4 : 1 }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{st.emoji}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isCorrect ? st.color : isWrong ? T.danger : T.text }}>{st.label}</div>
                </button>
              );
            })}
          </div>

          {/* Explanation + "Run the Market" simulation */}
          {answered && (
            <>
              <div className="fade-up" style={{ background: answered === question.answer ? T.successBg : T.dangerBg, borderRadius: T.r2, padding: "14px 18px", borderLeft: `4px solid ${answered === question.answer ? T.success : T.danger}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: answered === question.answer ? T.success : T.danger, marginBottom: 4 }}>
                  {answered === question.answer ? `Correct! +${cluePoints[cluesRevealed]} pts` : `Wrong — it's ${question.answer}`}
                </div>
                <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6 }}>{question.explain}</div>
              </div>
              {/* "Run the Market" micro-simulation */}
              <div className="fade-up" style={{ background: "#F8F4FF", borderRadius: T.r2, padding: "14px 18px", border: "1px solid #7268C022" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#7268C0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>🎮 What happens when you act?</div>
                <div style={{ fontSize: 12, color: T.text, lineHeight: 1.7 }}>{question.simResult}</div>
              </div>
            </>
          )}

          {answered && (
            <button onClick={next} style={{ padding: "10px 24px", borderRadius: T.r5, background: T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", alignSelf: "flex-start" }}>
              {current + 1 >= deck.length ? "See Results" : "Next →"}
            </button>
          )}
        </>
      ) : (
        /* Results */
        <div className="scale-pop" style={{ background: T.bgCard, borderRadius: T.r3, padding: "36px 28px", textAlign: "center", border: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
          <ConfettiEffect active={showConfetti} />
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 30%, ${gradeColors[grade]}15, transparent 60%)` }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: gradeColors[grade] + "22", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: `3px solid ${gradeColors[grade]}44` }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: gradeColors[grade], fontFamily: "'Bricolage Grotesque', sans-serif" }}>{grade}</span>
            </div>
            <div style={{ fontSize: 42, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: T.text, letterSpacing: "-0.04em" }}>{score} pts</div>
            <div style={{ fontSize: 14, color: T.textSec, marginTop: 4 }}>{deck.length} scenarios · Fewer clues = more points</div>
            <div style={{ fontSize: 12, color: T.textTer, marginTop: 8 }}>
              {grade === "S" ? "Market structures mastered — you can identify AND predict firm behaviour!" : grade === "A" ? "Strong understanding — quick identification with minimal clues." : grade === "B" ? "Good foundation — try answering with fewer clues for more points." : "Keep studying — focus on the distinguishing characteristics of each structure."}
            </div>
            <div style={{ marginTop: 12, padding: "10px 14px", background: T.accentLight, borderRadius: T.r2, fontSize: 11, color: T.accentText, textAlign: "left", lineHeight: 1.6 }}>
              📝 <strong>H2 Exam Tip:</strong> When identifying market structures, look for: number of firms, product differentiation, barriers to entry, and interdependence. The "Run the Market" scenarios show how firms behave differently under each structure.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketMogulGame;
