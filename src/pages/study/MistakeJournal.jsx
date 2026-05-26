import React, { useState } from 'react';
import { T } from '../../theme/theme.js';
import { PushPin, CheckCircle, XCircle, Lightbulb, Plus } from '../../icons/icons.jsx';
import { EmptyStateIllustration, PageHeader, Card, Btn, Input, Textarea, Select } from '../../components/ui';
import { SUBJECTS } from '../../data/subjects.js';

const EMPTY_FORM = { subject: "", topic: "", question: "", yourAnswer: "", correctAnswer: "" };

function MistakeJournal({ state, dispatch }) {
  const mistakes = Array.isArray(state.mistakes) ? state.mistakes : [];
  const unreviewed = mistakes.filter(m => !m.reviewed);
  const reviewed = mistakes.filter(m => m.reviewed);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const handleAdd = () => {
    if (!form.question.trim()) return;
    dispatch({ type: "ADD_MISTAKE", payload: { ...form, question: form.question.trim() } });
    setForm(EMPTY_FORM);
    setShowForm(false);
    dispatch({ type: "ADD_TOAST", payload: { message: "Mistake logged — review it before your next session.", variant: "success" } });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader title="Mistake Journal" subtitle="Track errors from practice sessions and homework to prevent repeating them"
        action={<Btn onClick={() => setShowForm(v => !v)}><Plus size={15} weight="bold" /> Log Mistake</Btn>} />

      {showForm && (
        <Card elevated style={{ padding: 22 }}>
          <h3 style={{ margin: "0 0 16px", fontWeight: 700, fontSize: 15 }}>Log a Mistake</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Select value={form.subject} onChange={v => setForm(f => ({ ...f, subject: v }))} placeholder="Subject" options={SUBJECTS.map(s => ({ value: s.id, label: s.name }))} style={{ flex: 1, minWidth: 180 }} />
              <Input value={form.topic} onChange={v => setForm(f => ({ ...f, topic: v }))} placeholder="Topic (e.g. Elasticity)" style={{ flex: 1, minWidth: 180 }} />
            </div>
            <Textarea value={form.question} onChange={v => setForm(f => ({ ...f, question: v }))} placeholder="What was the question or concept you got wrong?" rows={3} />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Input value={form.yourAnswer} onChange={v => setForm(f => ({ ...f, yourAnswer: v }))} placeholder="Your answer (optional)" style={{ flex: 1, minWidth: 180 }} />
              <Input value={form.correctAnswer} onChange={v => setForm(f => ({ ...f, correctAnswer: v }))} placeholder="Correct answer (optional)" style={{ flex: 1, minWidth: 180 }} />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Btn variant="secondary" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}>Cancel</Btn>
              <Btn onClick={handleAdd} disabled={!form.question.trim()}><Plus size={14} weight="bold" /> Add to Journal</Btn>
            </div>
          </div>
        </Card>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, background: T.dangerBg, borderRadius: T.r2, padding: "14px", textAlign: "center", border: `1px solid ${T.danger}22` }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.danger, fontFamily: T.fontDisplay }}>{unreviewed.length}</div>
          <div style={{ fontSize: 11, color: T.danger, fontWeight: 600 }}>To Review</div>
        </div>
        <div style={{ flex: 1, background: T.successBg, borderRadius: T.r2, padding: "14px", textAlign: "center", border: `1px solid ${T.success}22` }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.success, fontFamily: T.fontDisplay }}>{reviewed.length}</div>
          <div style={{ fontSize: 11, color: T.success, fontWeight: 600 }}>Reviewed</div>
        </div>
      </div>

      {mistakes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <EmptyStateIllustration type="celebration" size={80} />
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginTop: 10 }}>No mistakes recorded yet</div>
          <div style={{ fontSize: 12, color: T.textTer, marginTop: 4 }}>Tap “Log Mistake” to record errors from homework and practice, then review them here.</div>
        </div>
      ) : (
        <>
          {unreviewed.length > 0 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.danger, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><PushPin size={14} color={T.danger} /> Needs Review</div>
              {unreviewed.map(m => {
                const theme = T[m.subject] || T.eng;
                return (
                  <div key={m.id} style={{ display: "flex", gap: 12, padding: "12px 14px", background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.danger}`, marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: theme.accent, background: theme.bg, padding: "2px 8px", borderRadius: 20 }}>{m.topic || "General"}</span>
                        <span style={{ fontSize: 10, color: T.textTer }}>{m.date}</span>
                      </div>
                      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.5 }}>{m.question}</div>
                      {m.correctAnswer && <div style={{ fontSize: 12, color: T.success, marginTop: 4, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><CheckCircle size={12} color={T.success} /> Correct: {m.correctAnswer}</div>}
                      {m.yourAnswer && <div style={{ fontSize: 12, color: T.danger, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}><XCircle size={12} color={T.danger} /> Your answer: {m.yourAnswer}</div>}
                    </div>
                    <button onClick={() => dispatch({ type: "TOGGLE_MISTAKE_REVIEWED", payload: m.id })} style={{ padding: "6px 12px", borderRadius: T.r1, background: T.bgMuted, border: `1px solid ${T.border}`, cursor: "pointer", fontSize: 10, fontWeight: 700, color: T.textSec, alignSelf: "flex-start", whiteSpace: "nowrap" }}>Mark Reviewed</button>
                  </div>
                );
              })}
            </div>
          )}
          {reviewed.length > 0 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.success, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><CheckCircle size={14} color={T.success} /> Reviewed ({reviewed.length})</div>
              {reviewed.slice(0, 5).map(m => (
                <div key={m.id} style={{ padding: "8px 14px", background: T.bgMuted, borderRadius: T.r1, marginBottom: 4, fontSize: 12, color: T.textTer, display: "flex", justifyContent: "space-between" }}>
                  <span>{m.question?.slice(0, 60)}…</span>
                  <span>{m.date}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div style={{ padding: "12px 16px", background: T.accentLight, borderRadius: T.r2, fontSize: 12, color: T.accentText, lineHeight: 1.6, display: "flex", alignItems: "flex-start", gap: 6 }}>
        <Lightbulb size={14} color={T.accentText} style={{ flexShrink: 0, marginTop: 2 }} /> <span><strong>Study tip:</strong> Review your mistake journal before every practice session. A-Worthlings who actively review errors improve 30% faster than those who just practice new questions.</span>
      </div>
    </div>
  );
}


export default MistakeJournal;
