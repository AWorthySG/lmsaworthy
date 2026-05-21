import React from 'react';
import { T } from '../../theme/theme.js';
import { PushPin, CheckCircle, XCircle, Lightbulb } from '../../icons/icons.jsx';
import { EmptyStateIllustration, PageHeader } from '../../components/ui';

function MistakeJournal({ state, dispatch }) {
  const mistakes = state.mistakes || [];
  const unreviewed = mistakes.filter(m => !m.reviewed);
  const reviewed = mistakes.filter(m => m.reviewed);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader title="Mistake Journal" subtitle="Track errors from quizzes and games to prevent repeating them" />

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, background: T.dangerBg, borderRadius: T.r2, padding: "14px", textAlign: "center", border: `1px solid ${T.danger}22` }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.danger, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{unreviewed.length}</div>
          <div style={{ fontSize: 11, color: T.danger, fontWeight: 600 }}>To Review</div>
        </div>
        <div style={{ flex: 1, background: T.successBg, borderRadius: T.r2, padding: "14px", textAlign: "center", border: `1px solid ${T.success}22` }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.success, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{reviewed.length}</div>
          <div style={{ fontSize: 11, color: T.success, fontWeight: 600 }}>Reviewed</div>
        </div>
      </div>

      {mistakes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <EmptyStateIllustration type="celebration" size={80} />
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginTop: 10 }}>No mistakes recorded yet</div>
          <div style={{ fontSize: 12, color: T.textTer, marginTop: 4 }}>Mistakes from quizzes and games will appear here automatically.</div>
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
                  <span>{m.question?.slice(0, 60)}...</span>
                  <span>{m.date}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div style={{ padding: "12px 16px", background: T.accentLight, borderRadius: T.r2, fontSize: 12, color: T.accentText, lineHeight: 1.6, display: "flex", alignItems: "flex-start", gap: 6 }}>
        <Lightbulb size={14} color={T.accentText} style={{ flexShrink: 0, marginTop: 2 }} /> <span><strong>Study tip:</strong> Review your mistake journal before every practice session. Students who actively review errors improve 30% faster than those who just practice new questions.</span>
      </div>
    </div>
  );
}


export default MistakeJournal;
