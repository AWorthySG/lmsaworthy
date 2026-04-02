import React from 'react';
import { T } from '../../theme/theme.js';
import Progress from '../ui/Progress.jsx';

import { getLevel, getLevelProgress } from '../../utils/gamificationUtils.js';
import { LEVELS } from '../../data/gamification.js';

export default function XPBar({ xp, compact }) {
  const lv = getLevel(xp);
  const progress = getLevelProgress(xp);
  const nextLv = LEVELS.find(l => l.level === lv.level + 1);
  if (compact) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: lv.color, background: lv.bg, padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0 }}>{lv.emoji} {lv.name}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.textTer, marginBottom: 3 }}>
            <span style={{ fontWeight: 700, color: lv.color }}>{xp} XP</span>
            {nextLv && <span>{nextLv.min} XP</span>}
          </div>
          <Progress value={progress} color={lv.color} bg={lv.bg} height={5} />
        </div>
      </div>
    );
  }
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 26 }}>{lv.emoji}</span>
          <div>
            <div style={{ fontWeight: 700, color: lv.color, fontSize: 15 }}>{lv.name}</div>
            <div style={{ fontSize: 11, color: T.textTer }}>Level {lv.level} of 5</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 800, fontSize: 26, color: lv.color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{xp}</div>
          <div style={{ fontSize: 11, color: T.textTer }}>XP earned</div>
        </div>
      </div>
      <Progress value={progress} color={lv.color} bg={lv.bg} height={10} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.textTer, marginTop: 5 }}>
        <span>{xp - lv.min} XP this level</span>
        {nextLv ? <span>{nextLv.min - xp} XP to {nextLv.emoji} {nextLv.name}</span> : <span style={{ color: lv.color, fontWeight: 700 }}>Max level reached!</span>}
      </div>
    </div>
  );
}
