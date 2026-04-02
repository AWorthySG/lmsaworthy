import React from 'react';
import { T } from '../../theme/theme.js';

export default function Btn({ children, variant = "primary", onClick, style, disabled, size = "md" }) {
  const sizes = { sm: { padding: "5px 12px", fontSize: 12, gap: 5 }, md: { padding: "8px 16px", fontSize: 13, gap: 6 }, lg: { padding: "10px 22px", fontSize: 14, gap: 7 } };
  const variants = {
    primary: { background: T.accent, color: T.textInverse, border: "none" },
    secondary: { background: T.bgMuted, color: T.text, border: `1px solid ${T.border}` },
    danger: { background: T.dangerBg, color: T.danger, border: `1px solid ${T.danger}22` },
    ghost: { background: "transparent", color: T.textSec, border: "1px solid transparent" },
  };
  return (
    <button disabled={disabled} onClick={onClick}
      style={{ ...sizes[size], borderRadius: T.r1, fontWeight: 550, cursor: disabled ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", opacity: disabled ? 0.35 : 1, transition: "opacity 0.15s", ...variants[variant], ...style }}>
      {children}
    </button>
  );
}
