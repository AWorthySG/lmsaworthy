import React, { useState } from 'react';
import { T } from '../../../theme/theme.js';

function TonePainterGame() {
  const poems = [
    { title: "November", lines: [
      { text: "The trees stand stripped and silent in the cold,", mood: "melancholy", answer: "blue" },
      { text: "Their branches reaching upward, begging light—", mood: "desperation", answer: "red" },
      { text: "But see, beneath the frost, a crocus bold", mood: "hope", answer: "green" },
      { text: "Pushes through the darkness into sight.", mood: "hope", answer: "green" },
      { text: "We too have weathered storms that stole our song,", mood: "melancholy", answer: "blue" },
      { text: "Yet still we rise, determined to be strong.", mood: "defiance", answer: "red" },
    ]},
    { title: "The Factory", lines: [
      { text: "Iron teeth gnash and grind behind the gates,", mood: "anger", answer: "red" },
      { text: "Where children once played, smoke now fills the air.", mood: "melancholy", answer: "blue" },
      { text: "A single flower cracks the concrete yard,", mood: "hope", answer: "green" },
      { text: "Its yellow petals laughing at despair.", mood: "joy", answer: "gold" },
      { text: "The workers march in silence, fists held tight,", mood: "anger", answer: "red" },
      { text: "Tomorrow they will tear the old walls down.", mood: "hope", answer: "green" },
    ]},
    { title: "Harbour Dawn", lines: [
      { text: "The boats return with nets of gleaming silver,", mood: "joy", answer: "gold" },
      { text: "And gulls cry out above the waking pier.", mood: "melancholy", answer: "blue" },
      { text: "A boy runs barefoot toward his father's arms,", mood: "joy", answer: "gold" },
      { text: "His laughter scattering the morning fear.", mood: "hope", answer: "green" },
      { text: "But one boat drifts with no one at the helm,", mood: "melancholy", answer: "blue" },
    ]},
  ];
  const [poem] = useState(() => poems[Math.floor(Math.random() * poems.length)]);
  const colors = [
    { id: "blue", label: "Melancholy / Sadness", hex: "#3D7DD6", bg: "#EAF2FB" },
    { id: "red", label: "Anger / Desperation", hex: "#E05262", bg: "#FDEFF1" },
    { id: "green", label: "Hope / Renewal", hex: "#3BAA7E", bg: "#EAF6F2" },
    { id: "gold", label: "Joy / Triumph", hex: "#D4940A", bg: "#FFF6ED" },
  ];
  const [brush, setBrush] = useState("blue");
  const [painted, setPainted] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const colorMap = Object.fromEntries(colors.map(c => [c.id, c]));

  function paintLine(i) { if (!submitted) setPainted(p => ({...p, [i]: brush})); }
  function submit() { setSubmitted(true); }
  const score = submitted ? poem.lines.filter((l, i) => painted[i] === l.answer).length : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Color palette */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: T.textSec }}>Brush:</span>
        {colors.map(c => (
          <button key={c.id} onClick={() => setBrush(c.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, border: `2px solid ${brush === c.id ? c.hex : "transparent"}`, background: c.bg, cursor: "pointer", fontSize: 11, fontWeight: 600, color: c.hex }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: c.hex }} /> {c.label}
          </button>
        ))}
      </div>
      {/* Poem */}
      <div style={{ background: "#FFFEF8", borderRadius: T.r3, padding: "28px 26px", border: "1px solid #E8E4D8" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 14, fontStyle: "italic", fontFamily: "'Bricolage Grotesque', sans-serif" }}>{poem.title}</div>
        {poem.lines.map((l, i) => {
          const paintedColor = painted[i] ? colorMap[painted[i]] : null;
          const isCorrect = submitted && painted[i] === l.answer;
          const isWrong = submitted && painted[i] && painted[i] !== l.answer;
          return (
            <div key={i} onClick={() => paintLine(i)} style={{ padding: "6px 12px", marginBottom: 4, borderRadius: 6, cursor: submitted ? "default" : "pointer", background: paintedColor ? paintedColor.bg : "transparent", borderLeft: paintedColor ? `3px solid ${paintedColor.hex}` : "3px solid transparent", transition: "all 0.2s" }}>
              <span style={{ fontSize: 15, color: T.text, lineHeight: 1.8 }}>{l.text}</span>
              {submitted && <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: isCorrect ? T.success : isWrong ? T.danger : T.textTer }}>{isCorrect ? "✓" : isWrong ? `✗ (${l.mood})` : `— ${l.mood}`}</span>}
            </div>
          );
        })}
      </div>
      {!submitted ? (
        <button onClick={submit} disabled={Object.keys(painted).length < poem.lines.length} style={{ padding: "10px 24px", borderRadius: T.r5, background: Object.keys(painted).length >= poem.lines.length ? T.gradPrimary : T.bgMuted, color: Object.keys(painted).length >= poem.lines.length ? "#fff" : T.textTer, fontWeight: 700, fontSize: 13, border: "none", cursor: Object.keys(painted).length >= poem.lines.length ? "pointer" : "not-allowed", alignSelf: "flex-start" }}>Submit Analysis</button>
      ) : (
        <div className="scale-pop" style={{ background: T.bgMuted, borderRadius: T.r3, padding: "20px", color: T.text, border: `1px solid ${T.border}`, textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{score}/{poem.lines.length}</div>
          <div style={{ fontSize: 12, color: T.textSec }}>{score === poem.lines.length ? "Perfect tone analysis!" : "Review the mood annotations above."}</div>
        </div>
      )}
    </div>
  );
}

export default TonePainterGame;
