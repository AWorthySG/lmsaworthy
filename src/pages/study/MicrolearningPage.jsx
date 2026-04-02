import React, { useState } from 'react';
import { T } from '../../theme/theme.js';
import { ArrowLeft } from '../../icons/icons.jsx';
import { SUBJECTS } from '../../data/subjects.js';
import { MICRO_MODULES } from '../../data/microModules.js';
import { getSubject } from '../../utils/helpers.js';

function MicrolearningPage({ state, dispatch, defaultSubject }) {
  const [filterSubj, setFilterSubj] = useState(defaultSubject || "all");
  const [activeModule, setActiveModule] = useState(null);
  const filtered = filterSubj === "all" ? MICRO_MODULES : MICRO_MODULES.filter(m => m.subject === filterSubj);

  if (activeModule) {
    const theme = T[activeModule.subject] || T.eng;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 600 }}>
        <button onClick={() => setActiveModule(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, color: T.textSec, padding: 0 }}>
          <ArrowLeft size={14} color={T.textSec} /> Back to modules
        </button>
        <div style={{ background: theme.bg, borderRadius: T.r3, padding: "24px", border: `1px solid ${theme.accent}22` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 28 }}>{activeModule.icon}</span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{activeModule.title}</div>
              <div style={{ fontSize: 11, color: theme.accent, fontWeight: 600 }}>{activeModule.duration} · {getSubject(activeModule.subject)?.name}</div>
            </div>
          </div>
          <div style={{ fontSize: 15, color: T.text, lineHeight: 1.8, whiteSpace: "pre-line" }}>{activeModule.content}</div>
        </div>
        <div style={{ background: T.accentLight, borderRadius: T.r2, padding: "14px 18px", border: `1px solid ${T.accent}22` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, marginBottom: 4 }}>📝 Exam Tip</div>
          <div style={{ fontSize: 13, color: T.accentText, lineHeight: 1.6 }}>{activeModule.examTip}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: T.text, margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Microlearning</h1>
        <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0" }}>5-minute bite-sized lessons — perfect for revision on the go</p>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button onClick={() => setFilterSubj("all")} style={{ padding: "5px 12px", borderRadius: 20, border: `2px solid ${filterSubj === "all" ? T.accent : T.border}`, background: filterSubj === "all" ? T.accentLight : T.bgCard, color: filterSubj === "all" ? T.accent : T.textSec, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>All</button>
        {SUBJECTS.map(s => (
          <button key={s.id} onClick={() => setFilterSubj(s.id)} style={{ padding: "5px 12px", borderRadius: 20, border: `2px solid ${filterSubj === s.id ? (T[s.id]?.accent || T.accent) : T.border}`, background: filterSubj === s.id ? (T[s.id]?.bg || T.accentLight) : T.bgCard, color: filterSubj === s.id ? (T[s.id]?.accent || T.accent) : T.textSec, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>{s.name}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 10 }}>
        {filtered.map((m, i) => {
          const theme = T[m.subject] || T.eng;
          return (
            <button key={m.id} onClick={() => setActiveModule(m)} className="card-lift card-enter" style={{ "--i": i, padding: "18px", borderRadius: T.r2, background: T.bgCard, border: `1px solid ${T.border}`, cursor: "pointer", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 24 }}>{m.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: theme.accent, background: theme.bg, padding: "2px 8px", borderRadius: 20 }}>{m.duration}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>{m.title}</div>
              <div style={{ fontSize: 11, color: T.textTer }}>{getSubject(m.subject)?.name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ━━━ ADAPTIVE DIFFICULTY ENGINE ━━━ */
/* ━━━ PEER ESSAY REVIEW PAGE ━━━ */

export default MicrolearningPage;
