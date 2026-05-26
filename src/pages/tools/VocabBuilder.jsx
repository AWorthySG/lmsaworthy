import React, { useState, useMemo } from 'react';
import { T } from '../../theme/theme.js';
import { Brain, Target, ArrowFatUp, Eye, CheckCircle, X, MagnifyingGlass, CaretLeft, CaretRight, ArrowLeft, BookOpen } from '../../icons/icons.jsx';
import { VOCAB_DRILLS } from '../../data/vocabDrills.js';
import { initSRCard, calculateNextReview, getReviewQueue, loadSRData, saveSRData } from '../../utils/spacedRepetition.js';
import { PageHeader, EmptyState } from '../../components/ui';

/* ── Category colour palette ── */
const CAT = {
  "Tone Words":          { bg: "#F3E8FF", text: "#6D28D9", accent: "#7C3AED" },
  "Connotation":         { bg: "#FFF7ED", text: "#C2410C", accent: "#EA580C" },
  "Discourse Markers":   { bg: "#F0FDFA", text: "#0F766E", accent: "#0D9488" },
  "Literary Devices":    { bg: "#FFF1F2", text: "#BE123C", accent: "#E11D48" },
  "Paraphrasing":        { bg: "#F0FDF4", text: "#15803D", accent: "#16A34A" },
  "Evaluative Language": { bg: "#FFFBEB", text: "#92400E", accent: "#B45309" },
};
const catColor = (cat) => CAT[cat] || { bg: T.accentLight, text: T.accentText, accent: T.accent };

/* ── Category pill ── */
function CatBadge({ cat, small }) {
  const c = catColor(cat);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: small ? "2px 8px" : "3px 10px", borderRadius: 20, background: c.bg, color: c.text, fontSize: small ? 10 : 11, fontWeight: 700, letterSpacing: 0.2 }}>
      {cat}
    </span>
  );
}

/* ── POS badge ── */
function PosBadge({ pos }) {
  return (
    <span style={{ fontSize: 10, color: T.textTer, background: T.bgMuted, padding: "2px 7px", borderRadius: 10, fontWeight: 600, fontStyle: "italic" }}>{pos}</span>
  );
}

