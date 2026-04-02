import React, { useState } from 'react';
import { T } from '../../theme/theme.js';
import { SUBJECTS } from '../../data/subjects.js';
import { getSubject } from '../../utils/helpers.js';
import { triggerCelebration } from '../../components/gamification';

function PeerReview({ state, dispatch }) {
  const [view, setView] = useState("hub"); // hub | submit | review | myEssays
  const [essayText, setEssayText] = useState("");
  const [essayTitle, setEssayTitle] = useState("");
  const [essaySubject, setEssaySubject] = useState("eng");
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewScores, setReviewScores] = useState({ content: 3, language: 3, structure: 3 });
  const [reviewFeedback, setReviewFeedback] = useState("");

  const essays = state.peerEssays || [];
  const reviews = state.peerReviews || [];
  const pendingReview = essays.filter(e => e.status === "pending" && reviews.filter(r => r.essayId === e.id).length < 2);
  const myEssays = essays; // In a real app, filter by current user

  function submitEssay() {
    if (!essayTitle.trim() || !essayText.trim()) return;
    dispatch({ type: "SUBMIT_PEER_ESSAY", payload: { title: essayTitle, text: essayText, subject: essaySubject, author: "You" } });
    dispatch({ type: "ADD_TOAST", payload: { message: "Essay submitted for peer review!", variant: "success" } });
    setEssayTitle(""); setEssayText(""); setEssaySubject("eng"); setView("hub");
  }

  function submitReview() {
    if (!reviewTarget || !reviewFeedback.trim()) return;
    dispatch({ type: "ADD_PEER_REVIEW", payload: { essayId: reviewTarget.id, reviewerId: 0, scores: reviewScores, feedback: reviewFeedback } });
    dispatch({ type: "ADD_TOAST", payload: { message: "Review submitted! +15 coins", variant: "success" } });
    triggerCelebration("coins");
    setReviewTarget(null); setReviewFeedback(""); setReviewScores({ content: 3, language: 3, structure: 3 }); setView("hub");
  }

  const rubricLabels = { 1: "Weak", 2: "Below Average", 3: "Average", 4: "Good", 5: "Excellent" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, background: T.gradPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Peer Essay Review</h1>
        <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0" }}>Submit essays for feedback and review your peers' work</p>
      </div>

      {view === "hub" && (
        <>
          {/* Stats */}
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { label: "Essays Submitted", value: essays.length, color: T.accent, icon: "📝" },
              { label: "Awaiting Review", value: pendingReview.length, color: T.warning, icon: "👀" },
              { label: "Reviews Given", value: reviews.length, color: T.success, icon: "✅" },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, background: T.bgCard, borderRadius: T.r2, padding: "14px", border: `1px solid ${T.border}`, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: T.textSec, fontWeight: 600 }}>{s.icon} {s.label}</div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setView("submit")} style={{ flex: 1, padding: "16px", borderRadius: T.r2, background: T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 24 }}>📝</span>Submit My Essay
            </button>
            <button onClick={() => setView("review")} disabled={pendingReview.length === 0} style={{ flex: 1, padding: "16px", borderRadius: T.r2, background: pendingReview.length > 0 ? T.goldLight : T.bgMuted, color: pendingReview.length > 0 ? T.goldDark : T.textTer, fontWeight: 700, fontSize: 14, border: `1px solid ${pendingReview.length > 0 ? T.gold + "44" : T.border}`, cursor: pendingReview.length > 0 ? "pointer" : "not-allowed", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 24 }}>👀</span>Review a Peer's Essay {pendingReview.length > 0 && `(${pendingReview.length})`}
            </button>
          </div>

          {/* My essays + reviews received */}
          {essays.length > 0 && (
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 10, fontFamily: "'Bricolage Grotesque', sans-serif" }}>My Submissions</div>
              {essays.map(e => {
                const theme = T[e.subject] || T.eng;
                const essayReviews = reviews.filter(r => r.essayId === e.id);
                return (
                  <div key={e.id} style={{ marginBottom: 8, background: T.bgCard, borderRadius: T.r2, padding: "14px 16px", border: `1px solid ${T.border}`, borderLeft: `3px solid ${theme.accent}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{e.title}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: essayReviews.length >= 2 ? T.success : T.warning, background: essayReviews.length >= 2 ? T.successBg : T.warningBg, padding: "2px 8px", borderRadius: 20 }}>{essayReviews.length}/2 reviews</span>
                    </div>
                    <div style={{ fontSize: 11, color: T.textTer }}>{e.createdAt} · {getSubject(e.subject)?.name}</div>
                    {essayReviews.length > 0 && (
                      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                        {essayReviews.map(r => (
                          <div key={r.id} style={{ background: T.bgMuted, borderRadius: T.r1, padding: "10px 12px", fontSize: 12 }}>
                            <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                              {Object.entries(r.scores).map(([k, v]) => (
                                <span key={k} style={{ fontWeight: 700, color: v >= 4 ? T.success : v >= 3 ? T.textSec : T.danger }}>{k}: {v}/5</span>
                              ))}
                            </div>
                            <div style={{ color: T.text, lineHeight: 1.5 }}>{r.feedback}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ padding: "12px 16px", background: T.accentLight, borderRadius: T.r2, fontSize: 12, color: T.accentText, lineHeight: 1.6 }}>
            💡 <strong>How it works:</strong> Submit your essay → 2 peers review it using structured rubrics → You get detailed feedback on Content, Language, and Structure. Reviewing others' work earns you 15 coins per review.
          </div>
        </>
      )}

      {/* Submit essay */}
      {view === "submit" && (
        <div style={{ maxWidth: 640, display: "flex", flexDirection: "column", gap: 12 }}>
          <button onClick={() => setView("hub")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, color: T.textSec, padding: 0 }}>← Back</button>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: T.text, display: "block", marginBottom: 4 }}>Essay Title</label>
              <input value={essayTitle} onChange={e => setEssayTitle(e.target.value)} placeholder="e.g. Should social media be banned for under-16s?" style={{ width: "100%", padding: "10px 12px", borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 13, boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: T.text, display: "block", marginBottom: 4 }}>Subject</label>
              <select value={essaySubject} onChange={e => setEssaySubject(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 13, boxSizing: "border-box" }}>
                {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: T.text, display: "block", marginBottom: 4 }}>Your Essay</label>
            <textarea value={essayText} onChange={e => setEssayText(e.target.value)} rows={12} placeholder="Paste or type your essay here..." style={{ width: "100%", padding: "12px 14px", borderRadius: T.r2, border: `1px solid ${T.border}`, fontSize: 14, resize: "vertical", boxSizing: "border-box", lineHeight: 1.8, fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
            <div style={{ fontSize: 11, color: T.textTer, marginTop: 4 }}>{essayText.split(/\s+/).filter(Boolean).length} words</div>
          </div>
          <button onClick={submitEssay} disabled={!essayTitle.trim() || !essayText.trim()} style={{ padding: "12px 24px", borderRadius: T.r2, background: essayTitle.trim() && essayText.trim() ? T.gradPrimary : T.bgMuted, color: essayTitle.trim() && essayText.trim() ? "#fff" : T.textTer, fontWeight: 700, fontSize: 14, border: "none", cursor: essayTitle.trim() && essayText.trim() ? "pointer" : "not-allowed", alignSelf: "flex-start", boxShadow: essayTitle.trim() && essayText.trim() ? T.shadowAccent : "none" }}>Submit for Peer Review</button>
        </div>
      )}

      {/* Review a peer's essay */}
      {view === "review" && (
        <div style={{ maxWidth: 700, display: "flex", flexDirection: "column", gap: 12 }}>
          <button onClick={() => { setView("hub"); setReviewTarget(null); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, color: T.textSec, padding: 0 }}>← Back</button>
          {!reviewTarget ? (
            <>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Select an essay to review:</div>
              {pendingReview.map(e => {
                const theme = T[e.subject] || T.eng;
                return (
                  <button key={e.id} onClick={() => setReviewTarget(e)} className="card-hover" style={{ padding: "14px 16px", borderRadius: T.r2, background: T.bgCard, border: `1px solid ${T.border}`, cursor: "pointer", textAlign: "left", borderLeft: `3px solid ${theme.accent}` }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{e.title}</div>
                    <div style={{ fontSize: 11, color: T.textTer }}>{getSubject(e.subject)?.name} · {e.text.split(/\s+/).filter(Boolean).length} words · {e.createdAt}</div>
                  </button>
                );
              })}
            </>
          ) : (
            <>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Reviewing: "{reviewTarget.title}"</div>
              {/* Essay text */}
              <div style={{ background: "#FFFEF8", borderRadius: T.r3, padding: "24px", border: "1px solid #E8E4D8", fontSize: 14, lineHeight: 1.9, color: T.text, maxHeight: 400, overflowY: "auto", whiteSpace: "pre-wrap" }}>{reviewTarget.text}</div>
              {/* Scoring rubric */}
              <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px", border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 12 }}>Score each criterion (1-5):</div>
                {[
                  { key: "content", label: "Content & Argument", desc: "Are the arguments well-developed with specific examples?" },
                  { key: "language", label: "Language & Expression", desc: "Is the vocabulary varied? Grammar accurate?" },
                  { key: "structure", label: "Structure & Coherence", desc: "Is there a clear thesis? Logical paragraph flow?" },
                ].map(c => (
                  <div key={c.key} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{c.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: reviewScores[c.key] >= 4 ? T.success : reviewScores[c.key] >= 3 ? T.accent : T.danger }}>{reviewScores[c.key]}/5 — {rubricLabels[reviewScores[c.key]]}</span>
                    </div>
                    <div style={{ fontSize: 10, color: T.textTer, marginBottom: 6 }}>{c.desc}</div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[1, 2, 3, 4, 5].map(v => (
                        <button key={v} onClick={() => setReviewScores(s => ({ ...s, [c.key]: v }))}
                          style={{ flex: 1, padding: "8px 4px", borderRadius: T.r1, border: `2px solid ${reviewScores[c.key] === v ? T.accent : T.border}`, background: reviewScores[c.key] === v ? T.accentLight : T.bgCard, color: reviewScores[c.key] === v ? T.accent : T.textSec, fontWeight: 800, fontSize: 13, cursor: "pointer" }}>{v}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {/* Written feedback */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.text, display: "block", marginBottom: 4 }}>Written Feedback</label>
                <textarea value={reviewFeedback} onChange={e => setReviewFeedback(e.target.value)} rows={4} placeholder="What did they do well? What could be improved? Be specific and constructive..." style={{ width: "100%", padding: "12px 14px", borderRadius: T.r2, border: `1px solid ${T.border}`, fontSize: 13, resize: "vertical", boxSizing: "border-box", lineHeight: 1.7 }} />
              </div>
              <button onClick={submitReview} disabled={!reviewFeedback.trim()} style={{ padding: "12px 24px", borderRadius: T.r2, background: reviewFeedback.trim() ? T.gradPrimary : T.bgMuted, color: reviewFeedback.trim() ? "#fff" : T.textTer, fontWeight: 700, fontSize: 14, border: "none", cursor: reviewFeedback.trim() ? "pointer" : "not-allowed", alignSelf: "flex-start" }}>Submit Review (+15 coins)</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ━━━ ANALYTICS DASHBOARD ━━━ */

export default PeerReview;
