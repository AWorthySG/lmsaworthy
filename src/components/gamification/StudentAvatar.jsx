import React from 'react';
import { T } from '../../theme/theme.js';

// NOTE: AVATAR_OPTIONS must be provided by a shared helpers/constants module
import { AVATAR_OPTIONS } from '../../helpers.js';

export default function StudentAvatar({ student, size = 40, radius = "50%" }) {
  const av = student?.avatar ? AVATAR_OPTIONS.find(a => a.id === student.avatar) : null;
  if (av) {
    return (
      <div style={{ width: size, height: size, borderRadius: radius, background: av.bg, border: `2.5px solid ${av.ring}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: Math.round(size * 0.52), flexShrink: 0, userSelect: "none" }}>
        {av.emoji}
      </div>
    );
  }
  const initials = (student?.name || "?").split(" ").map(n => n[0]).join("");
  return (
    <div style={{ width: size, height: size, borderRadius: radius, background: `linear-gradient(135deg, ${T.accent}, #3F51EC)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: Math.round(size * 0.32), flexShrink: 0 }}>
      {initials}
    </div>
  );
}
