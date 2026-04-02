import React, { useState } from 'react';
import { T } from '../../theme/theme.js';
import { SUBJECTS } from '../../data/subjects.js';
import { PAST_PAPERS } from '../../data/pastPapersData.js';
import { ESSAY_RUBRICS } from '../../data/essayData.js';
import { getSubject, getExamCountdowns } from '../../utils/helpers.js';

function PastPapers({ state, dispatch, defaultSubject }) {
  const [filterSubj, setFilterSubj] = useState(defaultSubject || "all");
  const filtered = filterSubj === "all" ? PAST_PAPERS : PAST_PAPERS.filter(p => p.subject === filterSubj);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: T.text, margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Past-Year Papers</h1>
        <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0" }}>Practice with real Cambridge exam papers and model answers</p>
      </div>
      {/* Exam countdown banner */}
      {(() => {
        const next = getExamCountdowns()[0];
        return next && (
          <div style={{ background: "linear-gradient(135deg, #1A1816, #2E2218)", borderRadius: T.r3, padding: "16px 20px", color: "#fff", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#D4A254", fontFamily: "'JetBrains Mono', monospace" }}>{next.daysLeft}</div>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>Days to next exam</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{next.name}</div>
            </div>
          </div>
        );
      })()}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button onClick={() => setFilterSubj("all")} style={{ padding: "5px 12px", borderRadius: 20, border: `2px solid ${filterSubj === "all" ? T.accent : T.border}`, background: filterSubj === "all" ? T.accentLight : T.bgCard, color: filterSubj === "all" ? T.accent : T.textSec, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>All</button>
        {SUBJECTS.map(s => (
          <button key={s.id} onClick={() => setFilterSubj(s.id)} style={{ padding: "5px 12px", borderRadius: 20, border: `2px solid ${filterSubj === s.id ? (T[s.id]?.accent || T.accent) : T.border}`, background: filterSubj === s.id ? (T[s.id]?.bg || T.accentLight) : T.bgCard, color: filterSubj === s.id ? (T[s.id]?.accent || T.accent) : T.textSec, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>{s.name}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(p => {
          const theme = T[p.subject] || T.eng;
          return (
            <div key={p.id} className="card-hover" style={{ display: "flex", gap: 14, padding: "16px 18px", background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, borderLeft: `3px solid ${theme.accent}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: theme.accent, background: theme.bg, padding: "2px 8px", borderRadius: 20 }}>{p.paper}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: T.textTer }}>{p.year}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{p.title}</div>
                <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                  {p.topics.map(t => <span key={t} style={{ fontSize: 9, color: T.textTer, background: T.bgMuted, padding: "2px 6px", borderRadius: 10 }}>{t}</span>)}
                </div>
                {/* Model answer hints */}
                {p.modelHints && p.modelHints.length > 0 && (
                  <div style={{ marginTop: 10, padding: "10px 12px", background: T.goldLight, borderRadius: T.r1, border: `1px solid ${T.gold}22` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: T.goldDark, marginBottom: 4 }}>💡 Model Answer Hints</div>
                    {p.modelHints.map((h, i) => (
                      <div key={i} style={{ fontSize: 11, color: T.text, lineHeight: 1.6, marginBottom: i < p.modelHints.length - 1 ? 6 : 0 }}>• {h}</div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", justifyContent: "center" }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: T.textTer, background: T.bgMuted, padding: "2px 8px", borderRadius: 10 }}>{p.difficulty}</span>
                {p.modelHints && <span style={{ fontSize: 9, fontWeight: 700, color: T.gold, background: T.goldLight, padding: "2px 8px", borderRadius: 10 }}>💡 Hints</span>}
              </div>
            </div>
          );
        })}
      </div>
      {/* Rubrics section */}
      <div style={{ marginTop: 8 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: "0 0 12px", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Cambridge Marking Rubrics</h2>
        {Object.entries(ESSAY_RUBRICS).map(([subj, rubric]) => {
          const theme = T[subj] || T.eng;
          return (
            <div key={subj} style={{ marginBottom: 16, background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, overflow: "hidden" }}>
              <div style={{ padding: "12px 18px", background: theme.bg, borderBottom: `1px solid ${theme.accent}22` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.accent }}>{rubric.name}</div>
              </div>
              {rubric.criteria.map((c, ci) => (
                <div key={ci} style={{ padding: "12px 18px", borderBottom: ci < rubric.criteria.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{c.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: theme.accent }}>{c.weight}%</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {c.levels.map((l, li) => (
                      <div key={li} style={{ display: "flex", gap: 8, fontSize: 11, lineHeight: 1.5 }}>
                        <span style={{ fontWeight: 700, color: li === 0 ? T.success : li === 1 ? "#3D7DD6" : li === 2 ? T.warning : T.danger, minWidth: 70, flexShrink: 0 }}>{l.level}</span>
                        <span style={{ color: T.textSec }}>{l.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ━━━ MICROLEARNING PAGE ━━━ */

export default PastPapers;
