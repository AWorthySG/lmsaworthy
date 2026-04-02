import React, { useState, useEffect, useRef } from 'react';
import { T } from '../../../theme/theme.js';

function StoryArchitectGame() {
  const stories = [
    { title: "The Last Letter", redHerring: { id: 99, text: "Maya's neighbour mentions that the local library is hosting a WWII exhibition next week.", why: "This is a tangential detail — it doesn't advance the plot, reveal character, or create tension." },
      blocks: [
        { id: 1, text: "Maya finds a dusty envelope hidden in her grandmother's wardrobe.", stage: "Exposition", order: 0, why: "It introduces the protagonist and the inciting object — setting the scene for the story." },
        { id: 2, text: "She discovers the letter is addressed to someone called 'R' and contains a secret from WWII.", stage: "Rising Action", order: 1, why: "It raises the stakes and introduces the central mystery that drives the plot forward." },
        { id: 3, text: "Maya tracks down 'R' — an elderly man in a nursing home — who reveals her grandmother was a resistance spy.", stage: "Rising Action", order: 2, why: "It escalates the conflict by deepening the mystery and introducing a new character." },
        { id: 4, text: "The nursing home catches fire. Maya must choose between saving the letter or helping R escape.", stage: "Climax", order: 3, why: "This is the moment of highest tension — an impossible choice that reveals Maya's true character." },
        { id: 5, text: "Maya drops the letter and carries R out. The letter burns, but R whispers: 'She'd have done the same.'", stage: "Falling Action", order: 4, why: "The tension resolves as we learn the consequence of Maya's choice and its emotional payoff." },
        { id: 6, text: "Maya writes her own letter to her grandmother, promising to live with the same courage.", stage: "Resolution", order: 5, why: "It closes the narrative arc with reflection and personal growth — the story comes full circle." },
      ]},
    { title: "The Bridge", redHerring: { id: 99, text: "Kai reads about a historical bridge in another country that was built to unite two kingdoms.", why: "This is a thematic parallel but not a scene in THIS story — it doesn't involve the characters or advance the plot." },
      blocks: [
        { id: 1, text: "Kai lives in a divided city where two communities have not spoken in decades.", stage: "Exposition", order: 0, why: "It establishes the setting and the central conflict (a divided community)." },
        { id: 2, text: "He discovers an old tunnel connecting both sides and begins secretly visiting the other community.", stage: "Rising Action", order: 1, why: "The protagonist takes action — the tunnel symbolises the first step toward resolution." },
        { id: 3, text: "Kai befriends Lina from the other side, and together they plan a shared festival to reunite the city.", stage: "Rising Action", order: 2, why: "The stakes escalate — Kai is now committed, and a plan creates narrative momentum." },
        { id: 4, text: "On festival day, elders from both sides confront Kai and demand he choose a side or face exile.", stage: "Climax", order: 3, why: "Maximum tension — Kai faces the ultimate consequence of his actions with no easy escape." },
        { id: 5, text: "Lina reveals the elders themselves were childhood friends, separated by the same division.", stage: "Falling Action", order: 4, why: "The revelation reframes the conflict — it's the emotional turning point toward resolution." },
        { id: 6, text: "The elders embrace, the festival continues, and the tunnel becomes a public bridge.", stage: "Resolution", order: 5, why: "The conflict is fully resolved with symbolic transformation — division becomes connection." },
      ]},
  ];
  const [story] = useState(() => stories[Math.floor(Math.random() * stories.length)]);
  // Include red herring in the pool
  const [shuffled] = useState(() => [...story.blocks, story.redHerring].sort(() => Math.random() - 0.5));
  const [placed, setPlaced] = useState([]);
  const [discarded, setDiscarded] = useState(null); // red herring detection
  const [justifyIdx, setJustifyIdx] = useState(null); // which slot to justify
  const [justifyAnswer, setJustifyAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const timerRef = useRef(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const stages = ["Exposition", "Rising Action", "Rising Action", "Climax", "Falling Action", "Resolution"];
  const stageColors = { Exposition: "#3D7DD6", "Rising Action": "#EF8354", Climax: "#E05262", "Falling Action": "#D4940A", Resolution: "#3BAA7E" };

  // Start timer on first interaction
  function startTimer() {
    if (timerStarted) return;
    setTimerStarted(true);
    timerRef.current = setInterval(() => setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); return 0; } return t - 1; }), 1000);
  }
  useEffect(() => () => clearInterval(timerRef.current), []);

  function placeBlock(block) {
    startTimer();
    if (placed.find(b => b.id === block.id)) return;
    if (placed.length >= 6) return;
    setPlaced(p => [...p, block]);
  }
  function discardBlock(block) {
    startTimer();
    setDiscarded(block);
  }
  function removeBlock(idx) { setPlaced(p => p.filter((_, i) => i !== idx)); }
  const available = shuffled.filter(b => !placed.find(p => p.id === b.id) && discarded?.id !== b.id);
  const done = placed.length === stages.length;
  const correct = placed.filter((b, i) => b.order === i).length;
  const redHerringCorrect = discarded?.id === story.redHerring.id;
  const timeBonus = done && timeLeft > 60 ? 2 : done && timeLeft > 30 ? 1 : 0;
  const totalScore = correct + (redHerringCorrect ? 2 : 0) + timeBonus;
  const maxScore = stages.length + 2 + 2; // placement + red herring + time bonus
  const grade = totalScore >= 9 ? "S" : totalScore >= 7 ? "A" : totalScore >= 5 ? "B" : totalScore >= 3 ? "C" : "D";
  const gradeColors = { S: "#D4A254", A: "#3BAA7E", B: "#3D7DD6", C: "#E5A832", D: "#E05262" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* HUD */}
      <div className="grain" style={{ background: "linear-gradient(135deg, #2D1B4A, #4A2060)", borderRadius: T.r3, padding: "14px 20px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>Story: "{story.title}"</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{placed.length}/6 placed{discarded ? " · 1 discarded" : ""}</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {timerStarted && (
            <div style={{ fontSize: 18, fontWeight: 800, color: timeLeft <= 30 ? "#ff6b6b" : timeLeft <= 60 ? "#D4A254" : "rgba(255,255,255,0.8)", fontFamily: "'JetBrains Mono', monospace" }}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </div>
          )}
        </div>
      </div>

      {/* Story arc visual */}
      <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 40, padding: "0 4px" }}>
        {stages.map((stage, i) => {
          const heights = [20, 28, 32, 40, 28, 18]; // arc shape
          const block = placed[i];
          return (
            <div key={i} style={{ flex: 1, height: heights[i], background: block ? stageColors[stage] + "40" : T.bgMuted, borderRadius: "4px 4px 0 0", transition: "all 0.3s", position: "relative" }}>
              {block && <div style={{ position: "absolute", top: -4, left: "50%", transform: "translateX(-50%)", width: 8, height: 8, borderRadius: "50%", background: stageColors[stage] }} />}
            </div>
          );
        })}
      </div>

      {/* Story arc slots */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {stages.map((stage, i) => {
          const block = placed[i];
          const isCorrect = block && block.order === i;
          return (
            <div key={i} onClick={() => block && !done && removeBlock(i)} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: block ? (isCorrect && done ? "#EAF6F2" : T.bgCard) : T.bgMuted, borderRadius: T.r2, padding: "10px 12px", border: `1px solid ${block ? (isCorrect && done ? T.success + "44" : T.border) : "transparent"}`, minHeight: 44, cursor: block && !done ? "pointer" : "default", transition: "all 0.2s" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: stageColors[stage] + "18", color: stageColors[stage], fontWeight: 800, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `2px solid ${stageColors[stage]}33` }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: stageColors[stage], textTransform: "uppercase", letterSpacing: 0.5 }}>{stage}</div>
                {block ? <div style={{ fontSize: 12, color: T.text, lineHeight: 1.5 }}>{block.text}</div> : <div style={{ fontSize: 11, color: T.textTer, fontStyle: "italic" }}>Empty</div>}
              </div>
              {done && block && <span style={{ fontSize: 12 }}>{isCorrect ? "✅" : "❌"}</span>}
              {done && block && !isCorrect && <span style={{ fontSize: 9, color: T.textTer }}>{block.stage}</span>}
            </div>
          );
        })}
      </div>

      {/* Available blocks + discard option */}
      {available.length > 0 && !done && (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: T.textSec }}>Available scenes:</span>
            <span style={{ fontSize: 10, color: T.danger, fontWeight: 600 }}>⚠️ One scene is a red herring!</span>
          </div>
          {available.map(b => (
            <div key={b.id} style={{ display: "flex", gap: 6 }}>
              <button onClick={() => placeBlock(b)} className="card-hover" style={{ flex: 1, padding: "10px 12px", borderRadius: T.r2, background: T.bgCard, border: `1px solid ${T.border}`, cursor: "pointer", textAlign: "left", fontSize: 12, color: T.text, lineHeight: 1.5 }}>{b.text}</button>
              <button onClick={() => discardBlock(b)} title="Discard as red herring" style={{ width: 36, borderRadius: T.r2, background: T.dangerBg, border: `1px solid ${T.danger}33`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🗑️</button>
            </div>
          ))}
        </div>
      )}

      {/* Discarded block */}
      {discarded && !done && (
        <div style={{ background: T.dangerBg, borderRadius: T.r2, padding: "8px 14px", fontSize: 12, color: T.danger, display: "flex", alignItems: "center", gap: 8 }}>
          <span>🗑️ Discarded: "{discarded.text.slice(0, 50)}..."</span>
          <button onClick={() => setDiscarded(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, color: T.accent }}>Undo</button>
        </div>
      )}

      {/* Results */}
      {done && (
        <div className="scale-pop" style={{ background: T.bgCard, borderRadius: T.r3, padding: "28px", textAlign: "center", border: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 30%, ${gradeColors[grade]}15, transparent 60%)` }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: gradeColors[grade] + "22", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", border: `3px solid ${gradeColors[grade]}44` }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: gradeColors[grade], fontFamily: "'Bricolage Grotesque', sans-serif" }}>{grade}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{totalScore} / {maxScore}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 8, fontSize: 11, color: T.textSec }}>
              <span>Arc: {correct}/6</span>
              <span>Red herring: {redHerringCorrect ? "✅" : "❌"}</span>
              <span>Time bonus: +{timeBonus}</span>
            </div>
            {!redHerringCorrect && discarded && (
              <div style={{ marginTop: 10, padding: "8px 14px", background: T.dangerBg, borderRadius: T.r2, fontSize: 11, color: T.danger, textAlign: "left" }}>
                🗑️ You discarded a real scene! The red herring was: "{story.redHerring.text}" — {story.redHerring.why}
              </div>
            )}
            {redHerringCorrect && (
              <div style={{ marginTop: 10, padding: "8px 14px", background: T.successBg, borderRadius: T.r2, fontSize: 11, color: T.success, textAlign: "left" }}>
                🎯 Correct! "{story.redHerring.text}" — {story.redHerring.why}
              </div>
            )}
            {/* Why each scene belongs */}
            <div style={{ marginTop: 12, textAlign: "left" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, marginBottom: 6 }}>Why each scene belongs:</div>
              {story.blocks.map((b, i) => (
                <div key={b.id} style={{ fontSize: 11, color: T.text, lineHeight: 1.6, marginBottom: 4, paddingLeft: 12, borderLeft: `2px solid ${stageColors[b.stage]}44` }}>
                  <strong style={{ color: stageColors[b.stage] }}>{b.stage}:</strong> {b.why}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: "10px 14px", background: T.accentLight, borderRadius: T.r2, fontSize: 11, color: T.accentText, textAlign: "left", lineHeight: 1.6 }}>
              📝 <strong>O-Level Tip:</strong> In narrative writing, every scene must serve a purpose: advance the plot, reveal character, or build tension. Irrelevant content (like the red herring) loses marks — examiners call this "padding."
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StoryArchitectGame;
