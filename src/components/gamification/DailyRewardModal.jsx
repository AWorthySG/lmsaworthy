import React from 'react';
import { T } from '../../theme/theme.js';

import { DAILY_REWARDS, getStreakReward } from '../../data/gamification.js';

export default function DailyRewardModal({ wallet, onClaim, onClose }) {
  const today = new Date().toISOString().split("T")[0];
  const alreadyClaimed = wallet.lastClaim === today;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const streakContinues = wallet.lastClaim === yesterday;
  const nextStreak = streakContinues ? wallet.streak + 1 : 1;
  const reward = getStreakReward(nextStreak);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(23,37,82,0.6)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="scale-pop" style={{ background: "#fff", borderRadius: T.r3, width: 380, overflow: "hidden", boxShadow: T.shadow3 }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #FFF3ED, #FFE8D6)", padding: "24px 28px 20px", textAlign: "center" }}>
          <div className="scale-pop" style={{ fontSize: 40, marginBottom: 8, animationDelay: "0.15s" }}>{alreadyClaimed ? "✅" : "🎁"}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {alreadyClaimed ? "Already Claimed!" : "Daily Login Reward"}
          </div>
          <div style={{ fontSize: 12, color: T.textSec, marginTop: 4 }}>
            {alreadyClaimed ? "Come back tomorrow for more!" : `Day ${nextStreak} — ${streakContinues ? `${wallet.streak}-day streak continues!` : "Start a new streak!"}`}
          </div>
        </div>

        {/* Reward preview */}
        <div style={{ padding: "20px 28px" }}>
          {/* 7-day streak row */}
          <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
            {DAILY_REWARDS.map((r, i) => {
              const dayNum = i + 1;
              const isToday = dayNum === ((nextStreak - 1) % 7) + 1 && !alreadyClaimed;
              const isPast = alreadyClaimed ? dayNum <= ((wallet.streak - 1) % 7) + 1 : dayNum < ((nextStreak - 1) % 7) + 1;
              return (
                <div key={i} style={{ flex: 1, textAlign: "center", padding: "8px 2px", borderRadius: T.r1, background: isToday ? T.accentLight : isPast ? T.successBg : T.bgMuted, border: isToday ? `2px solid ${T.accent}` : "2px solid transparent", transition: "all 0.2s" }}>
                  <div style={{ fontSize: 14 }}>{r.emoji}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: isToday ? T.accent : isPast ? T.success : T.textTer, marginTop: 2 }}>Day {dayNum}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: isToday ? T.accent : isPast ? T.success : T.textSec }}>{r.coins}</div>
                  {isPast && <div style={{ fontSize: 8, color: T.success }}>✓</div>}
                </div>
              );
            })}
          </div>

          {/* Today's reward detail */}
          {!alreadyClaimed && (
            <div style={{ background: T.bgMuted, borderRadius: T.r2, padding: "16px", textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 32, marginBottom: 4 }}>{reward.emoji}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: T.accent, fontFamily: "'Bricolage Grotesque', sans-serif" }}>+{reward.coins} Coins</div>
              {reward.multiplier > 1 && (
                <div style={{ fontSize: 11, fontWeight: 700, color: T.gold, marginTop: 2 }}>{reward.multiplier}x multiplier (week {reward.multiplier})</div>
              )}
              {reward.bonus && (
                <div style={{ fontSize: 11, fontWeight: 600, color: T.success, marginTop: 4 }}>{reward.bonus}</div>
              )}
            </div>
          )}

          {/* Balance */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: T.textTer, fontWeight: 600 }}>Current Balance</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.navy }}>🪙 {wallet.coins}{!alreadyClaimed ? ` → ${wallet.coins + reward.coins}` : ""}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: T.textTer, fontWeight: 600 }}>Streak</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.accent }}>🔥 {alreadyClaimed ? wallet.streak : (streakContinues ? wallet.streak : 0)} days</div>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            {!alreadyClaimed ? (
              <button onClick={onClaim} className="glow-pulse" style={{ flex: 1, padding: "12px", borderRadius: T.r2, background: T.gradPrimary, color: "#fff", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer", boxShadow: T.shadowAccent, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                🪙 Claim {reward.coins} Coins
              </button>
            ) : (
              <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: T.r2, background: T.bgMuted, color: T.textSec, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
