import React, { useState, useEffect, useRef } from 'react';
import { T } from '../../theme/theme.js';
import { Play, Timer, CheckCircle, XCircle, Trophy, SkipForward } from '../../icons/icons.jsx';
import { GP1_QTYPES } from '../../data/gpQuestionTypes.js';
import { PRACTICE_QUESTIONS } from '../../data/practiceQuestions.js';

function PracticeQuestions() {
  const [mode, setMode] = useState("menu"); // menu | drill | feedback | results
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [picked, setPicked] = useState({ type: null, structure: null, framework: null });
  const [timeLeft, setTimeLeft] = useState(0);
  const [drillSize, setDrillSize] = useState(10);
  const timerRef = useRef(null);

  function startDrill() {
    const shuffled = [...PRACTICE_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, drillSize);
    setQuestions(shuffled);
    setCurrent(0);
    setAnswers([]);
    setPicked({ type: null, structure: null, framework: null });
    setTimeLeft(drillSize * 40); // ~40s per question
    setMode("drill");
  }

  useEffect(() => {
    if (mode === "drill" && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timerRef.current);
    }
    if (mode === "drill" && timeLeft === 0 && questions.length > 0) setMode("results");
  }, [mode, timeLeft, questions.length]);

  function submitAnswer() {
    const q = questions[current];
    const correctType = picked.type === q.type;
    const correctStructure = picked.structure === q.structure;
    const correctFramework = picked.framework === q.framework;
    const score = (correctType ? 1 : 0) + (correctStructure ? 1 : 0) + (correctFramework ? 1 : 0);
    setAnswers(a => [...a, { qId: q.id, picked: { ...picked }, correct: { type: q.type, structure: q.structure, framework: q.framework }, score, total: 3 }]);
    setMode("feedback");
  }

  function nextQuestion() {
    if (current + 1 >= questions.length) { setMode("results"); return; }
    setCurrent(c => c + 1);
    setPicked({ type: null, structure: null, framework: null });
    setMode("drill");
  }

  const totalScore = answers.reduce((s, a) => s + a.score, 0);
  const totalPossible = answers.length * 3;
  const pct = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
  const fmtTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const typeOptions = GP1_QTYPES.map(qt => ({ value: qt.id, label: `${qt.code} ${qt.title}`, color: qt.color }));
  const structureOptions = [...new Set(GP1_QTYPES.map(qt => qt.structure))].map(s => ({ value: s, label: s }));
  const frameworkOptions = GP1_QTYPES.map(qt => ({ value: qt.framework, label: `${qt.framework} — ${qt.frameworkFull}` }));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 96px)", gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #1A1816, #3D3832)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Practice Drills</h1>
        <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0", fontWeight: 400 }}>Identify question types, structures & frameworks under timed conditions</p>
      </div>

      {mode === "menu" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 520 }}>
          <div style={{ background: "linear-gradient(120deg, #0F1B3D, #216ef4)", borderRadius: T.r3, padding: "22px 26px", color: "#fff" }}>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 8 }}>Question Analysis Drill</div>
            <div style={{ fontSize: 13, color: "#C8D8F5", lineHeight: 1.6, marginBottom: 16 }}>You'll see real GP essay questions. For each, identify the question type, master structure, and recommended framework. Timed to simulate the 5–7 minute selection phase.</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: "#8BAEED", fontWeight: 600 }}>Questions:</span>
              {[5, 10, 15, 25].map(n => (
                <button key={n} onClick={() => setDrillSize(n)}
                  style={{ padding: "5px 14px", borderRadius: 20, border: `2px solid ${drillSize === n ? "#fff" : "rgba(255,255,255,0.3)"}`, background: drillSize === n ? "rgba(255,255,255,0.2)" : "transparent", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{n}</button>
              ))}
            </div>
            <button onClick={startDrill} style={{ padding: "10px 28px", borderRadius: T.r5, background: "#fff", color: T.accent, fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <Play size={16} weight="fill" /> Start Drill
            </button>
          </div>
          <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px", border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 8 }}>How It Works</div>
            {[
              "Read the essay question carefully and identify trigger words.",
              "Select the question type (01–06), master structure, and framework.",
              "Get instant feedback with the correct answer and explanation.",
              "Review your results and identify which question types need more practice."
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: T.accent, color: "#fff", fontWeight: 800, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <span style={{ fontSize: 12, color: T.textSec, lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === "drill" && questions[current] && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 640 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.textSec }}>Question {current + 1} of {questions.length}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: timeLeft < 30 ? T.danger : T.textSec }}>
              <Timer size={14} /> <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{fmtTime(timeLeft)}</span>
            </div>
          </div>
          <div style={{ height: 4, background: T.bgMuted, borderRadius: 8 }}>
            <div style={{ height: "100%", background: T.accent, borderRadius: 8, width: `${((current + 1) / questions.length) * 100}%`, transition: "width 0.3s" }} />
          </div>

          <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "20px 22px", border: `2px solid ${T.accent}33`, boxShadow: T.shadow2 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Identify this question</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: T.text, lineHeight: 1.6, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{questions[current].q}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, marginBottom: 6 }}>Question Type</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {typeOptions.map(opt => (
                  <button key={opt.value} onClick={() => setPicked(p => ({ ...p, type: opt.value }))}
                    style={{ padding: "6px 12px", borderRadius: 20, border: `2px solid ${picked.type === opt.value ? opt.color : T.border}`, background: picked.type === opt.value ? opt.color + "15" : T.bgCard, color: picked.type === opt.value ? opt.color : T.textSec, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>{opt.label}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, marginBottom: 6 }}>Master Structure</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {structureOptions.map(opt => (
                  <button key={opt.value} onClick={() => setPicked(p => ({ ...p, structure: opt.value }))}
                    style={{ padding: "6px 12px", borderRadius: 20, border: `2px solid ${picked.structure === opt.value ? T.accent : T.border}`, background: picked.structure === opt.value ? T.accentLight : T.bgCard, color: picked.structure === opt.value ? T.accent : T.textSec, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>{opt.label}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, marginBottom: 6 }}>Framework</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {frameworkOptions.map(opt => (
                  <button key={opt.value} onClick={() => setPicked(p => ({ ...p, framework: opt.value }))}
                    style={{ padding: "6px 12px", borderRadius: 20, border: `2px solid ${picked.framework === opt.value ? "#6660B9" : T.border}`, background: picked.framework === opt.value ? "#EEEAFF" : T.bgCard, color: picked.framework === opt.value ? "#6660B9" : T.textSec, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>{opt.label}</button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={submitAnswer} disabled={!picked.type || !picked.structure || !picked.framework}
            style={{ padding: "10px 24px", borderRadius: T.r5, background: picked.type && picked.structure && picked.framework ? T.accent : T.bgMuted, color: picked.type && picked.structure && picked.framework ? "#fff" : T.textTer, fontWeight: 700, fontSize: 13, border: "none", cursor: picked.type && picked.structure && picked.framework ? "pointer" : "not-allowed", alignSelf: "flex-start" }}>
            Submit Answer
          </button>
        </div>
      )}

      {mode === "feedback" && answers.length > 0 && (() => {
        const ans = answers[answers.length - 1];
        const qt = GP1_QTYPES.find(q => q.id === ans.correct.type);
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 640 }}>
            <div style={{ background: ans.score === 3 ? T.successBg : ans.score >= 1 ? T.warningBg : T.dangerBg, borderRadius: T.r2, padding: "16px 20px", border: `1px solid ${ans.score === 3 ? T.success : ans.score >= 1 ? T.warning : T.danger}33` }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: ans.score === 3 ? T.success : ans.score >= 1 ? T.warning : T.danger, marginBottom: 4 }}>
                {ans.score === 3 ? "Perfect!" : ans.score >= 1 ? `${ans.score}/3 Correct` : "All Incorrect"}
              </div>
              <div style={{ fontSize: 13, color: T.text, fontWeight: 700, fontStyle: "italic", marginBottom: 10 }}>{questions[current].q}</div>
              {[
                { label: "Question Type", yours: GP1_QTYPES.find(q => q.id === ans.picked.type)?.title || "—", correct: qt?.title, ok: ans.picked.type === ans.correct.type },
                { label: "Structure", yours: ans.picked.structure, correct: ans.correct.structure, ok: ans.picked.structure === ans.correct.structure },
                { label: "Framework", yours: ans.picked.framework, correct: ans.correct.framework, ok: ans.picked.framework === ans.correct.framework },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  {row.ok ? <CheckCircle size={14} color={T.success} weight="fill" /> : <XCircle size={14} color={T.danger} weight="fill" />}
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.textSec, minWidth: 90 }}>{row.label}:</span>
                  {!row.ok && <span style={{ fontSize: 12, color: T.danger, textDecoration: "line-through" }}>{row.yours}</span>}
                  <span style={{ fontSize: 12, fontWeight: 700, color: row.ok ? T.success : T.accent }}>{row.correct}</span>
                </div>
              ))}
            </div>
            {qt && (
              <div style={{ background: T.bgCard, borderRadius: T.r1, padding: "12px 14px", border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: qt.color, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>Why {qt.title}?</div>
                <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6 }}>{qt.what}</div>
              </div>
            )}
            <button onClick={nextQuestion} style={{ padding: "10px 24px", borderRadius: T.r5, background: T.accent, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6 }}>
              {current + 1 >= questions.length ? <><Trophy size={14} /> View Results</> : <><SkipForward size={14} /> Next Question</>}
            </button>
          </div>
        );
      })()}

      {mode === "results" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 640 }}>
          <div style={{ background: "linear-gradient(120deg, #0F1B3D, #216ef4)", borderRadius: T.r3, padding: "22px 26px", color: "#fff", textAlign: "center" }}>
            <div style={{ fontSize: 40, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{pct}%</div>
            <div style={{ fontSize: 14, color: "#C8D8F5" }}>{totalScore} / {totalPossible} fields correct across {answers.length} questions</div>
            <div style={{ fontSize: 12, color: "#8BAEED", marginTop: 8 }}>{pct >= 80 ? "Excellent — you know your question types well!" : pct >= 50 ? "Good effort — review the types you missed below." : "Keep practising — revisit the Paper 1 Essay Guide."}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {answers.map((ans, i) => {
              const qt = GP1_QTYPES.find(q => q.id === ans.correct.type);
              return (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", background: T.bgCard, borderRadius: T.r1, padding: "8px 12px", border: `1px solid ${T.border}` }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: ans.score === 3 ? T.success : ans.score >= 1 ? T.warning : T.danger, color: "#fff", fontWeight: 800, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{ans.score}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Q{i + 1}: {questions[i]?.q}</div>
                    <div style={{ fontSize: 10, color: qt?.color, fontWeight: 600 }}>{qt?.code} {qt?.title} · {ans.correct.framework}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={startDrill} style={{ padding: "10px 20px", borderRadius: T.r5, background: T.accent, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>Try Again</button>
            <button onClick={() => setMode("menu")} style={{ padding: "10px 20px", borderRadius: T.r5, background: T.bgMuted, color: T.textSec, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>Back to Menu</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PracticeQuestions;
