import React, { useState } from 'react';
import { T } from '../../theme/theme.js';
import { EmptyStateIllustration } from '../../components/ui';

function GoalSetting({ state, dispatch }) {
  const [newGoal, setNewGoal] = useState("");
  const [goalType, setGoalType] = useState("weekly");
  const goals = state.goals || [];
  const active = goals.filter(g => !g.completed);
  const completed = goals.filter(g => g.completed);

  function addGoal() {
    if (!newGoal.trim()) return;
    dispatch({ type: "ADD_GOAL", payload: { text: newGoal, type: goalType } });
    setNewGoal("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, background: T.gradPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>My Goals</h1>
        <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0" }}>Set learning goals and track your progress</p>
      </div>

      {/* Add goal */}
      <div style={{ display: "flex", gap: 8 }}>
        <input value={newGoal} onChange={e => setNewGoal(e.target.value)} onKeyDown={e => e.key === "Enter" && addGoal()} placeholder="e.g. Complete 3 practice drills this week..." style={{ flex: 1, padding: "10px 14px", borderRadius: T.r2, border: `1px solid ${T.border}`, fontSize: 13, boxSizing: "border-box" }} />
        <select value={goalType} onChange={e => setGoalType(e.target.value)} style={{ padding: "10px 12px", borderRadius: T.r2, border: `1px solid ${T.border}`, fontSize: 12 }}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="exam">Before Exams</option>
        </select>
        <button onClick={addGoal} disabled={!newGoal.trim()} style={{ padding: "10px 18px", borderRadius: T.r2, background: newGoal.trim() ? T.gradPrimary : T.bgMuted, color: newGoal.trim() ? "#fff" : T.textTer, fontWeight: 700, fontSize: 13, border: "none", cursor: newGoal.trim() ? "pointer" : "not-allowed" }}>Add</button>
      </div>

      {/* Active goals */}
      {active.length > 0 && (
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 8 }}>Active Goals</div>
          {active.map(g => (
            <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, marginBottom: 6 }}>
              <button onClick={() => dispatch({ type: "TOGGLE_GOAL", payload: g.id })} style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${T.accent}`, background: "transparent", cursor: "pointer", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{g.text}</div>
                <div style={{ fontSize: 10, color: T.textTer }}>{g.type} · set {g.createdAt}</div>
              </div>
              <button onClick={() => dispatch({ type: "DELETE_GOAL", payload: g.id })} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: T.textTer, padding: 4 }}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Completed goals */}
      {completed.length > 0 && (
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.success, marginBottom: 8 }}>✅ Completed ({completed.length})</div>
          {completed.slice(0, 5).map(g => (
            <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: T.successBg, borderRadius: T.r2, border: `1px solid ${T.success}22`, marginBottom: 4, opacity: 0.7 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: T.success, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>✓</span>
              </div>
              <span style={{ fontSize: 13, color: T.success, textDecoration: "line-through" }}>{g.text}</span>
            </div>
          ))}
        </div>
      )}

      {goals.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <EmptyStateIllustration type="default" size={80} />
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginTop: 10 }}>No goals yet</div>
          <div style={{ fontSize: 12, color: T.textTer, marginTop: 4 }}>Set your first learning goal above to stay on track.</div>
        </div>
      )}

      {/* Suggested goals */}
      <div style={{ background: T.accentLight, borderRadius: T.r2, padding: "14px 16px", border: `1px solid ${T.accent}22` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.accentText, marginBottom: 6 }}>💡 Suggested Goals</div>
        {["Complete all daily challenges this week", "Submit 1 essay for peer review", "Achieve 80%+ on a practice drill", "Review all notes before the next class"].map((s, i) => (
          <button key={i} onClick={() => { setNewGoal(s); }} style={{ display: "block", fontSize: 12, color: T.accent, background: "none", border: "none", cursor: "pointer", padding: "3px 0", textAlign: "left" }}>+ {s}</button>
        ))}
      </div>
    </div>
  );
}

/* ━━━ MISTAKE JOURNAL ━━━ */

export default GoalSetting;
