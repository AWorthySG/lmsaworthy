import React, { useState } from 'react';
import { T } from '../../../theme/theme.js';

function ThesisDefenceGame() {
  const questions = [
    {
      question: "'Technology does more harm than good.' Discuss.",
      counters: [
        { attack: "Technology has created millions of jobs in the tech sector and boosted economic productivity globally.", rebuttals: [
          { text: "While technology creates jobs, it also displaces workers in traditional industries, and the net effect on employment remains debated by economists.", quality: "strong" },
          { text: "That's just what tech companies want you to think — they only care about profits.", quality: "weak" },
          { text: "Technology's economic benefits don't negate its psychological and social harms. Economic growth at the cost of mental health is not genuine progress.", quality: "strong" },
        ]},
        { attack: "Telemedicine and AI diagnostics have saved countless lives in underserved regions with no access to doctors.", rebuttals: [
          { text: "Healthcare benefits exist but are concentrated in wealthy nations. Most of the world's population still lacks reliable internet access, widening the digital health divide.", quality: "strong" },
          { text: "Doctors are better than machines. Technology can never replace human intuition.", quality: "weak" },
          { text: "Acknowledged — healthcare is one area where technology's benefits are clear. However, the same technology enables mass surveillance and data exploitation of patients.", quality: "acceptable" },
        ]},
        { attack: "Social media gives marginalised groups a voice they never had — protest movements like #MeToo would have been impossible without technology.", rebuttals: [
          { text: "Social media can amplify voices, but it equally amplifies misinformation, hate speech, and radicalisation. The platform that enables #MeToo also enables QAnon.", quality: "strong" },
          { text: "People protested long before social media existed. The civil rights movement didn't need Twitter.", quality: "acceptable" },
          { text: "That's one example. For every successful movement, there are thousands of cases of cyberbullying and harassment.", quality: "acceptable" },
        ]},
        { attack: "Renewable energy technology is our best hope for fighting climate change — solar and wind have become cheaper than fossil fuels.", rebuttals: [
          { text: "Clean energy technology is promising, but technology also caused the climate crisis through industrialisation. We cannot assume the same force that caused the problem will solve it without systemic change.", quality: "strong" },
          { text: "Solar panels are made with rare earth minerals mined in environmentally destructive ways.", quality: "acceptable" },
          { text: "Climate change isn't really about technology, it's about politics.", quality: "weak" },
        ]},
        { attack: "Online education platforms like Khan Academy have democratised access to world-class education for free.", rebuttals: [
          { text: "Access to content ≠ access to education. Without structured guidance, mentorship, and a supportive environment, free online resources often widen the gap between self-motivated learners and those who need more support.", quality: "strong" },
          { text: "Most students don't actually finish online courses — completion rates are under 10%.", quality: "acceptable" },
          { text: "Books have been free in libraries for centuries. Online education isn't that revolutionary.", quality: "weak" },
        ]},
      ],
    },
  ];
  const [qIdx] = useState(0);
  const [phase, setPhase] = useState("defend"); // defend | done
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(3);
  const [answered, setAnswered] = useState(null);
  const [history, setHistory] = useState([]);

  const q = questions[qIdx];
  const counter = q.counters[round];
  const done = round >= q.counters.length || hp <= 0;

  function selectRebuttal(reb) {
    if (answered) return;
    setAnswered(reb);
    const pts = reb.quality === "strong" ? 2 : reb.quality === "acceptable" ? 1 : 0;
    setScore(s => s + pts);
    if (reb.quality === "weak") setHp(h => h - 1);
    setHistory(h => [...h, { round, quality: reb.quality }]);
  }

  function next() { setRound(r => r + 1); setAnswered(null); }

  const maxScore = q.counters.length * 2;
  const pct = Math.round((score / maxScore) * 100);
  const grade = pct >= 90 ? "S" : pct >= 70 ? "A" : pct >= 50 ? "B" : pct >= 30 ? "C" : "D";
  const gradeColors = { S: "#D4A254", A: "#3BAA7E", B: "#3D7DD6", C: "#E5A832", D: "#E05262" };
  const qualityColors = { strong: "#3BAA7E", acceptable: "#E5A832", weak: "#E05262" };

  if (done) {
    return (
      <div className="scale-pop" style={{ background: T.bgCard, borderRadius: T.r3, padding: "36px 28px", textAlign: "center", border: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 30%, ${gradeColors[grade]}15, transparent 60%)` }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{hp > 0 ? "🛡️" : "💥"}</div>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: gradeColors[grade] + "22", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: `3px solid ${gradeColors[grade]}44` }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: gradeColors[grade], fontFamily: "'Bricolage Grotesque', sans-serif" }}>{grade}</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: T.text }}>{score} / {maxScore}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
            {history.map((h, i) => (
              <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: qualityColors[h.quality] + "20", border: `2px solid ${qualityColors[h.quality]}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                {h.quality === "strong" ? "✓" : h.quality === "acceptable" ? "~" : "✗"}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: T.textTer, marginTop: 12 }}>
            {hp <= 0 ? "Your thesis crumbled! Focus on rebuttals that acknowledge the counter-argument." : grade === "S" ? "Masterful defence! Your argumentative skills are Band 5 material." : "Review: the strongest rebuttals acknowledge the counter before refuting it."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* HUD */}
      <div className="grain" style={{ background: "linear-gradient(135deg, #0F172A, #302050)", borderRadius: T.r3, padding: "16px 20px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>Thesis Defence</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Wave {round + 1} / {q.counters.length}</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#D4A254", fontFamily: "'JetBrains Mono', monospace" }}>{score}</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>SCORE</div>
          </div>
          <div style={{ display: "flex", gap: 3 }}>
            {Array.from({ length: 3 }, (_, i) => <span key={i} style={{ fontSize: 16, opacity: i < hp ? 1 : 0.2 }}>{i < hp ? "🛡️" : "💔"}</span>)}
          </div>
        </div>
      </div>

      {/* Essay question */}
      <div style={{ background: T.bgMuted, borderRadius: T.r2, padding: "12px 16px", fontSize: 13, fontWeight: 600, color: T.text, fontFamily: "'Fraunces', serif", fontStyle: "italic", lineHeight: 1.6 }}>
        {q.question}
      </div>

      {/* Counter-argument attack */}
      <div style={{ background: "#FEF2F2", borderRadius: T.r2, padding: "16px 18px", border: `1px solid #E0526233`, position: "relative" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#E05262", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
          <span>⚔️</span> Counter-Argument
        </div>
        <div style={{ fontSize: 14, color: T.text, lineHeight: 1.7, fontWeight: 500 }}>{counter.attack}</div>
      </div>

      {/* Rebuttal options */}
      <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: 0.5 }}>Choose your rebuttal:</div>
      {counter.rebuttals.map((reb, i) => {
        const isSelected = answered === reb;
        const showQuality = answered !== null;
        return (
          <button key={i} onClick={() => selectRebuttal(reb)}
            style={{
              padding: "14px 18px", borderRadius: T.r2, textAlign: "left", fontSize: 13, lineHeight: 1.6, cursor: answered ? "default" : "pointer",
              border: `2px solid ${isSelected ? qualityColors[reb.quality] : showQuality && reb.quality === "strong" ? "#3BAA7E55" : T.border}`,
              background: isSelected ? qualityColors[reb.quality] + "12" : showQuality && reb.quality === "strong" && !isSelected ? "#EAF6F222" : T.bgCard,
              opacity: showQuality && !isSelected && reb.quality !== "strong" ? 0.5 : 1, transition: "all 0.2s",
              color: T.text,
            }}>
            {showQuality && <div style={{ fontSize: 10, fontWeight: 800, color: qualityColors[reb.quality], textTransform: "uppercase", marginBottom: 4 }}>
              {reb.quality === "strong" ? "✓ Strong rebuttal (+2)" : reb.quality === "acceptable" ? "~ Acceptable (+1)" : "✗ Weak — thesis takes damage!"}
            </div>}
            {reb.text}
          </button>
        );
      })}

      {answered && <button onClick={next} style={{ padding: "10px 24px", borderRadius: T.r5, background: T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", alignSelf: "flex-start" }}>{round + 1 >= q.counters.length ? "See Results" : "Next Attack →"}</button>}
    </div>
  );
}

export default ThesisDefenceGame;
