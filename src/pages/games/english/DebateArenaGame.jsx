import React, { useState } from 'react';
import { T } from '../../../theme/theme.js';

function DebateArenaGame() {
  const topics = [
    { claim: "Social media does more harm than good for teenagers.",
      args: [
        { text: "Increases anxiety, depression, and body image issues", side: "for", strength: "strong" },
        { text: "Enables cyberbullying with no escape from school conflicts", side: "for", strength: "strong" },
        { text: "Encourages comparison culture and unrealistic standards", side: "for", strength: "moderate" },
        { text: "Provides community for isolated and marginalised youth", side: "against", strength: "strong" },
        { text: "Platform for creative expression and skill development", side: "against", strength: "moderate" },
        { text: "Enables access to educational content and global perspectives", side: "against", strength: "weak" },
      ],
      rebuttals: [
        { attack: "Social media connects isolated young people who have no community in real life.", best: "While connection exists, studies show heavy users report MORE loneliness, not less — digital connection is not a substitute for face-to-face interaction.", bestLabel: "Acknowledge then refute with evidence", ok: "Not everyone who uses social media is lonely.", weak: "That's just what social media companies want you to believe." },
        { attack: "Platforms like YouTube and TikTok are powerful educational tools.", best: "Educational content exists but represents a fraction of usage. The average teen spends 3+ hours daily on social media, primarily consuming entertainment — the educational argument overstates the reality.", bestLabel: "Proportionality argument", ok: "Books are better for learning than TikTok.", weak: "Education should happen in schools, not on phones." },
        { attack: "Banning social media would infringe on young people's freedom of expression.", best: "Regulation does not equal banning. Age-appropriate design requirements and algorithmic transparency protect young users without eliminating the platform entirely.", bestLabel: "Nuanced distinction (regulation ≠ ban)", ok: "Children don't have the same rights as adults.", weak: "Freedom of expression is less important than safety." },
      ],
    },
    { claim: "Zoos should be banned in the modern world.",
      args: [
        { text: "Animals suffer psychological distress in confined environments", side: "for", strength: "strong" },
        { text: "Modern documentaries offer better educational alternatives", side: "for", strength: "moderate" },
        { text: "Captive breeding rarely succeeds in reintroducing species to the wild", side: "for", strength: "moderate" },
        { text: "Zoos protect endangered species through managed breeding programmes", side: "against", strength: "strong" },
        { text: "They provide vital research opportunities for conservation science", side: "against", strength: "strong" },
        { text: "Zoos educate millions and inspire support for wildlife protection", side: "against", strength: "weak" },
      ],
      rebuttals: [
        { attack: "Without zoos, species like the Arabian oryx would be extinct.", best: "Some conservation successes exist, but they are exceptions. The vast majority of zoo animals are not endangered species — most zoos prioritise crowd-pleasers over genuine conservation targets.", bestLabel: "Acknowledge exception, challenge the rule", ok: "There are other ways to protect species, like habitat preservation.", weak: "Animals should be free, period." },
        { attack: "Children who visit zoos develop a lifelong passion for wildlife.", best: "Research on the 'zoo effect' is inconclusive. A 2014 study found no significant long-term change in conservation attitudes after zoo visits. Direct nature experiences may be more impactful.", bestLabel: "Counter with specific research", ok: "Documentaries are more educational than seeing a bored animal in a cage.", weak: "Kids can learn about animals from books." },
        { attack: "Modern zoos have vastly improved animal welfare standards.", best: "Improvements exist, but even the best enclosures cannot replicate natural ranges. An elephant enclosure of 2 hectares versus a natural range of 5,000 sq km — the gap remains fundamental.", bestLabel: "Concede improvement, maintain core objection", ok: "Some zoos are better than others, but many are still terrible.", weak: "Zoos are just prisons for animals." },
      ],
    },
  ];

  const [topic] = useState(() => topics[Math.floor(Math.random() * topics.length)]);
  const [phase, setPhase] = useState("sort"); // sort | strength | rebuttals | results
  const [pool, setPool] = useState(() => [...topic.args].sort(() => Math.random() - 0.5));
  const [sortScore, setSortScore] = useState(0);
  const [strengthScore, setStrengthScore] = useState(0);
  const [rebuttalScore, setRebuttalScore] = useState(0);
  const [sortWrong, setSortWrong] = useState(0);
  const [strengthIdx, setStrengthIdx] = useState(0);
  const [strengthAnswered, setStrengthAnswered] = useState(false);
  const [rebuttalIdx, setRebuttalIdx] = useState(0);
  const [rebuttalAnswered, setRebuttalAnswered] = useState(null);
  const [streak, setStreak] = useState(0);

  // Phase 1: Sort arguments
  function place(item, side) {
    if (item.side === side) { setSortScore(s => s + 1); setStreak(s => s + 1); }
    else { setSortWrong(w => w + 1); setStreak(0); }
    setPool(p => p.filter(x => x !== item));
  }

  // Phase 2: Rank strength
  const forArgs = topic.args.filter(a => a.side === "for");
  function answerStrength(s) {
    if (strengthAnswered) return;
    setStrengthAnswered(true);
    if (s === forArgs[strengthIdx].strength) setStrengthScore(sc => sc + 1);
  }
  function nextStrength() {
    if (strengthIdx + 1 >= forArgs.length) { setPhase("rebuttals"); return; }
    setStrengthIdx(i => i + 1);
    setStrengthAnswered(false);
  }

  // Phase 3: Rebuttals
  function answerRebuttal(choice) {
    if (rebuttalAnswered) return;
    setRebuttalAnswered(choice);
    const pts = choice === "best" ? 2 : choice === "ok" ? 1 : 0;
    setRebuttalScore(s => s + pts);
  }
  function nextRebuttal() {
    if (rebuttalIdx + 1 >= topic.rebuttals.length) { setPhase("results"); return; }
    setRebuttalIdx(i => i + 1);
    setRebuttalAnswered(null);
  }

  const totalMax = topic.args.length + forArgs.length + topic.rebuttals.length * 2;
  const totalScore = sortScore + strengthScore + rebuttalScore;
  const pct = Math.round((totalScore / totalMax) * 100);
  const grade = pct >= 90 ? "S" : pct >= 75 ? "A" : pct >= 60 ? "B" : pct >= 40 ? "C" : "D";
  const gradeColors = { S: "#D4A254", A: "#3BAA7E", B: "#3D7DD6", C: "#E5A832", D: "#E05262" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* HUD */}
      <div className="grain" style={{ background: "linear-gradient(135deg, #0F172A, #3D1A1A)", borderRadius: T.r3, padding: "16px 20px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>
            {phase === "sort" ? "Phase 1: Sort" : phase === "strength" ? "Phase 2: Strength" : phase === "rebuttals" ? "Phase 3: Rebuttals" : "Results"}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>"{topic.claim}"</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {streak > 1 && <div className="scale-pop" style={{ background: "rgba(248,181,90,0.2)", borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 800, color: "#D4A254" }}>🔥 {streak}x</div>}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#D4A254", fontFamily: "'JetBrains Mono', monospace" }}>{totalScore}</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>PTS</div>
          </div>
        </div>
      </div>

      {/* Phase indicator */}
      <div style={{ display: "flex", gap: 4, height: 4, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ flex: 1, background: phase === "sort" ? T.accent : T.success, borderRadius: 4, transition: "background 0.3s" }} />
        <div style={{ flex: 1, background: phase === "strength" ? T.accent : (phase === "rebuttals" || phase === "results") ? T.success : T.bgMuted, borderRadius: 4, transition: "background 0.3s" }} />
        <div style={{ flex: 1, background: phase === "rebuttals" ? T.accent : phase === "results" ? T.success : T.bgMuted, borderRadius: 4, transition: "background 0.3s" }} />
      </div>

      {/* ═══ PHASE 1: SORT ═══ */}
      {phase === "sort" && (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.textSec }}>Sort each argument as FOR or AGAINST the claim ({pool.length} remaining)</div>
          {pool.length > 0 ? (
            <div className="card-enter" style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px", border: `1px solid ${T.border}`, boxShadow: T.shadow2 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text, lineHeight: 1.6, marginBottom: 12 }}>{pool[0].text}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => place(pool[0], "for")} style={{ flex: 1, padding: "10px", borderRadius: T.r2, background: "#EAF6F2", border: `2px solid #3BAA7E44`, color: "#3BAA7E", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>✅ FOR</button>
                <button onClick={() => place(pool[0], "against")} style={{ flex: 1, padding: "10px", borderRadius: T.r2, background: "#FDEFF1", border: `2px solid #E0526244`, color: "#E05262", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>❌ AGAINST</button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.success, marginBottom: 8 }}>✓ All arguments sorted! {sortScore}/{topic.args.length} correct</div>
              <button onClick={() => setPhase("strength")} style={{ padding: "10px 24px", borderRadius: T.r5, background: T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>Phase 2: Rank Strength →</button>
            </div>
          )}
        </>
      )}

      {/* ═══ PHASE 2: STRENGTH RANKING ═══ */}
      {phase === "strength" && (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.textSec }}>How strong is this FOR argument? ({strengthIdx + 1}/{forArgs.length})</div>
          <div className="card-enter" style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px", border: `1px solid ${T.border}`, boxShadow: T.shadow2 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text, lineHeight: 1.6, marginBottom: 12 }}>"{forArgs[strengthIdx].text}"</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[{ id: "strong", label: "💪 Strong", color: "#3BAA7E" }, { id: "moderate", label: "➖ Moderate", color: "#E5A832" }, { id: "weak", label: "🤷 Weak", color: "#E05262" }].map(s => {
                const isCorrect = strengthAnswered && s.id === forArgs[strengthIdx].strength;
                const isWrong = strengthAnswered && strengthAnswered !== true && s.id !== forArgs[strengthIdx].strength;
                return (
                  <button key={s.id} onClick={() => answerStrength(s.id)}
                    style={{ flex: 1, padding: "10px 8px", borderRadius: T.r2, border: `2px solid ${isCorrect ? s.color : strengthAnswered ? T.border : s.color + "33"}`, background: isCorrect ? s.color + "15" : T.bgCard, cursor: strengthAnswered ? "default" : "pointer", fontSize: 12, fontWeight: 700, color: isCorrect ? s.color : T.text, opacity: strengthAnswered && !isCorrect ? 0.4 : 1, transition: "all 0.2s" }}>
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
          {strengthAnswered && (
            <>
              <div className="fade-up" style={{ padding: "10px 16px", background: T.bgMuted, borderRadius: T.r2, fontSize: 12, color: T.textSec, lineHeight: 1.6 }}>
                💡 <strong>Exam tip:</strong> {forArgs[strengthIdx].strength === "strong" ? "Strong arguments use specific evidence, measurable impact, or expert consensus." : forArgs[strengthIdx].strength === "moderate" ? "Moderate arguments are valid but lack specificity or could be countered." : "Weak arguments are vague, anecdotal, or easily dismissed."}
              </div>
              <button onClick={nextStrength} style={{ padding: "10px 24px", borderRadius: T.r5, background: T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", alignSelf: "flex-start" }}>
                {strengthIdx + 1 >= forArgs.length ? "Phase 3: Rebuttals →" : "Next Argument →"}
              </button>
            </>
          )}
        </>
      )}

      {/* ═══ PHASE 3: REBUTTALS ═══ */}
      {phase === "rebuttals" && (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.textSec }}>Your opponent argues: (Round {rebuttalIdx + 1}/{topic.rebuttals.length})</div>
          <div style={{ background: "#FEF2F2", borderRadius: T.r2, padding: "14px 18px", border: "1px solid #E0526233" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#E05262", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>⚔️ Counter-Argument</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text, lineHeight: 1.6 }}>{topic.rebuttals[rebuttalIdx].attack}</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec }}>Choose the best rebuttal:</div>
          {[
            { key: "best", text: topic.rebuttals[rebuttalIdx].best, pts: 2 },
            { key: "ok", text: topic.rebuttals[rebuttalIdx].ok, pts: 1 },
            { key: "weak", text: topic.rebuttals[rebuttalIdx].weak, pts: 0 },
          ].sort(() => Math.random() - 0.5).map(opt => {
            const isSelected = rebuttalAnswered === opt.key;
            const showQuality = rebuttalAnswered !== null;
            const qualityColor = opt.key === "best" ? "#3BAA7E" : opt.key === "ok" ? "#E5A832" : "#E05262";
            return (
              <button key={opt.key} onClick={() => answerRebuttal(opt.key)}
                style={{ padding: "12px 16px", borderRadius: T.r2, border: `2px solid ${isSelected ? qualityColor : showQuality && opt.key === "best" ? "#3BAA7E55" : T.border}`, background: isSelected ? qualityColor + "12" : T.bgCard, cursor: rebuttalAnswered ? "default" : "pointer", textAlign: "left", fontSize: 13, lineHeight: 1.6, color: T.text, opacity: showQuality && !isSelected && opt.key !== "best" ? 0.5 : 1, transition: "all 0.2s" }}>
                {showQuality && <div style={{ fontSize: 10, fontWeight: 800, color: qualityColor, textTransform: "uppercase", marginBottom: 4 }}>
                  {opt.key === "best" ? `✓ Best rebuttal (+2) — ${topic.rebuttals[rebuttalIdx].bestLabel}` : opt.key === "ok" ? "~ Acceptable (+1)" : "✗ Weak rebuttal (0)"}
                </div>}
                {opt.text}
              </button>
            );
          })}
          {rebuttalAnswered && <button onClick={nextRebuttal} style={{ padding: "10px 24px", borderRadius: T.r5, background: T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", alignSelf: "flex-start" }}>{rebuttalIdx + 1 >= topic.rebuttals.length ? "See Results →" : "Next Round →"}</button>}
        </>
      )}

      {/* ═══ RESULTS ═══ */}
      {phase === "results" && (
        <div className="scale-pop" style={{ background: T.bgCard, borderRadius: T.r3, padding: "36px 28px", textAlign: "center", border: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 30%, ${gradeColors[grade]}15, transparent 60%)` }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>⚔️</div>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: gradeColors[grade] + "22", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: `3px solid ${gradeColors[grade]}44` }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: gradeColors[grade], fontFamily: "'Bricolage Grotesque', sans-serif" }}>{grade}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: T.text }}>{totalScore} / {totalMax}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 12, fontSize: 12 }}>
              <span style={{ color: T.textSec }}>Sort: <strong>{sortScore}/{topic.args.length}</strong></span>
              <span style={{ color: T.textSec }}>Strength: <strong>{strengthScore}/{forArgs.length}</strong></span>
              <span style={{ color: T.textSec }}>Rebuttals: <strong>{rebuttalScore}/{topic.rebuttals.length * 2}</strong></span>
            </div>
            <div style={{ marginTop: 12, padding: "10px 14px", background: T.accentLight, borderRadius: T.r2, fontSize: 11, color: T.accentText, textAlign: "left", lineHeight: 1.6 }}>
              📝 <strong>O-Level Tip:</strong> In argumentative essays, the best rebuttals acknowledge the counter-argument before refuting it: "While it is true that [counter]... however, [your rebuttal with evidence]." This shows maturity and earns higher marks.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DebateArenaGame;
