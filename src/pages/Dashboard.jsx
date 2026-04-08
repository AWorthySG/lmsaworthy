import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { T } from '../theme/theme.js';
import { House, Books, VideoCamera, Lightning, Target, Lightbulb, RocketLaunch, Flame, Trophy, Crown, Medal, Star, Sparkle, Gift, Confetti, CheckCircle, ChartLineUp, CalendarBlank, Clock, ArrowRight, Brain, GraduationCap, BookOpen, ClipboardText, Scroll, PencilSimpleLine, Notebook } from '../icons/icons.jsx';
import { Card, Btn, Badge, SubjectBadge, Progress, StatCard } from '../components/ui';
import { XPBar, BadgeChip, StudentAvatar, PodiumCard, StreakCalendar, ShareableProgressCard, triggerCelebration } from '../components/gamification';
import { calcStudentXP, getLevel, getLevelProgress, getStudentBadges } from '../utils/gamificationUtils.js';
import { getSubject, getSubjectTheme, formatDate, getExamCountdowns, getDailyChallenge, getWeeklyProgress, getWordOfTheDay } from '../utils/helpers.js';
import { SUBJECTS, TOPICS } from '../data/subjects.js';
import { LEVELS, BADGE_DEFS, AVATAR_OPTIONS } from '../data/gamification.js';
import { ACTIVITY_FEED } from '../data/seedData.js';

