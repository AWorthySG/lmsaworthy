import React, { useState, useEffect } from 'react';
import { T } from '../../../theme/theme.js';
import { ConfettiEffect } from '../../../components/gamification';

function ArgumentMapperGame() {
  const claims = [
    {
      claim: "AI will replace most white-collar jobs within 20 years",
      cards: [
        { text: "Automation already handles routine legal research, medical imaging analysis, and financial auditing faster than humans.", category: "for", explain: "Specific real-world examples of AI displacing white-collar tasks across multiple industries." },
        { text: "New technologies historically create more jobs than they destroy — ATMs led to more bank branches, not fewer bank tellers.", category: "against", explain: "Historical counter-evidence shows technological unemployment fears have been overstated before." },
        { text: "GPT-4 scored in the 90th percentile on the bar exam, demonstrating capability to replace lawyers.", category: "for", explain: "Concrete benchmark showing AI can perform at professional certification level." },
        { text: "Only a fool would ignore the obvious threat of AI — anyone who disagrees is simply not paying attention.", category: "fallacy", fallacyType: "Ad Hominem", explain: "Attacks the character of those who disagree rather than addressing their arguments." },
        { text: "AI lacks emotional intelligence, ethical judgement, and the ability to navigate complex interpersonal negotiations.", category: "against", explain: "Identifies genuine limitations of current AI that are central to many white-collar roles." },
        { text: "Professor Stephen Hawking warned about AI, so it must be dangerous to jobs.", category: "fallacy", fallacyType: "Appeal to Authority", explain: "Uses a famous scientist's opinion outside his field of expertise as definitive proof." },
        { text: "McKinsey estimates 30% of work hours globally could be automated by 2030 with current technology.", category: "for", explain: "Cites a specific, quantified projection from a reputable research firm." },
        { text: "People who support AI are just saying we should let robots take over everything and make humans obsolete.", category: "fallacy", fallacyType: "Straw Man", explain: "Misrepresents the pro-AI position as wanting total human replacement, which no one argues." },
        { text: "Most AI tools augment human workers rather than replacing them — radiologists using AI detect 11% more cancers.", category: "against", explain: "Evidence that AI serves as a complement to human expertise, not a substitute." },
        { text: "The cost of training AI models is falling exponentially, making automation economically viable for smaller firms.", category: "for", explain: "Economic argument about decreasing barriers to AI adoption across the economy." },
      ]
    },
    {
      claim: "Social media companies should be legally liable for content posted by users",
      cards: [
        { text: "Platforms profit from engagement algorithms that amplify harmful and misleading content, creating a duty of care.", category: "for", explain: "Argues economic incentives create moral and legal responsibility for content outcomes." },
        { text: "Holding platforms liable would effectively end free speech online — people could never post anything.", category: "fallacy", fallacyType: "Slippery Slope", explain: "Exaggerates the consequence to an extreme outcome without justifying the logical chain." },
        { text: "Section 230 immunity was written in 1996, long before platforms became dominant information gatekeepers.", category: "for", explain: "Valid historical argument that legal frameworks have not kept pace with platform power." },
        { text: "Newspapers are liable for what they print; platforms that curate and recommend content function similarly.", category: "for", explain: "Draws a reasonable analogy between editorial curation and algorithmic recommendation." },
        { text: "The sheer volume of user content — 500 hours of video uploaded to YouTube every minute — makes pre-screening impossible.", category: "against", explain: "Practical argument about the infeasibility of content moderation at scale." },
        { text: "Everyone knows social media is toxic — only paid shills for Big Tech would defend these companies.", category: "fallacy", fallacyType: "Ad Hominem", explain: "Dismisses opposing views by attacking motivations rather than engaging with arguments." },
        { text: "Platform liability could stifle innovation, as startups cannot afford the legal risk that large companies can absorb.", category: "against", explain: "Economic argument about the unequal impact of liability on firms of different sizes." },
        { text: "Germany's NetzDG law requires platforms to remove illegal content within 24 hours and has reduced hate speech by 20%.", category: "for", explain: "Cites a specific policy precedent with measurable outcomes." },
        { text: "My friend was cyberbullied on Instagram, which proves social media companies don't care about safety.", category: "fallacy", fallacyType: "Anecdotal Evidence", explain: "Uses a single personal experience to make a sweeping generalisation about corporate intent." },
        { text: "Liability would push platforms toward over-censorship, removing legitimate political speech to avoid legal risk.", category: "against", explain: "Valid concern about the chilling effect of liability on lawful expression." },
      ]
    }
  ];

  const [claimIdx] = useState(() => Math.floor(Math.random() * claims.length));
  const scenario = claims[claimIdx];
  const [deck] = useState(() => [...scenario.cards].sort(() => Math.random() - 0.5));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const categories = [
    { id: "for", label: "FOR", emoji: "✅", color: "#3D9470", bg: "#EBF3EF" },
    { id: "against", label: "AGAINST", emoji: "❌", color: "#C04848", bg: "#F8ECEC" },
    { id: "fallacy", label: "FALLACY", emoji: "⚠️", color: "#C49030", bg: "#F9F3E6" },
  ];
  const catLookup = Object.fromEntries(categories.map(c => [c.id, c]));

  const [wager, setWager] = useState(1); // 1x, 2x, 3x confidence wager
  const [fallacyGuess, setFallacyGuess] = useState(null); // subtype identification
  const [showFallacyStep, setShowFallacyStep] = useState(false);
  const fallacyTypes = ["Ad Hominem", "Straw Man", "Appeal to Authority", "Slippery Slope", "Anecdotal Evidence"];

  function answer(cat) {
    if (answered) return;
    const card = deck[current];
    setAnswered(cat);
    if (cat === card.category) {
      // If it's a fallacy, show subtype identification step before awarding points
      if (cat === "fallacy" && card.fallacyType) {
        setShowFallacyStep(true);
        // Points awarded after fallacy subtype guess
      } else {
        setScore(s => s + wager);
        setStreak(s => { const ns = s + 1; setBestStreak(b => Math.max(b, ns)); return ns; });
      }
    } else {
      setScore(s => Math.max(0, s - wager)); // lose wagered points
      setStreak(0);
    }
  }

  function submitFallacyGuess(type) {
    const card = deck[current];
    setFallacyGuess(type);
    setShowFallacyStep(false);
    const bonus = type === card.fallacyType ? 2 : 0;
    setScore(s => s + wager + bonus);
    setStreak(s => { const ns = s + 1; setBestStreak(b => Math.max(b, ns)); return ns; });
  }

  function next() {
    setCurrent(c => c + 1);
    setAnswered(null);
    setWager(1);
    setFallacyGuess(null);
    setShowFallacyStep(false);
  }

  const card = deck[current];
  const done = current >= deck.length;
  const pct = deck.length > 0 ? Math.round((score / deck.length) * 100) : 0;
  const grade = pct >= 90 ? "S" : pct >= 80 ? "A" : pct >= 60 ? "B" : pct >= 40 ? "C" : "D";
  const gradeColors = { S: "#D4A24C", A: "#3D9470", B: "#4A7CB8", C: "#C49030", D: "#C04848" };
  useEffect(() => { if (done && (grade === 'S' || grade === 'A')) setShowConfetti(true); }, [done]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* HUD */}
      <div style={{ background: T.bgMuted, borderRadius: T.r3, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 28 }}>🗺️</div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 200, color: T.textTer, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Argument Mapper</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{done ? "Complete" : `Card ${current + 1} of ${deck.length}`}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {streak > 1 && <div style={{ background: T.accentLight, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 800, color: T.accent }}>🔥 {streak}x</div>}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.success, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{score}</div>
            <div style={{ fontSize: 8, color: T.textTer }}>CORRECT</div>
          </div>
        </div>
      </div>

      {!done ? (
        <>
          {/* Progress */}
          <div style={{ height: 6, background: T.bgMuted, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 10, background: `linear-gradient(90deg, ${T.accent}, #D4A24C)`, width: `${((current + 1) / deck.length) * 100}%`, transition: "width 0.4s cubic-bezier(0.22,1,0.36,1)" }} />
          </div>

          {/* Claim banner */}
          <div style={{ background: T.bgMuted, borderRadius: T.r2, padding: "10px 16px", borderLeft: `3px solid ${T.accent}` }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Claim</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif" }}>"{scenario.claim}"</div>
          </div>

          {/* Confidence Wager — Gimkit-style */}
          {!answered && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: T.textSec }}>Confidence:</span>
              {[1, 2, 3].map(w => (
                <button key={w} onClick={() => setWager(w)}
                  style={{ padding: "4px 14px", borderRadius: 20, border: `2px solid ${wager === w ? T.accent : T.border}`, background: wager === w ? T.accentLight : T.bgCard, fontSize: 12, fontWeight: 800, color: wager === w ? T.accent : T.textTer, cursor: "pointer", transition: "all 0.15s" }}>
                  {w}x
                </button>
              ))}
              <span style={{ fontSize: 10, color: T.textTer, marginLeft: 4 }}>
                {wager === 1 ? "Safe bet" : wager === 2 ? "Double or nothing" : "💎 All in!"}
              </span>
            </div>
          )}

          {/* Argument card */}
          <div className="card-enter" style={{ background: T.bgCard, borderRadius: T.r3, padding: "24px 22px", border: `1px solid ${T.border}`, boxShadow: T.shadow2 }}>
            <div style={{ fontSize: 9, fontWeight: 200, color: T.textTer, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 10 }}>Argument</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: T.text, lineHeight: 1.55 }}>"{card.text}"</div>
            {/* After answer: fallacy badge */}
            {answered && card.category === "fallacy" && card.fallacyType && !showFallacyStep && (
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#C49030", background: "#F9F3E6", padding: "3px 10px", borderRadius: 20, border: "1px solid #C4903033" }}>⚠️ {card.fallacyType}</span>
                {fallacyGuess && fallacyGuess === card.fallacyType && <span style={{ fontSize: 11, fontWeight: 700, color: T.success }}>+2 bonus!</span>}
                {fallacyGuess && fallacyGuess !== card.fallacyType && <span style={{ fontSize: 11, fontWeight: 600, color: T.textTer }}>You guessed: {fallacyGuess}</span>}
              </div>
            )}
          </div>

          {/* Fallacy Subtype Identification Step */}
          {showFallacyStep && (
            <div className="fade-up" style={{ background: "#F9F3E6", borderRadius: T.r2, padding: "16px 18px", border: "1px solid #C4903033" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#C49030", marginBottom: 10 }}>🎯 Bonus Round: What TYPE of fallacy is this?</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {fallacyTypes.map(ft => (
                  <button key={ft} onClick={() => submitFallacyGuess(ft)}
                    style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid #C4903033`, background: "#fff", fontSize: 11, fontWeight: 700, color: "#C49030", cursor: "pointer", transition: "all 0.15s" }}>
                    {ft}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 10, color: T.textTer, marginTop: 6 }}>Correct subtype = +2 bonus points</div>
            </div>
          )}

          {/* Category buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {categories.map(cat => {
              const isCorrect = answered && cat.id === card.category;
              const isWrong = answered === cat.id && cat.id !== card.category;
              return (
                <button key={cat.id} onClick={() => answer(cat.id)}
                  style={{ padding: "16px 10px", borderRadius: T.r2, border: `2px solid ${isCorrect ? cat.color : isWrong ? T.danger : answered ? "transparent" : cat.color + "30"}`, background: isCorrect ? cat.bg : isWrong ? T.dangerBg : answered ? T.bgMuted : T.bgCard, cursor: answered ? "default" : "pointer", textAlign: "center", transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)", transform: isCorrect ? "scale(1.03)" : isWrong ? "scale(0.97)" : "scale(1)", opacity: answered && !isCorrect && !isWrong ? 0.4 : 1 }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{cat.emoji}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isCorrect ? cat.color : isWrong ? T.danger : T.text }}>{cat.label}</div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answered && (
            <div className="fade-up" style={{ background: answered === card.category ? catLookup[card.category].bg : T.dangerBg, borderRadius: T.r2, padding: "14px 18px", borderLeft: `4px solid ${answered === card.category ? catLookup[card.category].color : T.danger}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: answered === card.category ? catLookup[card.category].color : T.danger, marginBottom: 4 }}>
                {answered === card.category ? `Correct — ${catLookup[card.category].label}${card.fallacyType ? ` (${card.fallacyType})` : ""}` : `Wrong — it's actually "${catLookup[card.category].label}"${card.fallacyType ? ` (${card.fallacyType})` : ""}`}
              </div>
              <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6 }}>{card.explain}</div>
            </div>
          )}

          {answered && (
            <button onClick={next} style={{ padding: "10px 24px", borderRadius: T.r5, background: T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", alignSelf: "flex-start" }}>
              {current + 1 >= deck.length ? "See Results" : "Next Argument →"}
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
            <div style={{ fontSize: 42, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: T.text, letterSpacing: "-0.04em" }}>{pct}%</div>
            <div style={{ fontSize: 14, color: T.textSec, marginTop: 4 }}>{score} / {deck.length} arguments correctly identified</div>
            {bestStreak > 2 && <div style={{ fontSize: 12, color: T.accent, fontWeight: 700, marginTop: 8 }}>🔥 Best streak: {bestStreak}x</div>}
            <div style={{ fontSize: 12, color: T.textTer, marginTop: 8 }}>
              {pct >= 90 ? "Master analyst — you can spot fallacies and weigh arguments with precision!" : pct >= 70 ? "Sharp critical thinker — a few tricky ones slipped through." : pct >= 50 ? "Good start — review the logical fallacy types." : "Keep practising — identifying fallacies is a crucial GP skill."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArgumentMapperGame;
