import React from 'react';
import { T } from '../../theme/theme.js';

export default function Select({ value, onChange, options, placeholder, style, id, "aria-label": ariaLabel, ...rest }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      id={id} aria-label={ariaLabel || placeholder}
      style={{ padding: "9px 14px", borderRadius: T.r2, border: `1.5px solid ${T.border}`, fontSize: 14, outline: "none", color: T.text, background: T.bgCard, cursor: "pointer", ...style }} {...rest}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
