import React, { useState, useEffect } from 'react';
import { T } from '../../theme/theme.js';
import { MagnifyingGlass, X, CaretDown, Sparkle, Target } from '../../icons/icons.jsx';
import { INFO_PACK_THEMES } from '../../data/infoPackThemes.js';

function InfoPacksInfographic() {
  const [activeTheme, setActiveTheme] = useState(null);
  const [expandedEx, setExpandedEx] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimIn(true), 80);
    return () => clearTimeout(t);
  }, []);

  const filteredThemes = searchQuery.trim()
    ? INFO_PACK_THEMES.map(th => ({
        ...th,
        examples: th.examples.filter(ex => {
          const haystack = `${ex.name} ${ex.detail} ${ex.use} ${ex.versatility.join(" ")}`.toLowerCase();
          return haystack.includes(searchQuery.toLowerCase());
        })
      })).filter(th => th.examples.length > 0)
    : INFO_PACK_THEMES;

  const totalExamples = INFO_PACK_THEMES.reduce((s, th) => s + th.examples.length, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(120deg, #0F1B3D 0%, #1A2A5E 60%, #C08A00 100%)", borderRadius: T.r3, padding: "20px 22px", color: "#fff" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#F5D68A", marginBottom: 4 }}>8881 Syllabus Themes · Paper 1 Example Bank</div>
        <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 6 }}>Info Packs — Curated Examples</div>
        <div style={{ fontSize: 12, color: "#E8D8B0", lineHeight: 1.6 }}>
          {totalExamples} ready-to-use examples across {INFO_PACK_THEMES.length} syllabus themes. Each example includes region, year, detailed context, how to use it in essays, and cross-theme versatility tags. Build 30, master 10.
        </div>
        {/* Theme pills overview */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {INFO_PACK_THEMES.map(th => (
            <span key={th.id} style={{ fontSize: 10, fontWeight: 700, background: "rgba(255,255,255,0.15)", color: "#fff", padding: "3px 10px", borderRadius: 20 }}>
              {th.emoji} {th.theme} ({th.examples.length})
            </span>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ position: "relative" }}>
        <MagnifyingGlass size={14} color={T.textTer} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search examples — try 'Singapore', 'AI', 'inequality', 'environment'…"
          style={{ width: "100%", padding: "10px 12px 10px 34px", borderRadius: T.r2, border: `1px solid ${T.border}`, fontSize: 13, color: T.text, background: T.bgCard, outline: "none", boxSizing: "border-box" }}
          onFocus={e => e.target.style.borderColor = T.accent}
          onBlur={e => e.target.style.borderColor = T.border}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 2 }}>
            <X size={14} color={T.textTer} />
          </button>
        )}
      </div>

      {/* Tip */}
      <div style={{ background: T.accentLight, borderRadius: T.r1, padding: "10px 14px", border: `1px solid ${T.accentMid}`, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <Sparkle size={14} weight="fill" color={T.accent} style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 12, color: T.accentText, lineHeight: 1.6 }}>
          <strong>Strategy:</strong> A strong GP example is specific, recent, and evaluable — names a policy/event/data point, explains the mechanism, and is analysed (not just cited). Each example here is tagged for cross-theme versatility so you can reuse it across multiple essay topics.
        </div>
      </div>

      {/* Theme accordion */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filteredThemes.map((th, ti) => {
          const isOpen = activeTheme === th.id;
          return (
            <div key={th.id} style={{
              borderRadius: T.r2, border: `2px solid ${isOpen ? th.color : T.border}`, background: T.bgCard, overflow: "hidden",
              transition: "border-color 0.2s, box-shadow 0.2s", boxShadow: isOpen ? T.shadow2 : T.shadow1,
              opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(10px)",
              transitionProperty: "border-color, box-shadow, opacity, transform",
              transitionDuration: "0.2s, 0.2s, 0.4s, 0.4s",
              transitionDelay: `0s, 0s, ${ti * 0.04}s, ${ti * 0.04}s`
            }}>
              <button onClick={() => { setActiveTheme(a => a === th.id ? null : th.id); setExpandedEx(null); }}
                style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: th.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 20 }}>{th.emoji}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{th.theme}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: th.color, background: th.bg, padding: "1px 7px", borderRadius: 20 }}>{th.examples.length} examples</span>
                  </div>
                  <div style={{ fontSize: 11, color: T.textSec }}>{th.desc}</div>
                </div>
                <CaretDown size={16} color={T.textTer} style={{ flexShrink: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }} />
              </button>

              {isOpen && (
                <div style={{ padding: "0 18px 18px", animation: "fadeSlideIn 0.18s ease" }}>
                  {/* Suggested question types */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: T.textTer, paddingTop: 3 }}>Best for:</span>
                    {th.qtypes.map(qt => (
                      <span key={qt} style={{ fontSize: 10, fontWeight: 600, color: th.color, background: th.bg, padding: "2px 8px", borderRadius: 20, border: `1px solid ${th.color}30` }}>{qt}</span>
                    ))}
                  </div>

                  {/* Example cards */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {th.examples.map((ex, i) => {
                      const exKey = `${th.id}-${i}`;
                      const isExOpen = expandedEx === exKey;
                      return (
                        <div key={i} style={{ borderRadius: T.r1, border: `1px solid ${isExOpen ? th.color : T.border}`, background: isExOpen ? th.bg + "44" : "#F5F7FE", overflow: "hidden", transition: "all 0.2s" }}>
                          <button onClick={() => setExpandedEx(e => e === exKey ? null : exKey)}
                            style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{ex.name}</div>
                              <div style={{ display: "flex", gap: 8, marginTop: 3 }}>
                                <span style={{ fontSize: 10, color: th.color, fontWeight: 600 }}>{ex.region}</span>
                                <span style={{ fontSize: 10, color: T.textTer }}>·</span>
                                <span style={{ fontSize: 10, color: T.textSec }}>{ex.year}</span>
                              </div>
                            </div>
                            <CaretDown size={13} color={T.textTer} style={{ flexShrink: 0, transition: "transform 0.2s", transform: isExOpen ? "rotate(180deg)" : "none" }} />
                          </button>

                          {isExOpen && (
                            <div style={{ padding: "0 14px 14px", animation: "fadeSlideIn 0.15s ease" }}>
                              {/* Detail */}
                              <div style={{ fontSize: 12, color: T.text, lineHeight: 1.7, marginBottom: 10, background: "#fff", borderRadius: T.r1, padding: "10px 12px", border: `1px solid ${T.border}` }}>
                                {ex.detail}
                              </div>

                              {/* How to use — parsed into FOR / COUNTER cards */}
                              <div style={{ marginBottom: 10 }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: th.color, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>How to Use in Essays</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                  {ex.use.split(/(?=(?:FOR |COUNTER))/g).filter(s => s.trim()).map((chunk, ci) => {
                                    const isFor = chunk.startsWith("FOR ");
                                    const isCounter = chunk.startsWith("COUNTER");
                                    const raw = isFor ? chunk.slice(4) : isCounter ? chunk.replace(/^COUNTER:?\s*/, "") : chunk;
                                    // FOR points: split at first colon → "topic: explanation"
                                    // COUNTER points: extract first sentence as the key claim
                                    let topicSentence, explanation;
                                    if (isFor) {
                                      const colonIdx = raw.indexOf(": ");
                                      topicSentence = colonIdx > 0 && colonIdx < 120 ? raw.slice(0, colonIdx).trim() : null;
                                      explanation = colonIdx > 0 && colonIdx < 120 ? raw.slice(colonIdx + 2).trim() : raw.trim();
                                    } else {
                                      // For COUNTERs, take text up to first period or dash as the key claim
                                      const dashIdx = raw.indexOf(" — ");
                                      const periodIdx = raw.indexOf(". ");
                                      const splitAt = dashIdx > 0 && dashIdx < 100 ? dashIdx : periodIdx > 0 && periodIdx < 120 ? periodIdx : -1;
                                      if (splitAt > 0) {
                                        topicSentence = raw.slice(0, splitAt).trim();
                                        explanation = raw.slice(splitAt + (raw[splitAt] === "." ? 2 : 3)).trim();
                                      } else {
                                        topicSentence = null;
                                        explanation = raw.trim();
                                      }
                                    }
                                    const tagColor = isFor ? "#006840" : isCounter ? "#FB424E" : th.color;
                                    const tagBg = isFor ? "#E2FBF0" : isCounter ? "#FFEBEC" : th.bg;
                                    const tagLabel = isFor ? "SUPPORT" : isCounter ? "COUNTER" : "USE";
                                    return (
                                      <div key={ci} style={{ background: "#fff", borderRadius: T.r1, padding: "10px 12px", border: `1px solid ${tagColor}22`, borderLeft: `3px solid ${tagColor}` }}>
                                        <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 4 }}>
                                          <span style={{ fontSize: 9, fontWeight: 800, color: tagColor, background: tagBg, padding: "2px 6px", borderRadius: 10, letterSpacing: 0.5, flexShrink: 0, marginTop: 1 }}>{tagLabel}</span>
                                          {topicSentence && (
                                            <span style={{ fontSize: 12, fontWeight: 700, color: T.text, lineHeight: 1.4 }}>{topicSentence}</span>
                                          )}
                                        </div>
                                        {topicSentence && (
                                          <div style={{ background: isFor ? "#E2FBF044" : "#FFEBEC44", borderRadius: 6, padding: "6px 8px", marginBottom: 4, marginLeft: 2 }}>
                                            <div style={{ fontSize: 10, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Sample topic sentence</div>
                                            <div style={{ fontSize: 11, color: tagColor, fontWeight: 600, fontStyle: "italic", lineHeight: 1.5 }}>
                                              {isFor
                                                ? `"${topicSentence.charAt(0).toUpperCase() + topicSentence.slice(1)} — ${explanation.split(/[.!]/, 1)[0]}."`
                                                : `"However, ${topicSentence.charAt(0).toLowerCase() + topicSentence.slice(1)}."`
                                              }
                                            </div>
                                          </div>
                                        )}
                                        {explanation && (
                                          <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.6, marginLeft: 2 }}>
                                            {topicSentence ? (isFor ? explanation.split(/[.!]/).slice(1).join(".").trim() : explanation) : explanation}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Versatility tags */}
                              <div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>Cross-Theme Versatility</div>
                                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                  {ex.versatility.map(v => {
                                    const matchTheme = INFO_PACK_THEMES.find(t => t.theme === v || t.theme.includes(v));
                                    const tagColor = matchTheme ? matchTheme.color : T.textSec;
                                    const tagBg = matchTheme ? matchTheme.bg : T.bgMuted;
                                    return (
                                      <span key={v} style={{ fontSize: 10, fontWeight: 600, color: tagColor, background: tagBg, padding: "2px 8px", borderRadius: 20, border: `1px solid ${tagColor}25` }}>{v}</span>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredThemes.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: T.textTer, fontSize: 13 }}>
          No examples match "{searchQuery}". Try a broader search term.
        </div>
      )}

      {/* Bottom reminder */}
      <div style={{ background: T.bgMuted, borderRadius: T.r2, padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Target size={16} weight="fill" color={T.accent} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 4 }}>Remember: STRONG vs WEAK Examples</div>
          <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.6 }}>
            <span style={{ color: "#006840", fontWeight: 700 }}>STRONG:</span> Specific, recent, evaluable. Names a policy/event/data point, explains the mechanism, and is analysed. 2–3 specific examples per paragraph, developed in depth.<br/>
            <span style={{ color: "#FB424E", fontWeight: 700 }}>WEAK:</span> Generic, undated, or decorative. "Many countries have implemented policies…" tells the examiner nothing.
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoPacksInfographic;