/* ── Progress bar ── */
function ProgBar({ value, total }) {
  return (
    <div style={{ height: 4, background: T.bgMuted, borderRadius: 4, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${(value / total) * 100}%`, background: T.accent, borderRadius: 4, transition: "width 0.3s" }} />
    </div>
  );
}

/* ── Category filter strip ── */
function CatFilter({ value, onChange }) {
  const cats = ["All", ...Object.keys(CAT)];
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {cats.map(cat => {
        const active = value === cat;
        const c = cat === "All" ? null : catColor(cat);
        return (
          <button key={cat} onClick={() => onChange(cat)}
            style={{ padding: "5px 12px", borderRadius: 20, border: `1.5px solid ${active ? (c?.accent || T.accent) : T.border}`, background: active ? (c?.bg || T.accentLight) : T.bg, color: active ? (c?.text || T.accentText) : T.textSec, fontSize: 11, fontWeight: active ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>
            {cat}
          </button>
        );
      })}
    </div>
  );
}

function VocabBuilder() {
  const [mode, setMode] = useState("hub"); // hub | browse | flashcard | quiz | upgrade | results
  const [filterCat, setFilterCat] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // Session state
  const [deck, setDeck] = useState([]);
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [answered, setAnswered] = useState(null); // null | index chosen
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState([]);
  const [drillMode, setDrillMode] = useState("quiz"); // "quiz" | "upgrade" | "flashcard"

  // Spaced repetition — seed the deck on first load if storage is empty
  // (the rating handler persists subsequent changes via saveSRData).
  const [srCards, setSrCards] = useState(() => {
    const existing = loadSRData();
    if (existing.length > 0) return existing;
    return VOCAB_DRILLS.map(v => initSRCard({ id: v.id, word: v.word, def: v.def }));
  });

  const reviewQueue = useMemo(() => getReviewQueue(srCards), [srCards]);
  const dueCount = reviewQueue.length;

  const categories = [...new Set(VOCAB_DRILLS.map(v => v.cat))];

  // SR stats
  const mastered = srCards.filter(c => c.interval >= 21).length;
  const learning = srCards.filter(c => c.repetitions > 0 && c.interval < 21).length;

  /* ── Start a session ── */
  function startSession(type, catFilter) {
    const source = catFilter && catFilter !== "All"
      ? VOCAB_DRILLS.filter(v => v.cat === catFilter)
      : VOCAB_DRILLS;
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    setDeck(shuffled); setPos(0); setScore(0); setMissed([]);
    setAnswered(null); setFlipped(false);
    setDrillMode(type);
    setMode(type === "flashcard" ? "flashcard" : type === "upgrade" ? "upgrade" : "quiz");
  }

  function startSRReview() {
    if (dueCount === 0) return;
    const drillMap = Object.fromEntries(VOCAB_DRILLS.map(v => [v.id, v]));
    const items = reviewQueue.map(sr => drillMap[sr.id]).filter(Boolean);
    if (!items.length) return;
    setDeck(items); setPos(0); setScore(0); setMissed([]);
    setAnswered(null); setFlipped(false);
    setDrillMode("flashcard");
    setMode("flashcard");
  }

  /* ── Flashcard ── */
  function flipCard() { setFlipped(f => !f); }

  function rateSR(quality) {
    const word = deck[pos];
    const updated = srCards.map(sr => sr.id === word.id ? calculateNextReview(sr, quality) : sr);
    setSrCards(updated); saveSRData(updated);
    advanceCard(quality >= 3);
  }

  /* ── Quiz ── */
  function answerQuiz(idx) {
    if (answered !== null) return;
    setAnswered(idx);
    const correct = idx === deck[pos].correct;
    if (correct) setScore(s => s + 1);
    else setMissed(m => [...m, deck[pos]]);
  }

  /* ── Upgrade ── */
  function revealUpgrade() { setAnswered(0); }

  /* ── Advance to next card ── */
  function advanceCard(wasCorrect) {
    if (pos + 1 >= deck.length) { setMode("results"); return; }
    setPos(p => p + 1);
    setAnswered(null); setFlipped(false);
    if (drillMode !== "flashcard" && !wasCorrect && wasCorrect !== undefined) {
      // already tracked in answerQuiz
    }
  }

  const card = deck[pos];
  const totalDrills = deck.length;
  const pct = totalDrills > 0 ? Math.round((score / totalDrills) * 100) : 0;

  /* ── Browse filtered list ── */
  const browsed = useMemo(() => VOCAB_DRILLS.filter(v => {
    if (filterCat !== "All" && v.cat !== filterCat) return false;
    if (search && !v.word.toLowerCase().includes(search.toLowerCase()) && !v.def.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [filterCat, search]);

  /* ── Back to hub ── */
  function goHub() { setMode("hub"); setDeck([]); }

  /* ─────────────────── HUB ─────────────────── */
  if (mode === "hub") return (
    <div>
      <PageHeader title="Vocabulary" subtitle="O-Level English — tone, connotation, discourse and evaluative language" />

      {/* Stats strip */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { label: "Total Words", value: VOCAB_DRILLS.length, color: T.text },
          { label: "Due for Review", value: dueCount, color: dueCount > 0 ? T.accent : T.success },
          { label: "Learning", value: learning, color: "#D97706" },
          { label: "Mastered", value: mastered, color: T.success },
        ].map(s => (
          <div key={s.label} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r2, padding: "12px 20px", minWidth: 100 }}>
            <div style={{ fontSize: 10, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: T.fontDisplay }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* SR due banner */}
      {dueCount > 0 && (
        <button onClick={startSRReview} style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", marginBottom: 16, padding: "14px 20px", borderRadius: T.r2, border: `2px solid ${T.accent}`, background: T.accentLight, cursor: "pointer", textAlign: "left" }}>
          <div style={{ width: 40, height: 40, borderRadius: T.r2, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Brain size={20} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.accent }}>Spaced Repetition Review</div>
            <div style={{ fontSize: 12, color: T.textSec, marginTop: 2 }}>{dueCount} word{dueCount > 1 ? "s" : ""} due — review now for maximum retention</div>
          </div>
          <div style={{ background: T.accent, color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 20 }}>{dueCount} due</div>
        </button>
      )}

      {/* Category filter */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Filter by category</div>
        <CatFilter value={filterCat} onChange={setFilterCat} />
      </div>

      {/* Mode cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
        {[
          { icon: BookOpen, label: "Browse Words", desc: "Search and explore the full word bank", action: () => setMode("browse"), color: T.accent },
          { icon: Brain, label: "Flashcards", desc: "Flip cards to test your recall of definitions", action: () => startSession("flashcard", filterCat), color: "#7C3AED" },
          { icon: Target, label: "Synonym Quiz", desc: "Pick the closest meaning from four options", action: () => startSession("quiz", filterCat), color: "#0D9488" },
          { icon: ArrowFatUp, label: "Upgrade Drill", desc: "Transform weak phrases into precise language", action: () => startSession("upgrade", filterCat), color: "#EA580C" },
        ].map(({ icon: Icon, label, desc, action, color }) => (
          <button key={label} onClick={action}
            style={{ padding: "20px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgCard, cursor: "pointer", textAlign: "left", transition: "box-shadow 0.15s, transform 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = T.shadow; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
            <div style={{ width: 40, height: 40, borderRadius: T.r2, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Icon size={20} color={color} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.5 }}>{desc}</div>
          </button>
        ))}
      </div>
    </div>
  );

  /* ─────────────────── BROWSE ─────────────────── */
  if (mode === "browse") return (
    <div>
      <PageHeader title="Browse Words" subtitle={`${VOCAB_DRILLS.length} words across ${categories.length} categories`}
        action={<button onClick={goHub} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: T.r5, background: T.bgMuted, border: `1px solid ${T.border}`, color: T.textSec, fontSize: 13, fontWeight: 600, cursor: "pointer" }}><ArrowLeft size={14} weight="bold" /> Back</button>} />

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <MagnifyingGlass size={15} color={T.textTer} style={{ position: "absolute", left: 12, top: 11 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search words or definitions…"
            style={{ width: "100%", padding: "9px 12px 9px 36px", borderRadius: T.r1, border: `1px solid ${T.border}`, background: T.bgCard, fontSize: 13, color: T.text, outline: "none", boxSizing: "border-box" }} />
        </div>
        {search && <button onClick={() => setSearch("")} style={{ padding: "8px 12px", borderRadius: T.r1, border: `1px solid ${T.border}`, background: T.bg, color: T.textSec, fontSize: 12, cursor: "pointer" }}>Clear</button>}
      </div>

      <div style={{ marginBottom: 16 }}><CatFilter value={filterCat} onChange={setFilterCat} /></div>

      {browsed.length === 0
        ? <EmptyState icon={BookOpen} message="No words match your search" />
        : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {browsed.map(v => {
              const c = catColor(v.cat);
              const open = expandedId === v.id;
              return (
                <div key={v.id} style={{ background: T.bgCard, borderRadius: T.r2, border: `1px solid ${open ? c.accent : T.border}`, overflow: "hidden", transition: "border-color 0.2s" }}>
                  <button onClick={() => setExpandedId(open ? null : v.id)}
                    style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "14px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 17, fontWeight: 750, color: T.text, fontFamily: T.fontDisplay }}>{v.word}</span>
                      <PosBadge pos={v.pos} />
                      <CatBadge cat={v.cat} small />
                    </div>
                    <span style={{ fontSize: 13, color: T.textSec, flex: 1, textAlign: "left", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.def}</span>
                    <CaretRight size={14} color={T.textTer} style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
                  </button>

                  {open && (
                    <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${T.border}` }}>
                      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Definition</div>
                          <div style={{ fontSize: 14, color: T.text, lineHeight: 1.6 }}>{v.def}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Example</div>
                          <div style={{ fontSize: 13, color: T.textSec, lineHeight: 1.7, fontStyle: "italic" }}>"{v.example}"</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Usage Tip</div>
                          <div style={{ fontSize: 13, color: T.textSec, lineHeight: 1.6 }}>{v.tip}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "10px 14px", background: T.bgMuted, borderRadius: T.r1 }}>
                          <span style={{ fontSize: 11, color: T.textTer, fontWeight: 700 }}>UPGRADE:</span>
                          <span style={{ fontSize: 12, color: T.danger, textDecoration: "line-through" }}>"{v.upgrade.weak}"</span>
                          <span style={{ fontSize: 12, color: T.textTer }}>→</span>
                          <span style={{ fontSize: 12, color: T.success, fontWeight: 650 }}>"{v.upgrade.strong}"</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );

  /* ─────────────────── FLASHCARD ─────────────────── */
  if (mode === "flashcard" && card) {
    const c = catColor(card.cat);
    return (
      <div style={{ maxWidth: 540 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={goHub} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: T.textSec, display: "flex", alignItems: "center" }}><ArrowLeft size={18} /></button>
          <div style={{ flex: 1 }}>
            <ProgBar value={pos + 1} total={totalDrills} />
          </div>
          <span style={{ fontSize: 12, color: T.textTer, fontWeight: 600, whiteSpace: "nowrap" }}>{pos + 1} / {totalDrills}</span>
        </div>

        {/* Flip card */}
        <div style={{ perspective: 1200, width: "100%", marginBottom: 20 }} onClick={flipCard}>
          <div style={{ position: "relative", width: "100%", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", transition: "transform 0.5s ease", cursor: "pointer" }}>

            {/* Front */}
            <div style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", background: T.bgCard, borderRadius: T.r3, border: `1px solid ${T.border}`, padding: "40px 32px", textAlign: "center", minHeight: 260, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, boxShadow: T.shadow }}>
              <CatBadge cat={card.cat} />
              <div style={{ fontSize: 36, fontWeight: 800, color: T.text, fontFamily: T.fontDisplay, letterSpacing: -0.5 }}>{card.word}</div>
              <PosBadge pos={card.pos} />
              <div style={{ fontSize: 13, color: T.textSec, fontStyle: "italic", lineHeight: 1.6, maxWidth: 380 }}>"{card.context}"</div>
              <div style={{ fontSize: 11, color: T.textTer, marginTop: 8 }}>Tap to reveal definition</div>
            </div>

            {/* Back */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", background: c.bg, borderRadius: T.r3, border: `2px solid ${c.accent}`, padding: "32px", minHeight: 260, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, boxShadow: T.shadow }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <CatBadge cat={card.cat} small />
                <PosBadge pos={card.pos} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: c.text, textTransform: "uppercase", letterSpacing: 0.5 }}>Definition</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.text, lineHeight: 1.5 }}>{card.def}</div>
              <div style={{ fontSize: 13, color: T.textSec, fontStyle: "italic", lineHeight: 1.7 }}>"{card.example}"</div>
              <div style={{ fontSize: 12, color: T.textSec, background: "rgba(255,255,255,0.6)", padding: "8px 12px", borderRadius: T.r1, lineHeight: 1.6 }}>{card.tip}</div>
            </div>
          </div>
        </div>

        {/* Rating (only after flip) */}
        {flipped ? (
          <div>
            <div style={{ fontSize: 12, color: T.textTer, marginBottom: 10, textAlign: "center" }}>How well did you know this?</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[
                { q: 0, label: "Again", sub: "Forgot", color: T.danger, bg: T.dangerBg },
                { q: 2, label: "Hard", sub: "Struggled", color: "#D97706", bg: "#FFF7ED" },
                { q: 4, label: "Good", sub: "Got it", color: "#0D9488", bg: "#F0FDFA" },
                { q: 5, label: "Easy", sub: "Confident", color: T.success, bg: T.successBg },
              ].map(opt => (
                <button key={opt.q} onClick={() => rateSR(opt.q)}
                  style={{ padding: "10px 6px", borderRadius: T.r2, border: `2px solid ${opt.color}40`, background: opt.bg, color: opt.color, cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = opt.color}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = opt.color + "40"}>
                  <div style={{ fontSize: 13, fontWeight: 750 }}>{opt.label}</div>
                  <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <button onClick={() => pos > 0 && (setPos(p => p - 1), setFlipped(false))}
              disabled={pos === 0}
              style={{ padding: "8px 16px", borderRadius: T.r5, border: `1px solid ${T.border}`, background: T.bg, color: pos === 0 ? T.textTer : T.text, cursor: pos === 0 ? "default" : "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600 }}>
              <CaretLeft size={14} /> Prev
            </button>
            <button onClick={flipCard}
              style={{ padding: "8px 24px", borderRadius: T.r5, background: T.accent, color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              <Eye size={14} /> Reveal
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ─────────────────── QUIZ (SYNONYM) ─────────────────── */
  if (mode === "quiz" && card) {
    const c = catColor(card.cat);
    const isAnswered = answered !== null;
    return (
      <div style={{ maxWidth: 540 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={goHub} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: T.textSec, display: "flex", alignItems: "center" }}><ArrowLeft size={18} /></button>
          <div style={{ flex: 1 }}><ProgBar value={pos + 1} total={totalDrills} /></div>
          <span style={{ fontSize: 12, color: T.textTer, fontWeight: 600 }}>{pos + 1} / {totalDrills}</span>
          <span style={{ fontSize: 12, color: T.success, fontWeight: 700 }}>{score} ✓</span>
        </div>

        {/* Word card */}
        <div style={{ background: T.bgCard, borderRadius: T.r3, border: `1px solid ${T.border}`, padding: "28px 28px 24px", marginBottom: 14, boxShadow: T.shadow }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <CatBadge cat={card.cat} small />
            <PosBadge pos={card.pos} />
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: T.text, fontFamily: T.fontDisplay, marginBottom: 8, letterSpacing: -0.5 }}>{card.word}</div>
          <div style={{ fontSize: 13, color: T.textSec, fontStyle: "italic", lineHeight: 1.6 }}>"{card.context}"</div>

          {isAnswered && (
            <div style={{ marginTop: 16, padding: "12px 16px", background: T.bgMuted, borderRadius: T.r1, borderLeft: `3px solid ${c.accent}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 4 }}>Definition</div>
              <div style={{ fontSize: 13, color: T.textSec, lineHeight: 1.6 }}>{card.def}</div>
              <div style={{ fontSize: 13, color: T.textSec, fontStyle: "italic", marginTop: 6, lineHeight: 1.6 }}>"{card.example}"</div>
            </div>
          )}
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Which is closest in meaning?</div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {card.options.map((opt, i) => {
            const isCorrect = i === card.correct;
            const isChosen = answered === i;
            let border = T.border, bg = T.bgCard, color = T.text, icon = null;
            if (isAnswered) {
              if (isCorrect) { border = T.success; bg = T.successBg; color = T.success; icon = <CheckCircle size={16} color={T.success} />; }
              else if (isChosen) { border = T.danger; bg = T.dangerBg; color = T.danger; icon = <X size={16} color={T.danger} />; }
              else { color = T.textTer; }
            }
            return (
              <button key={i} onClick={() => answerQuiz(i)} disabled={isAnswered}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: T.r2, border: `2px solid ${border}`, background: bg, color, fontWeight: 600, fontSize: 14, cursor: isAnswered ? "default" : "pointer", textAlign: "left", transition: "all 0.15s" }}>
                <span>{opt}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <button onClick={() => advanceCard(answered === card.correct)}
            style={{ padding: "10px 28px", borderRadius: T.r5, background: T.accent, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
            {pos + 1 >= totalDrills ? "See Results" : "Next →"}
          </button>
        )}
      </div>
    );
  }

  /* ─────────────────── UPGRADE DRILL ─────────────────── */
  if (mode === "upgrade" && card) {
    const c = catColor(card.cat);
    const revealed = answered !== null;
    return (
      <div style={{ maxWidth: 540 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={goHub} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: T.textSec, display: "flex", alignItems: "center" }}><ArrowLeft size={18} /></button>
          <div style={{ flex: 1 }}><ProgBar value={pos + 1} total={totalDrills} /></div>
          <span style={{ fontSize: 12, color: T.textTer, fontWeight: 600 }}>{pos + 1} / {totalDrills}</span>
        </div>

        <div style={{ background: T.bgCard, borderRadius: T.r3, border: `1px solid ${T.border}`, padding: "28px", boxShadow: T.shadow }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            <CatBadge cat={card.cat} small />
            <PosBadge pos={card.pos} />
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Upgrade this phrase</div>

          {/* Weak phrase */}
          <div style={{ padding: "14px 18px", background: T.dangerBg, borderRadius: T.r2, marginBottom: 16, borderLeft: `3px solid ${T.danger}` }}>
            <div style={{ fontSize: 10, color: T.danger, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Weak</div>
            <div style={{ fontSize: 16, color: T.danger, fontStyle: "italic", textDecoration: revealed ? "line-through" : "none", opacity: revealed ? 0.6 : 1 }}>"{card.upgrade.weak}"</div>
          </div>

          {/* Strong phrase (revealed) */}
          {revealed ? (
            <>
              <div style={{ padding: "14px 18px", background: T.successBg, borderRadius: T.r2, marginBottom: 16, borderLeft: `3px solid ${T.success}` }}>
                <div style={{ fontSize: 10, color: T.success, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Strong</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.success }}>"{card.upgrade.strong}"</div>
              </div>

              <div style={{ padding: "12px 16px", background: c.bg, borderRadius: T.r1, marginBottom: 20 }}>
                <span style={{ fontSize: 14, fontWeight: 750, color: T.text }}>{card.word}</span>
                <span style={{ fontSize: 13, color: T.textSec, marginLeft: 8 }}>— {card.def}</span>
              </div>

              <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.6, marginBottom: 20, fontStyle: "italic" }}>"{card.example}"</div>

              <button onClick={() => advanceCard()}
                style={{ padding: "10px 28px", borderRadius: T.r5, background: T.accent, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
                {pos + 1 >= totalDrills ? "See Results" : "Next →"}
              </button>
            </>
          ) : (
            <button onClick={revealUpgrade}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: T.r5, background: T.accent, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
              <Eye size={15} /> Reveal upgrade
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ─────────────────── RESULTS ─────────────────── */
  if (mode === "results") {
    const isFlashcard = drillMode === "flashcard";
    return (
      <div style={{ maxWidth: 500 }}>
        <div style={{ background: T.bgCard, borderRadius: T.r3, border: `1px solid ${T.border}`, padding: "32px 28px", textAlign: "center", marginBottom: 20, boxShadow: T.shadow }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", border: `4px solid ${pct >= 70 ? T.success : T.accent}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", background: pct >= 70 ? T.successBg : T.accentLight }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: pct >= 70 ? T.success : T.accent, fontFamily: T.fontDisplay }}>{isFlashcard ? "✓" : `${pct}%`}</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 6, fontFamily: T.fontDisplay }}>
            {isFlashcard ? "Session complete!" : pct >= 80 ? "Excellent!" : pct >= 60 ? "Good effort!" : "Keep practising!"}
          </div>
          {!isFlashcard && <div style={{ fontSize: 14, color: T.textSec }}>{score} / {totalDrills} correct</div>}
          {isFlashcard && <div style={{ fontSize: 14, color: T.textSec }}>You reviewed {totalDrills} card{totalDrills > 1 ? "s" : ""}</div>}
        </div>

        {missed.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Words to revisit ({missed.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {missed.map(v => (
                <div key={v.id} style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "10px 14px", background: T.dangerBg, borderRadius: T.r1, borderLeft: `3px solid ${T.danger}` }}>
                  <span style={{ fontSize: 14, fontWeight: 750, color: T.text }}>{v.word}</span>
                  <span style={{ fontSize: 12, color: T.textSec }}>— {v.def}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => startSession(drillMode, filterCat)}
            style={{ padding: "10px 22px", borderRadius: T.r5, background: T.accent, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
            Try Again
          </button>
          <button onClick={goHub}
            style={{ padding: "10px 22px", borderRadius: T.r5, background: T.bgMuted, color: T.textSec, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
            Back to Hub
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default VocabBuilder;
