import React, { useState } from 'react';
import { T } from '../../theme/theme.js';
import { CaretDown, Warning, Trophy, BookOpen, Target, ChartPie } from '../../icons/icons.jsx';
import { GP1_QTYPES, GP1_FRAMEWORKS, GP1_TOOLS } from '../../data/gpQuestionTypes.js';

function GP1QTypeDetail({ qt, showStrong, setShowStrong }) {
  return (
    <div style={{ padding: "0 20px 20px", animation: "fadeSlideIn 0.18s ease" }}>
      {/* Trigger words */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: qt.color, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Trigger Words to Identify This Type</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {qt.triggers.map((t, i) => (
            <span key={i} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: qt.bg, color: qt.color, fontStyle: t.includes("…") || t.length > 20 ? "italic" : "normal", border: `1px solid ${qt.color}30` }}>{t}</span>
          ))}
        </div>
      </div>

      {/* What the question is asking */}
      <div style={{ background: "#F5F7FE", borderRadius: T.r1, padding: "10px 14px", marginBottom: 16, borderLeft: `3px solid ${qt.color}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>What the Question Is Really Asking</div>
        <p style={{ fontSize: 13, color: T.text, margin: 0, lineHeight: 1.6 }}>{qt.what}</p>
      </div>

      {/* Framework + Counter row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <div style={{ background: qt.bg, borderRadius: T.r1, padding: "10px 14px", border: `1px solid ${qt.color}30` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: qt.color, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Framework</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: qt.color, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{qt.framework}</div>
          <div style={{ fontSize: 11, color: T.textSec }}>{qt.frameworkFull}</div>
        </div>
        <div style={{ background: qt.counter === "Rebuttal" ? "#FFEBEC" : "#E0F6F9", borderRadius: T.r1, padding: "10px 14px", border: `1px solid ${qt.counterColor}30` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: qt.counterColor, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Counter Approach</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: qt.counterColor, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{qt.counter}</div>
          <div style={{ fontSize: 11, color: T.textSec }}>Stand: {qt.stand}</div>
        </div>
      </div>

      {/* Warning */}
      <div style={{ background: "#FFF0D9", borderRadius: T.r1, padding: "8px 12px", marginBottom: 16, display: "flex", gap: 8, alignItems: "flex-start", border: "1px solid #E0780030" }}>
        <Warning size={14} color="#E07800" weight="fill" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: 12, color: "#7A4400", margin: 0, lineHeight: 1.5 }}>{qt.warning}</p>
      </div>

      {/* Paragraph structure */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Paragraph Structure</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {qt.paraStructure.map((p, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "90px 100px 1fr", gap: 8, alignItems: "start", background: i % 2 === 0 ? "#F5F7FE" : "transparent", borderRadius: T.r1, padding: "7px 10px" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: qt.color }}>{p.label}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: T.textSec }}>{p.role}</span>
              <span style={{ fontSize: 11, color: T.text, lineHeight: 1.5 }}>{p.what}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Common mistakes */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#FB424E", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Common Mistakes to Avoid</div>
        {qt.mistakes.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
            <span style={{ fontSize: 14, lineHeight: 1, marginTop: 1 }}>✗</span>
            <span style={{ fontSize: 12, color: T.text, lineHeight: 1.5 }}>{m}</span>
          </div>
        ))}
      </div>

      {/* Examiner reward */}
      <div style={{ background: "#E2FBF0", borderRadius: T.r1, padding: "8px 12px", marginBottom: 16, display: "flex", gap: 8, alignItems: "flex-start" }}>
        <Trophy size={14} color="#006840" weight="fill" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: 12, color: "#006840", margin: 0, lineHeight: 1.5 }}><strong>What Examiners Reward:</strong> {qt.reward}</p>
      </div>

      {/* Sample thesis toggle */}
      <div>
        <button onClick={() => setShowStrong(s => s === qt.id ? null : qt.id)}
          style={{ fontSize: 12, fontWeight: 600, color: qt.color, background: qt.bg, border: `1px solid ${qt.color}40`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <BookOpen size={13} /> {showStrong === qt.id ? "Hide" : "Show"} Sample Thesis
        </button>
        {showStrong === qt.id && (
          <div style={{ marginTop: 8, background: qt.bg, borderRadius: T.r1, padding: "10px 14px", border: `1px solid ${qt.color}30`, animation: "fadeSlideIn 0.15s ease" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: qt.color, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Sample Thesis Statement</div>
            <p style={{ fontSize: 13, color: T.text, margin: 0, lineHeight: 1.7, fontStyle: "italic" }}>{qt.thesis}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function GP1Infographic() {
  const [selected, setSelected] = useState(null);
  const [showStrong, setShowStrong] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [activeFramework, setActiveFramework] = useState(null);
  const [showBands, setShowBands] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 40 }}>

      {/* ── Two Master Structures ── */}
      <div style={{ background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, overflow: "hidden", boxShadow: T.shadow1 }}>
        <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Two Master Structures</div>
          <div style={{ fontSize: 12, color: T.textSec, marginTop: 2 }}>Every GP Paper 1 question maps onto one of these two architectures — choosing wrong is a structural error</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          {/* Refutation */}
          <div style={{ padding: "16px 20px", borderRight: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "#E4EFFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Target size={14} color="#216ef4" weight="fill" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#216ef4", fontFamily: "'Bricolage Grotesque', sans-serif" }}>REFUTATION</span>
            </div>
            <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6, marginBottom: 10 }}>
              Part A argues <strong>FOR</strong> your position.<br/>Part B presents opposing views and <strong>DEFEATS</strong> them through direct rebuttal.
            </div>
            <div style={{ fontSize: 11, background: "#E4EFFE", borderRadius: T.r1, padding: "8px 10px", marginBottom: 8 }}>
              <strong style={{ color: "#216ef4" }}>Stand:</strong> <span style={{ color: T.text }}>Absolute or strong qualified</span><br/>
              <strong style={{ color: "#216ef4" }}>Counter:</strong> <span style={{ color: T.text }}>Rebuttal — defeat the opposing view</span>
            </div>
            <div style={{ fontSize: 11, color: T.textSec }}>Best for: <span style={{ color: "#216ef4", fontWeight: 600 }}>Q01 Direct Assertion, Q05 Open Discussion (absolute stand)</span></div>
          </div>
          {/* Limitation */}
          <div style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "#EEEAFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChartPie size={14} color="#6660B9" weight="fill" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#6660B9", fontFamily: "'Bricolage Grotesque', sans-serif" }}>LIMITATION</span>
            </div>
            <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6, marginBottom: 10 }}>
              Part A shows where the claim <strong>IS true</strong>.<br/>Part B shows where and when the claim <strong>BREAKS DOWN</strong>, using concession with evaluation.
            </div>
            <div style={{ fontSize: 11, background: "#EEEAFF", borderRadius: T.r1, padding: "8px 10px", marginBottom: 8 }}>
              <strong style={{ color: "#6660B9" }}>Stand:</strong> <span style={{ color: T.text }}>Qualified / calibrated / middleground</span><br/>
              <strong style={{ color: "#6660B9" }}>Counter:</strong> <span style={{ color: T.text }}>Concession — acknowledge, then weigh</span>
            </div>
            <div style={{ fontSize: 11, color: T.textSec }}>Best for: <span style={{ color: "#6660B9", fontWeight: 600 }}>Q02 Extent, Q03 Comparison, Q04 Cause/Solution, Q06 Evaluative Judgement</span></div>
          </div>
        </div>
        {/* The critical rule */}
        <div style={{ margin: "0 16px 16px", background: "#FFF0D9", borderRadius: T.r1, padding: "10px 14px", border: "1px solid #E0780030" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#E07800", marginBottom: 4 }}>THE CONCESSION vs REBUTTAL RULE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12 }}>
            <div><strong style={{ color: "#216ef4" }}>Absolute stand</strong> <span style={{ color: T.text }}>→ opposing views need <strong>REBUTTAL</strong></span></div>
            <div><strong style={{ color: "#6660B9" }}>Qualified stand</strong> <span style={{ color: T.text }}>→ opposing views need <strong>CONCESSION ONLY</strong></span></div>
          </div>
          <div style={{ fontSize: 11, color: "#7A4400", marginTop: 6 }}>Rebutting within a middleground essay contradicts your own thesis — you would be rejecting a position you yourself endorsed.</div>
        </div>
      </div>

      {/* ── 6 Question Types ── */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>6 Essay Question Types — Click to Explore</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {GP1_QTYPES.map(qt => {
            const isOpen = selected === qt.id;
            return (
              <div key={qt.id} style={{ borderRadius: T.r2, border: `2px solid ${isOpen ? qt.color : T.border}`, background: T.bgCard, overflow: "hidden", transition: "border-color 0.2s", boxShadow: isOpen ? T.shadow2 : T.shadow1 }}>
                <button onClick={() => setSelected(s => s === qt.id ? null : qt.id)}
                  style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
                  {/* Code badge */}
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: qt.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 18 }}>{qt.emoji}</span>
                  </div>
                  {/* Title */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: qt.color, background: qt.bg, padding: "1px 7px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 0.8 }}>Type {qt.code}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{qt.title}</span>
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: qt.structureColor, fontWeight: 600 }}>{qt.structure}</span>
                      <span style={{ fontSize: 11, color: T.textTer }}>·</span>
                      <span style={{ fontSize: 11, color: T.textSec }}>{qt.framework}: {qt.frameworkFull}</span>
                    </div>
                  </div>
                  {/* Expand */}
                  <div style={{ flexShrink: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>
                    <CaretDown size={16} color={T.textTer} />
                  </div>
                </button>
                {isOpen && <GP1QTypeDetail qt={qt} showStrong={showStrong} setShowStrong={setShowStrong} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Paragraph Frameworks ── */}
      <div style={{ background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, overflow: "hidden", boxShadow: T.shadow1 }}>
        <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Paragraph-Level Frameworks</div>
          <div style={{ fontSize: 12, color: T.textSec, marginTop: 2 }}>Use the right structure for each paragraph type — click to expand</div>
        </div>
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
          {GP1_FRAMEWORKS.map(fw => {
            const isOpen = activeFramework === fw.id;
            return (
              <div key={fw.id} style={{ borderRadius: T.r1, border: `1px solid ${isOpen ? fw.color : T.border}`, overflow: "hidden", transition: "border-color 0.2s" }}>
                <button onClick={() => setActiveFramework(a => a === fw.id ? null : fw.id)}
                  style={{ width: "100%", background: isOpen ? fw.bg : "transparent", border: "none", cursor: "pointer", padding: "10px 14px", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: fw.color, fontFamily: "'Bricolage Grotesque', sans-serif", minWidth: 60 }}>{fw.label}</span>
                  <span style={{ fontSize: 12, color: T.textSec, flex: 1 }}>{fw.when}</span>
                  <CaretDown size={14} color={T.textTer} style={{ flexShrink: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }} />
                </button>
                {isOpen && (
                  <div style={{ padding: "0 14px 14px", animation: "fadeSlideIn 0.15s ease" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {fw.steps.map((s, i) => (
                        <div key={i} style={{ flex: "1 1 160px", background: "#F5F7FE", borderRadius: T.r1, padding: "10px 12px", borderTop: `3px solid ${fw.color}` }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: fw.color, fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 2 }}>{s.abbr}</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 4 }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.5 }}>{s.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div style={{ background: "#F5F7FE", borderRadius: T.r1, padding: "10px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, marginBottom: 4 }}>KEY RULE: Topic sentences must be REASON-DRIVEN, not area-driven</div>
            <div style={{ fontSize: 12, color: T.text }}>
              <span style={{ color: "#FB424E" }}>✗ Weak:</span> "In terms of the economy…" (area-driven — describes a domain, not an argument)<br/>
              <span style={{ color: "#006840" }}>✓ Strong:</span> "Countries should host events because it generates needed revenue…" (reason-driven — Topic + Cause + Effect)
            </div>
          </div>
        </div>
      </div>

      {/* ── Planning & Evaluation Tools ── */}
      <div style={{ background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, overflow: "hidden", boxShadow: T.shadow1 }}>
        <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Planning & Evaluation Tools</div>
          <div style={{ fontSize: 12, color: T.textSec, marginTop: 2 }}>Brainstorming tools for planning · evaluation tools for within paragraphs</div>
        </div>
        <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
          {GP1_TOOLS.map(tool => {
            const isOpen = activeTool === tool.id;
            return (
              <div key={tool.id} onClick={() => setActiveTool(a => a === tool.id ? null : tool.id)}
                style={{ borderRadius: T.r1, border: `2px solid ${isOpen ? tool.color : T.border}`, padding: 14, cursor: "pointer", transition: "all 0.2s", background: isOpen ? tool.bg : T.bgCard }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: tool.color, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{tool.label}</span>
                  <span style={{ fontSize: 10, background: tool.bg, color: tool.color, padding: "1px 6px", borderRadius: 10, fontWeight: 700, border: `1px solid ${tool.color}30` }}>{tool.source}</span>
                </div>
                <div style={{ fontSize: 11, color: T.textSec, marginBottom: isOpen ? 10 : 0 }}>{tool.when}</div>
                {isOpen && (
                  <div style={{ animation: "fadeSlideIn 0.15s ease" }}>
                    {tool.letters.map((l, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 800, color: tool.color, fontFamily: "'Bricolage Grotesque', sans-serif", minWidth: 16 }}>{l.l}</span>
                        <span style={{ fontSize: 11, color: T.text }}>{l.full}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 8, fontSize: 11, color: T.textSec, lineHeight: 1.5, borderTop: `1px solid ${tool.color}20`, paddingTop: 8 }}>{tool.note}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Band Descriptors + Time ── */}
      <div style={{ background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, overflow: "hidden", boxShadow: T.shadow1 }}>
        <button onClick={() => setShowBands(b => !b)}
          style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Band Descriptors & Time Management</div>
            <div style={{ fontSize: 12, color: T.textSec, marginTop: 2 }}>What separates Band 3 → 4 → 5, and how to pace 90 minutes</div>
          </div>
          <CaretDown size={16} color={T.textTer} style={{ flexShrink: 0, transition: "transform 0.2s", transform: showBands ? "rotate(180deg)" : "none" }} />
        </button>
        {showBands && (
          <div style={{ padding: "0 20px 20px", animation: "fadeSlideIn 0.18s ease" }}>
            {/* Band jumps */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div style={{ background: "#FFF0D9", borderRadius: T.r1, padding: "12px 14px", border: "1px solid #E0780030" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#E07800", marginBottom: 6 }}>BAND 3 → 4 (Most Students)</div>
                <div style={{ fontSize: 11, color: T.text, lineHeight: 1.7 }}>
                  <strong>Band 3:</strong> Observations are 'generalised, assertive and/or descriptive.' Connections are 'implicit.'<br/>
                  <strong>Band 4:</strong> 'Some measured observations.' Connections are 'identified.' Shows 'analysis and evaluation.'<br/>
                  <strong style={{ color: "#E07800" }}>The difference: Band 4 students don't just state facts — they explain what they mean and why they matter.</strong>
                </div>
              </div>
              <div style={{ background: "#E2FBF0", borderRadius: T.r1, padding: "12px 14px", border: "1px solid #00684030" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#006840", marginBottom: 6 }}>BAND 4 → 5 (A-Grade Threshold)</div>
                <div style={{ fontSize: 11, color: T.text, lineHeight: 1.7 }}>
                  <strong>Band 4:</strong> 'Some engagement at conceptual level.' Examples are 'appropriate and frequent.'<br/>
                  <strong>Band 5:</strong> Engagement is 'clearly evident.' Examples are 'wide-ranging.' Connections 'identified AND explained.'<br/>
                  <strong style={{ color: "#006840" }}>The difference: Band 5 essays evaluate consistently and fully explain relationships between ideas.</strong>
                </div>
              </div>
            </div>
            {/* Time management */}
            <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 8 }}>90-Minute Exam Plan</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { phase: "Selection", time: "5–7 min", what: "Read all 8 questions. Shortlist 2–3. Run the ATQ test. Commit to one." },
                { phase: "Planning", time: "10–15 min", what: "Linear outline: thesis, FULL topic sentences (Topic+Cause+Effect), assigned examples. Identify question type and master structure." },
                { phase: "Writing", time: "55–65 min", what: "Intro (5–8 min), 3–4 body paragraphs (10–12 min each), conclusion (3–5 min)." },
                { phase: "Proofreading", time: "5–10 min", what: "Grammar, spelling, punctuation, coherence. Check thesis and conclusion align." },
              ].map((p, i) => (
                <div key={i} style={{ flex: "1 1 180px", background: "#F5F7FE", borderRadius: T.r1, padding: "10px 12px", borderTop: `3px solid #216ef4` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#216ef4" }}>{p.phase}</span>
                    <span style={{ fontSize: 11, background: "#E4EFFE", color: "#216ef4", padding: "1px 6px", borderRadius: 8, fontWeight: 700 }}>{p.time}</span>
                  </div>
                  <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.5 }}>{p.what}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, background: "#E4EFFE", borderRadius: T.r1, padding: "8px 12px", fontSize: 12, color: "#1250B0" }}>
              <strong>Cardinal Rule:</strong> A complete essay always beats an incomplete one. Plan conservatively and protect time for the conclusion. Aim for 600–800 words. Three deeply developed paragraphs beat five shallow ones.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ━━━ INFO PACKS — CURATED EXAMPLES BY 8881 SYLLABUS THEME ━━━ */


export default GP1Infographic;
