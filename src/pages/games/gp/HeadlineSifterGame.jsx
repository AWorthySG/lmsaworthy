import React, { useState, useEffect, useRef } from 'react';
import { T } from '../../../theme/theme.js';
import { ConfettiEffect } from '../../../components/gamification';

function HeadlineSifterGame() {
  const headlines = [
    { text: "Study Finds 73% of Teens Report Increased Anxiety After Social Media Use", source: "National Health Review", answer: "reliable", explain: "Specific statistic, named source, neutral language.", redFlags: [] },
    { text: "SHOCKING: Government's SECRET Plan to Control What You Think!", source: "TruthPatriot.net", answer: "misleading", explain: "Clickbait caps, emotional manipulation, vague unnamed 'plan', unverified source.", redFlags: ["SHOCKING", "SECRET", "TruthPatriot.net"] },
    { text: "Local Man Discovers One Weird Trick That Banks Don't Want You to Know", source: "ViralFinance", answer: "misleading", explain: "Classic clickbait pattern: 'one weird trick', appeals to secrecy, no substance.", redFlags: ["One Weird Trick", "Don't Want You to Know"] },
    { text: "Singapore's Rental Market Shows 3.2% Decline in Q3, Analysts Note Cooling Trend", source: "Straits Times", answer: "reliable", explain: "Specific data, time-bound, attributed to analysts, established publication.", redFlags: [] },
    { text: "Area Man Absolutely Certain He Could Run Country Better From His HDB Flat", source: "The Singapore Siao", answer: "satire", explain: "Humorous tone, 'Area Man' is a classic satire trope, publication name signals comedy.", redFlags: ["Area Man", "Singapore Siao"] },
    { text: "Scientists PROVE Organic Food Cures All Diseases — Big Pharma Furious!", source: "NaturalTruthDaily", answer: "misleading", explain: "Absolute claim ('all diseases'), conspiracy framing ('Big Pharma'), no named scientists.", redFlags: ["PROVE", "All Diseases", "Big Pharma Furious"] },
    { text: "Opposition Party's Education Proposal May Increase Class Sizes, Critics Warn", source: "CNA", answer: "reliable", explain: "Balanced ('may', 'critics warn'), specific policy, established broadcaster.", redFlags: [] },
    { text: "Every Boomer I Know Has This One Opinion About Young People and It's Hilarious", source: "BuzzLah", answer: "biased", explain: "Generational stereotyping, clickbait structure, emotionally loaded ('hilarious').", redFlags: ["Every Boomer", "Hilarious"] },
    { text: "Why This Generation Is Simply Too Lazy to Succeed — An Opinion", source: "Commentary Weekly", answer: "biased", explain: "Sweeping generalisation, labelled as opinion but presented provocatively, no evidence.", redFlags: ["Simply Too Lazy", "This Generation"] },
    { text: "Nation's Dogs Celebrate After Government Declares Every Day Is 'Good Boy Day'", source: "The Kopi Onion", answer: "satire", explain: "Absurd premise, personification of animals, parody publication name.", redFlags: ["Nation's Dogs", "Good Boy Day", "Kopi Onion"] },
    { text: "New Study Links Moderate Coffee Consumption to Reduced Risk of Type 2 Diabetes", source: "The Lancet", answer: "reliable", explain: "Specific health claim, prestigious peer-reviewed medical journal, hedged language ('moderate', 'reduced risk').", redFlags: [] },
    { text: "This ONE Superfood Will Make You Live to 150 — Doctors Are BAFFLED!", source: "HealthHacksDaily", answer: "misleading", explain: "Absurd health claim, clickbait formula ('ONE', 'BAFFLED'), no named doctors, unrealistic promise.", redFlags: ["ONE Superfood", "150", "BAFFLED"] },
    { text: "Millennials Are Killing the Economy by Spending Too Much on Avocado Toast", source: "The Daily Commentary", answer: "biased", explain: "Generational blame, oversimplification of complex economic factors, dismissive tone, no data cited.", redFlags: ["Millennials Are Killing", "Avocado Toast"] },
    { text: "Local Cat Elected Mayor of Small Town in Landslide Victory, Promises More Naps", source: "The Onion Singapore", answer: "satire", explain: "Absurd scenario (cat as mayor), humorous promises ('more naps'), obvious parody outlet.", redFlags: ["Cat Elected Mayor", "Promises More Naps"] },
    { text: "Global Carbon Emissions Rose 1.1% in 2025, Driven Largely by Emerging Economies", source: "Reuters", answer: "reliable", explain: "Specific percentage, time-bound data, attributed to identifiable factor, tier-1 wire service.", redFlags: [] },
  ];
  const [deck] = useState(() => [...headlines].sort(() => Math.random() - 0.5).slice(0, 12));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef(null);

  // Timer per headline
  useEffect(() => {
    if (current >= deck.length || answered) return;
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setAnswered("timeout"); setStreak(0); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [current, answered]);
  const categories = [
    { id: "reliable", label: "Reliable", emoji: "✅", color: "#3BAA7E", bg: "#EAF6F2" },
    { id: "biased", label: "Biased", emoji: "⚠️", color: "#E5A832", bg: "#FFF8EC" },
    { id: "misleading", label: "Misleading", emoji: "🚫", color: "#E05262", bg: "#FDEFF1" },
    { id: "satire", label: "Satire", emoji: "😂", color: "#7C6FDB", bg: "#F0EDFF" },
  ];
  const catLookup = Object.fromEntries(categories.map(c => [c.id, c]));

  function answer(cat) {
    if (answered) return;
    clearInterval(timerRef.current);
    setAnswered(cat);
    if (cat === deck[current].answer) {
      const speedBonus = timeLeft >= 10 ? 2 : 1; // fast answer = double points
      const streakBonus = Math.min(streak + 1, 4); // streak multiplier caps at 4x
      setScore(s => s + speedBonus * streakBonus);
      setStreak(s => s + 1);
    } else { setStreak(0); }
  }
  function next() { setCurrent(c => c + 1); setAnswered(null); }
  const h = deck[current];
  const done = current >= deck.length;
  const maxPossible = deck.length * 8; // theoretical max with perfect streaks + speed
  const pct = deck.length > 0 ? Math.min(100, Math.round((score / (deck.length * 3)) * 100)) : 0;
  const grade = pct >= 90 ? "S" : pct >= 80 ? "A" : pct >= 60 ? "B" : pct >= 40 ? "C" : "D";
  const gradeColors = { S: "#D4A254", A: "#3BAA7E", B: "#3D7DD6", C: "#E5A832", D: "#E05262" };
  useEffect(() => { if (done && (grade === 'S' || grade === 'A')) setShowConfetti(true); }, [done]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* HUD */}
      <div className="grain" style={{ background: "linear-gradient(135deg, #0F172A, #1E2A4A)", borderRadius: T.r3, padding: "14px 20px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", overflow: "hidden", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 28 }}>📰</div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>Headline Sifter</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{done ? "Complete" : `${current + 1} of ${deck.length}`}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {streak > 1 && <div className="scale-pop" style={{ background: "rgba(248,181,90,0.2)", borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 800, color: "#D4A254" }}>🔥 {streak}x</div>}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#51cf66" }}>{score}</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>CORRECT</div>
          </div>
        </div>
      </div>

      {!done ? (
        <>
          {/* Progress */}
          <div style={{ height: 6, background: T.bgMuted, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 10, background: "linear-gradient(90deg, #7C6FDB, #EF8354)", width: `${((current + 1) / deck.length) * 100}%`, transition: "width 0.4s cubic-bezier(0.22,1,0.36,1)" }} />
          </div>

          {/* Timer bar */}
          {!answered && (
            <div style={{ height: 5, background: T.bgMuted, borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 10, background: timeLeft <= 5 ? "#E05262" : timeLeft <= 8 ? "#E5A832" : "#3BAA7E", width: `${(timeLeft / 15) * 100}%`, transition: "width 1s linear, background 0.3s" }} />
            </div>
          )}

          {/* Newspaper-style headline card */}
          <div className="card-enter" style={{ background: "#FFFEF8", borderRadius: T.r3, padding: "28px 26px", border: "1px solid #E8E4D8", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", position: "relative", overflow: "hidden" }}>
            {/* Newspaper texture lines */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #0F172A, #2D3A8C)" }} />
            {/* Timer display */}
            {!answered && <div style={{ position: "absolute", top: 12, right: 16, fontSize: 18, fontWeight: 800, color: timeLeft <= 5 ? "#E05262" : timeLeft <= 8 ? "#E5A832" : "#C8BEA8", fontFamily: "'JetBrains Mono', monospace" }}>{timeLeft}s</div>}
            <div style={{ fontSize: 9, fontWeight: 700, color: "#9A8E78", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
              <span>{h.source}</span>
              {answered && timeLeft >= 10 && answered !== "timeout" && <span style={{ color: "#D4A254", fontWeight: 800 }}>⚡ SPEED BONUS</span>}
            </div>
            <div style={{ fontSize: 19, fontWeight: 800, color: "#1A1D2B", lineHeight: 1.45, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{h.text}</div>
            {/* Red flag indicators after answer */}
            {answered && h.redFlags.length > 0 && (
              <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {h.redFlags.map((f, i) => (
                  <span key={i} className="scale-pop" style={{ animationDelay: `${i * 80}ms`, fontSize: 10, fontWeight: 700, color: "#E05262", background: "#FDEFF1", padding: "2px 8px", borderRadius: 20, border: "1px solid #E0526233" }}>🚩 {f}</span>
                ))}
              </div>
            )}
          </div>

          {/* Category buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {categories.map(cat => {
              const isCorrect = answered && cat.id === h.answer;
              const isWrong = answered === cat.id && cat.id !== h.answer;
              return (
                <button key={cat.id} onClick={() => answer(cat.id)}
                  style={{ padding: "16px 14px", borderRadius: T.r2, border: `2px solid ${isCorrect ? cat.color : isWrong ? T.danger : answered ? "transparent" : cat.color + "30"}`, background: isCorrect ? cat.bg : isWrong ? T.dangerBg : answered ? T.bgMuted : T.bgCard, cursor: answered ? "default" : "pointer", textAlign: "center", transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)", transform: isCorrect ? "scale(1.03)" : isWrong ? "scale(0.97)" : "scale(1)", opacity: answered && !isCorrect && !isWrong ? 0.4 : 1 }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{cat.emoji}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: isCorrect ? cat.color : isWrong ? T.danger : T.text }}>{cat.label}</div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answered && (
            <div className="fade-up" style={{ background: answered === h.answer ? catLookup[h.answer].bg : T.dangerBg, borderRadius: T.r2, padding: "14px 18px", borderLeft: `4px solid ${answered === h.answer ? catLookup[h.answer].color : T.danger}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: answered === h.answer ? catLookup[h.answer].color : T.danger, marginBottom: 4 }}>
                {answered === h.answer ? `✓ Correct — ${catLookup[h.answer].label}` : `✗ It's actually "${catLookup[h.answer].label}"`}
              </div>
              <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6 }}>{h.explain}</div>
            </div>
          )}
          {/* Timeout */}
          {answered === "timeout" && (
            <div className="fade-up" style={{ background: T.dangerBg, borderRadius: T.r2, padding: "12px 16px", textAlign: "center", borderLeft: `4px solid ${T.danger}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.danger }}>⏰ Time's up!</div>
              <div style={{ fontSize: 12, color: T.text, marginTop: 4 }}>This headline is <strong>{catLookup[h.answer].label}</strong>: {h.explain}</div>
            </div>
          )}
          {answered && <button onClick={next} style={{ padding: "10px 24px", borderRadius: T.r5, background: T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", alignSelf: "flex-start" }}>{current + 1 >= deck.length ? "See Results" : "Next Headline →"}</button>}
        </>
      ) : (
        <div className="scale-pop" style={{ background: T.bgCard, borderRadius: T.r3, padding: "36px 28px", color: T.text, textAlign: "center", position: "relative", overflow: "hidden" }}>
          <ConfettiEffect active={showConfetti} />
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 30%, ${gradeColors[grade]}15, transparent 60%)` }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: gradeColors[grade] + "22", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: `3px solid ${gradeColors[grade]}44` }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: gradeColors[grade], fontFamily: "'Bricolage Grotesque', sans-serif" }}>{grade}</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{score} pts</div>
            <div style={{ fontSize: 14, color: T.textSec, marginTop: 4 }}>{deck.length} headlines · Speed bonuses + streak multipliers</div>
            <div style={{ fontSize: 12, color: T.textTer, marginTop: 8 }}>
              {pct >= 90 ? "🏆 Master Media Analyst — you can spot misinformation instantly!" : pct >= 70 ? "👁️ Sharp eye — a few more tricky ones to master." : pct >= 50 ? "📰 Good start — review the red flag indicators above." : "📚 Keep practising — media literacy is a crucial skill."}
            </div>
            <div style={{ marginTop: 12, padding: "10px 14px", background: T.accentLight, borderRadius: T.r2, fontSize: 11, color: T.accentText, textAlign: "left", lineHeight: 1.6 }}>
              📝 <strong>GP Paper 2 Tip:</strong> When evaluating sources in comprehension, check for: specific data, named sources, hedged language ("may", "suggests"), and established publications. These are the same signals tested here.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeadlineSifterGame;
