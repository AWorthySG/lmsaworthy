import React, { useState } from 'react';
import { T } from '../../../theme/theme.js';

function SceneBreakdownGame() {
  const scenes = [
    {
      text: "Lady Macbeth reads the letter aloud, her eyes blazing. 'Yet do I fear thy nature; it is too full o' th' milk of human kindness.' She paces the chamber, then halts: 'Come, you spirits that tend on mortal thoughts, unsex me here.'",
      characters: [
        { name: "Lady Macbeth", motivations: ["Power", "Ambition"], correctMotivation: "Ambition" },
        { name: "Macbeth (absent)", motivations: ["Loyalty", "Ambition"], correctMotivation: "Ambition" },
      ],
      relationship: "Manipulator \u2192 Manipulated",
      explanation: "Lady Macbeth's ambition drives the scene. She fears Macbeth is \"too full o' th' milk of human kindness\" to act \u2014 revealing her role as the manipulative force behind the murder plot.",
    },
    {
      text: "Piggy clutches the conch and steps forward. 'I got the conch! I got a right to speak!' The boys jeer and throw stones. Ralph watches from the edge, torn between order and survival.",
      characters: [
        { name: "Piggy", motivations: ["Fear", "Duty"], correctMotivation: "Duty" },
        { name: "Ralph", motivations: ["Power", "Duty"], correctMotivation: "Duty" },
      ],
      relationship: "Allies against chaos",
      explanation: "Piggy's insistence on rules and Ralph's wavering commitment to order reveal their shared sense of duty. The conch symbolises democratic authority crumbling under the boys' savagery.",
    },
    {
      text: "Elizabeth stands before Darcy in the rain. 'You are the last man in the world whom I could ever be prevailed upon to marry.' Darcy steps back, pale, his pride shattered by her words.",
      characters: [
        { name: "Elizabeth", motivations: ["Revenge", "Fear"], correctMotivation: "Revenge" },
        { name: "Mr Darcy", motivations: ["Love", "Power"], correctMotivation: "Love" },
      ],
      relationship: "Antagonist \u2192 Humbled lover",
      explanation: "Elizabeth's rejection is fuelled by wounded pride and a desire to retaliate against Darcy's insults. Darcy's motivation is love, but his pride prevents him from expressing it without condescension.",
    },
  ];
  const [scene] = useState(() => scenes[Math.floor(Math.random() * scenes.length)]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const motivationOptions = ["Love", "Ambition", "Fear", "Duty", "Revenge", "Power", "Loyalty"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#FFFEF8", borderRadius: T.r3, padding: "20px 22px", border: "1px solid #E8E4D8", fontSize: 14, color: T.text, lineHeight: 1.8, fontStyle: "italic" }}>"{scene.text}"</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.textSec }}>For each character, select their primary motivation:</div>
      {scene.characters.map((ch, i) => (
        <div key={i} style={{ background: T.bgCard, borderRadius: T.r2, padding: "14px 16px", border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 8 }}>🎭 {ch.name}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {motivationOptions.map(m => {
              const isSelected = answers[ch.name] === m;
              const isCorrect = submitted && m === ch.correctMotivation;
              const isWrong = submitted && isSelected && m !== ch.correctMotivation;
              return (
                <button key={m} onClick={() => !submitted && setAnswers(a => ({...a, [ch.name]: m}))}
                  style={{ padding: "6px 14px", borderRadius: 20, border: `2px solid ${isCorrect ? T.success : isWrong ? T.danger : isSelected ? T.accent : T.border}`, background: isCorrect ? T.successBg : isWrong ? T.dangerBg : isSelected ? T.accentLight : T.bgCard, cursor: submitted ? "default" : "pointer", fontSize: 12, fontWeight: 600, color: isCorrect ? T.success : isWrong ? T.danger : isSelected ? T.accent : T.text }}>{m}</button>
              );
            })}
          </div>
        </div>
      ))}
      {!submitted ? (
        <button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < scene.characters.length} style={{ padding: "10px 24px", borderRadius: T.r5, background: Object.keys(answers).length >= scene.characters.length ? T.gradPrimary : T.bgMuted, color: Object.keys(answers).length >= scene.characters.length ? "#fff" : T.textTer, fontWeight: 700, fontSize: 13, border: "none", cursor: Object.keys(answers).length >= scene.characters.length ? "pointer" : "not-allowed", alignSelf: "flex-start" }}>Analyse Scene</button>
      ) : (
        <div className="fade-up" style={{ background: T.successBg, borderRadius: T.r2, padding: "14px", border: `1px solid ${T.success}33` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.success, marginBottom: 4 }}>Relationship: {scene.relationship}</div>
          <div style={{ fontSize: 12, color: T.text }}>{scene.explanation}</div>
        </div>
      )}
    </div>
  );
}

export default SceneBreakdownGame;
