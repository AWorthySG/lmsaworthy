import React from 'react';
import { T } from '../../theme/theme.js';

export default function StudentAvatar({ student, size = 40, radius = "50%" }) {
  const initials = (student?.name || "?").split(" ").map(n => n[0]).join("").slice(0, 2);
  return (
    <div style={{ width: size, height: size, borderRadius: radius, background: `linear-gradient(135deg, ${T.accent}, #3F51EC)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: Math.round(size * 0.36), flexShrink: 0, userSelect: "none" }}>
      {initials}
    </div>
  );
}
