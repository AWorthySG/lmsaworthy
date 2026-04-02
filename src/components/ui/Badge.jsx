import React from 'react';
import { T } from '../../theme/theme.js';
import { getSubject, getSubjectTheme } from '../../utils/helpers.js';

export function Badge({ children, color, bg, style }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, letterSpacing: 0.2, padding: "4px 10px", borderRadius: 20, color: color || T.accentText, background: bg || T.accentLight, ...style }}>{children}</span>;
}

export function SubjectBadge({ subjectId, small }) {
  const s = getSubject(subjectId);
  const theme = getSubjectTheme(subjectId);
  if (!s) return null;
  return <Badge color={theme.text} bg={theme.bg} style={small ? { fontSize: 10, padding: "3px 8px" } : {}}>{s.name}</Badge>;
}

export default Badge;
