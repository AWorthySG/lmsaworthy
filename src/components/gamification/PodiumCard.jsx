import React from 'react';
import { T } from '../../theme/theme.js';
import StudentAvatar from './StudentAvatar.jsx';

// NOTE: getLevel must be provided by a shared helpers module
import { getLevel } from '../../helpers.js';

export default function PodiumCard({ student, rank, xp }) {
  const lv = getLevel(xp);
  const podiumColors = { 1: "#F59E0B", 2: "#94A3B8", 3: "#CD7F32" };
  const podiumHeights = { 1: 100, 2: 70, 3: 55 };
  const medals = { 1: "\uD83E\uDD47", 2: "\uD83E\uDD48", 3: "\uD83E\uDD49" };
  const c = podiumColors[rank];
  const isFirst = rank === 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: isFirst ? 155 : 135, transform: isFirst ? "scale(1.05)" : "none", zIndex: isFirst ? 2 : 1 }}>
      {isFirst && <div style={{ fontSize: 22, marginBottom: 4 }}>👑</div>}
      <div style={{ boxShadow: isFirst ? `0 8px 28px ${c}66, 0 0 0 3px ${c}33` : `0 6px 20px ${c}55`, borderRadius: "50%", marginBottom: 6 }}>
        <StudentAvatar student={student} size={isFirst ? 58 : 50} />
      </div>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontWeight: 700, fontSize: isFirst ? 14 : 13, color: T.text }}>{student.name}</div>
        <div style={{ fontSize: 11, color: lv.color, fontWeight: 700 }}>{lv.emoji} {lv.name}</div>
        <div style={{ fontWeight: 800, fontSize: isFirst ? 19 : 17, color: c, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{xp} XP</div>
      </div>
      <div style={{ width: "100%", height: podiumHeights[rank], background: isFirst ? `linear-gradient(to top, ${c}EE, ${c}88, ${c}55)` : `linear-gradient(to top, ${c}EE, ${c}88)`, borderRadius: `${T.r2}px ${T.r2}px 0 0`, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 10, fontSize: isFirst ? 30 : 26, borderTop: `${isFirst ? 3 : 2}px solid ${c}`, borderLeft: `${isFirst ? 3 : 2}px solid ${c}`, borderRight: `${isFirst ? 3 : 2}px solid ${c}`, borderBottom: "none", boxShadow: isFirst ? `inset 0 2px 8px rgba(255,255,255,0.3)` : "none" }}>
        {medals[rank]}
      </div>
    </div>
  );
}
