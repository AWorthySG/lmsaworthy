import React, { useState } from 'react';
import { T } from '../../theme/theme.js';
import { Eye } from '../../icons/icons.jsx';
import { VOCAB_DRILLS } from '../../data/vocabDrills.js';

function VocabBuilder() {
  const [mode, setMode] = useState("hub"); // hub | quiz | upgrade | results
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(null); // index of selected option
  const [filterCat, setFilterCat] = useState(null);
  const [drillType, setDrillType] = useState("synonym"); // synonym | upgrade
  const categories = [...new Set(VOCAB_DRILLS.map(v => v.cat))];

  function startQuiz(type) {
    const filtered = filterCat ? VOCAB_DRILLS.filter(v => v.cat === filterCat) : VOCAB_DRILLS;
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrent(0);
    setScore(0);
    setAnswered(null);
    setDrillType(type);
    setMode("quiz");
  }

  function answer(idx) {
    if (answered !== null) return;
    setAnswered(idx);
    if (idx === cards[current].correct) setScore(s => s + 1);
  }

  function next() {
    if (current + 1 >= cards.length) { setMode("results"); return; }
    setCurrent(c => c + 1);
    setAnswered(null);
  }

  const pct = cards.length > 0 ? Math.round((score / cards.length) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 96px)", gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #1A1816, #3D3832)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Vocabulary Builder</h1>
        <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0", fontWeight: 400 }}>Master tone words, discourse markers, and evaluative language for Papers 1 & 2</p>
      </div>

      {mode === "hub" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 560 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button onClick={() => setFilterCat(null)} style={{ padding: "5px 12px", borderRadius: 20, border: `2px solid ${!filterCat ? T.accent : T.border}`, background: !filterCat ? T.accentLight : T.bgCard, color: !filterCat ? T.accent : T.textSec, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>All ({VOCAB_DRILLS.length})</button>
            {categories.map(cat => {
              const count = VOCAB_DRILLS.filter(v => v.cat === cat).length;
              return (
                <button key={cat} onClick={() => setFilterCat(cat)} style={{ padding: "5px 12px", borderRadius: 20, border: `2px solid ${filterCat === cat ? T.accent : T.border}`, background: filterCat === cat ? T.accentLight : T.bgCard, color: filterCat === cat ? T.accent : T.textSec, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>{cat} ({count})</button>
              );
            })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button onClick={() => startQuiz("synonym")} style={{ padding: "20px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgCard, cursor: "pointer", textAlign: "left" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>🎯</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>Synonym Match</div>
              <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.5 }}>Given a word, pick the closest synonym. Tests comprehension and vocabulary range.</div>
            </button>
            <button onClick={() => startQuiz("upgrade")} style={{ padding: "20px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgCard, cursor: "pointer", textAlign: "left" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>⬆️</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>Upgrade Your Phrase</div>
              <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.5 }}>See the weak version and the strong upgrade. Learn how to elevate your language.</div>
            </button>
          </div>
        </div>
      )}

      {mode === "quiz" && cards[current] && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 520 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.textSec }}>
            <span>{current + 1} / {cards.length}</span>
            <span style={{ fontWeight: 700, color: T.success }}>{score} correct</span>
          </div>
          <div style={{ height: 4, background: T.bgMuted, borderRadius: 8 }}>
            <div style={{ height: "100%", background: T.accent, borderRadius: 8, width: `${((current + 1) / cards.length) * 100}%`, transition: "width 0.3s" }} />
          </div>

          {drillType === "synonym" ? (
            <>
              <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "20px", border: `1px solid ${T.border}`, textAlign: "center" }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: T.accent, background: T.accentLight, padding: "2px 8px", borderRadius: 20, textTransform: "uppercase" }}>{cards[current].cat}</span>
                <div style={{ fontSize: 28, fontWeight: 800, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif", marginTop: 8 }}>{cards[current].word}</div>
                <div style={{ fontSize: 12, color: T.textSec, fontStyle: "italic", marginTop: 4 }}>"{cards[current].context}"</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {cards[current].options.map((opt, i) => {
                  const isCorrect = i === cards[current].correct;
                  const isChosen = answered === i;
                  let bg = T.bgCard, border = T.border, color = T.text;
                  if (answered !== null) {
                    if (isCorrect) { bg = T.successBg; border = T.success; color = T.success; }
                    else if (isChosen) { bg = T.dangerBg; border = T.danger; color = T.danger; }
                  }
                  return (
                    <button key={i} onClick={() => answer(i)} style={{ padding: "10px 14px", borderRadius: T.r1, border: `2px solid ${border}`, background: bg, color, fontWeight: 600, fontSize: 13, cursor: answered !== null ? "default" : "pointer", textAlign: "left" }}>
                      {opt} {answered !== null && isCorrect && " ✓"}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "20px", border: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: T.accent, background: T.accentLight, padding: "2px 8px", borderRadius: 20, textTransform: "uppercase" }}>{cards[current].cat}</span>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginTop: 10, marginBottom: 6 }}>Upgrade this phrase:</div>
                <div style={{ fontSize: 16, color: T.danger, fontStyle: "italic", textDecoration: "line-through", marginBottom: 10 }}>"{cards[current].upgrade.weak}"</div>
                {answered !== null ? (
                  <div style={{ fontSize: 16, fontWeight: 700, color: T.success }}>"{cards[current].upgrade.strong}"</div>
                ) : (
                  <button onClick={() => setAnswered(0)} style={{ padding: "8px 16px", borderRadius: T.r5, background: T.accent, color: "#fff", fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer" }}>
                    <Eye size={14} /> Reveal Upgrade
                  </button>
                )}
                {answered !== null && (
                  <div style={{ marginTop: 10, fontSize: 12, color: T.textSec, lineHeight: 1.6 }}>
                    <span style={{ fontWeight: 700, color: T.text }}>{cards[current].word}</span>: {cards[current].def}
                  </div>
                )}
              </div>
            </>
          )}

          {answered !== null && (
            <button onClick={next} style={{ padding: "10px 24px", borderRadius: T.r5, background: T.accent, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", alignSelf: "flex-start" }}>
              {current + 1 >= cards.length ? "View Results" : "Next"}
            </button>
          )}
        </div>
      )}

      {mode === "results" && (
        <div style={{ maxWidth: 520 }}>
          <div style={{ background: "linear-gradient(120deg, #0F1B3D, #216ef4)", borderRadius: T.r3, padding: "22px 26px", color: "#fff", textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 40, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{pct}%</div>
            <div style={{ fontSize: 14, color: "#C8D8F5" }}>{score} / {cards.length} correct</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => startQuiz(drillType)} style={{ padding: "8px 16px", borderRadius: T.r5, background: T.accent, color: "#fff", fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer" }}>Try Again</button>
            <button onClick={() => setMode("hub")} style={{ padding: "8px 16px", borderRadius: T.r5, background: T.bgMuted, color: T.textSec, fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer" }}>Back</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VocabBuilder;
