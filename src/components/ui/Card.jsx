import React from 'react';
import { T } from '../../theme/theme.js';

export default function Card({ children, style, onClick, elevated, className }) {
  return (
    <div onClick={onClick} className={className || ""}
      style={{
        background: T.bgCard, borderRadius: T.r2,
        border: `1px solid ${T.border}`,
        padding: 20, cursor: onClick ? "pointer" : "default",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
        boxShadow: elevated ? T.shadow2 : T.shadow1,
        ...style
      }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.boxShadow = T.shadow2; } }}
      onMouseLeave={e => { if (onClick) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = elevated ? T.shadow2 : T.shadow1; } }}>
      {children}
    </div>
  );
}
