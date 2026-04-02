import React, { useState, useEffect, useRef } from 'react';
import { T } from '../../theme/theme.js';
import { Timer, CaretRight, DownloadSimple, CheckSquare } from '../../icons/icons.jsx';
import { GP1_QTYPES } from '../../data/gpQuestionTypes.js';
import { PRACTICE_QUESTIONS } from '../../data/practiceQuestions.js';

function TimedEssayWriter() {
  const [mode, setMode] = useState("menu"); // menu | select | write | done
  const [questions, setQuestions] = useState([]);
  const [chosenQ, setChosenQ] = useState(null);
  const [essay, setEssay] = useState("");
  const [timeLeft, setTimeLeft] = useState(5400); // 90 min
  const [phase, setPhase] = useState("select"); // select | plan | write | proofread
  const [planNotes, setPlanNotes] = useState("");
  const [started, setStarted] = useState(false);
  const timerRef = useRef(null);
  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;

  function startExam() {
    const shuffled = [...PRACTICE_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 8);
    setQuestions(shuffled);
    setChosenQ(null);
    setEssay("");
    setPlanNotes("");
    setTimeLeft(5400);
    setPhase("select");
    setStarted(false);
    setMode("select");
  }

  function selectQuestion(q) {
    setChosenQ(q);
    setPhase("plan");
    setStarted(true);
  }

  useEffect(() => {
    if (started && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timerRef.current);
    }
    if (started && timeLeft <= 0) setMode("done");
  }, [started, timeLeft]);

  // Auto-detect phase based on time elapsed
  const elapsed = 5400 - timeLeft;
  const suggestedPhase = elapsed < 420 ? "select" : elapsed < 1320 ? "plan" : elapsed < 5100 ? "write" : "proofread";
  const phaseColors = { select: "#FB424E", plan: "#E07800", write: "#216ef4", proofread: "#17a2b8" };
  const phaseLabels = { select: "Select (5-7 min)", plan: "Plan (10-15 min)", write: "Write (55-65 min)", proofread: "Proofread (5-10 min)" };
  const fmtTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const qt = chosenQ ? GP1_QTYPES.find(q => q.id === chosenQ.type) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 96px)", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #1A1816, #3D3832)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Timed Essay Writer</h1>
          <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0", fontWeight: 400 }}>90-minute simulated exam — pick 1 of 8, plan, write, proofread</p>
        </div>
        {started && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: timeLeft < 300 ? T.danger : T.text, fontFamily: "'JetBrains Mono', monospace" }}>{fmtTime(timeLeft)}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: phaseColors[suggestedPhase] }}>{phaseLabels[suggestedPhase]}</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: wordCount >= 600 ? T.success : wordCount >= 400 ? T.warning : T.textTer }}>{wordCount} words</div>
          </div>
        )}
      </div>

      {/* Time management bar */}
      {started && (
        <div style={{ display: "flex", gap: 2, height: 6, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
          {[
            { key: "select", pct: 8, color: "#FB424E" },
            { key: "plan", pct: 15, color: "#E07800" },
            { key: "write", pct: 65, color: "#216ef4" },
            { key: "proofread", pct: 12, color: "#17a2b8" },
          ].map(p => (
            <div key={p.key} style={{ flex: p.pct, background: p.color, opacity: suggestedPhase === p.key ? 1 : 0.25, transition: "opacity 0.3s" }} />
          ))}
        </div>
      )}

      {mode === "menu" && (
        <div style={{ maxWidth: 520 }}>
          <div style={{ background: "linear-gradient(120deg, #0F1B3D, #1A2A5E 60%, #FB424E)", borderRadius: T.r3, padding: "22px 26px", color: "#fff" }}>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 8 }}>Simulated GP Paper 1</div>
            <div style={{ fontSize: 13, color: "#E8C8C8", lineHeight: 1.6, marginBottom: 16 }}>90 minutes. 8 questions. Choose 1. Plan your outline, write your essay, and proofread — all under timed conditions. Aim for 600–800 words.</div>
            <button onClick={startExam} style={{ padding: "10px 28px", borderRadius: T.r5, background: "#fff", color: "#FB424E", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <Timer size={16} weight="fill" /> Begin Exam
            </button>
          </div>
        </div>
      )}

      {mode === "select" && !chosenQ && (
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 10 }}>Select 1 of 8 questions — read carefully and run the ATQ test</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 640 }}>
            {questions.map((q, i) => {
              const qtype = GP1_QTYPES.find(t => t.id === q.type);
              return (
                <button key={q.id} onClick={() => selectQuestion(q)}
                  style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 16px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgCard, cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = qtype?.color || T.accent; e.currentTarget.style.boxShadow = T.shadow2; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: T.bgMuted, color: T.textSec, fontWeight: 800, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text, lineHeight: 1.5 }}>{q.q}</div>
                  </div>
                  <CaretRight size={14} color={T.textTer} style={{ flexShrink: 0, marginTop: 4 }} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {mode === "select" && chosenQ && (
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Question header */}
          <div style={{ background: qt?.bg || T.accentLight, borderRadius: T.r2, padding: "12px 16px", border: `1px solid ${qt?.color || T.accent}33`, flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: qt?.color, textTransform: "uppercase", letterSpacing: 0.6 }}>{qt?.code} {qt?.title} · {qt?.framework} · {qt?.structure}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginTop: 4, lineHeight: 1.5 }}>{chosenQ.q}</div>
          </div>

          {/* Planning area */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, marginBottom: 4 }}>Planning Notes (thesis, topic sentences, examples)</div>
            <textarea value={planNotes} onChange={e => setPlanNotes(e.target.value)}
              placeholder="Outline: thesis → topic sentences (Topic + Cause + Effect) → assigned examples. Identify your stand and counter-approach."
              rows={4} style={{ width: "100%", padding: "10px 12px", borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 12, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box" }} />
          </div>

          {/* Essay writing area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.text }}>Your Essay</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: wordCount >= 600 && wordCount <= 800 ? T.success : wordCount > 800 ? T.warning : T.textTer }}>{wordCount} / 600–800 words</span>
            </div>
            <textarea value={essay} onChange={e => setEssay(e.target.value)}
              placeholder="Begin writing your essay here…"
              style={{ flex: 1, width: "100%", padding: "14px 16px", borderRadius: T.r2, border: `1px solid ${T.border}`, fontSize: 14, fontFamily: "'Georgia', serif", lineHeight: 1.8, resize: "none", boxSizing: "border-box", color: T.text }} />
          </div>

          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            <button onClick={() => setMode("done")} style={{ padding: "8px 20px", borderRadius: T.r5, background: T.accent, color: "#fff", fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer" }}>Submit Essay</button>
          </div>
        </div>
      )}

      {mode === "done" && (
        <div style={{ maxWidth: 560 }}>
          <div style={{ background: "linear-gradient(120deg, #0F1B3D, #216ef4)", borderRadius: T.r3, padding: "22px 26px", color: "#fff", textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 4 }}>Essay Complete</div>
            <div style={{ fontSize: 14, color: "#C8D8F5" }}>{wordCount} words · {fmtTime(5400 - timeLeft)} elapsed</div>
            <div style={{ fontSize: 12, color: "#8BAEED", marginTop: 6 }}>{wordCount >= 600 ? "Good length!" : "A bit short — aim for 600+ words next time."} {timeLeft > 0 ? `You had ${fmtTime(timeLeft)} remaining.` : "Time ran out."}</div>
          </div>
          {/* Self-assessment checklist */}
          <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px", border: `1px solid ${T.border}`, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 10 }}>Self-Assessment — Band Descriptor Checklist</div>
            {[
              { label: "Clear thesis stated in introduction", band: "Band 3+" },
              { label: "Examples are specific, named, and evaluated (not just cited)", band: "Band 4+" },
              { label: "Concession/rebuttal matches your stand type", band: "Band 4+" },
              { label: "Topic sentences are reason-driven (Topic + Cause + Effect)", band: "Band 4+" },
              { label: "Conclusion synthesises — not summarises", band: "Band 5" },
              { label: "Arguments show nuance and qualification throughout", band: "Band 5" },
              { label: "Examples from multiple levels (local, regional, global)", band: "Band 5" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <CheckSquare size={14} color={T.textTer} />
                <span style={{ fontSize: 12, color: T.text, flex: 1 }}>{item.label}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: T.accent, background: T.accentLight, padding: "1px 6px", borderRadius: 10 }}>{item.band}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => { navigator.clipboard.writeText(`Question: ${chosenQ?.q}\n\n${essay}`); }} style={{ padding: "8px 16px", borderRadius: T.r5, background: T.bgMuted, color: T.textSec, fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><DownloadSimple size={14} /> Copy Essay</button>
            <button onClick={startExam} style={{ padding: "8px 16px", borderRadius: T.r5, background: T.accent, color: "#fff", fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer" }}>New Exam</button>
            <button onClick={() => setMode("menu")} style={{ padding: "8px 16px", borderRadius: T.r5, background: T.bgMuted, color: T.textSec, fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer" }}>Back</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimedEssayWriter;
