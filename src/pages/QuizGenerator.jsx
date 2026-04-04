import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { T } from '../theme/theme.js';
import { Lightning, Plus, X, CheckCircle, XCircle, Clock, Trophy, Star, ArrowRight, ArrowLeft, Trash, Timer, Warning, Exam } from '../icons/icons.jsx';
import { Card, Btn, Badge, SubjectBadge, Progress, PageHeader, Input, Select, Textarea, BackBtn } from '../components/ui';
import { ConfettiEffect, triggerCelebration } from '../components/gamification';
import { SUBJECTS, TOPICS } from '../data/subjects.js';
import useTimer from '../hooks/useTimer.js';

function QuizGenerator({ state, dispatch }) {
  const [view, setView] = useState("list");
  const [selQuiz, setSelQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [nT, snT] = useState(""); const [nS, snS] = useState(""); const [nTo, snTo] = useState(""); const [nTL, snTL] = useState(15); const [nQ, snQ] = useState([]);
  const [filterSubj, setFilterSubj] = useState("");
  const timer = useTimer(selQuiz?.timeLimit || 15, () => setTimeUp(true));

  function startQuiz(q) { setSelQuiz(q); setAnswers({}); setSubmitted(false); setTimeUp(false); setView("take"); }
  function submitQuiz() { setSubmitted(true); timer.stop(); setView("results"); dispatch({ type: "ADD_TOAST", payload: { message: "Quiz submitted!", variant: "success" } }); triggerCelebration("coins"); }
  function getAutoScore() { if (!selQuiz) return { earned: 0, total: 0 }; let e = 0, t = 0; selQuiz.questions.forEach((q) => { t += q.marks; if (q.type === "mcq" && answers[q.id] === q.correct) e += q.marks; }); return { earned: e, total: t }; }

  if (view === "create") {
    return (
      <div>
        <BackBtn onClick={() => setView("list")} />
        <PageHeader title="Create Quiz" />
        <Card elevated style={{ marginBottom: 20, borderLeft: `3px solid ${T.accent}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <Input value={nT} onChange={snT} placeholder="Quiz title" />
            <Input value={nTL} onChange={snTL} placeholder="Time limit (min)" type="number" />
            <Select value={nS} onChange={snS} options={SUBJECTS.map((s) => ({ value: s.id, label: s.name }))} placeholder="Select subject" />
            <Select value={nTo} onChange={snTo} options={(TOPICS[nS] || []).map((t) => ({ value: t, label: t }))} placeholder="Select topic" />
          </div>
        </Card>
        {nQ.map((q, idx) => (
          <Card key={idx} elevated style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Question {idx + 1}</span>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <Select value={q.type} onChange={(v) => { const u = [...nQ]; u[idx] = { ...u[idx], type: v }; snQ(u); }} options={[{ value: "mcq", label: "MCQ" }, { value: "short", label: "Short Answer" }, { value: "structured", label: "Structured" }]} style={{ fontSize: 12 }} />
                <Input value={q.marks} onChange={(v) => { const u = [...nQ]; u[idx] = { ...u[idx], marks: parseInt(v) || 0 }; snQ(u); }} type="number" style={{ width: 60 }} />
                <span style={{ fontSize: 12, color: T.textTer }}>marks</span>
                <button onClick={() => snQ(nQ.filter((_, i) => i !== idx))} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Trash size={14} weight="bold" color={T.danger} /></button>
              </div>
            </div>
            <Textarea value={q.text} onChange={(v) => { const u = [...nQ]; u[idx] = { ...u[idx], text: v }; snQ(u); }} placeholder="Question text" />
            {q.type === "mcq" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input type="radio" name={`q${idx}`} checked={q.correct === oIdx} onChange={() => { const u = [...nQ]; u[idx] = { ...u[idx], correct: oIdx }; snQ(u); }} style={{ accentColor: T.accent }} />
                    <Input value={opt} onChange={(v) => { const u = [...nQ]; u[idx].options[oIdx] = v; snQ(u); }} placeholder={`Option ${oIdx + 1}`} />
                  </div>
                ))}
              </div>
            )}
            {q.type !== "mcq" && <Textarea value={q.modelAnswer} onChange={(v) => { const u = [...nQ]; u[idx] = { ...u[idx], modelAnswer: v }; snQ(u); }} placeholder="Model answer" rows={2} style={{ marginTop: 10 }} />}
          </Card>
        ))}
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="secondary" onClick={() => snQ([...nQ, { id: nQ.length + 1, type: "mcq", text: "", options: ["", "", "", ""], correct: 0, marks: 2, modelAnswer: "" }])}><Plus size={14} weight="bold" /> Add Question</Btn>
          <Btn onClick={() => { if (!nT || !nS || nQ.length === 0) return; dispatch({ type: "ADD_QUIZ", payload: { title: nT, subject: nS, topic: nTo, timeLimit: parseInt(nTL), questions: nQ.map((q, i) => ({ ...q, id: i + 1 })) } }); dispatch({ type: "ADD_TOAST", payload: { message: `Quiz "${nT}" created`, variant: "success" } }); snT(""); snS(""); snTo(""); snTL(15); snQ([]); setView("list"); }} disabled={!nT || !nS || nQ.length === 0}>Save Quiz</Btn>
        </div>
      </div>
    );
  }

  if (view === "results" && selQuiz) {
    const { earned, total } = getAutoScore();
    const pct = Math.round((earned / total) * 100);
    return (
      <div>
        <BackBtn onClick={() => setView("list")} />
        <PageHeader title="Quiz Results" subtitle={selQuiz.title} />
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20 }}>
          <Card elevated style={{ textAlign: "center", borderTop: `3px solid ${pct >= 70 ? T.success : pct >= 50 ? T.warning : T.danger}` }}>
            <Trophy size={32} weight="duotone" color={pct >= 70 ? T.success : pct >= 50 ? T.warning : T.danger} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 44, fontWeight: 800, color: pct >= 70 ? T.success : pct >= 50 ? T.warning : T.danger, letterSpacing: -1 }}>{pct}%</div>
            <div style={{ fontSize: 14, color: T.textSec, marginTop: 4 }}>{earned} / {total} marks</div>
            <div style={{ fontSize: 11, color: T.textTer, marginTop: 10 }}>MCQ auto-graded</div>
          </Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {selQuiz.questions.map((q, idx) => {
              const ok = q.type === "mcq" && answers[q.id] === q.correct;
              const wrong = q.type === "mcq" && answers[q.id] !== undefined && answers[q.id] !== q.correct;
              return (
                <Card key={q.id} elevated style={{ borderLeft: `3px solid ${q.type === "mcq" ? (ok ? T.success : wrong ? T.danger : T.border) : T.accent}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.textTer }}>Q{idx + 1} — {q.type.toUpperCase()} ({q.marks}m)</span>
                    {q.type === "mcq" && <Badge color={ok ? T.success : T.danger} bg={ok ? T.successBg : T.dangerBg}>{ok ? "Correct" : "Incorrect"}</Badge>}
                    {q.type !== "mcq" && <Badge color="#2563EB" bg="#DBEAFE">Needs Review</Badge>}
                  </div>
                  <p style={{ fontSize: 14, color: T.text, margin: "0 0 10px", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{q.text}</p>
                  {q.type === "mcq" && <div><div style={{ fontSize: 13, color: T.textSec }}>Your answer: <strong style={{ color: T.text }}>{q.options[answers[q.id]] || "No answer"}</strong></div>{wrong && <div style={{ fontSize: 13, color: T.success, marginTop: 4 }}>Correct: <strong>{q.options[q.correct]}</strong></div>}</div>}
                  {q.type !== "mcq" && <div><div style={{ fontSize: 12, fontWeight: 600, color: T.textTer, marginBottom: 4 }}>Your answer:</div><div style={{ fontSize: 13, color: T.text, background: T.bgMuted, padding: 12, borderRadius: T.r2, marginBottom: 8 }}>{answers[q.id] || "No answer"}</div><div style={{ fontSize: 12, fontWeight: 600, color: T.textTer, marginBottom: 4 }}>Model answer:</div><div style={{ fontSize: 13, color: T.text, background: T.successBg, padding: 12, borderRadius: T.r2 }}>{q.modelAnswer}</div></div>}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (view === "take" && selQuiz) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div><BackBtn onClick={() => setView("list")} /><h1 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>{selQuiz.title}</h1></div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 20, fontWeight: 800, color: timer.seconds < 60 ? T.danger : T.text, background: timer.seconds < 60 ? T.dangerBg : T.bgMuted, padding: "8px 16px", borderRadius: T.r2, fontFamily: "'JetBrains Mono', monospace", border: `1.5px solid ${timer.seconds < 60 ? "#FECACA" : T.border}` }}>
              <Timer size={18} weight="bold" /> {timer.display}
            </div>
            {!timer.running && !submitted && <Btn onClick={timer.start} variant="secondary"><Play size={14} weight="fill" /> Start</Btn>}
            <Btn onClick={submitQuiz}>Submit Quiz</Btn>
          </div>
        </div>
        {timeUp && <div style={{ background: T.dangerBg, border: `1px solid #FECACA`, borderRadius: T.r2, padding: 12, marginBottom: 16, display: "flex", alignItems: "center", gap: 8, color: T.danger, fontSize: 13, fontWeight: 600 }}><Warning size={16} weight="fill" /> Time is up! Please submit your quiz.</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {selQuiz.questions.map((q, idx) => (
            <Card key={q.id} elevated>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Question {idx + 1}</span>
                <Badge color={T.textSec} bg={T.bgMuted}>{q.marks}m · {q.type.toUpperCase()}</Badge>
              </div>
              <p style={{ fontSize: 14, color: T.text, margin: "0 0 14px", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{q.text}</p>
              {q.type === "mcq" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {q.options.map((opt, oIdx) => (
                    <label key={oIdx} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: T.r2, border: `1.5px solid ${answers[q.id] === oIdx ? T.accent : T.border}`, background: answers[q.id] === oIdx ? T.accentLight : "transparent", cursor: "pointer", fontSize: 14, color: T.text, transition: "all 0.15s" }}>
                      <input type="radio" name={`quiz-${q.id}`} checked={answers[q.id] === oIdx} onChange={() => setAnswers({ ...answers, [q.id]: oIdx })} style={{ accentColor: T.accent }} />
                      {opt}
                    </label>
                  ))}
                </div>
              ) : <Textarea value={answers[q.id] || ""} onChange={(v) => setAnswers({ ...answers, [q.id]: v })} placeholder="Type your answer here..." rows={q.type === "structured" ? 6 : 3} />}
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Quizzes" subtitle="Test your knowledge" action={<Btn onClick={() => setView("create")}><Plus size={15} weight="bold" /> Create Quiz</Btn>} />
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        <Btn variant={!filterSubj ? "primary" : "secondary"} size="sm" onClick={() => setFilterSubj("")}>All</Btn>
        {SUBJECTS.map(s => <Btn key={s.id} variant={filterSubj === s.id ? "primary" : "secondary"} size="sm" onClick={() => setFilterSubj(s.id)}>{s.name}</Btn>)}
      </div>
      {state.quizzes.filter(q => !filterSubj || q.subject === filterSubj).length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          <EmptyStateIllustration type="default" size={100} />
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginTop: 12, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{state.quizzes.length === 0 ? "No quizzes yet" : "No quizzes for this subject"}</div>
          <div style={{ fontSize: 13, color: T.textTer, marginTop: 4 }}>Create your first quiz with the button above.</div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {state.quizzes.filter(q => !filterSubj || q.subject === filterSubj).map((quiz) => {
          const tm = quiz.questions.reduce((s, q) => s + q.marks, 0);
          const mc = quiz.questions.filter((q) => q.type === "mcq").length;
          const wr = quiz.questions.length - mc;
          const theme = getSubjectTheme(quiz.subject);
          return (
            <Card key={quiz.id} onClick={() => startQuiz(quiz)} elevated>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: T.r2, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}><Lightning size={20} weight="duotone" color={T.accent} /></div>
                <h3 style={{ fontSize: 14, fontWeight: 650, color: T.text, margin: 0, flex: 1, lineHeight: 1.3 }}>{quiz.title}</h3>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                <SubjectBadge subjectId={quiz.subject} small />
                {quiz.topic && <Badge color={T.textSec} bg={T.bgMuted} style={{ fontSize: 10 }}>{quiz.topic}</Badge>}
              </div>
              <div style={{ display: "flex", gap: 14, fontSize: 12, color: T.textSec, marginBottom: 12 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={13} weight="bold" /> {quiz.timeLimit}m</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Exam size={13} weight="bold" /> {quiz.questions.length} Qs</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={13} weight="bold" /> {tm}m</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {mc > 0 && <Badge color={T.accentText} bg={T.accentLight} style={{ fontSize: 10 }}>{mc} MCQ</Badge>}
                {wr > 0 && <Badge color="#2563EB" bg="#DBEAFE" style={{ fontSize: 10 }}>{wr} Written</Badge>}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


export default QuizGenerator;
