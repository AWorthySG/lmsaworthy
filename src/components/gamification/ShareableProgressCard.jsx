import React, { useRef, useState } from 'react';
import { T } from '../../theme/theme.js';
import html2canvas from 'html2canvas-pro';

import { getExamCountdowns } from '../../utils/helpers.js';
import { getStreakReward } from '../../data/gamification.js';

export default function ShareableProgressCard({ state }) {
  const cardRef = useRef(null);
  const [generating, setGenerating] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const wallet = state.wallet;
  const gradedSubs = (state.submissions || []).filter(s => s.status === "graded");
  const exams = getExamCountdowns().slice(0, 2);

  // Compute readiness
  const totalHw = state.homework.filter(h => h.status === "active").length;
  const completedHw = (state.submissions || []).filter(s => s.status === "graded" || s.status === "submitted").length;
  const hwScore = totalHw > 0 ? Math.round((completedHw / Math.max(totalHw, 1)) * 100) : 50;
  const streakScore = Math.min(100, wallet.streak * 10);
  const coinScore = Math.min(100, wallet.coins / 5);
  const readiness = Math.round((hwScore + streakScore + coinScore) / 3);

  async function downloadCard() {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2, useCORS: true, logging: false });
      const link = document.createElement("a");
      link.download = `aworthy-progress-${new Date().toISOString().split("T")[0]}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) { console.error("Card generation failed:", e); }
    setGenerating(false);
  }

  async function shareCard() {
    if (!cardRef.current || !navigator.share) return downloadCard();
    setGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2, useCORS: true, logging: false });
      canvas.toBlob(async (blob) => {
        if (!blob) { setGenerating(false); return; }
        const file = new File([blob], "aworthy-progress.png", { type: "image/png" });
        await navigator.share({ title: "My A Worthy Progress", text: `Study streak: ${wallet.streak} days | Exam readiness: ${readiness}%`, files: [file] }).catch(() => {});
        setGenerating(false);
      }, "image/png");
    } catch (e) { downloadCard(); }
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setShowCard(!showCard)} style={{ padding: "8px 16px", borderRadius: T.r2, background: T.accentLight, color: T.accent, fontWeight: 700, fontSize: 12, border: `1px solid ${T.accent}22`, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          📸 {showCard ? "Hide" : "Preview"} Progress Card
        </button>
        {showCard && (
          <>
            <button onClick={downloadCard} disabled={generating} style={{ padding: "8px 16px", borderRadius: T.r2, background: T.accent, color: "#fff", fontWeight: 700, fontSize: 12, border: "none", cursor: generating ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              ⬇️ {generating ? "Generating..." : "Download"}
            </button>
            <button onClick={shareCard} disabled={generating} style={{ padding: "8px 16px", borderRadius: T.r2, background: T.navy, color: "#fff", fontWeight: 700, fontSize: 12, border: "none", cursor: generating ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              📤 Share
            </button>
          </>
        )}
      </div>

      {showCard && (
        <div ref={cardRef} style={{ width: 440, borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(15,23,42,0.25)", fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 16 }}>
          {/* Card header */}
          <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E2A4A 40%, #2D3A8C 100%)", padding: "28px 28px 22px", color: "#fff", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,162,84,0.15), transparent 70%)" }} />
            <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,58,140,0.3), transparent 70%)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, position: "relative" }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800 }}>A</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 0.5 }}>A Worthy</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", letterSpacing: 1.5, textTransform: "uppercase" }}>Learning Platform</div>
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", position: "relative" }}>My Progress</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2, position: "relative" }}>{new Date().toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" })}</div>
          </div>

          {/* Card body */}
          <div style={{ background: "#fff", padding: "22px 28px 28px" }}>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 18 }}>
              {[
                { label: "Streak", value: `${wallet.streak}d`, icon: "🔥", color: "#2D3A8C" },
                { label: "Readiness", value: `${readiness}%`, icon: "🎯", color: readiness >= 70 ? "#22C55E" : readiness >= 40 ? "#F59E0B" : "#FB424E" },
                { label: "Coins", value: wallet.coins, icon: "🪙", color: "#D4A254" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center", background: "#F8F7F4", borderRadius: 12, padding: "14px 8px" }}>
                  <div style={{ fontSize: 10, color: "#7A7A85", fontWeight: 600, marginBottom: 4 }}>{s.icon} {s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Readiness bar */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#7A7A85", fontWeight: 600, marginBottom: 4 }}>
                <span>Exam Readiness</span>
                <span>{readiness}%</span>
              </div>
              <div style={{ height: 10, background: "#EEEDF2", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 8, background: readiness >= 70 ? "linear-gradient(90deg, #22C55E, #16A34A)" : readiness >= 40 ? "linear-gradient(90deg, #F59E0B, #EAB308)" : "linear-gradient(90deg, #FB424E, #EF4444)", width: `${readiness}%` }} />
              </div>
            </div>

            {/* Upcoming exams */}
            {exams.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1E1E2E", marginBottom: 6 }}>⏳ Next Exams</div>
                {exams.map((e, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: e.daysLeft <= 30 ? "#FB424E" : "#2D3A8C", fontFamily: "'JetBrains Mono', monospace", minWidth: 32, textAlign: "center" }}>{e.daysLeft}</div>
                    <div style={{ fontSize: 11, color: "#4A4A55" }}>{e.name} · <span style={{ color: "#7A7A85" }}>{e.date}</span></div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <div style={{ borderTop: "1px solid #EEEDF2", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 9, color: "#AEAEB5", letterSpacing: 0.5 }}>lms.a-worthy.com</span>
              <span style={{ fontSize: 9, color: "#AEAEB5" }}>Homework graded: {gradedSubs.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
