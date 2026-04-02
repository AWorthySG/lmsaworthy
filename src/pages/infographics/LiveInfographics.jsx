import React, { useState } from 'react';
import { T } from '../../theme/theme.js';
import { ArrowLeft, CaretRight, MagicWand } from '../../icons/icons.jsx';
import GP1Infographic from './GP1Infographic.jsx';
import InfoPacksInfographic from './InfoPacksInfographic.jsx';
import GP2Infographic from './GP2Infographic.jsx';
import CriticalReadingInfographic from './CriticalReadingInfographic.jsx';

const INFOGRAPHICS = [
  { id: "gp1essay", title: "GP Paper 1 \u00b7 Essay Guide", subtitle: "6 question types, master structures & paragraph frameworks", icon: "\u270d\ufe0f", color: "#006840", bg: "#E2FBF0", tag: "General Paper", component: GP1Infographic },
  { id: "infopacks", title: "Info Packs \u00b7 Example Bank", subtitle: "Curated examples across 11 syllabus themes with cross-topic versatility", icon: "\ud83d\udce6", color: "#C08A00", bg: "#FFF8D6", tag: "General Paper", component: InfoPacksInfographic },
  { id: "gp2saq", title: "GP Paper 2 \u00b7 SAQ Guide", subtitle: "Interactive short-answer question walkthrough", icon: "\ud83d\udcd6", color: "#216ef4", bg: "#E4EFFE", tag: "General Paper", component: GP2Infographic },
  { id: "critread", title: "Critical Reading Framework", subtitle: "6-step routine + discourse markers reference", icon: "\ud83d\udd2c", color: "#6660B9", bg: "#EEEAFF", tag: "Foundation Skill", component: CriticalReadingInfographic },
];

function LiveInfographics() {
  const [activeIG, setActiveIG] = useState(null);
  const ig = activeIG ? INFOGRAPHICS.find(i => i.id === activeIG) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 96px)", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        {ig && (
          <button onClick={() => setActiveIG(null)} style={{ width: 32, height: 32, borderRadius: T.r1, background: T.bgMuted, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowLeft size={16} color={T.textSec} />
          </button>
        )}
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #1A1816, #3D3832)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0, letterSpacing: -0.4, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {ig ? ig.title : "Live Infographics"}
          </h1>
          <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0", fontWeight: 400 }}>
            {ig ? ig.subtitle : "Interactive visual learning guides — click any element to explore"}
          </p>
        </div>
      </div>

      {/* Content */}
      {!ig ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16, flexShrink: 0 }}>
          {INFOGRAPHICS.map(info => (
            <button key={info.id} onClick={() => setActiveIG(info.id)}
              style={{ background: T.bgCard, borderRadius: T.r3, padding: "24px", border: `1px solid ${T.border}`, cursor: "pointer", textAlign: "left", transition: "all 0.2s", boxShadow: T.shadow1 }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = T.shadow2; e.currentTarget.style.borderColor = info.color; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = T.shadow1; e.currentTarget.style.borderColor = T.border; }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>{info.icon}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: info.color, background: info.bg, padding: "2px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 0.8 }}>{info.tag}</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 6, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{info.title}</div>
              <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.6, marginBottom: 16 }}>{info.subtitle}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: info.color, fontSize: 12, fontWeight: 700 }}>
                <MagicWand size={14} weight="fill" /> Open Infographic <CaretRight size={12} />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          <ig.component />
        </div>
      )}
    </div>
  );
}

export default LiveInfographics;