function HeroScene3D() {
  return (
    <div style={{ marginBottom: 24, borderRadius: T.r4, overflow: "hidden", border: `1px solid ${T.border}`, position: "relative", background: "linear-gradient(135deg, #0F172A 0%, #1E2A4A 40%, #2D3A8C 100%)" }}>
      <style>{`
        @keyframes heroFloat1 { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(8px,-12px) rotate(3deg); } }
        @keyframes heroFloat2 { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(-6px,10px) rotate(-2deg); } }
        @keyframes heroFloat3 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(4px,-8px); } }
        @keyframes heroPulse { 0%,100% { opacity: 0.12; } 50% { opacity: 0.22; } }
        @keyframes heroGradShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      `}</style>
      {/* Animated gradient overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(270deg, rgba(45,58,140,0.2), rgba(212,162,84,0.08), rgba(13,148,136,0.08), rgba(45,58,140,0.2))", backgroundSize: "400% 400%", animation: "heroGradShift 15s ease infinite" }} />
      {/* Decorative SVG elements */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.9 }} viewBox="0 0 800 280" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="heroGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
          </pattern>
          <linearGradient id="indigoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#4F5BD5" stopOpacity="0.2"/>
          </linearGradient>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D4A254" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#E8C078" stopOpacity="0.2"/>
          </linearGradient>
        </defs>
        <rect width="800" height="280" fill="url(#heroGrid)"/>
        {/* Floating geometric shapes */}
        <g style={{ animation: "heroFloat1 8s ease-in-out infinite" }}>
          <rect x="620" y="40" width="80" height="80" rx="16" fill="none" stroke="url(#indigoGrad)" strokeWidth="1.5"/>
          <rect x="632" y="52" width="56" height="56" rx="10" fill="rgba(129,140,248,0.06)"/>
          <path d="M648 72 v24 M648 72 c0 0 8-4 16 0 v24 c-8-4-16 0-16 0 M648 72 c0 0-8-4-16 0 v24 c8-4 16 0 16 0" fill="none" stroke="rgba(129,140,248,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
        </g>
        <g style={{ animation: "heroFloat2 10s ease-in-out infinite" }}>
          <circle cx="720" cy="180" r="35" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5"/>
          <circle cx="720" cy="180" r="22" fill="rgba(212,162,84,0.05)"/>
          <path d="M715 174 a8 8 0 1 1 10 0 c0 4-2 6-2 8 h-6 c0-2-2-4-2-8z M715 184 h10 M716 187 h8" fill="none" stroke="rgba(212,162,84,0.4)" strokeWidth="1.2" strokeLinecap="round"/>
        </g>
        <g style={{ animation: "heroFloat3 7s ease-in-out infinite" }}>
          <polygon points="680,230 710,250 650,250" fill="none" stroke="rgba(13,148,136,0.25)" strokeWidth="1.5"/>
        </g>
        <line x1="500" y1="0" x2="800" y2="200" stroke="rgba(129,140,248,0.05)" strokeWidth="1"/>
        <line x1="0" y1="200" x2="400" y2="280" stroke="rgba(13,148,136,0.04)" strokeWidth="1"/>
        <circle cx="150" cy="50" r="60" fill="rgba(79,91,213,0.04)" style={{ animation: "heroPulse 4s ease infinite" }}/>
        <circle cx="700" cy="140" r="80" fill="rgba(212,162,84,0.03)" style={{ animation: "heroPulse 5s ease infinite 1s" }}/>
      </svg>
      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, padding: "36px 32px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <img src="/logo-aworthy.jpeg" alt="" style={{ height: 60, objectFit: "contain", borderRadius: 10 }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>A Worthy · Learning Platform</span>
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#FEFEFE", fontFamily: "'Bricolage Grotesque', sans-serif", lineHeight: 1.15, letterSpacing: "-0.03em", maxWidth: 480 }}>Master Every<br/><span style={{ background: "linear-gradient(135deg, #E8C078, #D4A254)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Question Type</span></div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 10, maxWidth: 400, lineHeight: 1.6, fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300 }}>Structured frameworks for O-Level English, GP, and Economics.</div>
      </div>
      {/* Frosted stat bar */}
      <div style={{ position: "relative", zIndex: 3, display: "flex", justifyContent: "flex-start", gap: 0, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {[
          { label: "Subjects", value: "5", icon: "📚" },
          { label: "Question Types", value: "Every", icon: "🎯" },
          { label: "Approach", value: "Structured", icon: "🏗️" },
        ].map((s, i) => (
          <div key={s.label} style={{ flex: 1, textAlign: "center", padding: "12px 20px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{s.icon} {s.value}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ━━━ STUDENT DASHBOARD ━━━ */
function StudentDashboard({ state, dispatch, authUser, userProfile }) {
  const today = new Date().toISOString().split("T")[0];
  const myHomework = state.homework.filter(h => h.status === "active");
  const mySubs = state.submissions;
  const pendingHw = myHomework.filter(h => {
    const sub = mySubs.find(s => s.homeworkId === h.id);
    return sub && sub.status !== "graded" && sub.status !== "submitted";
  });
  const gradedHw = mySubs.filter(s => s.status === "graded");

  return (
    <div>
      {/* Welcome — enhanced glassmorphism hero card */}
      {(() => {
        const hour = new Date().getHours();
        const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
        const greetEmoji = hour < 12 ? "🌅" : hour < 17 ? "☀️" : "🌙";
        const firstName = (userProfile?.name || authUser?.displayName || authUser?.email || "Scholar").split(" ")[0].split("@")[0];
        const pendingCount = myHomework.filter(h => !mySubs.find(s => s.homeworkId === h.id && (s.status === "graded" || s.status === "submitted"))).length;
        return (
          <div style={{ marginBottom: 24, background: "linear-gradient(135deg, #0F172A 0%, #1E2A4A 45%, #2D3A8C 100%)", borderRadius: T.r4, padding: "28px 24px 22px", position: "relative", overflow: "hidden" }}>
            {/* Background accents */}
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(212,162,84,0.14), transparent 50%), radial-gradient(circle at 10% 80%, rgba(79,91,213,0.1), transparent 50%)" }} />
            <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", border: "1px solid rgba(212,162,84,0.08)" }} />
            <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", border: "1px solid rgba(212,162,84,0.06)" }} />
            <div style={{ position: "absolute", bottom: -30, left: -20, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,91,213,0.2), transparent 70%)" }} />

            {/* Content */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#D4A254", textTransform: "uppercase", letterSpacing: 1.5, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 6px #22C55E" }} />
                  Student Dashboard
                </div>
                {pendingCount > 0 && (
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: "rgba(220,38,38,0.7)", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(220,38,38,0.4)" }}>
                    {pendingCount} pending
                  </div>
                )}
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", fontFamily: "'Bricolage Grotesque', sans-serif", margin: "0 0 4px", letterSpacing: "-0.03em" }}>
                {greetEmoji} {greeting}, {firstName}!
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 18px", fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300 }}>
                {new Date().toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long" })} · Keep up the great work!
              </p>

              {/* Stat pills — 4 stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {[
                  { value: state.wallet.coins, label: "Coins", emoji: "🪙", color: "#D4A254" },
                  { value: state.wallet.streak, label: "Streak", emoji: "🔥", color: "#818CF8" },
                  { value: gradedHw.length, label: "Graded", emoji: "✅", color: "#22C55E" },
                  { value: state.wallet.level || 1, label: "Level", emoji: "⭐", color: "#F59E0B" },
                ].map(stat => (
                  <div key={stat.label} style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: 12, padding: "12px 10px", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: stat.color, fontFamily: "'Bricolage Grotesque', sans-serif", lineHeight: 1 }}>{stat.value}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginTop: 4, letterSpacing: "0.05em" }}>{stat.emoji} {stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Exam Countdown */}
      {(() => {
        const exams = getExamCountdowns().slice(0, 3);
        return exams.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 10, fontFamily: "'Bricolage Grotesque', sans-serif" }}>⏳ Exam Countdown</div>
            <div style={{ display: "flex", gap: 8 }}>
              {exams.map((e, i) => {
                const theme = T[e.subject] || T.eng;
                const urgent = e.daysLeft <= 30;
                return (
                  <div key={i} className="card-enter" style={{ "--i": i, flex: 1, background: urgent ? T.dangerBg : T.bgCard, borderRadius: T.r2, padding: "12px", border: `1px solid ${urgent ? T.danger + "33" : T.border}`, textAlign: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: urgent ? T.danger : theme.accent, fontFamily: "'JetBrains Mono', monospace" }}>{e.daysLeft}</div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: T.textTer, textTransform: "uppercase" }}>days</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: T.text, marginTop: 4 }}>{e.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Daily Challenge */}
      {(() => {
        const challenge = getDailyChallenge();
        const theme = T[challenge.subject] || T.eng;
        return (
          <div style={{ marginBottom: 20, background: "linear-gradient(135deg, #0F172A, #1E2A4A)", borderRadius: T.r3, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -10, right: -10, fontSize: 60, opacity: 0.06 }}>🎯</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 12 }}>🎯</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#D4A254", textTransform: "uppercase", letterSpacing: 1 }}>Daily Challenge</span>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginLeft: "auto", background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 10 }}>{challenge.type}</span>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>{challenge.question}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>Complete for +10 coins · Refreshes daily</div>
          </div>
        );
      })()}

      {/* Word of the Day */}
      {(() => {
        const wotd = getWordOfTheDay();
        const theme = T[wotd.subject] || T.eng;
        return (
          <div style={{ marginBottom: 16, background: T.bgCard, borderRadius: T.r2, padding: "14px 16px", border: `1px solid ${T.border}`, borderLeft: `3px solid ${theme.accent}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: T.gold, textTransform: "uppercase", letterSpacing: 0.5 }}>📖 Word of the Day</span>
              <span style={{ fontSize: 9, color: T.textTer }}>{getSubject(wotd.subject)?.name}</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{wotd.word}</div>
            <div style={{ fontSize: 12, color: T.textSec, marginTop: 2 }}>{wotd.def}</div>
            <div style={{ fontSize: 11, color: T.textTer, marginTop: 6, fontStyle: "italic", lineHeight: 1.5 }}>"{wotd.usage}"</div>
          </div>
        );
      })()}

      {/* Pomodoro Timer */}
      <div style={{ marginBottom: 20 }}>
        <PomodoroTimer dispatch={dispatch} />
      </div>

      {/* Streak Calendar */}
      <div style={{ marginBottom: 20 }}>
        <StreakCalendar wallet={state.wallet} />
      </div>

      {/* Pending homework */}
      {pendingHw.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 10 }}>Homework Due</div>
          {pendingHw.map(h => (
            <div key={h.id} onClick={() => dispatch({ type: "SET_PAGE", payload: "homework" })}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r2, marginBottom: 6, cursor: "pointer" }}>
              <span style={{ fontSize: 18 }}>📋</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{h.title}</div>
                <div style={{ fontSize: 11, color: h.dueDate < today ? T.danger : T.textTer }}>Due {h.dueDate}{h.dueDate < today ? " — OVERDUE" : ""}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent grades */}
      {gradedHw.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 10 }}>Recent Grades</div>
          {gradedHw.slice(0, 5).map(sub => {
            const hw = state.homework.find(h => h.id === sub.homeworkId);
            return (
              <div key={sub.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r2, marginBottom: 4 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: T.success, fontFamily: "'Bricolage Grotesque', sans-serif", minWidth: 32 }}>{sub.grade}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{hw?.title || "Homework"}</div>
                  {sub.gradeComment && <div style={{ fontSize: 11, color: T.textTer, marginTop: 2 }}>{sub.gradeComment.slice(0, 60)}...</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Quick Actions</div>
        <div style={{ fontSize: 11, color: T.textTer, fontWeight: 500 }}>Jump right in</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 4 }}>
        {[
          { label: "Practice Drills", sub: "GP & English", page: "practice", icon: "🎯", bg: "linear-gradient(135deg, #FFF4EC, #FDE8D8)", border: "#F0DDD0", accent: "#EA580C" },
          { label: "Games", sub: "20+ games", page: "games-eng", icon: "🚀", bg: "linear-gradient(135deg, #EEF0FF, #DDE1FF)", border: "#C8CEFF", accent: "#4F5BD5" },
          { label: "Infographics", sub: "Visual notes", page: "infographics", icon: "✨", bg: "linear-gradient(135deg, #FFF8EC, #FEF0D0)", border: "#F0E8D0", accent: "#D97706" },
          { label: "Events", sub: "Prizes & more", page: "events", icon: "🎉", bg: "linear-gradient(135deg, #FFF0F0, #FFE0E0)", border: "#F0D8D8", accent: "#DC2626" },
          { label: "Community", sub: "Chat & share", page: "community", icon: "🤝", bg: "linear-gradient(135deg, #ECFAF2, #D4F5E4)", border: "#C0EDCE", accent: "#16A34A" },
        ].map((a, i) => (
          <button key={a.page} onClick={() => dispatch({ type: "SET_PAGE", payload: a.page })}
            className="card-lift card-enter"
            style={{ "--i": i, padding: "16px 12px", borderRadius: T.r3, background: a.bg, border: `1px solid ${a.border}`, cursor: "pointer", textAlign: "center", transition: "transform 0.15s ease, box-shadow 0.15s ease" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = T.shadow3; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{a.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 2 }}>{a.label}</div>
            <div style={{ fontSize: 10, color: T.textTer, fontWeight: 500 }}>{a.sub}</div>
          </button>
        ))}
      </div>

      {/* Study Plan */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 12, fontFamily: "'Bricolage Grotesque', sans-serif" }}>📅 Your Study Plan</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {generateStudyPlan(state).slice(0, 5).map((day, i) => {
            const theme = T[day.subjectId] || T.eng;
            return (
              <div key={i} className="card-enter" style={{ "--i": i, display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, borderLeft: `3px solid ${theme.accent}` }}>
                <div style={{ textAlign: "center", minWidth: 40 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: T.textTer }}>{day.day.slice(0, 3)}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>{day.date.split(" ")[1]}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.accent }}>{day.subject}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    {day.tasks.map((t, j) => (
                      <span key={j} style={{ fontSize: 10, color: T.textSec, background: T.bgMuted, padding: "2px 8px", borderRadius: 10 }}>{t.icon} {t.type} · {t.duration}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Progress Summary */}
      {(() => {
        const wp = getWeeklyProgress(state);
        return (
          <div style={{ marginTop: 20, background: T.bgCard, borderRadius: T.r3, padding: "18px 20px", border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 12, fontFamily: "'Bricolage Grotesque', sans-serif" }}>📊 This Week's Progress</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[
                { label: "Homework", value: wp.hwCompleted, icon: "📋", color: T.accent },
                { label: "Notes", value: wp.notesCreated, icon: "📝", color: T.teal },
                { label: "Reviews", value: wp.reviewsGiven, icon: "👀", color: T.success },
                { label: "Streak", value: `${wp.streakDays}d`, icon: "🔥", color: T.gold },
                { label: "Coins", value: `+${wp.coinsEarned}`, icon: "🪙", color: T.goldDark },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center", padding: "8px", borderRadius: T.r1, background: T.bgMuted }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: T.textTer }}>{s.icon} {s.label}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Shareable Progress Card */}
      <div style={{ marginTop: 20 }}>
        <ShareableProgressCard state={state} />
      </div>
    </div>
  );
}

function Dashboard({ state, dispatch, authUser, userProfile }) {
  // If student role, show student dashboard
  if (state.role === "student") return <StudentDashboard state={state} dispatch={dispatch} authUser={authUser} userProfile={userProfile} />;

  const subjectProgress = SUBJECTS.map((s) => ({ ...s, progress: Math.floor(Math.random() * 40 + 30) }));
  const actIcons = { award: Trophy, upload: Upload, check: CheckCircle, play: Play, exam: Exam, plus: Plus };

  const pendingSubmissions = state.submissions.filter(s => s.status === "submitted").length;
  const activeHomework = state.homework.filter(h => h.status === "active").length;
  const todaySessions = state.sessions.filter(s => s.date === new Date().toISOString().split("T")[0]).length;

  return (
    <div>
      {/* 3D Hero Scene */}
      <HeroScene3D />

      {/* Tutor Hero Card */}
      <div style={{ borderRadius: T.r3, background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #2D3A8C 100%)", padding: "28px 32px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(212,162,84,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, right: 80, width: 160, height: 160, borderRadius: "50%", background: "rgba(45,58,140,0.3)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'Bricolage Grotesque', sans-serif" }}>✦ The A-Worthy World</div>
              <h1 style={{ color: "#fff", fontSize: 30, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.03em", fontFamily: "'Bricolage Grotesque', sans-serif", lineHeight: 1.15 }}>Welcome back, Creator J</h1>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: 0, fontWeight: 300, fontFamily: "'Fraunces', serif", fontStyle: "italic" }}>Your students are waiting — let's make today count.</p>
            </div>
            {/* Alert pills */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
              {pendingSubmissions > 0 && (
                <button onClick={() => dispatch({ type: "SET_PAGE", payload: "homework" })} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 20, padding: "6px 14px", cursor: "pointer", color: "#FCA5A5", fontSize: 12, fontWeight: 700 }}>
                  <Bell size={13} weight="fill" />{pendingSubmissions} to grade
                </button>
              )}
              {activeHomework > 0 && (
                <button onClick={() => dispatch({ type: "SET_PAGE", payload: "homework" })} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 20, padding: "6px 14px", cursor: "pointer", color: "#FDE68A", fontSize: 12, fontWeight: 700 }}>
                  <ClipboardText size={13} weight="fill" />{activeHomework} active tasks
                </button>
              )}
            </div>
          </div>
          {/* Quick action buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
            {[
              { label: "Take Attendance", icon: CalendarCheck, page: "attendance", color: "#60A5FA" },
              { label: "Grade Homework", icon: ClipboardText, page: "homework", color: "#86EFAC" },
              { label: "View Progress", icon: ChartBar, page: "progress", color: "#C4B5FD" },
              { label: "Community", icon: Handshake, page: "community", color: T.gold },
            ].map(a => (
              <button key={a.label} onClick={() => dispatch({ type: "SET_PAGE", payload: a.page })} style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: T.r2, padding: "9px 16px", cursor: "pointer", color: a.color, fontSize: 12, fontWeight: 700, transition: "all 0.15s", backdropFilter: "blur(4px)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "none"; }}>
                <a.icon size={14} weight="duotone" />{a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats — card grid with icon containers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 28 }}>
        {[
          { icon: FolderSimpleStar, value: state.resources.length, label: "Resources", color: T.accent, bg: T.accentLight, page: "library" },
          { icon: PlayCircle, value: state.videoLessons.length, label: "Videos", color: "#A85A38", bg: "#F6EAE4", page: "videos" },
          { icon: Lightning, value: state.quizzes.length, label: "Quizzes", color: "#C49030", bg: "#F6F0E0", page: "quizzes" },
          { icon: Users, value: state.students.length, label: "Students", color: "#4A8E9E", bg: "#E4EFF2", page: "progress" },
          { icon: CalendarCheck, value: state.sessions.length, label: "Sessions", color: "#3B6EA6", bg: "#E8EFF6", page: "attendance" },
          { icon: Handshake, value: (state.posts || []).length, label: "Community", color: "#2E8058", bg: "#E4F0EA", page: "community" },
        ].map((s, i) => (
          <div key={s.label} className="card-lift card-enter" style={{ "--i": i, cursor: "pointer", padding: "16px", background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, transition: "all 0.2s" }} onClick={() => dispatch({ type: "SET_PAGE", payload: s.page })}
            onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + "60"; e.currentTarget.style.boxShadow = `0 4px 20px ${s.color}18`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ width: 36, height: 36, borderRadius: T.r2, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 10, fontWeight: 500, color: T.textTer, marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Bricolage Grotesque', sans-serif" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Subjects */}
      {/* Streak Calendar */}
      <div style={{ marginBottom: 24 }}>
        <StreakCalendar wallet={state.wallet} />
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: "0 0 16px", letterSpacing: "-0.03em", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Your Subjects</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14, marginBottom: 28 }}>
        {subjectProgress.map((s, idx) => {
          const theme = getSubjectTheme(s.id);
          return (
            <Card key={s.id} className="card-enter card-lift" style={{ "--i": idx, padding: 0, overflow: "hidden" }} onClick={() => dispatch({ type: "SET_PAGE", payload: "library" })} elevated>
              {/* Subject illustration header */}
              <div style={{ position: "relative", overflow: "hidden" }}>
                <SubjectIllustration subject={s.id} size={240} />
                <div style={{ position: "absolute", top: 10, left: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: T.r2, background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    <BookOpen size={16} color={theme.accent} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: theme.accent, background: "rgba(255,255,255,0.85)", padding: "2px 10px", borderRadius: 20, backdropFilter: "blur(4px)" }}>{TOPICS[s.id]?.length || 0} topics</span>
                </div>
              </div>
              <div style={{ padding: "14px 16px 16px" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 8 }}>{s.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.textSec, marginBottom: 6 }}>
                  <span>Progress</span><span style={{ color: theme.accent, fontWeight: 700 }}>{s.progress}%</span>
                </div>
                <Progress value={s.progress} color={theme.accent} bg={theme.bg} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Today's Classes */}
      {(() => {
        const todayClasses = state.sessions.filter(s => s.date === "2026-03-18");
        if (todayClasses.length === 0) return null;
        return (
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: "0 0 16px", letterSpacing: "-0.03em", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Today's Classes</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
              {todayClasses.map(session => {
                const theme = getSubjectTheme(session.subject);
                const students = state.students.filter(st => st.subjects.includes(session.subject));
                const rec = state.attendance[session.id] || {};
                const marked = Object.keys(rec).length;
                return (
                  <Card key={session.id} onClick={() => dispatch({ type: "SET_PAGE", payload: "attendance" })} elevated style={{ borderLeft: `3px solid ${theme.accent}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: T.r2, background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CalendarCheck size={20} weight="duotone" color={theme.accent} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 650, color: T.text }}>{getSubject(session.subject)?.name}</div>
                        <div style={{ fontSize: 12, color: T.textTer }}>{session.time}</div>
                      </div>
                      {marked < students.length ? (
                        <Badge color={T.warning} bg={T.warningBg}>{students.length - marked} unmarked</Badge>
                      ) : (
                        <Badge color={T.success} bg={T.successBg}><CheckCircle size={12} weight="fill" /> Done</Badge>
                      )}
                    </div>
                    {session.notes && <div style={{ fontSize: 12, color: T.textSec, background: T.bgMuted, padding: "6px 10px", borderRadius: T.r1 }}>{session.notes}</div>}
                    {!session.notes && <div style={{ fontSize: 12, color: T.textTer, fontStyle: "italic" }}>Click to take attendance</div>}
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Class Standings + Community Preview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 28 }}>
        <Card elevated style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: T.text, margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: "-0.02em" }}>🏆 Class Standings</h3>
            <button onClick={() => dispatch({ type: "SET_PAGE", payload: "leaderboard" })} style={{ background: T.accentLight, border: "none", borderRadius: 20, padding: "5px 14px", fontSize: 11, fontWeight: 700, color: T.accentText, cursor: "pointer", transition: "all 0.15s" }}>Full Leaderboard →</button>
          </div>
          {[...state.students].map(s => ({ ...s, xp: calcStudentXP(s, state) })).sort((a, b) => b.xp - a.xp).map((student, idx) => {
            const lv = getLevel(student.xp);
            const rankIcon = ["🥇", "🥈", "🥉"][idx] || `#${idx + 1}`;
            return (
              <div key={student.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: idx < state.students.length - 1 ? 14 : 0 }}>
                <span style={{ width: 24, fontSize: idx < 3 ? 18 : 12, textAlign: "center" }}>{rankIcon}</span>
                <StudentAvatar student={student} size={32} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 650, color: T.text }}>{student.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: lv.color, fontFamily: "'JetBrains Mono', monospace" }}>{student.xp} XP</span>
                  </div>
                  <Progress value={getLevelProgress(student.xp)} color={lv.color} bg={lv.bg} height={4} />
                </div>
              </div>
            );
          })}
        </Card>

        <Card elevated style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: T.text, margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: "-0.02em" }}>💬 Community</h3>
            <button onClick={() => dispatch({ type: "SET_PAGE", payload: "community" })} style={{ background: T.accentLight, border: "none", borderRadius: 20, padding: "5px 14px", fontSize: 11, fontWeight: 700, color: T.accentText, cursor: "pointer", transition: "all 0.15s" }}>View All →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(state.posts || []).slice(0, 3).map(post => (
              <div key={post.id} onClick={() => dispatch({ type: "SET_PAGE", payload: "community" })} style={{ cursor: "pointer", padding: "10px 12px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgMuted, transition: "all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = T.bgHover}
                onMouseLeave={e => e.currentTarget.style.background = T.bgMuted}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  {post.isAnnouncement && <span style={{ fontSize: 10, fontWeight: 700, color: "#92400E", background: "#FEF3C7", padding: "1px 5px", borderRadius: 20 }}>📢</span>}
                  <span style={{ fontSize: 12, fontWeight: 650, color: T.text }}>{post.title}</span>
                </div>
                <div style={{ fontSize: 11, color: T.textTer }}>{post.author} · {post.comments.length} comments</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Activity + Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        <Card elevated style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: "0 0 18px" }}>Recent Activity</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {ACTIVITY_FEED.map((a) => {
              const Icon = actIcons[a.type] || BookOpen;
              return (
                <div key={a.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 32, height: 32, borderRadius: T.r1, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={15} weight="duotone" color={T.accent} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: T.text, lineHeight: 1.5 }}>{a.text}</div>
                    <div style={{ fontSize: 11, color: T.textTer, marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card elevated style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: "0 0 18px" }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[{ label: "Take Attendance", icon: CalendarCheck, page: "attendance", color: "#3F51EC" },
              { label: "Upload New Resource", icon: Upload, page: "library", color: "#0C8CE9" },
              { label: "Create a Quiz", icon: Lightning, page: "quizzes", color: "#6660B9" },
              { label: "View Student Progress", icon: ChartLineUp, page: "progress", color: "#00A85A" },
              { label: "Start Mock Exam", icon: Target, page: "exams", color: "#E07800" }
            ].map((item) => (
                <button key={item.label} onClick={() => dispatch({ type: "SET_PAGE", payload: item.page })}
                  onMouseEnter={(e) => e.currentTarget.style.background = T.bgHover}
                  onMouseLeave={(e) => e.currentTarget.style.background = T.bgMuted}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: T.bgMuted, borderRadius: T.r2, border: "none", cursor: "pointer", transition: "all 0.15s", width: "100%", textAlign: "left" }}>
                  <div style={{ width: 32, height: 32, borderRadius: T.r1, background: item.color + "14", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <item.icon size={16} weight="duotone" color={item.color} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{item.label}</span>
                  <CaretRight size={14} weight="bold" color={T.textTer} style={{ marginLeft: "auto" }} />
                </button>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}


export { StudentDashboard };
export default Dashboard;
