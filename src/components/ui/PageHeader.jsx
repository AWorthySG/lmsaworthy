import React from 'react';
import { T } from '../../theme/theme.js';

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${T.border}` }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: T.text, margin: 0, letterSpacing: -0.4, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 14, color: T.textSec, margin: "6px 0 0", fontWeight: 500 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
