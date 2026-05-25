import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { T } from '../theme/theme.js';
import { ChartLineUp, ChartBar, ChartPie, Users, Trophy, CalendarCheck, Gauge, Target, Flame, CalendarBlank, Timer, Star } from '../icons/icons.jsx';
import { Card, Btn, Badge, SubjectBadge, Progress, PageHeader, Select, StatCard } from '../components/ui';
import { StudentAvatar } from '../components/gamification';
import { getExamCountdowns } from '../utils/helpers.js';
import { SUBJECTS, TOPICS } from '../data/subjects.js';

function AnalyticsDashboard({ state }) {
  const students = state.students || [];
  const submissions = state.submissions || [];
  const attendance = state.attendance || {};
  const studyLogs = state.studyLogs || [];

  // Topic mastery calculation
  const topicMastery = {};
  SUBJECTS.forEach(subj => {
    const topics = TOPICS[subj.id] || [];
    topics.forEach(topic => {
      const relevant = submissions.filter(s => {
        const hw = state.homework.find(h => h.id === s.homeworkId);
        return hw?.subject === subj.id && hw?.topic === topic && s.status === "graded";
      });
      const avgGrade = relevant.length > 0 ? relevant.reduce((a, s) => {
        const g = s.grade || "";
        const score = g.includes("A") ? 85 : g.includes("B") ? 70 : g.includes("C") ? 55 : g.includes("D") ? 40 : 30;
        return a + score;
      }, 0) / relevant.length : null;
      if (!topicMastery[subj.id]) topicMastery[subj.id] = [];
      topicMastery[subj.id].push({ topic, mastery: avgGrade, count: relevant.length });
    });
  });

  // Attendance rate
  let totalExpected = 0, totalPresent = 0;
  state.sessions.forEach(s => {
    const stu = students.filter(st => st.subjects?.includes(s.subject));
    const rec = attendance[s.id] || {};
    totalExpected += stu.length;
    totalPresent += Object.values(rec).filter(v => v === "present" || v === "late").length;
  });
  const attendanceRate = totalExpected > 0 ? Math.round((totalPresent / totalExpected) * 100) : 0;

  // Study time this week (from studyLogs)
  const weekAgo = Date.now() - 7 * 86400000;
  const weekLogs = studyLogs.filter(l => l.timestamp > weekAgo);
  const totalMinsWeek = weekLogs.reduce((a, l) => a + (l.minutes || 0), 0);

  // Exam readiness score (0-100) — based on homework completion + attendance
  const totalHw = state.homework.filter(h => h.status === "active").length;
  const completedHw = submissions.filter(s => s.status === "graded" || s.status === "submitted").length;
  const hwRate = totalHw > 0 ? Math.round((completedHw / Math.max(totalHw, 1)) * 100) : 50;
  const examReadiness = Math.round((hwRate + attendanceRate) / 2);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader title="Analytics" subtitle="Track performance, study habits, and exam readiness" />

      {/* Key metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
        {[
          { label: "Exam Readiness", value: `${examReadiness}%`, color: examReadiness >= 70 ? T.success : examReadiness >= 40 ? T.warning : T.danger, icon: <Target size={12} /> },
          { label: "Homework Done", value: `${completedHw}/${totalHw}`, color: T.accent, icon: <Flame size={12} /> },
          { label: "Attendance", value: `${attendanceRate}%`, color: attendanceRate >= 80 ? T.success : T.warning, icon: <CalendarBlank size={12} /> },
          { label: "This Week", value: `${totalMinsWeek}m`, color: T.teal, icon: <Timer size={12} /> },
        ].map(m => (
          <div key={m.label} style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px", border: `1px solid ${T.border}`, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: T.textTer, fontWeight: 600, marginBottom: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>{m.icon} {m.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: m.color, fontFamily: T.fontDisplay }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Exam Readiness Gauge */}
      <div style={{ background: T.bgCard, borderRadius: T.r3, padding: "20px", border: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 12, fontFamily: T.fontDisplay, display: "flex", alignItems: "center", gap: 6 }}><Target size={16} color={T.accent} /> Exam Readiness Score</div>
        <div style={{ height: 12, background: T.bgMuted, borderRadius: 10, overflow: "hidden", position: "relative", marginBottom: 8 }}>
          <div style={{ height: "100%", borderRadius: 10, background: examReadiness >= 70 ? `linear-gradient(90deg, ${T.success}, #22C55E)` : examReadiness >= 40 ? `linear-gradient(90deg, ${T.warning}, #F59E0B)` : `linear-gradient(90deg, ${T.danger}, #EF4444)`, width: `${examReadiness}%`, transition: "width 0.5s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.textTer }}>
          <span>Not Ready</span><span>Getting There</span><span>Exam Ready</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: T.textSec, lineHeight: 1.6 }}>
          {examReadiness >= 70 ? "You're on track! Keep up the consistent practice." : examReadiness >= 40 ? "Room for improvement. Focus on completing homework and attending sessions regularly." : "You need to increase your study activity. Start by completing outstanding homework and attending upcoming sessions."}
        </div>
      </div>

      {/* Topic Mastery Heatmap */}
      <div style={{ background: T.bgCard, borderRadius: T.r3, padding: "20px", border: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 14, fontFamily: T.fontDisplay, display: "flex", alignItems: "center", gap: 6 }}><ChartBar size={16} color={T.accent} /> Topic Mastery</div>
        {SUBJECTS.map(subj => {
          const topics = topicMastery[subj.id] || [];
          if (topics.length === 0) return null;
          const theme = T[subj.id] || T.eng;
          return (
            <div key={subj.id} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: theme.accent, marginBottom: 8 }}>{subj.name}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {topics.map(t => {
                  const level = t.mastery === null ? 0 : t.mastery >= 80 ? 4 : t.mastery >= 65 ? 3 : t.mastery >= 50 ? 2 : 1;
                  const colors = ["#E2E4EA", "#FCA5A5", "#FCD34D", "#86EFAC", "#22C55E"];
                  return (
                    <div key={t.topic} title={`${t.topic}: ${t.mastery !== null ? Math.round(t.mastery) + "%" : "No data"} (${t.count} graded)`}
                      style={{ padding: "6px 10px", borderRadius: T.r1, background: colors[level] + "33", border: `1px solid ${colors[level]}55`, fontSize: 10, fontWeight: 600, color: level === 0 ? T.textTer : T.text, cursor: "default" }}>
                      {t.topic} {level > 0 && <span>{level === 1 ? <span style={{ color: T.danger, fontSize: 8 }}>●</span> : level === 2 ? <span style={{ color: "#D97706", fontSize: 8 }}>●</span> : level === 3 ? <span style={{ color: T.success, fontSize: 8 }}>●</span> : <Star size={9} color={T.gold} />}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div style={{ display: "flex", gap: 8, marginTop: 8, fontSize: 10, color: T.textTer }}>
          <span>&#9633; No data</span><span style={{ color: T.danger }}>● Needs work</span><span style={{ color: "#D97706" }}>● Developing</span><span style={{ color: T.success }}>● Good</span><span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}><Star size={10} color={T.gold} /> Mastered</span>
        </div>
      </div>

      {/* Exam countdown */}
      <div style={{ background: T.bgCard, borderRadius: T.r3, padding: "20px", border: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 12, fontFamily: T.fontDisplay, display: "flex", alignItems: "center", gap: 6 }}><Timer size={16} color={T.accent} /> Exam Countdown</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {getExamCountdowns().map((e) => {
            const theme = T[e.subject] || T.eng;
            const urgent = e.daysLeft <= 30;
            return (
              <div key={e.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: T.r2, background: urgent ? T.dangerBg : T.bgMuted, border: `1px solid ${urgent ? T.danger + "22" : T.border}` }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: urgent ? T.danger : theme.accent, fontFamily: T.fontMono, minWidth: 40, textAlign: "center" }}>{e.daysLeft}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{e.name}</div>
                  <div style={{ fontSize: 10, color: T.textTer }}>{e.date}</div>
                </div>
                {urgent && <span style={{ fontSize: 9, fontWeight: 700, color: T.danger, background: T.dangerBg, padding: "2px 8px", borderRadius: 20, border: `1px solid ${T.danger}22` }}>URGENT</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ━━━ PARENT VIEW — Shareable read-only dashboard ━━━ */

export default AnalyticsDashboard;
