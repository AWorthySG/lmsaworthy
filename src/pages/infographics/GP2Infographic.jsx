import React, { useState, useEffect } from 'react';
import { T } from '../../theme/theme.js';
import { CaretDown } from '../../icons/icons.jsx';
import { GP2_QTYPES } from '../../data/gpQuestionTypes.js';

const GP2_OVERVIEW = [
  { code: "SAQ", label: "Short-Answer Questions", marks: "9–11", time: "25 min", color: "#216ef4", pct: 22 },
  { code: "NIT", label: "New Item Type / Connections", marks: "4–6", time: "10 min", color: "#6660B9", pct: 10 },
  { code: "SUM", label: "Summary Question", marks: "8", time: "25 min", color: "#17a2b8", pct: 16 },
  { code: "AQ",  label: "Application Question", marks: "12", time: "25 min", color: "#E07800", pct: 24 },
  { code: "READ",label: "Reading Passages",  marks: "—",   time: "10 min", color: "#8A96B0", pct: 14 },
  { code: "CHK", label: "Checking",          marks: "—",   time: "5 min",  color: "#8A96B0", pct: 14 },
];

function QTypeDetail({ qt, showStrong, setShowStrong }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px 16px 20px", borderTop: `2px solid ${qt.color}22`, animation: "fadeSlideIn 0.2s ease" }}>
      {/* Command words */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Trigger Phrases</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {qt.commandWords.map((w, i) => (
            <span key={i} style={{ background: qt.bg, color: qt.color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: `1px solid ${qt.color}33` }}>{w}</span>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>The Approach</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {qt.steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: qt.color, color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{s.n}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 12, color: T.text, marginBottom: 2 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.6 }}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Answer Templates</div>
        {qt.templates.map((tmpl, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: qt.color, marginBottom: 4 }}>{tmpl.label}</div>
            <div style={{ background: qt.bg, border: `1px solid ${qt.color}33`, borderRadius: T.r1, padding: "8px 12px", fontSize: 12, color: T.text, lineHeight: 1.7, fontStyle: "italic" }}>{tmpl.t}</div>
          </div>
        ))}
      </div>

      {/* Worked example */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Worked Example</div>
        <div style={{ background: T.bgMuted, borderRadius: T.r1, padding: "8px 12px", fontSize: 12, color: T.text, marginBottom: 10, lineHeight: 1.6 }}>
          <span style={{ fontWeight: 700, color: T.textSec }}>Passage: </span>{qt.eg.passage}
        </div>
        <div style={{ display: "flex", gap: 0, background: T.bgMuted, borderRadius: T.r1, padding: 3, marginBottom: 10, width: "fit-content" }}>
          <button onClick={() => setShowStrong(false)} style={{ padding: "4px 12px", borderRadius: 7, border: "none", background: !showStrong ? "#FB424E" : "transparent", color: !showStrong ? "#fff" : T.textSec, fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>✗ Weak</button>
          <button onClick={() => setShowStrong(true)} style={{ padding: "4px 12px", borderRadius: 7, border: "none", background: showStrong ? "#17a2b8" : "transparent", color: showStrong ? "#fff" : T.textSec, fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>✓ Strong</button>
        </div>
        <div style={{ background: showStrong ? "#E0F6F9" : "#FFEBEC", border: `1px solid ${showStrong ? "#17a2b8" : "#FB424E"}44`, borderRadius: T.r1, padding: "10px 12px", fontSize: 12, color: T.text, lineHeight: 1.7, marginBottom: showStrong ? 8 : 0, transition: "background 0.25s" }}>
          {showStrong ? qt.eg.strong : qt.eg.weak}
        </div>
        {showStrong && (
          <div style={{ background: "#E4EFFE", borderRadius: T.r1, padding: "8px 12px", fontSize: 11, color: "#1250B0", lineHeight: 1.6 }}>
            <span style={{ fontWeight: 700 }}>Why it works: </span>{qt.eg.why}
          </div>
        )}
      </div>
    </div>
  );
}

function GP2Infographic() {
  const [selected, setSelected] = useState(null);
  const [showStrong, setShowStrong] = useState(false);
  const [animBars, setAnimBars] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimBars(true), 100);
    return () => clearTimeout(t);
  }, []);

  const sectionGroups = [
    { label: "Section A — Literal Paraphrasing", color: "#216ef4", items: GP2_QTYPES.filter(q => q.section === "A") },
    { label: "Section B1 — Word & Phrase Level", color: "#6660B9", items: GP2_QTYPES.filter(q => q.section === "B1") },
    { label: "Section B2 — Device & Figure Level", color: "#6660B9", items: GP2_QTYPES.filter(q => q.section === "B2") },
    { label: "Section B3 — Structural & Authorial", color: "#17a2b8", items: GP2_QTYPES.filter(q => q.section === "B3") },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Paper 2 at a glance */}
      <div style={{ background: "linear-gradient(120deg, #0F1B3D 0%, #1A2A5E 60%, #216ef4 100%)", borderRadius: T.r3, padding: "20px 22px", color: "#fff" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#8BAEED", marginBottom: 4 }}>A-Level H1 General Paper · 8881</div>
        <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 16 }}>Paper 2 · 90 Minutes · 50 Marks</div>
        {GP2_OVERVIEW.map(c => (
          <div key={c.code} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
              <span style={{ color: "#C8D8F5", fontWeight: 600 }}>{c.code} — {c.label}</span>
              <span style={{ color: "#fff", fontWeight: 700 }}>{c.marks} marks · {c.time}</span>
            </div>
            <div style={{ height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ height: "100%", background: c.color, borderRadius: 8, width: animBars ? `${c.pct * 4}%` : "0%", transition: "width 1s cubic-bezier(0.4,0,0.2,1)", maxWidth: "100%" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Accordion question types */}
      <div style={{ fontSize: 13, fontWeight: 600, color: T.textSec }}>Click any question type below to see the full approach, templates, and worked examples.</div>

      {sectionGroups.map(grp => (
        <div key={grp.label}>
          <div style={{ fontSize: 11, fontWeight: 700, color: grp.color, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8, paddingLeft: 2 }}>{grp.label}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {grp.items.map(qt => {
              const isOpen = selected === qt.id;
              return (
                <div key={qt.id} style={{ borderRadius: T.r2, border: `2px solid ${isOpen ? qt.color : T.border}`, background: isOpen ? qt.bg : T.bgCard, overflow: "hidden", transition: "border-color 0.18s, background 0.18s", boxShadow: isOpen ? `0 0 0 3px ${qt.color}18` : "none" }}>
                  <button onClick={() => { setSelected(s => s === qt.id ? null : qt.id); setShowStrong(false); }}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                    <div style={{ fontSize: 22, flexShrink: 0 }}>{qt.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: qt.color, fontFamily: "'JetBrains Mono', monospace" }}>{qt.code}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: qt.color, background: isOpen ? "#fff" : qt.bg, padding: "1px 6px", borderRadius: 20 }}>{qt.badge}</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{qt.title}</div>
                      <div style={{ fontSize: 11, color: T.textSec, marginTop: 1 }}>{qt.subtitle}</div>
                    </div>
                    <CaretDown size={15} color={qt.color} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
                  </button>
                  {isOpen && <QTypeDetail qt={qt} showStrong={showStrong} setShowStrong={setShowStrong} />}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}


export default GP2Infographic;
