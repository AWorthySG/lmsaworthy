import React from 'react';
import { T } from '../../theme/theme.js';

export default function StreakCalendar({ wallet }) {
  // Build a 12-week (84-day) grid of activity
  const today = new Date();
  const days = [];
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const claimed = wallet.history?.some(h => h.date === dateStr);
    days.push({ date: dateStr, active: claimed, day: d.getDay(), label: d.getDate() === 1 ? d.toLocaleString("default", { month: "short" }) : null });
  }
  // Group into weeks (columns)
  const weeks = [];
  let currentWeek = [];
  days.forEach((d, i) => {
    currentWeek.push(d);
    if (currentWeek.length === 7 || i === days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return (
    <div style={{ background: T.bgCard, borderRadius: T.r3, padding: "20px 22px", border: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
      {/* Subtle decorative corner */}
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(200,93,46,0.04)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🔥</span>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Study Streak</div>
        </div>
        <div style={{ background: T.accentLight, borderRadius: 20, padding: "4px 12px", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: T.accent, fontFamily: "'JetBrains Mono', monospace" }}>{wallet.streak}</span>
          <span style={{ fontSize: 10, color: T.accentText, fontWeight: 500 }}>day{wallet.streak !== 1 ? "s" : ""}</span>
        </div>
      </div>
      {/* Month labels */}
      <div style={{ display: "flex", gap: 2, marginBottom: 3, paddingLeft: 0 }}>
        {weeks.map((week, wi) => {
          const monthLabel = week.find(d => d.label);
          return <div key={wi} style={{ width: 13, fontSize: 9, color: T.textTer, textAlign: "center", fontWeight: 600 }}>{monthLabel ? monthLabel.label : ""}</div>;
        })}
      </div>
      {/* Heatmap grid */}
      <div style={{ display: "flex", gap: 2 }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {week.map((d, di) => (
              <div key={di} title={`${d.date}${d.active ? " — active" : ""}`}
                style={{ width: 13, height: 13, borderRadius: 3, background: d.active ? T.accent : T.bgMuted, opacity: d.active ? 1 : 0.4, transition: "all 0.2s ease", boxShadow: d.active ? "0 1px 3px rgba(200,93,46,0.2)" : "none" }} />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
        <span style={{ fontSize: 10, color: T.textTer }}>Last 12 weeks</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: T.textTer }}>
          <span>Less</span>
          <div style={{ width: 11, height: 11, borderRadius: 3, background: T.bgMuted, opacity: 0.4 }} />
          <div style={{ width: 11, height: 11, borderRadius: 3, background: T.accent, opacity: 0.5 }} />
          <div style={{ width: 11, height: 11, borderRadius: 3, background: T.accent }} />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
