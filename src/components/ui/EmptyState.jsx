import React from 'react';
import { T } from '../../theme/theme.js';

export function EmptyStateIllustration({ type = "default", size = 120 }) {
  const colors = { primary: T.accent, secondary: T.accentLight, bg: T.bgMuted, text: T.textTer };
  if (type === "no-results") return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill={colors.bg} />
      <rect x="60" y="70" width="80" height="10" rx="5" fill={colors.secondary} />
      <rect x="70" y="90" width="60" height="10" rx="5" fill={colors.secondary} />
      <rect x="65" y="110" width="70" height="10" rx="5" fill={colors.secondary} />
      <circle cx="100" cy="60" r="15" fill={colors.primary} opacity="0.3" />
      <path d="M95 55 L100 65 L105 55" stroke={colors.primary} strokeWidth="2" fill="none" />
      <circle cx="140" cy="140" r="20" stroke={colors.primary} strokeWidth="3" fill="none" />
      <line x1="155" y1="155" x2="170" y2="170" stroke={colors.primary} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
  if (type === "celebration") return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="60" fill={colors.bg} />
      <path d="M80 105 L95 120 L125 80" stroke={colors.primary} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {[30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360].map((angle, i) => (
        <circle key={i} cx={100 + 75 * Math.cos(angle * Math.PI / 180)} cy={100 + 75 * Math.sin(angle * Math.PI / 180)} r={i % 3 === 0 ? 4 : 3} fill={i % 2 === 0 ? colors.primary : "#D4A254"} opacity={0.6 + (i % 3) * 0.15} />
      ))}
    </svg>
  );
  if (type === "learning") return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill={colors.bg} />
      <rect x="55" y="80" width="50" height="65" rx="4" fill={colors.secondary} stroke={colors.primary} strokeWidth="2" />
      <rect x="65" y="90" width="30" height="4" rx="2" fill={colors.primary} opacity="0.4" />
      <rect x="65" y="100" width="25" height="4" rx="2" fill={colors.primary} opacity="0.3" />
      <rect x="65" y="110" width="28" height="4" rx="2" fill={colors.primary} opacity="0.2" />
      <rect x="95" y="65" width="50" height="65" rx="4" fill={colors.secondary} stroke={colors.primary} strokeWidth="2" />
      <rect x="105" y="75" width="30" height="4" rx="2" fill={colors.primary} opacity="0.4" />
      <rect x="105" y="85" width="25" height="4" rx="2" fill={colors.primary} opacity="0.3" />
      <rect x="105" y="95" width="28" height="4" rx="2" fill={colors.primary} opacity="0.2" />
      <circle cx="130" cy="50" r="12" fill="#D4A254" opacity="0.5" />
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill={colors.bg} />
      <rect x="60" y="80" width="80" height="50" rx="8" fill={colors.secondary} stroke={colors.primary} strokeWidth="2" />
      <circle cx="100" cy="70" r="15" fill={colors.primary} opacity="0.3" />
    </svg>
  );
}

export default function EmptyState({ icon: Icon, message }) {
  return (
    <div style={{ textAlign: "center", padding: 60, color: T.textSec }}>
      <EmptyStateIllustration type="no-results" size={100} />
      <div style={{ width: 56, height: 56, borderRadius: T.r3, background: T.accentLight, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14, marginTop: 12 }}>
        <Icon size={24} weight="duotone" color={T.accent} />
      </div>
      <p style={{ fontSize: 14, fontWeight: 500 }}>{message}</p>
    </div>
  );
}
