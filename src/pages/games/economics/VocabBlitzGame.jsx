import React, { useState, useEffect, useRef } from 'react';
import { T } from '../../../theme/theme.js';

function VocabBlitzGame() {
  const allWords = [
    { word: "Ubiquitous", def: "Found everywhere; omnipresent", decoys: ["Extremely rare or scarce", "Moving very quickly", "Relating to urban areas"] },
    { word: "Pragmatic", def: "Dealing with things in a practical way", decoys: ["Overly idealistic or dreamy", "Relating to language rules", "Full of dramatic emotion"] },
    { word: "Exacerbate", def: "Make a problem or situation worse", decoys: ["Improve or enhance greatly", "Examine in careful detail", "Remove completely"] },
    { word: "Juxtapose", def: "Place side by side for comparison", decoys: ["Oppose strongly or resist", "Arrange in chronological order", "Hide or conceal from view"] },
    { word: "Paradox", def: "A seemingly contradictory statement that may be true", decoys: ["A perfect example of something", "An imaginary ideal society", "A pair of identical things"] },
    { word: "Rhetoric", def: "The art of persuasive speaking or writing", decoys: ["The study of ancient history", "A harsh criticism of someone", "A mathematical theorem"] },
    { word: "Nuanced", def: "Characterised by subtle shades of meaning", decoys: ["Completely black and white", "Brand new and innovative", "Annoying and bothersome"] },
    { word: "Unprecedented", def: "Never done or known before", decoys: ["Expected and predictable", "Not worthy of attention", "Lacking proper leadership"] },
    { word: "Catalyst", def: "Something that triggers or accelerates change", decoys: ["A list of items in order", "A catastrophic disaster", "A type of chemical bond"] },
    { word: "Efficacy", def: "The ability to produce the desired result", decoys: ["The state of being efficient", "A government department", "A type of logical fallacy"] },
    { word: "Mitigate", def: "Make less severe or serious", decoys: ["Completely eliminate a problem", "Imitate or copy closely", "Investigate a crime scene"] },
    { word: "Substantiate", def: "Provide evidence to support a claim", decoys: ["Replace one thing with another", "Reduce in quantity or value", "Create something from nothing"] },
    { word: "Complacent", def: "Smugly satisfied; unaware of potential danger", decoys: ["Extremely worried and anxious", "Kind and willing to please", "Fully aware and vigilant"] },
    { word: "Entrenched", def: "Firmly established and difficult to change", decoys: ["Newly introduced or recent", "Dug into the ground", "Extremely wet or soaked"] },
    { word: "Pervasive", def: "Spreading widely throughout an area or group", decoys: ["Extremely convincing or persuasive", "Limited to a small region", "Relating to personal beliefs"] },
  ];
  const [words] = useState(() => [...allWords].sort(() => Math.random() - 0.5).slice(0, 12));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(8);
  const [answered, setAnswered] = useState(null);
  const [options, setOptions] = useState([]);
  const [speedBonus, setSpeedBonus] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  const done = current >= words.length || lives <= 0;
  const total = words.length;

  useEffect(() => {
    if (done) return;
    const w = words[current];
    const opts = [w.def, ...w.decoys].sort(() => Math.random() - 0.5);
    setOptions(opts);
    setAnswered(null);
    setTimeLeft(8);
    setSpeedBonus(false);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setAnswered("timeout");
          setCombo(0);
          setLives(l => l - 1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [current, done]);

  function answer(opt) {
    if (answered || done) return;
    clearInterval(timerRef.current);
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const isCorrect = opt === words[current].def;
    const fast = elapsed < 3;
    setAnswered(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      const comboMult = Math.min(combo + 1, 5);
      const points = (fast ? 2 : 1) * comboMult;
      setScore(s => s + points);
      setCombo(c => { const nc = c + 1; if (nc > bestCombo) setBestCombo(nc); return nc; });
      if (fast) setSpeedBonus(true);
    } else {
      setCombo(0);
      setLives(l => l - 1);
    }
  }

  function next() { setCurrent(c => c + 1); }

  const pct = total > 0 ? Math.round((score / (total * 5)) * 100) : 0;
  const grade = pct >= 90 ? "S" : pct >= 75 ? "A" : pct >= 60 ? "B" : pct >= 40 ? "C" : "D";
  const gradeColors = { S: "#D4A254", A: "#3BAA7E", B: "#3D7DD6", C: "#E5A832", D: "#E05262" };

  if (done) {
    return (
      <div className="scale-pop" style={{ background: T.bgCard, borderRadius: T.r3, padding: "36px 28px", textAlign: "center", border: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 30%, ${gradeColors[grade]}15, transparent 60%)` }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{lives > 0 ? "⚡" : "💔"}</div>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: gradeColors[grade] + "22", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: `3px solid ${gradeColors[grade]}44` }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: gradeColors[grade], fontFamily: "'Bricolage Grotesque', sans-serif" }}>{grade}</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: T.text }}>{score} pts</div>
          <div style={{ fontSize: 14, color: T.textSec, marginTop: 4 }}>{current} words · Best combo: 🔥{bestCombo}x</div>
          <div style={{ fontSize: 12, color: T.textTer, marginTop: 12 }}>
            {grade === "S" ? "Vocabulary master! Band 5 material." : grade === "A" ? "Excellent range — keep building!" : "Practice makes perfect — try again to improve."}
          </div>
        </div>
      </div>
    );
  }

  const w = words[current];
  const timerColor = timeLeft <= 3 ? "#E05262" : timeLeft <= 5 ? "#E5A832" : "#3BAA7E";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* HUD */}
      <div className="grain" style={{ background: "linear-gradient(135deg, #2D1B3D, #4A2060)", borderRadius: T.r3, padding: "16px 20px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>Vocab Blitz</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{current + 1} / {total}</div>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {combo > 1 && <div className="scale-pop" style={{ background: "rgba(248,181,90,0.2)", borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 800, color: "#D4A254" }}>🔥 {combo}x</div>}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#D4A254", fontFamily: "'JetBrains Mono', monospace" }}>{score}</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>SCORE</div>
          </div>
          <div style={{ display: "flex", gap: 3 }}>
            {Array.from({ length: 3 }, (_, i) => <span key={i} style={{ fontSize: 16, opacity: i < lives ? 1 : 0.2, transition: "opacity 0.3s" }}>{i < lives ? "❤️" : "🖤"}</span>)}
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div style={{ height: 6, background: T.bgMuted, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 10, background: timerColor, width: `${(timeLeft / 8) * 100}%`, transition: "width 1s linear, background 0.3s" }} />
      </div>

      {/* Word card */}
      <div className="card-enter" style={{ background: T.bgCard, borderRadius: T.r3, padding: "32px 28px", border: `1px solid ${T.border}`, textAlign: "center", boxShadow: T.shadow2, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 12, right: 16, fontSize: 24, fontWeight: 800, color: timerColor, fontFamily: "'JetBrains Mono', monospace" }}>{timeLeft}s</div>
        {speedBonus && <div className="scale-pop" style={{ position: "absolute", top: 12, left: 16, fontSize: 11, fontWeight: 800, color: "#D4A254", background: "rgba(248,181,90,0.15)", padding: "2px 10px", borderRadius: 20 }}>⚡ SPEED BONUS x2</div>}
        <div style={{ fontSize: 36, fontWeight: 800, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: "-0.03em" }}>{w.word}</div>
        <div style={{ fontSize: 12, color: T.textTer, marginTop: 8 }}>Select the correct definition</div>
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {options.map((opt, i) => {
          const isCorrect = answered && opt === w.def;
          const isWrong = answered === "wrong" && opt !== w.def && options.indexOf(opt) === options.indexOf(opt);
          const isSelected = answered === "wrong" && opt !== w.def;
          return (
            <button key={i} onClick={() => answer(opt)}
              className={!answered ? "card-hover" : ""}
              style={{
                padding: "14px 18px", borderRadius: T.r2, border: `2px solid ${isCorrect ? "#3BAA7E" : answered && opt !== w.def ? T.border : T.border}`,
                background: isCorrect ? "#EAF6F2" : T.bgCard, cursor: answered ? "default" : "pointer",
                textAlign: "left", fontSize: 13, fontWeight: 500, color: isCorrect ? "#3BAA7E" : T.text,
                opacity: answered && !isCorrect ? 0.5 : 1, transition: "all 0.2s",
                transform: isCorrect ? "scale(1.02)" : "scale(1)",
              }}>
              {isCorrect && "✅ "}{opt}
            </button>
          );
        })}
      </div>

      {/* Timeout message */}
      {answered === "timeout" && (
        <div className="fade-up" style={{ background: T.dangerBg, borderRadius: T.r2, padding: "12px 16px", textAlign: "center", borderLeft: `4px solid ${T.danger}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.danger }}>⏰ Time's up!</div>
          <div style={{ fontSize: 12, color: T.text, marginTop: 4 }}>The answer was: <strong>{w.def}</strong></div>
        </div>
      )}

      {answered && <button onClick={next} style={{ padding: "10px 24px", borderRadius: T.r5, background: T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", alignSelf: "flex-start" }}>{current + 1 >= total ? "See Results" : "Next Word →"}</button>}
    </div>
  );
}

export default VocabBlitzGame;
