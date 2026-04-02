import React from 'react';

export default function SubjectIllustration({ subject, size = 200 }) {
  const configs = {
    eng: { gradient: ["#2D3A8C", "#4F5BD5"], elements: (
      <g opacity="0.9">
        <rect x="55" y="35" width="45" height="60" rx="4" fill="none" stroke="#818CF8" strokeWidth="2"/>
        <line x1="62" y1="50" x2="92" y2="50" stroke="#818CF844" strokeWidth="1.5"/>
        <line x1="62" y1="58" x2="85" y2="58" stroke="#818CF844" strokeWidth="1.5"/>
        <line x1="62" y1="66" x2="90" y2="66" stroke="#818CF844" strokeWidth="1.5"/>
        <line x1="62" y1="74" x2="78" y2="74" stroke="#818CF844" strokeWidth="1.5"/>
        <text x="77" y="43" fontSize="8" fill="#D4A254" fontWeight="700">Aa</text>
        <path d="M120 55 c0-15 20-15 20 0 c0 10-10 18-10 22 c0-4-10-12-10-22z" fill="none" stroke="#D4A25488" strokeWidth="1.5"/>
        <line x1="130" y1="80" x2="130" y2="84" stroke="#D4A25488" strokeWidth="1.5"/>
      </g>
    )},
    gp: { gradient: ["#0F766E", "#0D9488"], elements: (
      <g opacity="0.9">
        <circle cx="80" cy="55" r="25" fill="none" stroke="#2DD4BF66" strokeWidth="2"/>
        <path d="M70 50 l6 10 l14-18" fill="none" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="115" y="40" width="30" height="35" rx="3" fill="none" stroke="#D4A25466" strokeWidth="1.5"/>
        <line x1="120" y1="50" x2="140" y2="50" stroke="#D4A25444" strokeWidth="1"/>
        <line x1="120" y1="56" x2="138" y2="56" stroke="#D4A25444" strokeWidth="1"/>
        <line x1="120" y1="62" x2="135" y2="62" stroke="#D4A25444" strokeWidth="1"/>
      </g>
    )},
    h1econ: { gradient: ["#5B21B6", "#7C3AED"], elements: (
      <g opacity="0.9">
        <polyline points="55,80 70,60 90,70 110,40 130,50" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="110" cy="40" r="3" fill="#D4A254"/>
        <line x1="55" y1="85" x2="140" y2="85" stroke="#A78BFA44" strokeWidth="1"/>
        <line x1="55" y1="85" x2="55" y2="35" stroke="#A78BFA44" strokeWidth="1"/>
        <text x="125" y="37" fontSize="9" fill="#D4A254" fontWeight="700">📈</text>
      </g>
    )},
    h2econ: { gradient: ["#C2410C", "#EA580C"], elements: (
      <g opacity="0.9">
        <line x1="60" y1="80" x2="140" y2="30" stroke="#FDBA7488" strokeWidth="2" strokeLinecap="round"/>
        <line x1="60" y1="30" x2="140" y2="80" stroke="#38BDF888" strokeWidth="2" strokeLinecap="round"/>
        <text x="142" y="30" fontSize="8" fill="#FDBA74" fontWeight="700">D</text>
        <text x="142" y="82" fontSize="8" fill="#38BDF8" fontWeight="700">S</text>
        <circle cx="100" cy="55" r="4" fill="#D4A254" opacity="0.8"/>
        <circle cx="100" cy="55" r="8" fill="none" stroke="#D4A25444" strokeWidth="1"/>
      </g>
    )},
  };
  const c = configs[subject] || configs.eng;
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 200 120" style={{ display: "block" }}>
      <defs>
        <linearGradient id={`subj-${subject}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c.gradient[0]}/>
          <stop offset="100%" stopColor={c.gradient[1]}/>
        </linearGradient>
      </defs>
      <rect width="200" height="120" rx="12" fill={`url(#subj-${subject})`} opacity="0.08"/>
      {c.elements}
    </svg>
  );
}
