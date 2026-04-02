import React, { useState } from 'react';
import { T } from '../../theme/theme.js';

export default function Textarea({ value, onChange, placeholder, rows = 3, style }) {
  const [focused, setFocused] = useState(false);
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={{ padding: "9px 14px", borderRadius: T.r2, border: `1.5px solid ${focused ? T.borderFocus : T.border}`, fontSize: 14, outline: "none", width: "100%", color: T.text, background: T.bgCard, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6, boxShadow: focused ? `0 0 0 3px ${T.accentLight}` : "none", ...style }} />;
}
