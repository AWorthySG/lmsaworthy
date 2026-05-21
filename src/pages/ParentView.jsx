import React from 'react';
import { T } from '../theme/theme.js';
import { Users, ChartLineUp, CalendarCheck, Trophy, Star, CheckCircle, ArrowSquareOut, Flame, ClipboardText, CalendarBlank, PencilSimpleLine, Timer } from '../icons/icons.jsx';
import { Card, Btn, Badge, SubjectBadge, Progress, PageHeader, Select, StatCard } from '../components/ui';
import { ShareableProgressCard, StudentAvatar, XPBar, BadgeChip, StreakCalendar } from '../components/gamification';
import { getExamCountdowns } from '../utils/helpers.js';
import { SUBJECTS } from '../data/subjects.js';
import { LEVELS } from '../data/gamification.js';

function ParentView({ state }) {
  const wallet = state.wallet;
  const exams = getExamCountdowns().slice(0, 3);
  const gradedSubs = (state.submissions || []).filter(s => s.status === "graded");
  let attended = 0;
  Object.values(state.attendance).forEach(rec => { attended += Object.values(rec).filter(v => v === "present" || v === "late").length; });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "linear-gradient(135deg, #0F172A, #1E2A4A, #2D3A8C)", borderRadius: T.r4, padding: "28px 24px", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(212,162,84,0.1), transparent 60%)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <img src="/logo-aworthy.jpeg" alt="A Worthy Learning" style={{ height: 36, borderRadius: 8 }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase" }}>A Worthy · Parent Dashboard</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 4px", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Progress Report</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>Real-time overview of your child's learning journey</p>
        </div>
      </div>

      {/* Key Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
        {[
          { label: "Study Streak", value: `${wallet.streak} days`, icon: <Flame size={12} />, color: T.accent },
          { label: "Coins Earned", value: wallet.coins, icon: <Star size={12} />, color: T.gold },
          { label: "Homework Graded", value: gradedSubs.length, icon: <ClipboardText size={12} />, color: T.success },
          { label: "Sessions Attended", value: attended, icon: <CalendarBlank size={12} />, color: T.teal },
        ].map(s => (
          <div key={s.label} style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px", border: `1px solid ${T.border}`, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: T.textTer, fontWeight: 600, marginBottom: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>{s.icon} {s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Grades */}
      {gradedSubs.length > 0 && (
        <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px 18px", border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 10, fontFamily: "'Bricolage Grotesque', sans-serif", display: "flex", alignItems: "center", gap: 6 }}><PencilSimpleLine size={15} color={T.accent} /> Recent Grades</div>
          {gradedSubs.slice(0, 5).map(sub => {
            const hw = state.homework.find(h => h.id === sub.homeworkId);
            return (
              <div key={sub.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: T.success, fontFamily: "'Bricolage Grotesque', sans-serif", minWidth: 36 }}>{sub.grade}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{hw?.title || "Homework"}</div>
                  {sub.gradeComment && <div style={{ fontSize: 11, color: T.textTer, marginTop: 2 }}>{sub.gradeComment.slice(0, 80)}…</div>}
                </div>
                <div style={{ fontSize: 10, color: T.textTer }}>{sub.gradedAt}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Exam Countdown */}
      {exams.length > 0 && (
        <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px 18px", border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 10, fontFamily: "'Bricolage Grotesque', sans-serif", display: "flex", alignItems: "center", gap: 6 }}><Timer size={15} color={T.accent} /> Upcoming Exams</div>
          {exams.map((e, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < exams.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: e.daysLeft <= 30 ? T.danger : T.accent, fontFamily: "'JetBrains Mono', monospace", minWidth: 40, textAlign: "center" }}>{e.daysLeft}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{e.name}</div>
                <div style={{ fontSize: 10, color: T.textTer }}>{e.date} · {e.daysLeft} days remaining</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Study Streak Calendar */}
      <StreakCalendar wallet={wallet} />

      {/* Shareable Progress Card */}
      <ShareableProgressCard state={state} />

      <div style={{ textAlign: "center", fontSize: 11, color: T.textTer, padding: "12px 0" }}>
        <button onClick={() => window.print()} style={{ background: T.accent, color: "#fff", border: "none", borderRadius: T.r2, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 8 }}>Print Report</button>
        <br />Generated by A Worthy Learning Platform · <a href="https://lms.a-worthy.com" style={{ color: T.accent }}>lms.a-worthy.com</a>
      </div>
    </div>
  );
}

/* ━━━ PERSONAL NOTES SYSTEM ━━━ */

export default ParentView;
