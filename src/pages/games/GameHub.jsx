import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { T } from '../../theme/theme.js';
import { GAME_INSTRUCTIONS, SUBJECT_GAMES } from '../../data/gameData.js';

// English games
import {
  ShrinkRayGame,
  DebateArenaGame,
  StoryArchitectGame,
  DeviceSpotterGame,
  TonePainterGame,
  SceneBreakdownGame,
} from './english';

// GP games
import {
  ThesisDefenceGame,
  HeadlineSifterGame,
  PolicyLabGame,
  ArgumentMapperGame,
} from './gp';

// Economics games
import {
  VocabBlitzGame,
  InflationFighterGame,
  PriceWarsGame,
  MarketPlaygroundGame,
  ExternalityCityGame,
  PolicyTugGame,
  ElasticityLabGame,
  MarketMogulGame,
  DdSsShifterGame,
  TradeWindsGame,
} from './economics';

// Icon helpers
const ic = (name) => React.memo(({ size = 20, color, style: s, className }) => (
  <Icon icon={name} width={size} height={size} style={{ color, flexShrink: 0, ...s }} className={className} />
));
const icc = (name) => React.memo(({ size = 20, style: s, className }) => (
  <Icon icon={name} width={size} height={size} style={{ flexShrink: 0, ...s }} className={className} />
));

const ArrowLeft = ic("fluent:arrow-left-24-filled");
const CaretRight = ic("fluent:chevron-right-24-filled");
const Play = icc("fluent-emoji-flat:play-button");

const SUBJECT_NAMES = {
  eng: "O-Level English",
  h1econ: "H1 Economics",
  h2econ: "H2 Economics",
  gp: "General Paper",
};

