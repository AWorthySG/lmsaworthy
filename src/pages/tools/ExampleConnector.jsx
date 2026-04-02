import React, { useState, useEffect } from 'react';
import { T } from '../../theme/theme.js';
import { CaretDown } from '../../icons/icons.jsx';
import { EmptyStateIllustration } from '../../components/ui/index.js';
import { INFO_PACK_THEMES } from '../../data/infoPackThemes.js';
import { GP1_QTYPES } from '../../data/gpQuestionTypes.js';
import { detectQuestionType } from '../../utils/helpers.js';

function ExampleConnector() {
  const [questionText, setQuestionText] = useState("");
  const [matches, setMatches] = useState([]);
  const [expandedMatch, setExpandedMatch] = useState(null);

  function findExamples() {
    if (!questionText.trim()) { setMatches([]); return; }
    const lower = questionText.toLowerCase();
    const keywords = lower.split(/\s+/).filter(w => w.length > 3 && !["that", "this", "with", "from", "have", "been", "more", "than", "your", "what", "does", "should", "agree", "discuss", "extent", "which", "their", "they", "about", "would", "could", "most"].includes(w));

    const scored = [];
    INFO_PACK_THEMES.forEach(th => {
      th.examples.forEach((ex, ei) => {
        const haystack = `${ex.name} ${ex.detail} ${ex.use} ${ex.versatility.join(" ")}`.toLowerCase();
        let score = 0;
        keywords.forEach(kw => { if (haystack.includes(kw)) score += kw.length; });
        // Boost Singapore examples slightly
        if (haystack.includes("singapore")) score += 3;
        if (score > 0) {
          const forArgs = ex.use.split(/(?=FOR )/g).filter(s => s.startsWith("FOR "));
          const counterArgs = ex.use.split(/(?=COUNTER)/g).filter(s => s.startsWith("COUNTER"));
          scored.push({ theme: th, example: ex, exIdx: ei, score, forCount: forArgs.length, counterCount: counterArgs.length });
        }
      });
    });

    scored.sort((a, b) => b.score - a.score);
    setMatches(scored.slice(0, 8));
    setExpandedMatch(null);
  }

  useEffect(() => {
    const timer = setTimeout(findExamples, 300);
    return () => clearTimeout(timer);
  }, [questionText]);

  // Auto-detect question type
  const detected = detectQuestionType(questionText, GP1_QTYPES);
  const topType = detected[0] ? GP1_QTYPES.find(q => q.id === detected[0].id) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 96px)", gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #1A1816, #3D3832)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Example Connector</h1>
        <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0", fontWeight: 400 }}>Paste a GP question to find the best examples from your Info Packs</p>
      </div>

      <div>
        <textarea value={questionText} onChange={e => setQuestionText(e.target.value)}
          placeholder="e.g. 'How far do you agree that technology has done more harm than good?'"
          rows={2} style={{ width: "100%", padding: "12px 14px", borderRadius: T.r2, border: `1px solid ${T.border}`, fontSize: 14, color: T.text, fontFamily: "inherit", lineHeight: 1.6, resize: "none", boxSizing: "border-box" }} />
      </div>

      {topType && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: T.textTer }}>Detected:</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: topType.color, background: topType.bg, padding: "2px 10px", borderRadius: 20 }}>{topType.emoji} {topType.title} · {topType.framework}</span>
        </div>
      )}

      {matches.length > 0 && (
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.textSec, marginBottom: 8 }}>{matches.length} examples found — ranked by relevance</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {matches.map((m, i) => {
              const isOpen = expandedMatch === i;
              return (
                <div key={i} style={{ borderRadius: T.r2, border: `2px solid ${isOpen ? m.theme.color : T.border}`, background: T.bgCard, overflow: "hidden", transition: "border-color 0.2s" }}>
                  <button onClick={() => setExpandedMatch(isOpen ? null : i)}
                    style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: m.theme.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12 }}>{m.theme.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{m.example.name}</div>
                      <div style={{ display: "flex", gap: 6, marginTop: 2, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10, color: m.theme.color, fontWeight: 600 }}>{m.example.region} · {m.example.year}</span>
                        <span style={{ fontSize: 10, color: T.success, fontWeight: 600 }}>{m.forCount} FOR</span>
                        <span style={{ fontSize: 10, color: T.danger, fontWeight: 600 }}>{m.counterCount} COUNTER</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                      <div style={{ width: 32, height: 4, borderRadius: 4, background: T.bgMuted }}>
                        <div style={{ width: `${Math.min(100, m.score * 3)}%`, height: "100%", background: m.theme.color, borderRadius: 4 }} />
                      </div>
                      <CaretDown size={13} color={T.textTer} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ padding: "0 14px 14px", animation: "fadeSlideIn 0.15s ease" }}>
                      <div style={{ fontSize: 12, color: T.text, lineHeight: 1.7, marginBottom: 10, background: "#F5F7FE", borderRadius: T.r1, padding: "10px 12px" }}>{m.example.detail}</div>
                      {/* Parsed FOR/COUNTER */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
                        {m.example.use.split(/(?=(?:FOR |COUNTER))/g).filter(s => s.trim()).map((chunk, ci) => {
                          const isFor = chunk.startsWith("FOR ");
                          const isCounter = chunk.startsWith("COUNTER");
                          const raw = isFor ? chunk.slice(4) : isCounter ? chunk.replace(/^COUNTER:?\s*/, "") : chunk;
                          const colonIdx = raw.indexOf(": ");
                          const topic = isFor && colonIdx > 0 && colonIdx < 120 ? raw.slice(0, colonIdx).trim() : null;
                          const tagColor = isFor ? "#006840" : isCounter ? "#FB424E" : m.theme.color;
                          return (
                            <div key={ci} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                              <span style={{ fontSize: 8, fontWeight: 800, color: tagColor, background: isFor ? "#E2FBF0" : "#FFEBEC", padding: "1px 5px", borderRadius: 8, flexShrink: 0, marginTop: 2 }}>{isFor ? "FOR" : "CTR"}</span>
                              <span style={{ fontSize: 11, color: T.text, lineHeight: 1.4 }}>{topic || raw.split(/[.—]/)[0]}</span>
                            </div>
                          );
                        })}
                      </div>
                      {/* Versatility */}
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {m.example.versatility.map(v => (
                          <span key={v} style={{ fontSize: 9, fontWeight: 600, color: m.theme.color, background: m.theme.bg, padding: "1px 6px", borderRadius: 10 }}>{v}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {questionText.trim() && matches.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: T.textTer, fontSize: 13 }}><EmptyStateIllustration type="no-results" size={90} /><div style={{ marginTop: 12 }}>No matching examples found. Try a different question or broader keywords.</div></div>
      )}
    </div>
  );
}

export default ExampleConnector;
