import React from 'react';
import { T } from '../../theme/theme.js';

export default function BadgeChip({ badge, earned, size = "md" }) {
  const small = size === "sm";
  return (
    <div title={`${badge.name}: ${badge.desc}`} style={{ display: "inline-flex", alignItems: "center", gap: small ? 3 : 5, padding: small ? "4px 8px" : "6px 12px", borderRadius: T.r2, background: earned ? T.accentLight : T.bgMuted, border: `1px solid ${earned ? T.accentMid : T.border}`, opacity: earned ? 1 : 0.38, cursor: "default", transition: "all 0.15s" }}>
      <span style={{ fontSize: small ? 13 : 15 }}>{badge.emoji}</span>
      <span style={{ fontSize: small ? 10 : 11, fontWeight: earned ? 650 : 400, color: earned ? T.accentText : T.textTer }}>{badge.name}</span>
    </div>
  );
}
