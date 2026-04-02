import React, { useState } from 'react';
import { T } from '../../theme/theme.js';
import { ALL_SUBJECT_DRILLS } from '../../data/practiceQuestions.js';
import PracticeQuestions from './PracticeQuestions.jsx';

function SubjectDrills({ subject }) {
  const drill = ALL_SUBJECT_DRILLS[subject];
  if (!drill || drill.mode === "gp") return <PracticeQuestions />;

  const [mode, setMode] = useState("menu");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplain, setShowExplain] = useState(false);

  function startDrill(count) {
    const shuffled = [...drill.questions].sort(() => Math.random() - 0.5).slice(0, count);
    setQuestions(shuffled);
    setCurrent(0);
    setAnswered(null);
    setScore(0);
    setShowExplain(false);
    setMode("drill");
  }

  function answer(idx) {
    if (answered !== null) return;
    setAnswered(idx);
    if (idx === questions[current].correct) setScore(s => s + 1);
    setShowExplain(true);
  }

  function next() {
    if (current + 1 >= questions.length) { setMode("results"); return; }
    setCurrent(c => c + 1);
    setAnswered(null);
    setShowExplain(false);
  }

  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 96px)", gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #1A1816, #3D3832)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{drill.title}</h1>
        <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0", fontWeight: 400 }}>{drill.desc}</p>
      </div>

      {mode === "menu" && (
        <div style={{ maxWidth: 520 }}>
          <div className="grain" style={{ background: T.bgMuted, borderRadius: T.r3, padding: "24px 28px", color: T.text, border: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 8 }}>Quick-Fire MCQ Drill</div>
            <div style={{ fontSize: 13, color: T.textSec, lineHeight: 1.6, marginBottom: 16 }}>Test your knowledge with multiple-choice questions. Each question has an explanation after you answer.</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[5, 8, 10].map(n => (
                <button key={n} onClick={() => startDrill(Math.min(n, drill.questions.length))}
                  style={{ padding: "10px 22px", borderRadius: T.r5, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  {Math.min(n, drill.questions.length)} Questions
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {mode === "drill" && questions[current] && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 600 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.textSec }}>
            <span>Question {current + 1} / {questions.length}</span>
            <span style={{ fontWeight: 700, color: T.success }}>{score} correct</span>
          </div>
          <div style={{ height: 4, background: T.bgMuted, borderRadius: 8 }}>
            <div className="bar-grow" style={{ height: "100%", background: T.accent, borderRadius: 8, width: `${((current + 1) / questions.length) * 100}%` }} />
          </div>

          {questions[current].topic && (
            <span style={{ fontSize: 10, fontWeight: 700, color: T.accent, background: T.accentLight, padding: "3px 10px", borderRadius: 20, alignSelf: "flex-start" }}>{questions[current].topic}</span>
          )}

          <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "22px 24px", border: `1px solid ${T.border}`, boxShadow: T.shadow2 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: T.text, lineHeight: 1.6 }}>{questions[current].q}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {questions[current].options.map((opt, i) => {
              const isCorrect = i === questions[current].correct;
              const isChosen = answered === i;
              let bg = T.bgCard, border = T.border, color = T.text;
              if (answered !== null) {
                if (isCorrect) { bg = T.successBg; border = T.success; color = T.success; }
                else if (isChosen) { bg = T.dangerBg; border = T.danger; color = T.danger; }
              }
              return (
                <button key={i} onClick={() => answer(i)}
                  style={{ padding: "12px 16px", borderRadius: T.r2, border: `2px solid ${border}`, background: bg, color, fontWeight: 600, fontSize: 13, cursor: answered !== null ? "default" : "pointer", textAlign: "left", transition: "all 0.15s" }}>
                  <span style={{ fontWeight: 700, marginRight: 8, opacity: 0.5 }}>{String.fromCharCode(65 + i)}.</span> {opt}
                  {answered !== null && isCorrect && " ✓"}
                </button>
              );
            })}
          </div>

          {showExplain && (
            <div className="fade-up" style={{ background: T.accentLight, borderRadius: T.r2, padding: "12px 16px", border: `1px solid ${T.accent}33` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.accent, marginBottom: 4 }}>Explanation</div>
              <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6 }}>{questions[current].explain}</div>
            </div>
          )}

          {answered !== null && (
            <button onClick={next} style={{ padding: "10px 24px", borderRadius: T.r5, background: T.accent, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", alignSelf: "flex-start" }}>
              {current + 1 >= questions.length ? "View Results" : "Next Question"}
            </button>
          )}
        </div>
      )}

      {mode === "results" && (
        <div style={{ maxWidth: 520 }}>
          <div className="scale-pop" style={{ background: T.bgMuted, borderRadius: T.r3, padding: "28px", color: T.text, border: `1px solid ${T.border}`, textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 44, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{pct}%</div>
            <div style={{ fontSize: 14, color: T.textSec }}>{score} / {questions.length} correct</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>{pct >= 80 ? "Excellent work!" : pct >= 50 ? "Good effort — review the explanations!" : "Keep practising — you'll improve!"}</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => startDrill(questions.length)} style={{ padding: "10px 20px", borderRadius: T.r5, background: T.accent, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>Try Again</button>
            <button onClick={() => setMode("menu")} style={{ padding: "10px 20px", borderRadius: T.r5, background: T.bgMuted, color: T.textSec, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>Back</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectDrills;
