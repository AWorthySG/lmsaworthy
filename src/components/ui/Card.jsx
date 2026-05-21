import React from 'react';
import { T } from '../../theme/theme.js';

export default function Card({ children, style, onClick, elevated, className }) {
  const interactive = !!onClick;
  return (
    <div onClick={onClick} className={className || ""}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(e); } } : undefined}
      style={{
        background: T.bgCard, borderRadius: T.r2,
        border: `1px solid ${T.border}`,
        padding: 20, cursor: interactive ? "pointer" : "default",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
        boxShadow: elevated ? T.shadow2 : T.shadow1,
        outline: "none",
        ...style
      }}
      onFocus={interactive ? (e) => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.boxShadow = `0 0 0 2px ${T.accent}40`; } : undefined}
      onBlur={interactive ? (e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = elevated ? T.shadow2 : T.shadow1; } : undefined}
      onMouseEnter={interactive ? (e) => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.boxShadow = T.shadow2; } : undefined}
      onMouseLeave={interactive ? (e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = elevated ? T.shadow2 : T.shadow1; } : undefined}>
      {children}
    </div>
  );
}
