import React from 'react';
import { T } from '../../theme/theme.js';

export default function Progress({ value, height = 6, color = T.accent, bg = T.bgMuted }) {
  return (
    <div style={{ width: "100%", height, background: bg, borderRadius: height, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, value)}%`, height: "100%", background: color, borderRadius: height, transition: "width 0.5s ease" }} />
    </div>
  );
}
