import React from 'react';
import { T } from '../../theme/theme.js';

export default function SimpleQRDisplay({ data, size = 160 }) {
  // Generate a simple visual code (not a real QR — for demo purposes, shows the code as a styled display)
  const code = btoa(data).slice(0, 8).toUpperCase();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ width: size, height: size, background: "#fff", borderRadius: T.r2, border: `2px solid ${T.text}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 1 }}>Attendance Code</div>
        <div style={{ fontSize: 36, fontWeight: 900, color: T.text, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 4 }}>{code}</div>
        <div style={{ fontSize: 9, color: T.textTer }}>Show this to your tutor</div>
      </div>
      <div style={{ fontSize: 11, color: T.textTer }}>Code refreshes each session</div>
    </div>
  );
}
