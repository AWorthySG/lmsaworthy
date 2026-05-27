import React, { useState, useMemo } from 'react';
import { T } from '../../theme/theme.js';
import { PushPin, CheckCircle, XCircle, Lightbulb, Plus, Brain, ArrowRight, ArrowLeft, Star } from '../../icons/icons.jsx';
import { EmptyStateIllustration, PageHeader, Card, Btn, Input, Textarea, Select } from '../../components/ui';
import { SUBJECTS } from '../../data/subjects.js';
import { calculateNextReview } from '../../utils/spacedRepetition.js';

const EMPTY_FORM = { subject: "", topic: "", question: "", yourAnswer: "", correctAnswer: "" };

// SR quality ratings shown to the student after flipping a card
const RATINGS = [
  { quality: 0, label: "Forgot", color: T.danger, bg: T.dangerBg },
  { quality: 2, label: "Hard",   color: "#D4940A", bg: "#FFF4E8" },
  { quality: 4, label: "Good",   color: T.success, bg: T.successBg },
  { quality: 5, label: "Easy",   color: "#2563EB", bg: "#EFF6FF" },
];

/* ── Review Mode ── */
function ReviewMode({ queue, onRate, onExit }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  const card = queue[idx];

  function rate(quality) {
    onRate(card, quality);
    const next = idx + 1;
    if (next >= queue.length) {
      setDone(true);
    } else {
      setIdx(next);
      setFlipped(false);
    }
  }

  if (done) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "60px 20px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: T.successBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Star size={36} color={T.success} weight="fill" />
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.text, fontFamily: T.fontDisplay }}>Session complete!</div>
          <div style={{ fontSize: 13, color: T.textSec, marginTop: 6 }}>You reviewed {queue.length} mistake{queue.length !== 1 ? "s" : ""}. Well done.</div>
        </div>
        <Btn onClick={onExit}><ArrowLeft size={14} weight="bold" /> Back to Journal</Btn>
      </div>
    );
  }

  const theme = T[card?.subject] || T.eng;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onExit} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: T.textSec, fontSize: 13, fontWeight: 600, padding: 0 }}>
          <ArrowLeft size={14} /> Exit Review
        </button>
        <span style={{ fontSize: 12, color: T.textTer, fontWeight: 600 }}>{idx + 1} / {queue.length}</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, borderRadius: 2, background: T.bgMuted, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((idx) / queue.length) * 100}%`, background: T.accent, borderRadius: 2, transition: "width 0.3s" }} />
      </div>

      {/* Subject / topic */}
      <div style={{ display: "flex", gap: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: theme.accent, background: theme.bg, padding: "3px 10px", borderRadius: 20 }}>{card.topic || "General"}</span>
        <span style={{ fontSize: 10, color: T.textTer, display: "flex", alignItems: "center" }}>{card.date}</span>
      </div>

      {/* Flip card */}
      <div style={{ perspective: 1000 }} onClick={() => setFlipped(f => !f)}>
        <div style={{
          position: "relative", minHeight: 220, cursor: "pointer",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)",
        }}>
          {/* Front — question */}
          <div style={{
            position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
            background: T.bgCard, borderRadius: T.r3, border: `1.5px solid ${T.border}`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: 28, textAlign: "center", gap: 12, boxShadow: T.shadow2,
          }}>
            <Brain size={28} color={T.accent} />
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, lineHeight: 1.6 }}>{card.question}</div>
            {card.yourAnswer && (
              <div style={{ fontSize: 12, color: T.danger, display: "flex", alignItems: "center", gap: 4 }}>
                <XCircle size={12} color={T.danger} /> Your answer: <em>{card.yourAnswer}</em>
              </div>
            )}
            <div style={{ fontSize: 11, color: T.textTer, marginTop: 8 }}>Tap to reveal answer</div>
          </div>

          {/* Back — correct answer */}
          <div style={{
            position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: T.successBg, borderRadius: T.r3, border: `1.5px solid ${T.success}44`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: 28, textAlign: "center", gap: 12, boxShadow: T.shadow2,
          }}>
            <CheckCircle size={28} color={T.success} weight="fill" />
            <div style={{ fontSize: 13, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.5 }}>Correct Answer</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.text, lineHeight: 1.6 }}>
              {card.correctAnswer || "No model answer recorded."}
            </div>
          </div>
        </div>
      </div>

      {/* Rating buttons — only after flip */}
      {flipped ? (
        <div>
          <div style={{ fontSize: 11, color: T.textTer, textAlign: "center", marginBottom: 10, fontWeight: 600 }}>How well did you recall this?</div>
          <div style={{ display: "flex", gap: 8 }}>
            {RATINGS.map(r => (
              <button key={r.quality} onClick={() => rate(r.quality)}
                style={{ flex: 1, padding: "10px 0", borderRadius: T.r2, background: r.bg, border: `1.5px solid ${r.color}33`, color: r.color, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "transform 0.1s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button onClick={() => setFlipped(true)}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 0", borderRadius: T.r2, background: T.accent, color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
          Reveal Answer <ArrowRight size={14} weight="bold" />
        </button>
      )}
    </div>
  );
}

/* ── Main page ── */
function MistakeJournal({ state, dispatch }) {
  const mistakes = useMemo(() => Array.isArray(state.mistakes) ? state.mistakes : [], [state.mistakes]);
  const today = new Date().toISOString().split("T")[0];

  // Mistakes due for SR review today
  const dueQueue = useMemo(() =>
    mistakes.filter(m => !m.nextReview || m.nextReview <= today).sort((a, b) => (a.nextReview || "") < (b.nextReview || "") ? -1 : 1),
    [mistakes, today]
  );

  const unreviewed = useMemo(() => mistakes.filter(m => !m.reviewed), [mistakes]);
  const reviewed = useMemo(() => mistakes.filter(m => m.reviewed), [mistakes]);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [reviewMode, setReviewMode] = useState(false);

  const handleAdd = () => {
    if (!form.question.trim()) return;
    dispatch({ type: "ADD_MISTAKE", payload: { ...form, question: form.question.trim() } });
    setForm(EMPTY_FORM);
    setShowForm(false);
    dispatch({ type: "ADD_TOAST", payload: { message: "Mistake logged — review it before your next session.", variant: "success" } });
  };

  function handleRate(card, quality) {
    const updated = calculateNextReview(
      { easeFactor: card.easeFactor ?? 2.5, interval: card.interval ?? 0, repetitions: card.repetitions ?? 0 },
      quality
    );
    dispatch({
      type: "UPDATE_MISTAKE_SR",
      payload: { id: card.id, ...updated, reviewed: quality >= 3 },
    });
  }

  if (reviewMode) {
    return (
      <ReviewMode
        queue={dueQueue.length > 0 ? dueQueue : mistakes.slice()}
        onRate={handleRate}
        onExit={() => setReviewMode(false)}
      />
    );
  }

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

      {/* SR Review banner */}
      {mistakes.length > 0 && (
        <button onClick={() => setReviewMode(true)}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: T.r2, background: dueQueue.length > 0 ? T.accent : T.bgMuted, border: `1.5px solid ${dueQueue.length > 0 ? T.accent : T.border}`, cursor: "pointer", width: "100%", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Brain size={20} color={dueQueue.length > 0 ? "#fff" : T.textSec} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: dueQueue.length > 0 ? "#fff" : T.text }}>
                {dueQueue.length > 0 ? `${dueQueue.length} mistake${dueQueue.length !== 1 ? "s" : ""} due for review` : "Start a review session"}
              </div>
              <div style={{ fontSize: 11, color: dueQueue.length > 0 ? "rgba(255,255,255,0.8)" : T.textTer }}>
                {dueQueue.length > 0 ? "Tap to start your spaced repetition session" : "All caught up — tap to practise any time"}
              </div>
            </div>
          </div>
          <ArrowRight size={16} color={dueQueue.length > 0 ? "#fff" : T.textSec} weight="bold" />
        </button>
      )}

      {/* Stats row */}
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, background: T.dangerBg, borderRadius: T.r2, padding: "14px", textAlign: "center", border: `1px solid ${T.danger}22` }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.danger, fontFamily: T.fontDisplay }}>{unreviewed.length}</div>
          <div style={{ fontSize: 11, color: T.danger, fontWeight: 600 }}>To Review</div>
        </div>
        <div style={{ flex: 1, background: T.successBg, borderRadius: T.r2, padding: "14px", textAlign: "center", border: `1px solid ${T.success}22` }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.success, fontFamily: T.fontDisplay }}>{reviewed.length}</div>
          <div style={{ fontSize: 11, color: T.success, fontWeight: 600 }}>Reviewed</div>
        </div>
        <div style={{ flex: 1, background: T.accentLight, borderRadius: T.r2, padding: "14px", textAlign: "center", border: `1px solid ${T.accent}22` }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.accent, fontFamily: T.fontDisplay }}>{dueQueue.length}</div>
          <div style={{ fontSize: 11, color: T.accent, fontWeight: 600 }}>Due Today</div>
        </div>
      </div>

      {mistakes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <EmptyStateIllustration type="celebration" size={80} />
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginTop: 10 }}>No mistakes recorded yet</div>
          <div style={{ fontSize: 12, color: T.textTer, marginTop: 4 }}>Tap "Log Mistake" to record errors from homework and practice, then review them here.</div>
        </div>
      ) : (
        <>
          {unreviewed.length > 0 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.danger, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><PushPin size={14} color={T.danger} /> Needs Review</div>
              {unreviewed.map(m => {
                const theme = T[m.subject] || T.eng;
                const isDue = !m.nextReview || m.nextReview <= today;
                return (
                  <div key={m.id} style={{ display: "flex", gap: 12, padding: "12px 14px", background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, borderLeft: `3px solid ${isDue ? T.danger : T.border}`, marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: theme.accent, background: theme.bg, padding: "2px 8px", borderRadius: 20 }}>{m.topic || "General"}</span>
                        <span style={{ fontSize: 10, color: T.textTer }}>{m.date}</span>
                        {isDue && <span style={{ fontSize: 10, fontWeight: 700, color: T.danger, background: T.dangerBg, padding: "2px 8px", borderRadius: 20 }}>Due</span>}
                        {!isDue && m.nextReview && <span style={{ fontSize: 10, color: T.textTer }}>Next: {m.nextReview}</span>}
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
                  <span>{m.question?.slice(0, 60)}{m.question?.length > 60 ? "…" : ""}</span>
                  <span>{m.date}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div style={{ padding: "12px 16px", background: T.accentLight, borderRadius: T.r2, fontSize: 12, color: T.accentText, lineHeight: 1.6, display: "flex", alignItems: "flex-start", gap: 6 }}>
        <Lightbulb size={14} color={T.accentText} style={{ flexShrink: 0, marginTop: 2 }} /> <span><strong>Study tip:</strong> Use spaced repetition — rate each card honestly. "Forgot" resets it to tomorrow; "Easy" schedules it weeks away. The algorithm surfaces what you need most.</span>
      </div>
    </div>
  );
}

export default MistakeJournal;
