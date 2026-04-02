import React, { useState } from 'react';
import { T } from '../../../theme/theme.js';

function DeviceSpotterGame() {
  const passages = [
    { text: "The wind whispered secrets through the ancient oaks, while the sky wept silver tears upon the sleeping village below. Time crawled forward like a wounded beast, dragging the heavy silence behind it.", devices: [
      { phrase: "wind whispered", device: "Personification", explain: "Wind can't whisper — human quality given to nature." },
      { phrase: "sky wept", device: "Personification", explain: "The sky is given the human ability to cry." },
      { phrase: "silver tears", device: "Metaphor", explain: "Rain described as tears — not literally tears." },
      { phrase: "sleeping village", device: "Personification", explain: "A village can't literally sleep." },
      { phrase: "Time crawled forward like a wounded beast", device: "Simile", explain: "'Like a wounded beast' — explicit comparison using 'like'." },
    ]},
    { text: "The thunder grumbled its displeasure across the bruised sky, and a million needles of rain hammered the rooftops. The brave little boat bobbed on the bitter, boiling sea like a cork in a cauldron.", devices: [
      { phrase: "thunder grumbled", device: "Personification", explain: "Thunder cannot grumble — it is given a human expression of annoyance." },
      { phrase: "bruised sky", device: "Metaphor", explain: "The sky is not literally bruised; it describes dark purple-grey storm clouds." },
      { phrase: "million needles of rain", device: "Hyperbole", explain: "Exaggeration — there are not literally a million needles; it emphasises the intensity of rain." },
      { phrase: "hammered the rooftops", device: "Onomatopoeia", explain: "'Hammered' evokes the loud, percussive sound of heavy rain striking surfaces." },
      { phrase: "brave little boat bobbed on the bitter, boiling", device: "Alliteration", explain: "Repeated 'b' sounds create a rhythmic, driving effect." },
      { phrase: "like a cork in a cauldron", device: "Simile", explain: "Explicit comparison using 'like' — the boat is compared to a helpless cork." },
    ]},
    { text: "The moon poured liquid silver over the sleeping fields, and the ancient oak stretched its weary arms toward the heavens. Silence screamed in the hollow darkness, as sharp as a blade against bare skin.", devices: [
      { phrase: "liquid silver", device: "Metaphor", explain: "Moonlight is described as liquid silver — not literally silver." },
      { phrase: "sleeping fields", device: "Personification", explain: "Fields cannot sleep — the human quality of rest is given to the landscape." },
      { phrase: "ancient oak stretched its weary arms", device: "Personification", explain: "The tree is given human tiredness and the action of stretching arms." },
      { phrase: "Silence screamed", device: "Oxymoron", explain: "Silence and screaming are contradictory — a deliberate paradox for effect." },
      { phrase: "as sharp as a blade against bare skin", device: "Simile", explain: "Explicit comparison using 'as...as' to convey the cutting quality of the silence." },
    ]},
    { text: "Her laughter was a cascade of bells ringing through the crowded corridor, and every face turned toward her magnetic glow. She was the sun around which all the pale planets orbited, impossibly bright, impossibly warm.", devices: [
      { phrase: "laughter was a cascade of bells", device: "Metaphor", explain: "Laughter is directly described as bells — not a literal comparison but an identity." },
      { phrase: "crowded corridor", device: "Alliteration", explain: "Repeated 'c' sounds link the words rhythmically." },
      { phrase: "magnetic glow", device: "Metaphor", explain: "A person does not literally have a magnetic glow — it implies irresistible attraction." },
      { phrase: "She was the sun", device: "Metaphor", explain: "She is identified as the sun — an implied comparison without 'like' or 'as'." },
      { phrase: "impossibly bright, impossibly warm", device: "Hyperbole", explain: "Exaggeration — no person is literally impossibly bright or warm." },
    ]},
  ];
  const [passage] = useState(() => passages[Math.floor(Math.random() * passages.length)]);
  const [found, setFound] = useState([]);
  const [selected, setSelected] = useState(null); // index of device to identify
  const [showResult, setShowResult] = useState(null);
  const deviceTypes = ["Metaphor", "Simile", "Personification", "Hyperbole", "Irony", "Alliteration", "Oxymoron", "Onomatopoeia"];

  function clickPhrase(idx) {
    if (found.includes(idx)) return;
    setSelected(idx);
    setShowResult(null);
  }
  function chooseDevice(device) {
    if (selected === null) return;
    const correct = passage.devices[selected].device === device;
    setShowResult({ idx: selected, correct, actual: passage.devices[selected].device, explain: passage.devices[selected].explain });
    if (correct) setFound(f => [...f, selected]);
    setTimeout(() => { setSelected(null); setShowResult(null); }, 2500);
  }
  const done = found.length === passage.devices.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: T.textSec }}>Found: {found.length} / {passage.devices.length} devices</span>
        {done && <span className="scale-pop" style={{ fontSize: 12, fontWeight: 700, color: T.success }}>🎉 All found!</span>}
      </div>
      <div style={{ height: 6, background: T.bgMuted, borderRadius: 8 }}><div style={{ height: "100%", background: T.success, borderRadius: 8, width: `${(found.length / passage.devices.length) * 100}%`, transition: "width 0.4s" }} /></div>
      {/* Passage with clickable phrases */}
      <div style={{ background: "#FFFEF8", borderRadius: T.r3, padding: "24px", border: "1px solid #E8E4D8", lineHeight: 2.2, fontSize: 15, color: T.text }}>
        {(() => {
          let text = passage.text;
          let parts = [];
          let lastIdx = 0;
          passage.devices.forEach((d, i) => {
            const start = text.indexOf(d.phrase, lastIdx);
            if (start === -1) return;
            if (start > lastIdx) parts.push({ type: "text", content: text.slice(lastIdx, start) });
            parts.push({ type: "device", content: d.phrase, idx: i });
            lastIdx = start + d.phrase.length;
          });
          if (lastIdx < text.length) parts.push({ type: "text", content: text.slice(lastIdx) });
          return parts.map((p, i) => p.type === "text" ? <span key={i}>{p.content}</span> : (
            <span key={i} onClick={() => clickPhrase(p.idx)} style={{ background: found.includes(p.idx) ? "#EAF6F2" : selected === p.idx ? "#FFF3ED" : "rgba(239,131,84,0.06)", borderRadius: 4, padding: "2px 4px", cursor: found.includes(p.idx) ? "default" : "pointer", border: found.includes(p.idx) ? `1px solid ${T.success}44` : selected === p.idx ? `1px solid ${T.accent}` : "1px solid transparent", fontWeight: found.includes(p.idx) ? 600 : 400, color: found.includes(p.idx) ? T.success : T.text, transition: "all 0.2s" }}>{p.content} {found.includes(p.idx) && "✓"}</span>
          ));
        })()}
      </div>
      {/* Device selector */}
      {selected !== null && !showResult && (
        <div className="fade-up" style={{ background: T.bgCard, borderRadius: T.r2, padding: "14px", border: `1px solid ${T.accent}33` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.accent, marginBottom: 8 }}>What device is "{passage.devices[selected].phrase}"?</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {deviceTypes.map(d => (
              <button key={d} onClick={() => chooseDevice(d)} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${T.border}`, background: T.bgCard, cursor: "pointer", fontSize: 12, fontWeight: 600, color: T.text }}>{d}</button>
            ))}
          </div>
        </div>
      )}
      {showResult && (
        <div className="scale-pop" style={{ background: showResult.correct ? T.successBg : T.dangerBg, borderRadius: T.r2, padding: "12px 16px", border: `1px solid ${showResult.correct ? T.success : T.danger}33` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: showResult.correct ? T.success : T.danger }}>{showResult.correct ? "✓ Correct!" : `✗ It's ${showResult.actual}`}</div>
          <div style={{ fontSize: 12, color: T.text, marginTop: 4 }}>{showResult.explain}</div>
        </div>
      )}
    </div>
  );
}

export default DeviceSpotterGame;
