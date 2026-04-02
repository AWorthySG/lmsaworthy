import React, { useState } from 'react';
import { T } from '../../theme/theme.js';
import { ArrowLeft, CaretRight } from '../../icons/icons.jsx';
import { MODEL_ESSAYS } from '../../data/essayData.js';
import { SUBJECTS } from '../../data/subjects.js';
import { getSubject } from '../../utils/helpers.js';

function ModelEssayBank({ state, dispatch }) {
  const [filterSubj, setFilterSubj] = useState("all");
  const [activeEssay, setActiveEssay] = useState(null);
  const filtered = filterSubj === "all" ? MODEL_ESSAYS : MODEL_ESSAYS.filter(e => e.subject === filterSubj);

  if (activeEssay) {
    const theme = T[activeEssay.subject] || T.eng;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
        <button onClick={() => setActiveEssay(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, color: T.textSec, padding: 0 }}>
          <ArrowLeft size={14} color={T.textSec} /> Back to essay bank
        </button>
        {/* Essay header */}
        <div style={{ background: theme.bg, borderRadius: T.r3, padding: "20px 22px", border: `1px solid ${theme.accent}22` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: theme.accent, background: "#fff", padding: "2px 8px", borderRadius: 20 }}>{getSubject(activeEssay.subject)?.name}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: T.success, background: T.successBg, padding: "2px 8px", borderRadius: 20 }}>Grade {activeEssay.grade}</span>
            {activeEssay.band && <span style={{ fontSize: 10, fontWeight: 700, color: T.gold, background: T.goldLight, padding: "2px 8px", borderRadius: 20 }}>Band {activeEssay.band}</span>}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif", lineHeight: 1.4 }}>{activeEssay.title}</div>
        </div>
        {/* Essay text */}
        <div style={{ background: "#FFFEF8", borderRadius: T.r3, padding: "28px 26px", border: "1px solid #E8E4D8", fontSize: 14, lineHeight: 2, color: T.text, whiteSpace: "pre-wrap", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {activeEssay.essay}
        </div>
        {/* Examiner feedback */}
        <div style={{ background: T.goldLight, borderRadius: T.r2, padding: "16px 18px", border: `1px solid ${T.gold}22` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.goldDark, marginBottom: 6 }}>📝 Why This Essay Scored Well</div>
          <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7 }}>{activeEssay.feedback}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, background: T.gradPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Model Essay Bank</h1>
        <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0" }}>Study A-grade essays with examiner feedback to learn what excellence looks like</p>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button onClick={() => setFilterSubj("all")} style={{ padding: "5px 12px", borderRadius: 20, border: `2px solid ${filterSubj === "all" ? T.accent : T.border}`, background: filterSubj === "all" ? T.accentLight : T.bgCard, color: filterSubj === "all" ? T.accent : T.textSec, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>All</button>
        {SUBJECTS.map(s => (
          <button key={s.id} onClick={() => setFilterSubj(s.id)} style={{ padding: "5px 12px", borderRadius: 20, border: `2px solid ${filterSubj === s.id ? (T[s.id]?.accent || T.accent) : T.border}`, background: filterSubj === s.id ? (T[s.id]?.bg || T.accentLight) : T.bgCard, color: filterSubj === s.id ? (T[s.id]?.accent || T.accent) : T.textSec, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>{s.name}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(e => {
          const theme = T[e.subject] || T.eng;
          return (
            <button key={e.id} onClick={() => setActiveEssay(e)} className="card-hover" style={{ display: "flex", gap: 14, padding: "16px 18px", background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, cursor: "pointer", textAlign: "left", borderLeft: `3px solid ${theme.accent}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: theme.accent, background: theme.bg, padding: "2px 8px", borderRadius: 20 }}>{e.type}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: T.success, background: T.successBg, padding: "2px 8px", borderRadius: 20 }}>Grade {e.grade}</span>
                  {e.band && <span style={{ fontSize: 10, fontWeight: 700, color: T.gold, background: T.goldLight, padding: "2px 8px", borderRadius: 20 }}>Band {e.band}</span>}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text, lineHeight: 1.4, marginBottom: 4 }}>{e.title}</div>
                <div style={{ fontSize: 11, color: T.textTer }}>{e.essay.split(/\s+/).length} words · {getSubject(e.subject)?.name}</div>
              </div>
              <CaretRight size={16} color={T.textTer} style={{ alignSelf: "center", flexShrink: 0 }} />
            </button>
          );
        })}
      </div>
      <div style={{ padding: "12px 16px", background: T.accentLight, borderRadius: T.r2, fontSize: 12, color: T.accentText, lineHeight: 1.6 }}>
        💡 <strong>Study tip:</strong> Don't just read model essays — actively annotate them. Identify the thesis, mark each PEEL paragraph, highlight the counter-argument, and note the vocabulary. Then try writing your own version of the same question.
      </div>
    </div>
  );
}

/* ━━━ WEEKLY PROGRESS SUMMARY ━━━ */

export default ModelEssayBank;
