import React from 'react';

export default function SubjectIllustration({ subject, size = 200 }) {
  const configs = {
    eng: { gradient: ["#3B4FBF", "#5C6FE8"], elements: (
      <g opacity="0.9">
        <rect x="55" y="35" width="45" height="60" rx="4" fill="none" stroke="#7B8FEC" strokeWidth="2"/>
        <line x1="62" y1="50" x2="92" y2="50" stroke="#7B8FEC44" strokeWidth="1.5"/>
        <line x1="62" y1="58" x2="85" y2="58" stroke="#7B8FEC44" strokeWidth="1.5"/>
        <line x1="62" y1="66" x2="90" y2="66" stroke="#7B8FEC44" strokeWidth="1.5"/>
        <line x1="62" y1="74" x2="78" y2="74" stroke="#7B8FEC44" strokeWidth="1.5"/>
        <text x="77" y="43" fontSize="8" fill="#D4A254" fontWeight="700">Aa</text>
        <path d="M120 55 c0-15 20-15 20 0 c0 10-10 18-10 22 c0-4-10-12-10-22z" fill="none" stroke="#D4A25488" strokeWidth="1.5"/>
        <line x1="130" y1="80" x2="130" y2="84" stroke="#D4A25488" strokeWidth="1.5"/>
      </g>
    )},
    omath: { gradient: ["#006D5B", "#00897B"], elements: (
      <g opacity="0.9">
        <circle cx="80" cy="57" r="22" fill="none" stroke="#4DB6AC" strokeWidth="2"/>
        <line x1="80" y1="35" x2="80" y2="79" stroke="#4DB6AC66" strokeWidth="1"/>
        <line x1="58" y1="57" x2="102" y2="57" stroke="#4DB6AC66" strokeWidth="1"/>
        <text x="111" y="44" fontSize="9" fill="#D4A254" fontWeight="700">π</text>
        <text x="116" y="62" fontSize="9" fill="#80CBC4" fontWeight="700">∑</text>
        <text x="111" y="78" fontSize="9" fill="#D4A25488" fontWeight="700">√</text>
      </g>
    )},
    amath: { gradient: ["#BF360C", "#E64A19"], elements: (
      <g opacity="0.9">
        <path d="M55 80 Q80 30 105 55 Q120 70 140 35" fill="none" stroke="#FF8A65" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="80" cy="54" r="3" fill="#D4A254"/>
        <circle cx="105" cy="55" r="3" fill="#FF8A65"/>
        <line x1="55" y1="85" x2="145" y2="85" stroke="#FF8A6544" strokeWidth="1"/>
        <text x="130" y="44" fontSize="8" fill="#D4A254" fontWeight="700">d/dx</text>
        <text x="118" y="77" fontSize="8" fill="#FF8A6588" fontWeight="700">∫</text>
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
        <polyline points="125,38 130,32 135,35 140,28" fill="none" stroke="#D4A254" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="138,28 140,28 140,30" fill="none" stroke="#D4A254" strokeWidth="1.5" strokeLinecap="round"/>
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
    ibmyp: { gradient: ["#1B5E20", "#2E7D32"], elements: (
      <g opacity="0.9">
        <rect x="58" y="38" width="30" height="18" rx="3" fill="none" stroke="#81C784" strokeWidth="1.5"/>
        <rect x="58" y="62" width="30" height="18" rx="3" fill="none" stroke="#A5D6A7" strokeWidth="1.5"/>
        <text x="62" y="52" fontSize="7" fill="#D4A254" fontWeight="700">Criterion</text>
        <text x="63" y="75" fontSize="7" fill="#81C784" fontWeight="700">A · B · C · D</text>
        <circle cx="120" cy="55" r="18" fill="none" stroke="#66BB6A" strokeWidth="1.5"/>
        <path d="M111 51 l5 8 l11-13" fill="none" stroke="#81C784" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
