import React from 'react';
import { T } from '../../theme/theme.js';
import { SUBJECTS } from '../../data/subjects.js';

const FORMULA_CARDS = {
  h1econ: [
    { title: "Multiplier", formula: "k = 1 / (1 - MPC) = 1 / MPS", note: "SG: small multiplier due to high MPS + MPM" },
    { title: "PED", formula: "PED = %ΔQd / %ΔP", note: "PED > 1 = elastic, PED < 1 = inelastic" },
  ],
  h2econ: [
    { title: "PED", formula: "PED = %ΔQd / %ΔP", note: "Elastic: ↓P → ↑TR. Inelastic: ↑P → ↑TR" },
    { title: "XED", formula: "XED = %ΔQd of A / %ΔP of B", note: "XED > 0 = substitutes. XED < 0 = complements" },
    { title: "YED", formula: "YED = %ΔQd / %ΔY", note: "YED > 0 = normal good. YED < 0 = inferior good" },
    { title: "PES", formula: "PES = %ΔQs / %ΔP", note: "Higher PES = more responsive supply" },
    { title: "Multiplier", formula: "k = 1 / (1 - MPC) = 1 / MPW", note: "MPW = MPS + MPT + MPM (withdrawals)" },
    { title: "Terms of Trade", formula: "ToT = (Export Price Index / Import Price Index) × 100", note: "↑ToT = favourable (exports buy more imports)" },
    { title: "Comparative Advantage", formula: "OC of Good X = Forgone units of Y / Units of X", note: "CA in good with LOWER opportunity cost" },
    { title: "Profit Max", formula: "MC = MR", note: "Firm maximises profit where MC intersects MR from below" },
    { title: "Allocative Efficiency", formula: "P = MC", note: "Achieved in perfect competition (LR)" },
    { title: "Productive Efficiency", formula: "P = min ATC", note: "Achieved in perfect competition (LR)" },
  ],
};

function FormulaCards() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, background: T.gradPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Formula Cards</h1>
        <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0" }}>Quick reference for key Economics formulas and concepts</p>
      </div>
      {Object.entries(FORMULA_CARDS).map(([subj, cards]) => {
        const theme = T[subj] || T.eng;
        const subjName = SUBJECTS.find(s => s.id === subj)?.name || subj;
        return (
          <div key={subj}>
            <div style={{ fontSize: 16, fontWeight: 800, color: theme.accent, marginBottom: 10, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{subjName}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
              {cards.map((c, i) => (
                <div key={i} className="card-enter" style={{ "--i": i, background: T.bgCard, borderRadius: T.r2, padding: "16px", border: `1px solid ${T.border}`, borderTop: `3px solid ${theme.accent}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.accent, marginBottom: 6 }}>{c.title}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: T.text, fontFamily: "'JetBrains Mono', monospace", marginBottom: 6, lineHeight: 1.4 }}>{c.formula}</div>
                  <div style={{ fontSize: 11, color: T.textTer, lineHeight: 1.5 }}>{c.note}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FormulaCards;
