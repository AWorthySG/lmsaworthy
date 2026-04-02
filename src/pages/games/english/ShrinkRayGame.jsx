import React, { useState, useEffect, useRef } from 'react';
import { T } from '../../../theme/theme.js';

function ShrinkRayGame() {
  const passages = [
    { text: "The government has recently decided to implement a new policy that aims to provide and offer additional financial support and monetary assistance to low-income families and households who are struggling to make ends meet in the current difficult and challenging economic climate.", essential: [3,4,7,8,10,14,15,16,20,21,27,28,30,31,34,35], target: 18 },
    { text: "Despite the fact that many people believe and think that social media platforms and networks are harmful and detrimental to the mental health and wellbeing of young people and teenagers, there is actually growing evidence and research that suggests these platforms can also provide valuable and meaningful support networks and communities for isolated and lonely individuals.", essential: [0,5,6,8,9,10,14,15,17,18,19,21,24,25,28,29,32,33,36,37], target: 22 },
    { text: "The government must urgently and immediately take strong and decisive action to address and tackle the serious and growing threat and danger posed by climate change and global warming to future generations and communities.", essential: [1,2,6,10,12,16,18,19,24,25,30,31], target: 18 },
    { text: "It is widely acknowledged and recognised that the use and integration of modern technology and digital devices in schools and educational institutions has the potential and ability to significantly and greatly improve the quality and standard of learning.", essential: [8,13,15,16,18,20,21,24,31,33,37], target: 20 },
    { text: "There is a pressing and urgent need and requirement for the government to ensure and guarantee that all citizens and residents have adequate and sufficient access and availability to affordable and reasonably priced healthcare services and medical treatment.", essential: [3,6,11,13,18,20,25,29,33,34,36,37], target: 20 },
  ];
  const [passIdx] = useState(() => Math.floor(Math.random() * passages.length));
  const [removed, setRemoved] = useState(new Set());
  const [lives, setLives] = useState(3);
  const [done, setDone] = useState(false);
  const [combo, setCombo] = useState(0);
  const [shake, setShake] = useState(false);
  const [particles, setParticles] = useState([]);
  const passage = passages[passIdx];
  const words = passage.text.split(" ");
  const remaining = words.length - removed.size;
  const progress = Math.round(((words.length - remaining) / (words.length - passage.target)) * 100);

  function spawnParticle(x, y, type) {
    const id = Date.now() + Math.random();
    setParticles(p => [...p, { id, x, y, type }]);
    setTimeout(() => setParticles(p => p.filter(pp => pp.id !== id)), 800);
  }

  function toggleWord(i, e) {
    if (done || lives <= 0) return;
    if (removed.has(i)) { setRemoved(r => { const n = new Set(r); n.delete(i); return n; }); return; }
    const rect = e.target.getBoundingClientRect();
    if (passage.essential.includes(i)) {
      setLives(l => l - 1); setCombo(0);
      setShake(true); setTimeout(() => setShake(false), 400);
      spawnParticle(rect.left + rect.width / 2, rect.top, "miss");
      return;
    }
    const newCombo = combo + 1;
    setCombo(newCombo);
    setRemoved(r => new Set(r).add(i));
    spawnParticle(rect.left + rect.width / 2, rect.top, "hit");
    if (remaining - 1 <= passage.target) setDone(true);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "relative" }}>
      {/* Floating particles */}
      {particles.map(p => (
        <div key={p.id} style={{ position: "fixed", left: p.x - 15, top: p.y - 20, pointerEvents: "none", zIndex: 9999, animation: "floatUp 0.8s ease forwards", fontSize: 16, fontWeight: 800, color: p.type === "hit" ? T.success : T.danger }}>
          {p.type === "hit" ? (combo > 2 ? `🔥 x${combo}` : "✂️") : "💥"}
        </div>
      ))}
      <style>{`@keyframes floatUp { 0% { opacity:1; transform:translateY(0) scale(1); } 100% { opacity:0; transform:translateY(-40px) scale(1.3); } }
        @keyframes shakeX { 0%,100% { transform:translateX(0); } 20% { transform:translateX(-6px); } 40% { transform:translateX(6px); } 60% { transform:translateX(-4px); } 80% { transform:translateX(4px); } }`}</style>

      {/* HUD bar */}
      <div className="grain" style={{ background: "linear-gradient(135deg, #0F172A, #1E2A4A)", borderRadius: T.r3, padding: "16px 20px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>Shrink Ray</div>
          <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            <span style={{ color: remaining <= passage.target ? "#51cf66" : "#fff" }}>{remaining}</span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}> / {passage.target} target</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {combo > 1 && <div className="scale-pop" style={{ background: "rgba(239,131,84,0.2)", borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 800, color: "#D4A254" }}>🔥 {combo}x combo</div>}
          <div style={{ display: "flex", gap: 3 }}>
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: i < lives ? "rgba(255,100,100,0.2)" : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, transition: "all 0.3s", transform: i < lives ? "scale(1)" : "scale(0.7)" }}>{i < lives ? "❤️" : "🖤"}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress beam */}
      <div style={{ height: 8, background: T.bgMuted, borderRadius: 10, overflow: "hidden", position: "relative" }}>
        <div style={{ height: "100%", borderRadius: 10, background: remaining <= passage.target ? "linear-gradient(90deg, #51cf66, #40c057)" : "linear-gradient(90deg, #EF8354, #F8B55A)", width: `${Math.min(100, Math.max(3, progress))}%`, transition: "width 0.4s cubic-bezier(0.22,1,0.36,1)", boxShadow: remaining <= passage.target ? "0 0 12px rgba(81,207,102,0.4)" : "0 0 12px rgba(239,131,84,0.3)" }} />
        {remaining <= passage.target && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)", animation: "shimmer 1.5s ease infinite" }} />}
      </div>

      {/* Text arena */}
      <div style={{ background: T.bgCard, borderRadius: T.r3, padding: "24px 26px", border: `1px solid ${T.border}`, lineHeight: 2.4, boxShadow: T.shadow2, animation: shake ? "shakeX 0.4s ease" : "none" }}>
        {words.map((w, i) => {
          const isRemoved = removed.has(i);
          const isEssential = passage.essential.includes(i);
          return (
            <span key={i} onClick={(e) => toggleWord(i, e)}
              style={{
                display: "inline-block", padding: "3px 4px", margin: "1px", borderRadius: 6, cursor: done || lives <= 0 ? "default" : "pointer", fontSize: 14, fontWeight: 500, transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
                background: isRemoved ? "linear-gradient(135deg, rgba(224,82,98,0.08), rgba(224,82,98,0.15))" : done && isEssential ? "rgba(59,170,139,0.1)" : "transparent",
                color: isRemoved ? T.danger : done && isEssential ? T.success : T.text,
                textDecoration: isRemoved ? "line-through" : "none",
                opacity: isRemoved ? 0.35 : 1,
                transform: isRemoved ? "scale(0.92)" : "scale(1)",
                border: done && isEssential ? `1px solid ${T.success}33` : "1px solid transparent",
              }}
              onMouseEnter={e => { if (!done && !isRemoved && lives > 0) e.target.style.background = "rgba(239,131,84,0.08)"; }}
              onMouseLeave={e => { if (!isRemoved && !(done && isEssential)) e.target.style.background = "transparent"; }}
            >{w}</span>
          );
        })}
      </div>

      {/* Victory / Defeat */}
      {done && (
        <div className="scale-pop" style={{ background: T.successBg, borderRadius: T.r3, padding: "28px", textAlign: "center", color: T.text, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 50%, rgba(81,207,102,0.15), transparent 60%)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 6 }}>Summary Complete!</div>
            <div style={{ fontSize: 13, color: T.textSec }}>{words.length} words → {remaining} words · All essential points preserved</div>
            {combo > 3 && <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: "#D4A254" }}>🔥 Best combo: {combo}x</div>}
          </div>
        </div>
      )}
      {lives <= 0 && (
        <div className="scale-pop" style={{ background: T.dangerBg, borderRadius: T.r3, padding: "28px", textAlign: "center", color: T.text, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 50%, rgba(224,82,98,0.15), transparent 60%)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>💔</div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 6 }}>Out of Lives!</div>
            <div style={{ fontSize: 13, color: T.textSec }}>Essential information was removed 3 times. The green-highlighted words below are key points.</div>
          </div>
        </div>
      )}

      <div style={{ fontSize: 11, color: T.textTer, display: "flex", alignItems: "center", gap: 6 }}>
        <span>✂️</span> Click redundant words to zap them · Essential words fight back · Build combos for bonus points
      </div>
    </div>
  );
}

export default ShrinkRayGame;
