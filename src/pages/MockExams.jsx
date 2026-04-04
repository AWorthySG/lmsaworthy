import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { T } from '../theme/theme.js';
import { Exam, Clock, CheckCircle, ArrowLeft, ArrowRight, Trophy, Timer, Play } from '../icons/icons.jsx';
import { Card, Btn, Badge, SubjectBadge, PageHeader, BackBtn, Textarea } from '../components/ui';
import { SUBJECTS } from '../data/subjects.js';
import useTimer from '../hooks/useTimer.js';

function MockExams({ state }) {
  const [view, setView] = useState("list");
  const [selExam, setSelExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [aSec, setASec] = useState(0);
  const timer = useTimer(selExam?.timeLimit || 90, () => { setSubmitted(true); setView("review"); });

  if (view === "review" && selExam) {
    const allQ = selExam.sections.flatMap((s) => s.questions);
    const totalM = allQ.reduce((s, q) => s + q.marks, 0);
    return (
      <div>
        <BackBtn onClick={() => setView("list")} />
        <PageHeader title="Exam Review" subtitle={selExam.title} />
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}>
          <div>
            <Card elevated style={{ textAlign: "center", marginBottom: 14, borderTop: `3px solid ${T.accent}` }}>
              <Trophy size={28} weight="duotone" color={T.accent} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>Total Marks</div>
              <div style={{ fontSize: 34, fontWeight: 800, color: T.accent, letterSpacing: -1 }}>{totalM}</div>
              <div style={{ fontSize: 12, color: T.textTer, marginTop: 4 }}>Manual review needed</div>
            </Card>
            <Card elevated>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 12 }}>Navigation</div>
              {selExam.sections.map((section) => (
                <div key={section.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.textTer, marginBottom: 6 }}>{section.name}</div>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {section.questions.map((q) => (
                      <div key={q.id} style={{ width: 28, height: 28, borderRadius: T.r1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, background: answers[q.id] ? T.accent : T.bgMuted, color: answers[q.id] ? "#fff" : T.textTer, border: `1px solid ${answers[q.id] ? T.accent : T.border}` }}>{q.id}</div>
                    ))}
                  </div>
                </div>
              ))}
            </Card>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {selExam.sections.map((section) => (
              <div key={section.id}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14 }}>{section.name}</h3>
                {section.questions.map((q) => (
                  <Card key={q.id} elevated style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Question {q.id}</span>
                      <Badge color={T.textSec} bg={T.bgMuted}>{q.marks}m</Badge>
                    </div>
                    <p style={{ fontSize: 14, color: T.text, margin: "0 0 12px", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{q.text}</p>
                    <div style={{ fontSize: 12, fontWeight: 600, color: T.textTer, marginBottom: 4 }}>Your answer:</div>
                    <div style={{ fontSize: 13, color: T.text, background: T.bgMuted, padding: 12, borderRadius: T.r2, marginBottom: 10, minHeight: 36, border: `1px solid ${T.border}` }}>{answers[q.id] || "No answer"}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: T.textTer, marginBottom: 4 }}>Model answer:</div>
                    <div style={{ fontSize: 13, color: T.text, background: T.successBg, padding: 12, borderRadius: T.r2 }}>{q.modelAnswer}</div>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === "take" && selExam) {
    const section = selExam.sections[aSec];
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div><div style={{ fontSize: 12, color: T.textTer, marginBottom: 2 }}>{selExam.title}</div><h1 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>{section.name}</h1></div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 20, fontWeight: 800, color: timer.seconds < 300 ? T.danger : T.text, fontFamily: "'JetBrains Mono', monospace", background: timer.seconds < 300 ? T.dangerBg : T.bgMuted, padding: "8px 16px", borderRadius: T.r2, border: `1.5px solid ${timer.seconds < 300 ? "#FECACA" : T.border}` }}><Timer size={18} weight="bold" /> {timer.display}</div>
            {!timer.running && !submitted && <Btn onClick={timer.start} variant="secondary"><Play size={14} weight="fill" /> Start</Btn>}
            <Btn onClick={() => { setSubmitted(true); timer.stop(); setView("review"); }}>Submit</Btn>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {selExam.sections.map((s, idx) => (
            <button key={s.id} onClick={() => setASec(idx)} style={{ padding: "9px 18px", borderRadius: T.r2, border: `1.5px solid ${idx === aSec ? T.accent : T.border}`, background: idx === aSec ? T.accentLight : "transparent", color: idx === aSec ? T.accentText : T.text, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>{s.name}</button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {section.questions.map((q) => (
            <Card key={q.id} elevated>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Question {q.id}</span>
                <Badge color={T.textSec} bg={T.bgMuted}>{q.marks}m</Badge>
              </div>
              <p style={{ fontSize: 14, color: T.text, margin: "0 0 14px", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{q.text}</p>
              <Textarea value={answers[q.id] || ""} onChange={(v) => setAnswers({ ...answers, [q.id]: v })} placeholder="Write your answer here..." rows={Math.max(6, Math.ceil(q.marks / 3))} />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Mock Examinations" subtitle="Practice under exam conditions" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
        {state.exams.map((exam) => {
          const totalM = exam.sections.flatMap((s) => s.questions).reduce((sum, q) => sum + q.marks, 0);
          const totalQ = exam.sections.flatMap((s) => s.questions).length;
          return (
            <Card key={exam.id} onClick={() => { setSelExam(exam); setAnswers({}); setSubmitted(false); setASec(0); setView("take"); }} elevated>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: T.r3, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <GraduationCap size={24} weight="duotone" color={T.accent} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: "0 0 8px" }}>{exam.title}</h3>
                  <SubjectBadge subjectId={exam.subject} small />
                  <div style={{ display: "flex", gap: 14, marginTop: 12, fontSize: 12, color: T.textSec }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={13} weight="bold" /> {exam.timeLimit}m</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Exam size={13} weight="bold" /> {totalQ} Qs</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={13} weight="bold" /> {totalM}m</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                    {exam.sections.map((s) => <Badge key={s.id} color={T.accentText} bg={T.accentLight} style={{ fontSize: 10 }}>{s.name}</Badge>)}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


export default MockExams;