function GameHub({ subject }) {
  const games = SUBJECT_GAMES[subject] || [];
  const [activeGame, setActiveGame] = useState(null);
  const [showingInstructions, setShowingInstructions] = useState(true); // show instructions first
  const subjectName = SUBJECT_NAMES[subject] || subject;

  const gameComponents = {
    "vocab-blitz": VocabBlitzGame,
    "thesis-defence": ThesisDefenceGame,
    "inflation-fighter": InflationFighterGame,
    "price-wars": PriceWarsGame,
    "shrink-ray": ShrinkRayGame,
    "debate-builder": DebateArenaGame,
    "story-architect": StoryArchitectGame,
    "device-spotter": DeviceSpotterGame,
    "tone-painter": TonePainterGame,
    "scene-breakdown": SceneBreakdownGame,
    "headline-sifter": HeadlineSifterGame,
    "policy-lab": PolicyLabGame,
    "argument-mapper": ArgumentMapperGame,
    "market-playground": MarketPlaygroundGame,
    "externality-city": ExternalityCityGame,
    "policy-tug": PolicyTugGame,
    "dd-ss-shifter": DdSsShifterGame,
    "elasticity-lab": ElasticityLabGame,
    "market-mogul": MarketMogulGame,
    "trade-winds": TradeWindsGame,
  };

  function selectGame(g) {
    setActiveGame(g);
    setShowingInstructions(true); // always show instructions first
  }

  if (activeGame) {
    const GameComp = gameComponents[activeGame.id];
    const instr = GAME_INSTRUCTIONS[activeGame.id];

    // Instructions screen
    if (showingInstructions && instr) {
      return (
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 96px)", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <button onClick={() => setActiveGame(null)} style={{ width: 32, height: 32, borderRadius: T.r1, background: T.bgMuted, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
                <span>{activeGame.emoji}</span> {activeGame.title}
              </h1>
              <p style={{ color: T.textSec, fontSize: 12, margin: "2px 0 0" }}>{activeGame.topic} · {activeGame.difficulty}</p>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", maxWidth: 600 }}>
            {/* Hero */}
            <div className="grain fade-up" style={{ background: `linear-gradient(135deg, ${activeGame.color}18, ${activeGame.color}08)`, borderRadius: T.r3, padding: "28px 26px", border: `1px solid ${activeGame.color}22`, marginBottom: 14, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -10, right: -10, fontSize: 70, opacity: 0.08 }}>{activeGame.emoji}</div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>{activeGame.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: activeGame.color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Objective</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.text, lineHeight: 1.6 }}>{instr.objective}</div>
              </div>
            </div>

            {/* Rules */}
            <div className="card-enter" style={{ "--i": 0, background: T.bgCard, borderRadius: T.r2, padding: "20px 22px", border: `1px solid ${T.border}`, marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16 }}>📋</span> How to Play
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {instr.rules.map((rule, i) => (
                  <div key={i} className="stagger-item" style={{ "--i": i, display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: activeGame.color + "15", color: activeGame.color, fontWeight: 800, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, border: `1px solid ${activeGame.color}25` }}>{i + 1}</div>
                    <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6 }}>{rule}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            {instr.tips && (
              <div className="card-enter" style={{ "--i": 1, background: T.accentLight, borderRadius: T.r2, padding: "14px 18px", border: `1px solid ${T.accent}22`, marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.accent, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <span>💡</span> Pro Tips
                </div>
                <div style={{ fontSize: 12, color: T.accentText, lineHeight: 1.7 }}>{instr.tips}</div>
              </div>
            )}

            {/* Scoring */}
            {instr.scoring && (
              <div className="card-enter" style={{ "--i": 2, background: T.bgMuted, borderRadius: T.r2, padding: "14px 18px", marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.textSec, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <span>🏆</span> Scoring
                </div>
                <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.6 }}>{instr.scoring}</div>
              </div>
            )}

            {/* Start button */}
            <button onClick={() => setShowingInstructions(false)}              style={{ padding: "14px 36px", borderRadius: T.r5, background: T.gradPrimary, color: "#fff", fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, boxShadow: T.shadowAccent }}>
              <Play size={18} /> Start Playing
            </button>
          </div>
        </div>
      );
    }

    // Game screen
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 96px)", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <button onClick={() => setActiveGame(null)} style={{ width: 32, height: 32, borderRadius: T.r1, background: T.bgMuted, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowLeft size={16} />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
              <span>{activeGame.emoji}</span> {activeGame.title}
            </h1>
            <p style={{ color: T.textSec, fontSize: 12, margin: "2px 0 0" }}>{activeGame.topic}</p>
          </div>
          <button onClick={() => setShowingInstructions(true)} title="View instructions"
            style={{ padding: "5px 12px", borderRadius: T.r1, background: T.bgMuted, border: `1px solid ${T.border}`, cursor: "pointer", fontSize: 11, fontWeight: 600, color: T.textSec, display: "flex", alignItems: "center", gap: 4 }}>
            📋 Rules
          </button>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", maxWidth: 640 }}>
          {GameComp ? <GameComp /> : (
            <div style={{ background: T.bgCard, borderRadius: T.r3, padding: "40px", textAlign: "center", border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{activeGame.emoji}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 6, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{activeGame.title}</div>
              <div style={{ fontSize: 13, color: T.textSec, lineHeight: 1.6, marginBottom: 16 }}>{activeGame.desc}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.textTer }}>This game could not be loaded. Please try again.</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 96px)", gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #1A1816, #3D3832)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Interactive Games</h1>
        <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0", fontWeight: 400 }}>{subjectName} — learn through play</p>
      </div>

      <div className="grain" style={{ background: `linear-gradient(135deg, ${T.bgMuted}, ${T.accentLight}44)`, borderRadius: T.r3, padding: "22px 26px", color: T.text, border: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, fontSize: 80, opacity: 0.06 }}>🎮</div>
        <div style={{ position: "absolute", bottom: -10, left: -10, width: 80, height: 80, borderRadius: "50%", background: `${T.accent}08` }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${T.accent}, #F8B55A, ${T.accent})`, opacity: 0.6 }} />
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: T.accent, marginBottom: 6 }}>Learn by Playing</div>
        <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Each game teaches a different {subjectName} concept</div>
        <div style={{ fontSize: 12, color: T.textSec, marginTop: 4 }}>{games.length} games available · Earn coins for high scores</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, minHeight: 0, overflowY: "auto" }}>
        {games.map((g, i) => (
          <button key={g.id} onClick={() => selectGame(g)} className="card-enter card-hover card-lift"
            style={{ "--i": i, display: "flex", gap: 16, padding: "18px 20px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgCard, cursor: "pointer", textAlign: "left", width: "100%", boxShadow: T.shadow1 }}>
            <div style={{ width: 52, height: 52, borderRadius: T.r2, background: g.color + "12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{g.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{g.title}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: g.color, background: g.color + "15", padding: "2px 8px", borderRadius: 20 }}>{g.difficulty}</span>
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: g.color, marginBottom: 4 }}>{g.topic}</div>
              <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.5 }}>{g.desc}</div>
            </div>
            <CaretRight size={16} style={{ alignSelf: "center", flexShrink: 0 }} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default GameHub;
