import React from 'react';
import { T } from '../../theme/theme.js';

export default function Select({ value, onChange, options, placeholder, style }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      style={{ padding: "9px 14px", borderRadius: T.r2, border: `1.5px solid ${T.border}`, fontSize: 14, outline: "none", color: T.text, background: T.bgCard, cursor: "pointer", ...style }}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
