import React, { useState } from 'react';
import { T } from '../../theme/theme.js';

export default function Input({ value, onChange, placeholder, style, type = "text", id, "aria-label": ariaLabel, ...rest }) {
  const [focused, setFocused] = useState(false);
  return <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
    id={id} aria-label={ariaLabel || placeholder}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={{ padding: "9px 14px", borderRadius: T.r2, border: `1.5px solid ${focused ? T.borderFocus : T.border}`, fontSize: 14, outline: "none", width: "100%", color: T.text, background: T.bgCard, transition: "border-color 0.15s", boxShadow: focused ? `0 0 0 3px ${T.accentLight}` : "none", ...style }} {...rest} />;
}
