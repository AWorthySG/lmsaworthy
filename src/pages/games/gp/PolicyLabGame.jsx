import React, { useState, useEffect } from 'react';
import { T } from '../../../theme/theme.js';

function PolicyLabGame() {
  const scenarios = [
    { name: "Urban Housing Shortage", context: "Thousands of families are priced out of the housing market. Rents have risen 40% in 3 years. The government must act — but every choice has trade-offs." },
    { name: "Healthcare System Overload", context: "Hospital waiting times have tripled. Citizens demand better healthcare, but the budget is stretched and private hospitals resist regulation." },
  ];
  const [scenIdx] = useState(() => Math.floor(Math.random() * scenarios.length));
  const scenario = scenarios[scenIdx];
  const allPolicies = [
    { label: "Build public housing", effects: { afford: 20, sustain: -5, approval: 15, budget: -25 }, hint: "Strong + on affordability", stakeholder: "🏗️ Developers welcome construction contracts, but environmentalists warn about green space loss." },
    { label: "Relax zoning laws", effects: { afford: 10, sustain: -15, approval: -5, budget: 5 }, hint: "Moderate + affordability, hurts sustainability", stakeholder: "🏘️ Property owners worry about neighbourhood character. Young families celebrate new options." },
    { label: "Impose rent controls", effects: { afford: 15, sustain: -10, approval: 10, budget: 0 }, hint: "Popular with public, sustainability risk", stakeholder: "👨‍👩‍👧 Tenants cheer, but landlords threaten to reduce maintenance and convert units to commercial." },
    { label: "Incentivise green developers", effects: { afford: 5, sustain: 18, approval: -5, budget: -15 }, hint: "Strong on sustainability, costly", stakeholder: "🌱 Environmental groups applaud, but taxpayers question the high cost per unit built." },
    { label: "Invest in public transport", effects: { afford: 8, sustain: 20, approval: 12, budget: -22 }, hint: "Well-rounded but expensive", stakeholder: "🚇 Commuters are thrilled. The finance minister warns of budget overrun." },
    { label: "Raise property taxes", effects: { afford: -8, sustain: 5, approval: -18, budget: 25 }, hint: "Fills the budget, unpopular", stakeholder: "💰 Treasury officials smile, but homeowners stage protests outside Parliament." },
    { label: "Expand social subsidies", effects: { afford: 12, sustain: -3, approval: 8, budget: -18 }, hint: "Broadly popular, drains budget", stakeholder: "👨‍👩‍👧‍👦 Low-income families find relief, but economists warn of long-term fiscal dependency." },
    { label: "Deregulate private sector", effects: { afford: -5, sustain: -8, approval: -10, budget: 15 }, hint: "Budget gain, everything else drops", stakeholder: "🏢 Corporations welcome the freedom. Workers' unions call it a betrayal of public trust." },
  ];
  const crises = [
    { label: "📉 Economic recession hits!", effects: { afford: -10, approval: -8, budget: -12, sustain: 0 } },
    { label: "🌊 Natural disaster damages infrastructure!", effects: { afford: -5, sustain: -15, approval: -5, budget: -10 } },
    { label: "📈 Tech sector boom boosts revenue!", effects: { afford: 3, sustain: 0, approval: 5, budget: 15 } },
    { label: "🗳️ Election year — public scrutiny intensifies!", effects: { afford: 0, sustain: 0, approval: -12, budget: 0 } },
    { label: "🌍 International pressure on sustainability targets!", effects: { afford: 0, sustain: -10, approval: -5, budget: 0 } },
    { label: "👥 Youth unemployment spikes!", effects: { afford: -8, sustain: 0, approval: -15, budget: -5 } },
  ];

  const maxRounds = 6;
  const [meters, setMeters] = useState({ afford: 50, sustain: 50, approval: 55, budget: 65 });
  const [round, setRound] = useState(1);
  const [history, setHistory] = useState([]);
  const [crisisMsg, setCrisisMsg] = useState("");
  const [stakeholderMsg, setStakeholderMsg] = useState("");
  const [justification, setJustification] = useState(null); // after choosing policy
  const [pendingPolicy, setPendingPolicy] = useState(null);
  const [roundPolicies, setRoundPolicies] = useState([]);

  // Each round offer 4 random policies
  useEffect(() => {
    setRoundPolicies([...allPolicies].sort(() => Math.random() - 0.5).slice(0, 4));
  }, [round]);

  const meterData = [
    { key: "afford", label: "Affordability", color: "#3D7DD6", emoji: "🏠" },
    { key: "sustain", label: "Sustainability", color: "#3BAA7E", emoji: "🌿" },
    { key: "approval", label: "Public Approval", color: "#EF8354", emoji: "👍" },
    { key: "budget", label: "Budget", color: "#D4940A", emoji: "💰" },
  ];
  const lowest = Math.min(...Object.values(meters));
  const allAbove40 = lowest >= 40;
  const done = round > maxRounds;

  function selectPolicy(p) {
    setPendingPolicy(p);
    setStakeholderMsg(p.stakeholder);
    setJustification(null);
  }

  function confirmPolicy() {
    if (!pendingPolicy) return;
    const p = pendingPolicy;
    let newMeters = { ...meters };
    Object.keys(p.effects).forEach(k => { newMeters[k] = Math.max(0, Math.min(100, newMeters[k] + p.effects[k])); });

    // Random crisis every other round
    let crisis = null;
    if (round >= 2 && round % 2 === 0) {
      crisis = crises[Math.floor(Math.random() * crises.length)];
      Object.keys(crisis.effects).forEach(k => { newMeters[k] = Math.max(0, Math.min(100, newMeters[k] + crisis.effects[k])); });
      setCrisisMsg(crisis.label);
    } else {
      setCrisisMsg("");
    }

    setMeters(newMeters);
    setHistory(h => [...h, { policy: p.label, meters: { ...newMeters }, crisis: crisis?.label || null }]);
    setPendingPolicy(null);
    setStakeholderMsg("");
    setRound(r => r + 1);
  }

  const grade = done ? (lowest >= 60 ? "S" : lowest >= 50 ? "A" : lowest >= 40 ? "B" : lowest >= 25 ? "C" : "D") : "";
  const gradeColors = { S: "#D4A254", A: "#3BAA7E", B: "#3D7DD6", C: "#E5A832", D: "#E05262" };

  if (done) {
    return (
      <div className="scale-pop" style={{ background: T.bgCard, borderRadius: T.r3, padding: "36px 28px", textAlign: "center", border: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 30%, ${gradeColors[grade]}15, transparent 60%)` }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏛️</div>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: gradeColors[grade] + "22", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: `3px solid ${gradeColors[grade]}44` }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: gradeColors[grade], fontFamily: "'Bricolage Grotesque', sans-serif" }}>{grade}</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: T.text }}>{allAbove40 ? "Balanced Governance!" : "Policy Failed"}</div>
          <div style={{ fontSize: 13, color: T.textSec, marginTop: 6 }}>Lowest meter: {lowest}% · {maxRounds} rounds survived</div>
          {/* Meter final state */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 16, textAlign: "left" }}>
            {meterData.map(m => (
              <div key={m.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: meters[m.key] < 40 ? T.danger : T.text }}>
                <span>{m.emoji}</span>
                <span style={{ fontWeight: 600 }}>{m.label}:</span>
                <span style={{ fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>{meters[m.key]}%</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: T.textTer, marginTop: 12 }}>
            {grade === "S" ? "Outstanding — you balanced all stakeholders while navigating crises." : grade === "A" ? "Strong performance — good trade-off management." : grade === "B" ? "Solid — but some stakeholders suffered." : "Review the trade-offs — every policy benefits someone at someone else's expense."}
          </div>
          <div style={{ marginTop: 12, padding: "10px 14px", background: T.accentLight, borderRadius: T.r2, fontSize: 11, color: T.accentText, textAlign: "left", lineHeight: 1.6 }}>
            📝 <strong>GP Exam Tip:</strong> In Paper 1, always acknowledge trade-offs. The best essays say "While Policy X improves A, it may worsen B, suggesting that..." This game mirrors how real policy arguments are evaluated.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* HUD */}
      <div className="grain" style={{ background: "linear-gradient(135deg, #0F172A, #1E2A4A)", borderRadius: T.r3, padding: "16px 20px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>{scenario.name}</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Round {round} of {maxRounds}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {meterData.map(m => (
            <div key={m.key} style={{ textAlign: "center", minWidth: 36 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: meters[m.key] < 40 ? "#ff6b6b" : meters[m.key] < 50 ? "#D4A254" : "#51cf66", fontFamily: "'JetBrains Mono', monospace" }}>{meters[m.key]}</div>
              <div style={{ fontSize: 7, color: "rgba(255,255,255,0.3)" }}>{m.emoji}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Context */}
      {round === 1 && (
        <div style={{ background: T.bgMuted, borderRadius: T.r2, padding: "12px 16px", fontSize: 12, color: T.textSec, lineHeight: 1.6, border: `1px solid ${T.border}` }}>
          📋 {scenario.context}
        </div>
      )}

      {/* Crisis banner */}
      {crisisMsg && <div className="fade-up" style={{ background: T.dangerBg, borderRadius: T.r2, padding: "10px 16px", fontSize: 13, fontWeight: 700, color: T.danger, textAlign: "center", border: `1px solid ${T.danger}33` }}>⚡ Crisis: {crisisMsg}</div>}

      {/* Meters — visual bars */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {meterData.map(m => (
          <div key={m.key} style={{ background: T.bgCard, borderRadius: T.r2, padding: "10px 14px", border: `1px solid ${meters[m.key] < 40 ? T.danger + "44" : T.border}`, transition: "border-color 0.3s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 6 }}>
              <span style={{ fontWeight: 600, color: T.text }}>{m.emoji} {m.label}</span>
              <span style={{ fontWeight: 800, color: meters[m.key] < 40 ? T.danger : m.color, fontFamily: "'JetBrains Mono', monospace" }}>{meters[m.key]}%</span>
            </div>
            <div style={{ height: 8, background: T.bgMuted, borderRadius: 8, position: "relative" }}>
              {/* Danger zone marker at 40% */}
              <div style={{ position: "absolute", left: "40%", top: -1, bottom: -1, width: 2, background: T.danger + "40", borderRadius: 2 }} />
              <div style={{ height: "100%", borderRadius: 8, background: meters[m.key] < 40 ? T.danger : m.color, width: `${meters[m.key]}%`, transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Policy options — qualitative hints instead of exact numbers */}
      {!pendingPolicy && (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.textSec }}>Choose a policy for this round:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {roundPolicies.map((p, i) => (
              <button key={i} onClick={() => selectPolicy(p)} className="card-hover card-enter" style={{ "--i": i, padding: "14px 16px", borderRadius: T.r2, background: T.bgCard, border: `1px solid ${T.border}`, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{p.label}</div>
                <div style={{ fontSize: 11, color: T.accent, fontWeight: 600, marginTop: 4, fontStyle: "italic" }}>💡 {p.hint}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Stakeholder reaction + confirm */}
      {pendingPolicy && (
        <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "14px 18px", border: `1px solid ${T.accent}33` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Policy Selected: {pendingPolicy.label}</div>
            <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6 }}>{stakeholderMsg}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setPendingPolicy(null)} style={{ padding: "10px 18px", borderRadius: T.r2, background: T.bgMuted, border: `1px solid ${T.border}`, color: T.textSec, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>← Change Policy</button>
            <button onClick={confirmPolicy} style={{ padding: "10px 24px", borderRadius: T.r2, background: T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", boxShadow: T.shadowAccent }}>Confirm & Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PolicyLabGame;
