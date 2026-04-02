import React from 'react';
import { T } from '../../theme/theme.js';
import { SUBJECTS, TOPICS } from '../../data/subjects.js';

function RevisionChecklist({ state, dispatch }) {
  const checklist = state.revisionChecklist || {};
  const allTopics = SUBJECTS.flatMap(s => (TOPICS[s.id] || []).map(t => ({ subject: s.id, topic: t, key: `${s.id}:${t}` })));
  const completed = allTopics.filter(t => checklist[t.key]).length;
  const total = allTopics.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, background: T.gradPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Revision Checklist</h1>
        <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0" }}>Track which topics you've revised — tick them off as you go</p>
      </div>
      {/* Progress */}
      <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "14px 18px", border: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
          <span style={{ fontWeight: 700, color: T.text }}>Overall Progress</span>
          <span style={{ fontWeight: 800, color: T.accent }}>{completed}/{total} ({total > 0 ? Math.round((completed / total) * 100) : 0}%)</span>
        </div>
        <div style={{ height: 8, background: T.bgMuted, borderRadius: 8 }}>
          <div style={{ height: "100%", borderRadius: 8, background: T.gradPrimary, width: `${total > 0 ? (completed / total) * 100 : 0}%`, transition: "width 0.4s" }} />
        </div>
      </div>
      {/* Per subject */}
      {SUBJECTS.map(subj => {
        const topics = (TOPICS[subj.id] || []);
        if (topics.length === 0) return null;
        const theme = T[subj.id] || T.eng;
        const subjCompleted = topics.filter(t => checklist[`${subj.id}:${t}`]).length;
        return (
          <div key={subj.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: theme.accent, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{subj.name}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: subjCompleted === topics.length ? T.success : T.textTer }}>{subjCompleted}/{topics.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {topics.map(topic => {
                const key = `${subj.id}:${topic}`;
                const done = checklist[key];
                return (
                  <button key={key} onClick={() => dispatch({ type: "TOGGLE_CHECKLIST_ITEM", payload: key })}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: T.r1, background: done ? T.successBg : T.bgCard, border: `1px solid ${done ? T.success + "33" : T.border}`, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${done ? T.success : T.border}`, background: done ? T.success : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                      {done && <span style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: done ? 600 : 400, color: done ? T.success : T.text, textDecoration: done ? "line-through" : "none" }}>{topic}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ━━━ GOAL SETTING PAGE ━━━ */

export default RevisionChecklist;
