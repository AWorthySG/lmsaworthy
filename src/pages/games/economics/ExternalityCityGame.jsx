import React, { useState, useEffect } from 'react';
import { T } from '../../../theme/theme.js';

function ExternalityCityGame() {
  const types = [
    { id: "factory", label: "🏭 Factory", cost: 20, gdp: 15, welfare: -10, desc: "GDP +15, Welfare -10 (pollution)" },
    { id: "school", label: "🏫 School", cost: 25, gdp: -5, welfare: 20, desc: "Welfare +20, GDP -5 (cost)" },
    { id: "park", label: "🌳 Park", cost: 10, gdp: 0, welfare: 15, desc: "Welfare +15 (community)" },
    { id: "house", label: "🏠 Housing", cost: 15, gdp: 5, welfare: 5, desc: "GDP +5, Welfare +5" },
    { id: "hospital", label: "🏥 Hospital", cost: 30, gdp: -5, welfare: 25, desc: "Welfare +25, GDP -5 (high cost)" },
    { id: "mall", label: "🛒 Mall", cost: 20, gdp: 18, welfare: -5, desc: "GDP +18, Welfare -5 (noise)" },
  ];
  const typeMap = Object.fromEntries(types.map(t => [t.id, t]));
  const emojis = { empty: "⬜", factory: "🏭", school: "🏫", park: "🌳", house: "🏠", hospital: "🏥", mall: "🛒" };

  const GRID_SIZE = 4;
  const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

  const rounds = [
    { goal: "Welfare ≥ 30 and GDP ≥ 10 — build a liveable city", checkWelfare: 30, checkGdp: 10, event: null },
    { goal: "GDP ≥ 45 with welfare ≥ 0 — maximize the economy", checkGdp: 45, checkWelfare: 0, event: null },
    { goal: "Balance: GDP ≥ 20 and welfare ≥ 35", checkGdp: 20, checkWelfare: 35, event: { label: "🏭 Industrial pollution doubles! Factory welfare penalty is now -20.", modify: "factory-welfare-double" } },
    { goal: "Welfare ≥ 50 — citizens demand quality of life", checkWelfare: 50, checkGdp: -999, event: { label: "🌱 Green initiative: Parks now give +20 welfare and cost $5.", modify: "park-boost" } },
    { goal: "GDP ≥ 35 AND welfare ≥ 40 — the ultimate city", checkGdp: 35, checkWelfare: 40, event: { label: "🏥 Healthcare crisis: Hospitals now give +35 welfare but cost $35.", modify: "hospital-boost" } },
  ];

  // Policy tools available after round 2
  const policies = [
    { label: "Pollution Tax", desc: "Factories: GDP -5, Welfare +3", icon: "💨", applyFn: (stats) => ({ gdp: stats.gdp - 5 * stats.factoryCount, welfare: stats.welfare + 3 * stats.factoryCount }) },
    { label: "Education Subsidy", desc: "Schools cost $10 less", icon: "📚", applyFn: null },
    { label: "Zoning Buffer", desc: "Factory-Housing penalty removed", icon: "🏗️", applyFn: null },
  ];

  const [round, setRound] = useState(0);
  const [grid, setGrid] = useState(Array(TOTAL_CELLS).fill("empty"));
  const [budget, setBudget] = useState(120);
  const [selectedType, setSelectedType] = useState("factory");
  const [roundScores, setRoundScores] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [activePolicy, setActivePolicy] = useState(null);
  const [discoveries, setDiscoveries] = useState([]); // discovered adjacency effects

  const currentRound = rounds[round];
  const done = round >= rounds.length;

  // Modified type stats based on round events
  function getTypeStats(id) {
    const base = { ...typeMap[id] };
    if (currentRound?.event?.modify === "factory-welfare-double" && id === "factory") base.welfare = -20;
    if (currentRound?.event?.modify === "park-boost" && id === "park") { base.welfare = 20; base.cost = 5; }
    if (currentRound?.event?.modify === "hospital-boost" && id === "hospital") { base.welfare = 35; base.cost = 35; }
    return base;
  }

  function getAdjacent(idx) {
    const adj = [];
    const row = Math.floor(idx / GRID_SIZE);
    const col = idx % GRID_SIZE;
    if (row > 0) adj.push(idx - GRID_SIZE);
    if (row < GRID_SIZE - 1) adj.push(idx + GRID_SIZE);
    if (col > 0) adj.push(idx - 1);
    if (col < GRID_SIZE - 1) adj.push(idx + 1);
    return adj;
  }

  function calcStats(g) {
    let gdp = 0, welfare = 0, factoryCount = 0;
    g.forEach((cell, idx) => {
      if (cell === "empty") return;
      const t = getTypeStats(cell);
      gdp += t.gdp;
      welfare += t.welfare;
      if (cell === "factory") factoryCount++;
      const neighbors = getAdjacent(idx);
      neighbors.forEach(ni => {
        // Known adjacency bonuses
        if (cell === "park" && g[ni] === "school") welfare += 2.5;
        if (cell === "school" && g[ni] === "park") welfare += 2.5;
        if (activePolicy !== "Zoning Buffer") {
          if (cell === "factory" && g[ni] === "house") welfare -= 2.5;
          if (cell === "house" && g[ni] === "factory") welfare -= 2.5;
        }
        // Hidden adjacency: Hospital next to Housing = +3 welfare
        if (cell === "hospital" && g[ni] === "house") welfare += 1.5;
        if (cell === "house" && g[ni] === "hospital") welfare += 1.5;
        // Hidden: Mall next to Mall = -3 GDP (competition)
        if (cell === "mall" && g[ni] === "mall") gdp -= 1.5;
        // Hidden: 2 factories adjacent = -3 extra welfare (pollution cluster)
        if (cell === "factory" && g[ni] === "factory") welfare -= 1.5;
      });
    });
    // Apply active policy
    if (activePolicy === "Pollution Tax") { gdp -= 5 * factoryCount; welfare += 3 * factoryCount; }
    return { gdp: Math.round(gdp), welfare: Math.round(welfare), factoryCount };
  }

  const stats = calcStats(grid);

  function placeBuilding(idx) {
    if (submitted) return;
    if (grid[idx] !== "empty") {
      const removedType = grid[idx];
      setGrid(g => { const n = [...g]; n[idx] = "empty"; return n; });
      setBudget(b => b + getTypeStats(removedType).cost);
      return;
    }
    const t = getTypeStats(selectedType);
    if (budget < t.cost) return;
    setGrid(g => { const n = [...g]; n[idx] = selectedType; return n; });
    setBudget(b => b - t.cost);

    // Check for hidden adjacency discoveries
    const neighbors = getAdjacent(idx);
    neighbors.forEach(ni => {
      if (selectedType === "hospital" && grid[ni] === "house" && !discoveries.includes("hospital-house")) {
        setDiscoveries(d => [...d, "hospital-house"]);
      }
      if (selectedType === "mall" && grid[ni] === "mall" && !discoveries.includes("mall-mall")) {
        setDiscoveries(d => [...d, "mall-mall"]);
      }
      if (selectedType === "factory" && grid[ni] === "factory" && !discoveries.includes("factory-factory")) {
        setDiscoveries(d => [...d, "factory-factory"]);
      }
    });
  }

  function submitRound() {
    const s = calcStats(grid);
    const passed = s.gdp >= (currentRound.checkGdp || -999) && s.welfare >= currentRound.checkWelfare;
    setRoundScores(rs => [...rs, passed]);
    setSubmitted(true);
  }

  function nextRound() {
    setRound(r => r + 1);
    setGrid(Array(TOTAL_CELLS).fill("empty"));
    setBudget(120);
    setSelectedType("factory");
    setSubmitted(false);
    setActivePolicy(null);
  }

  const totalPassed = roundScores.filter(Boolean).length;

  if (done) {
    const grade = totalPassed >= 5 ? "S" : totalPassed >= 4 ? "A" : totalPassed >= 3 ? "B" : totalPassed >= 2 ? "C" : "D";
    const gradeColors = { S: "#D4A24C", A: "#3D9470", B: "#4A7CB8", C: "#C49030", D: "#C04848" };
    return (
      <div className="scale-pop" style={{ background: T.bgCard, borderRadius: T.r3, padding: "36px 28px", textAlign: "center", border: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 30%, ${gradeColors[grade]}15, transparent 60%)` }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏙️</div>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: gradeColors[grade] + "22", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: `3px solid ${gradeColors[grade]}44` }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: gradeColors[grade], fontFamily: "'Bricolage Grotesque', sans-serif" }}>{grade}</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: T.text }}>{totalPassed} / 5</div>
          <div style={{ fontSize: 14, color: T.textSec, marginTop: 4 }}>rounds completed · {discoveries.length} adjacency effects discovered</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
            {roundScores.map((passed, i) => (
              <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: passed ? T.successBg : T.dangerBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, border: `1px solid ${passed ? T.success + "33" : T.danger + "33"}` }}>
                {passed ? "✅" : "❌"}
              </div>
            ))}
          </div>
          {discoveries.length > 0 && (
            <div style={{ marginTop: 12, textAlign: "left" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, marginBottom: 6 }}>🔬 Discovered Effects:</div>
              {discoveries.includes("hospital-house") && <div style={{ fontSize: 11, color: T.text, marginBottom: 2 }}>🏥+🏠 Hospital near Housing = +3 welfare</div>}
              {discoveries.includes("mall-mall") && <div style={{ fontSize: 11, color: T.text, marginBottom: 2 }}>🛒+🛒 Adjacent Malls = -3 GDP (competition)</div>}
              {discoveries.includes("factory-factory") && <div style={{ fontSize: 11, color: T.text, marginBottom: 2 }}>🏭+🏭 Factory cluster = -3 extra welfare (pollution compounds)</div>}
            </div>
          )}
          <div style={{ marginTop: 12, padding: "10px 14px", background: T.accentLight, borderRadius: T.r2, fontSize: 11, color: T.accentText, textAlign: "left", lineHeight: 1.6 }}>
            📝 <strong>H1 Exam Tip:</strong> Externalities compound when activities cluster (pollution zones). Government tools like Pigouvian taxes internalise the externality by making polluters pay the social cost — exactly what the Pollution Tax policy does in this game.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* HUD */}
      <div className="grain" style={{ background: "linear-gradient(135deg, #1A3030, #2B5B4B)", borderRadius: T.r3, padding: "14px 20px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>Externality City · Round {round + 1}/5</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{currentRound.goal}</div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {roundScores.map((passed, i) => (
            <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", background: passed ? "#51cf6644" : "#ff6b6b44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8 }}>{passed ? "✓" : "✗"}</div>
          ))}
        </div>
      </div>

      {/* Event banner */}
      {currentRound.event && (
        <div className="fade-up" style={{ background: T.warningBg, borderRadius: T.r2, padding: "10px 14px", fontSize: 12, fontWeight: 700, color: T.warning, textAlign: "center", border: `1px solid ${T.warning}33` }}>
          ⚡ {currentRound.event.label}
        </div>
      )}

      {/* Discovery notification */}
      {discoveries.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {discoveries.map(d => (
            <span key={d} className="scale-pop" style={{ fontSize: 10, fontWeight: 700, color: "#7268C0", background: "#F0EDFF", padding: "2px 8px", borderRadius: 20, border: "1px solid #7268C022" }}>
              🔬 {d === "hospital-house" ? "🏥+🏠 = +3 welfare" : d === "mall-mall" ? "🛒+🛒 = -3 GDP" : "🏭+🏭 = -3 welfare"}
            </span>
          ))}
        </div>
      )}

      {/* Stats + Budget */}
      <div style={{ display: "flex", gap: 6 }}>
        {[
          { label: "Budget", value: `$${budget}`, color: "#D4A24C", emoji: "💰" },
          { label: "GDP", value: stats.gdp, color: "#4A7CB8", emoji: "📊", target: currentRound.checkGdp > -999 ? currentRound.checkGdp : null },
          { label: "Welfare", value: stats.welfare, color: "#3D9470", emoji: "❤️", target: currentRound.checkWelfare },
        ].map(m => (
          <div key={m.label} style={{ flex: 1, background: T.bgCard, borderRadius: T.r2, padding: "8px", textAlign: "center", border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: T.textTer }}>{m.emoji} {m.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: m.color, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{m.value}</div>
            {m.target != null && <div style={{ fontSize: 8, color: typeof m.value === "number" && m.value >= m.target ? T.success : T.textTer }}>≥{m.target}</div>}
          </div>
        ))}
      </div>

      {/* Building selector */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {types.map(t => {
          const ts = getTypeStats(t.id);
          return (
            <button key={t.id} onClick={() => setSelectedType(t.id)} style={{ padding: "6px 10px", borderRadius: T.r2, border: `2px solid ${selectedType === t.id ? T.accent : T.border}`, background: selectedType === t.id ? T.accentLight : T.bgCard, cursor: "pointer", fontSize: 11, fontWeight: 600, color: T.text }}>
              {emojis[t.id]} ${ts.cost}
            </button>
          );
        })}
      </div>

      {/* 4x4 City grid */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gap: 4 }}>
        {grid.map((cell, i) => (
          <button key={i} onClick={() => placeBuilding(i)} style={{ aspectRatio: "1", borderRadius: T.r1, border: `2px solid ${cell !== "empty" ? T.accent + "33" : T.border}`, background: cell !== "empty" ? T.bgCard : T.bgMuted, cursor: submitted ? "default" : "pointer", fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", opacity: submitted ? 0.7 : 1 }}>
            {emojis[cell]}
          </button>
        ))}
      </div>

      {/* Policy tools (available from round 3) */}
      {round >= 2 && !submitted && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>🏛️ Government Policy (pick one):</div>
          <div style={{ display: "flex", gap: 6 }}>
            {policies.map(p => (
              <button key={p.label} onClick={() => setActivePolicy(activePolicy === p.label ? null : p.label)}
                style={{ flex: 1, padding: "8px 6px", borderRadius: T.r2, border: `2px solid ${activePolicy === p.label ? T.accent : T.border}`, background: activePolicy === p.label ? T.accentLight : T.bgCard, cursor: "pointer", textAlign: "center", fontSize: 10, fontWeight: 600, color: T.text }}>
                <div style={{ fontSize: 16 }}>{p.icon}</div>
                <div>{p.label}</div>
                <div style={{ fontSize: 9, color: T.textTer }}>{p.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Adjacency info */}
      <div style={{ fontSize: 10, color: T.textTer, lineHeight: 1.6 }}>
        Known: 🌳+🏫 = +5 welfare · 🏭+🏠 = -5 welfare{activePolicy === "Zoning Buffer" && " (removed by policy)"} · More adjacency effects to discover!
      </div>

      {/* Submit / Result */}
      {!submitted ? (
        <button onClick={submitRound} style={{ padding: "10px 24px", borderRadius: T.r5, background: T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", alignSelf: "flex-start" }}>
          Submit Round {round + 1}
        </button>
      ) : (
        <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: roundScores[roundScores.length - 1] ? T.successBg : T.dangerBg, borderRadius: T.r2, padding: "14px 18px", textAlign: "center", border: `1px solid ${roundScores[roundScores.length - 1] ? T.success + "33" : T.danger + "33"}` }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: roundScores[roundScores.length - 1] ? T.success : T.danger }}>
              {roundScores[roundScores.length - 1] ? "🎉 Goal Achieved!" : "Goal Not Met"}
            </div>
            <div style={{ fontSize: 12, color: T.textSec, marginTop: 4 }}>GDP: {stats.gdp} · Welfare: {stats.welfare} · Budget left: ${budget}{activePolicy ? ` · Policy: ${activePolicy}` : ""}</div>
          </div>
          <button onClick={nextRound} style={{ padding: "10px 24px", borderRadius: T.r5, background: T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", alignSelf: "flex-start" }}>
            {round + 1 >= rounds.length ? "See Final Results" : "Next Round →"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ExternalityCityGame;
