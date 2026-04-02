import React from 'react';
import { T } from '../../theme/theme.js';
import { ArrowLeft } from '../../icons/icons.js';

export default function BackBtn({ onClick, label = "Back" }) {
  return <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: "none", color: T.accent, fontSize: 13, cursor: "pointer", padding: "4px 0", marginBottom: 16, fontWeight: 600, letterSpacing: -0.1 }}><ArrowLeft size={15} weight="bold" /> {label}</button>;
}
