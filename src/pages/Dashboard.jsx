import React, { useMemo } from 'react';
import { T } from '../theme/theme.js';
import { House, Books, VideoCamera, Lightning, Target, Lightbulb, RocketLaunch, Flame, Trophy, Crown, Medal, Star, Sparkle, Gift, Confetti, CheckCircle, ChartLineUp, CalendarBlank, Clock, ArrowRight, Brain, GraduationCap, BookOpen, ClipboardText, Scroll, PencilSimpleLine, Notebook, Bell, CalendarCheck, ChartBar, Handshake, FolderSimpleStar, PlayCircle, Users, Upload, Play, Exam, Plus, CaretRight, Timer, Megaphone, ChatText, Eye, FlowArrow } from '../icons/icons.jsx';
import { Card, Btn, Badge, SubjectBadge, Progress, StatCard, SubjectIllustration } from '../components/ui';
import { XPBar, BadgeChip, StudentAvatar, PodiumCard, StreakCalendar, ShareableProgressCard } from '../components/gamification';
import { calcStudentXP, getLevel, getLevelProgress } from '../utils/gamificationUtils.js';
import { getSubject, getSubjectTheme, getExamCountdowns, getDailyChallenge, getWeeklyProgress, getWordOfTheDay, generateStudyPlan } from '../utils/helpers.js';
import PomodoroTimer from './tools/PomodoroTimer.jsx';
import { SUBJECTS, TOPICS } from '../data/subjects.js';
import { LEVELS, BADGE_DEFS, AVATAR_OPTIONS } from '../data/gamification.js';
import { ACTIVITY_FEED } from '../data/seedData.js';

function HeroBanner() {
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
          <img src="/logo-aworthy.jpeg" alt="A Worthy logo" style={{ height: 60, objectFit: "contain", borderRadius: 10 }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: 2, textTransform: "uppercase", fontFamily: T.fontMono }}>A Worthy · Learning Platform</span>
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#FEFEFE", fontFamily: T.fontDisplay, lineHeight: 1.15, letterSpacing: "-0.03em", maxWidth: 480 }}>Master Every<br/><span style={{ background: "linear-gradient(135deg, #E8C078, #D4A254)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Question Type</span></div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", marginTop: 10, maxWidth: 400, lineHeight: 1.6, fontFamily: T.fontSerif, fontStyle: "italic", fontWeight: 300 }}>Structured frameworks for O-Level English, GP, and Economics.</div>
      </div>
      {/* Frosted stat bar */}
      <div style={{ position: "relative", zIndex: 3, display: "flex", justifyContent: "flex-start", gap: 0, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {[
          { label: "Subjects", value: "5", icon: <BookOpen size={13} color="rgba(255,255,255,0.9)" /> },
          { label: "Question Types", value: "Every", icon: <Target size={13} color="rgba(255,255,255,0.9)" /> },
          { label: "Approach", value: "Structured", icon: <FlowArrow size={13} color="rgba(255,255,255,0.9)" /> },
        ].map((s, i) => (
          <div key={s.label} style={{ flex: 1, textAlign: "center", padding: "12px 20px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{s.icon} {s.value}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ━━━ STUDENT DASHBOARD SUB-COMPONENTS ━━━ */

function WelcomeHero({ state, authUser, userProfile, myHomework, mySubs, gradedHw }) {
  const firstName = (userProfile?.name || authUser?.displayName || authUser?.email || "Scholar").split(" ")[0].split("@")[0];
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const overdueCount = myHomework.filter(h => h.dueDate < today.toISOString().split("T")[0] && !mySubs.find(s => s.homeworkId === h.id && s.status === "graded")).length;
  const pendingCount = myHomework.filter(h => !mySubs.find(s => s.homeworkId === h.id && (s.status === "graded" || s.status === "submitted"))).length;

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Newspaper masthead strip */}
      <div style={{ borderBottom: `2px solid ${T.text}`, paddingBottom: 8, marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: T.textTer, fontWeight: 600 }}>
          {dateStr} · Singapore
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: T.textTer, fontWeight: 600 }}>
          <span>Coins: <b style={{ color: T.text }}>{state.wallet.coins}</b></span>
          <span>Streak: <b style={{ color: T.text }}>{state.wallet.streak}d</b></span>
          <span>Graded: <b style={{ color: T.text }}>{gradedHw.length}</b></span>
        </div>
      </div>

      {/* Large editorial headline */}
      <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: 46, lineHeight: 1.05, letterSpacing: "-0.025em", marginBottom: 10 }}>
        Welcome back, <em style={{ color: T.accent, fontStyle: "italic" }}>{firstName}</em>.
        {overdueCount > 0 && (
          <><br /><span style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: 36, color: T.oxblood, fontStyle: "italic" }}>
            {overdueCount} essay{overdueCount > 1 ? "s" : ""} overdue.
          </span></>
        )}
        {overdueCount === 0 && pendingCount > 0 && (
          <><br /><span style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: 36, color: T.textSec, fontStyle: "italic" }}>
            {pendingCount} task{pendingCount > 1 ? "s" : ""} waiting.
          </span></>
        )}
        {overdueCount === 0 && pendingCount === 0 && (
          <><br /><span style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: 36, color: T.textSec, fontStyle: "italic" }}>
            All caught up.
          </span></>
        )}
      </h1>
    </div>
  );
}

function ExamCountdownSection() {
  const exams = getExamCountdowns().slice(0, 3);
  if (exams.length === 0) return null;
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <div style={{ fontSize: 9.5, letterSpacing: "0.28em", textTransform: "uppercase", color: T.textTer, fontWeight: 700 }}>
          Examinations · Countdown
        </div>
        <div style={{ fontSize: 10, color: T.textTer }}>MOE / SEAB / CAIE</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${exams.length}, 1fr)`, gap: 12 }}>
        {exams.map((e, i) => {
          const theme = T[e.subject] || T.eng;
          const urgent = e.daysLeft <= 30;
          return (
            <div key={i} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r3, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 4, alignSelf: "stretch", background: urgent ? T.oxblood : theme.accent, borderRadius: 4, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: T.fontSerif, fontSize: 15, lineHeight: 1.15 }}>{e.name}</div>
                <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: T.textTer, marginTop: 3 }}>Paper {i + 1}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: T.fontDisplay, fontWeight: 500, fontSize: 42, lineHeight: 0.95, color: urgent ? T.oxblood : theme.accent, letterSpacing: "-0.04em" }}>{e.daysLeft}</div>
                <div style={{ fontSize: 9.5, letterSpacing: "0.2em", textTransform: "uppercase", color: T.textTer, marginTop: 4 }}>days</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DailyChallengeSection() {
  const challenge = getDailyChallenge();
  return (
    <div style={{ marginBottom: 24, background: T.bgSidebar, borderRadius: T.r4, padding: "24px 26px", position: "relative", overflow: "hidden", color: "#e9e2ce" }}>
      {/* Decorative monogram */}
      <div style={{ position: "absolute", right: -16, bottom: -50, fontFamily: T.fontSerif, fontStyle: "italic", fontSize: 190, lineHeight: 1, color: "rgba(199,154,69,0.09)", userSelect: "none", pointerEvents: "none" }}>aw</div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 9.5, letterSpacing: "0.28em", textTransform: "uppercase", color: "#c79a45", fontWeight: 700, marginBottom: 4 }}>
          Today's Brief · Daily Challenge
        </div>
        <div style={{ fontFamily: T.fontSerif, fontStyle: "italic", fontSize: 13, color: "#c79a45", marginBottom: 6 }}>{challenge.type}</div>
        <div style={{ fontFamily: T.fontDisplay, fontSize: 22, fontWeight: 400, lineHeight: 1.2, letterSpacing: "-0.01em", marginBottom: 12 }}>
          "{challenge.question}"
        </div>
        <div style={{ fontSize: 12.5, color: "rgba(233,226,206,0.7)", lineHeight: 1.55, maxWidth: 540, marginBottom: 18 }}>
          Write a compelling opening paragraph. Stake a position by sentence two; reserve evidence for the third.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button style={{ background: "#c79a45", color: T.bgSidebar, border: "none", padding: "10px 22px", borderRadius: 999, fontWeight: 700, fontSize: 13, fontFamily: "inherit", letterSpacing: "0.02em", cursor: "pointer" }}>
            Begin the Brief
          </button>
          <div style={{ fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "#c79a45" }}>
            +10 coins · refreshes 24:00
          </div>
        </div>
      </div>
    </div>
  );
}

function WordOfTheDaySection() {
  const wotd = getWordOfTheDay();
  return (
    <div style={{ marginBottom: 24, background: T.bgCard, borderRadius: T.r3, padding: "20px 22px", border: `1px solid ${T.border}` }}>
      <div style={{ fontSize: 9.5, letterSpacing: "0.28em", textTransform: "uppercase", color: T.accent, fontWeight: 700, marginBottom: 10 }}>
        Lexicon · {getSubject(wotd.subject)?.name}
      </div>
      <div style={{ fontFamily: T.fontDisplay, fontSize: 38, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 4 }}>{wotd.word}</div>
      <div style={{ fontFamily: T.fontSerif, fontStyle: "italic", fontSize: 13, color: T.textFaint || T.textTer, marginBottom: 10 }}>
        · adj.
      </div>
      <div style={{ fontSize: 14, color: T.text, marginBottom: 10, lineHeight: 1.5 }}>{wotd.def}</div>
      <div style={{ fontFamily: T.fontSerif, fontStyle: "italic", fontSize: 13.5, color: T.textSec, borderLeft: `2px solid ${T.accent}`, paddingLeft: 12, lineHeight: 1.55 }}>
        "{wotd.usage}"
      </div>
    </div>
  );
}

function WeeklyProgressSection({ state }) {
  const wp = getWeeklyProgress(state);
  return (
    <div style={{ marginTop: 20, background: T.bgCard, borderRadius: T.r3, padding: "18px 20px", border: `1px solid ${T.border}` }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 12, fontFamily: T.fontDisplay, display: "flex", alignItems: "center", gap: 6 }}><ChartLineUp size={15} color={T.text} /> This Week's Progress</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {[
          { label: "Homework", value: wp.hwCompleted, icon: <ClipboardText size={10} color={T.accent} />, color: T.accent },
          { label: "Notes", value: wp.notesCreated, icon: <PencilSimpleLine size={10} color={T.teal} />, color: T.teal },
          { label: "Reviews", value: wp.reviewsGiven, icon: <Eye size={10} color={T.success} />, color: T.success },
          { label: "Streak", value: `${wp.streakDays}d`, icon: <Flame size={10} color={T.gold} />, color: T.gold },
          { label: "Coins", value: `+${wp.coinsEarned}`, icon: <span style={{ fontWeight: 700, fontSize: 10, color: T.goldDark }}>$</span>, color: T.goldDark },
        ].map(s => (
          <div key={s.label} style={{ textAlign: "center", padding: "8px", borderRadius: T.r1, background: T.bgMuted }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color, fontFamily: T.fontDisplay }}>{s.value}</div>
            <div style={{ fontSize: 10, color: T.textTer, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>{s.icon} {s.label}</div>
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
      <WelcomeHero state={state} authUser={authUser} userProfile={userProfile} myHomework={myHomework} mySubs={mySubs} gradedHw={gradedHw} />

      {/* Exam Countdown */}
      <ExamCountdownSection />

      {/* Daily Challenge */}
      <DailyChallengeSection />

      {/* Word of the Day */}
      <WordOfTheDaySection />

      {/* Pomodoro Timer */}
      <div style={{ marginBottom: 20 }}>
        <PomodoroTimer dispatch={dispatch} />
      </div>

      {/* Streak Calendar */}
      <div style={{ marginBottom: 20 }}>
        <StreakCalendar wallet={state.wallet} />
      </div>

      {/* Your Agenda — combined homework + grades */}
      {(pendingHw.length > 0 || gradedHw.length > 0) && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <h3 style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: 22, letterSpacing: "-0.01em", margin: 0 }}>Your Agenda</h3>
            <div style={{ fontSize: 9.5, letterSpacing: "0.22em", textTransform: "uppercase", color: T.accent, fontWeight: 700 }}>
              {pendingHw.length + gradedHw.slice(0,3).length} entries
            </div>
          </div>
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r3, overflow: "hidden" }}>
            {pendingHw.map((h, i) => {
              const overdue = h.dueDate < today;
              return (
                <div key={h.id} onClick={() => dispatch({ type: "SET_PAGE", payload: "homework" })}
                  role="button" tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") dispatch({ type: "SET_PAGE", payload: "homework" }); }}
                  style={{ display: "grid", gridTemplateColumns: "68px 1fr 120px", alignItems: "center", gap: 14, padding: "13px 18px", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: 16, color: T.textSec, fontWeight: overdue ? 600 : 400 }}>{h.dueDate?.slice(5).replace("-", " ")}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{h.title}</div>
                    <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textTer, marginTop: 2 }}>{h.subject || "Assignment"}</div>
                  </div>
                  <div style={{ fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "right", color: overdue ? T.oxblood : T.accent, fontWeight: 700 }}>
                    {overdue ? "Overdue" : `Due ${h.dueDate?.slice(8)} ${new Date(h.dueDate).toLocaleString("en-SG", { month: "short" })}`}
                  </div>
                </div>
              );
            })}
            {gradedHw.slice(0, 3).map((sub, i) => {
              const hw = state.homework.find(h => h.id === sub.homeworkId);
              const isLast = i === Math.min(gradedHw.length, 3) - 1 && pendingHw.length === 0;
              return (
                <div key={sub.id} style={{ display: "grid", gridTemplateColumns: "68px 1fr 120px", alignItems: "center", gap: 14, padding: "13px 18px", borderBottom: isLast ? "none" : `1px solid ${T.border}` }}>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: 16, color: T.textSec }}>{sub.gradedAt?.slice(5).replace("-", " ") || "—"}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{hw?.title || "Homework"}</div>
                    {sub.gradeComment && <div style={{ fontSize: 11, color: T.textTer, marginTop: 2 }}>{sub.gradeComment.slice(0, 55)}…</div>}
                  </div>
                  <div style={{ fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "right", color: T.success, fontWeight: 700 }}>
                    Graded · {sub.grade}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div style={{ marginBottom: 8 }}>
        <h3 style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: 22, letterSpacing: "-0.01em", margin: "0 0 12px" }}>Jump In</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
          {[
            { label: "Practice Drills", sub: "GP & English",  page: "practice",    accent: T.eng.accent    },
            { label: "Games",           sub: "20+ games",     page: "games-eng",   accent: T.h1econ.accent },
            { label: "Infographics",    sub: "Visual notes",  page: "infographics", accent: T.accent       },
            { label: "Events",          sub: "Prizes & more", page: "events",      accent: T.oxblood       },
            { label: "Community",       sub: "Chat & share",  page: "community",   accent: T.success       },
          ].map((a, i) => (
            <button key={a.page} onClick={() => dispatch({ type: "SET_PAGE", payload: a.page })}
              className="card-lift card-enter"
              style={{ "--i": i, padding: "16px 12px", borderRadius: T.r3, background: T.bgCard, border: `1px solid ${T.border}`, cursor: "pointer", textAlign: "center", transition: "all 0.15s", borderTop: `3px solid ${a.accent}` }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = T.shadow2; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ fontFamily: T.fontDisplay, fontSize: 28, fontWeight: 400, color: a.accent, lineHeight: 1, marginBottom: 8 }}>
                {a.label.charAt(0)}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 2 }}>{a.label}</div>
              <div style={{ fontSize: 10, color: T.textTer, fontWeight: 500 }}>{a.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Study Plan */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <h3 style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: 22, letterSpacing: "-0.01em", margin: 0 }}>This Week</h3>
          <div style={{ fontSize: 9.5, color: T.textTer, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {new Date().toLocaleDateString("en-SG", { week: "long" }) ? `Wk ${Math.ceil(new Date().getDate() / 7)}` : ""}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {generateStudyPlan(state).slice(0, 5).map((day, i) => {
            const theme = T[day.subjectId] || T.eng;
            const isToday = day.day === new Date().toLocaleDateString("en-SG", { weekday: "long" });
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "72px 48px 1fr", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: i < 4 ? `1px solid ${T.border}` : "none", background: isToday ? "rgba(160,122,46,0.06)" : "transparent", borderRadius: isToday ? T.r1 : 0, paddingLeft: isToday ? 10 : 0, paddingRight: isToday ? 10 : 0, marginLeft: isToday ? -10 : 0 }}>
                <div style={{ fontFamily: T.fontDisplay, fontSize: 15, color: isToday ? T.accent : T.textSec, fontWeight: isToday ? 600 : 400 }}>{day.day.slice(0, 3)} {day.date.split(" ")[1]}</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: theme.accent, padding: "2px 6px", border: `1px solid ${theme.accent}`, borderRadius: 4, textAlign: "center" }}>
                  {day.subjectId?.slice(0, 3).toUpperCase()}
                </div>
                <div style={{ fontSize: 13, color: T.textSec }}>
                  {day.tasks.map(t => `${t.type} ${t.duration}`).join(" · ")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Progress Summary */}
      <WeeklyProgressSection state={state} />

      {/* Shareable Progress Card */}
      <div style={{ marginTop: 20 }}>
        <ShareableProgressCard state={state} />
      </div>
    </div>
  );
}

function Dashboard({ state, dispatch, authUser, userProfile }) {
  const subjectProgress = useMemo(() => SUBJECTS.map((s, i) => {
    const hash = ((i + 1) * 16807) % 2147483647;
    return { ...s, progress: (hash % 40) + 30 };
  }), []);

  // If student role, show student dashboard
  if (state.role === "student") return <StudentDashboard state={state} dispatch={dispatch} authUser={authUser} userProfile={userProfile} />;

  const actIcons = { award: Trophy, upload: Upload, check: CheckCircle, play: Play, exam: Exam, plus: Plus };

  const pendingSubmissions = state.submissions.filter(s => s.status === "submitted").length;
  const activeHomework = state.homework.filter(h => h.status === "active").length;

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Tutor Hero Card */}
      <div style={{ borderRadius: T.r3, background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #2D3A8C 100%)", padding: "28px 32px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(212,162,84,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, right: 80, width: 160, height: 160, borderRadius: "50%", background: "rgba(45,58,140,0.3)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8, fontFamily: T.fontDisplay, display: "flex", alignItems: "center", gap: 5 }}><Star size={11} color={T.gold} /> The A-Worthy World</div>
              <h1 style={{ color: "#fff", fontSize: 30, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.03em", fontFamily: T.fontDisplay, lineHeight: 1.15 }}>Welcome back, Jeremy</h1>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: 0, fontWeight: 300, fontFamily: T.fontSerif, fontStyle: "italic" }}>Your students are waiting — let's make today count.</p>
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
          <div key={s.label} className="card-lift card-enter"
            role="button" tabIndex={0}
            aria-label={`Go to ${s.label}`}
            onClick={() => dispatch({ type: "SET_PAGE", payload: s.page })}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); dispatch({ type: "SET_PAGE", payload: s.page }); } }}
            style={{ "--i": i, cursor: "pointer", padding: "16px", background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + "60"; e.currentTarget.style.boxShadow = `0 4px 20px ${s.color}18`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ width: 36, height: 36, borderRadius: T.r2, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.text, fontFamily: T.fontDisplay, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 10, fontWeight: 500, color: T.textTer, marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: T.fontDisplay }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Subjects */}
      {/* Streak Calendar */}
      <div style={{ marginBottom: 24 }}>
        <StreakCalendar wallet={state.wallet} />
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: "0 0 16px", letterSpacing: "-0.03em", fontFamily: T.fontDisplay }}>Your Subjects</h2>
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
        const todayClasses = state.sessions.filter(s => s.date === new Date().toISOString().split("T")[0]);
        if (todayClasses.length === 0) return null;
        return (
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: "0 0 16px", letterSpacing: "-0.03em", fontFamily: T.fontDisplay }}>Today's Classes</h2>
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
            <h3 style={{ fontSize: 16, fontWeight: 800, color: T.text, margin: 0, fontFamily: T.fontDisplay, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 6 }}><Trophy size={16} color={T.gold} /> Class Standings</h3>
            <button onClick={() => dispatch({ type: "SET_PAGE", payload: "leaderboard" })} style={{ background: T.accentLight, border: "none", borderRadius: 20, padding: "5px 14px", fontSize: 11, fontWeight: 700, color: T.accentText, cursor: "pointer", transition: "all 0.15s" }}>Full Leaderboard →</button>
          </div>
          {[...state.students].map(s => ({ ...s, xp: calcStudentXP(s, state) })).sort((a, b) => b.xp - a.xp).map((student, idx) => {
            const lv = getLevel(student.xp);
            const rankColors = ["#D4A254", "#A0AEC0", "#CD7F32"];
            const rankIcon = idx < 3 ? <Medal size={18} color={rankColors[idx]} /> : `#${idx + 1}`;
            return (
              <div key={student.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: idx < state.students.length - 1 ? 14 : 0 }}>
                <span style={{ width: 24, fontSize: idx < 3 ? 18 : 12, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>{rankIcon}</span>
                <StudentAvatar student={student} size={32} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 650, color: T.text }}>{student.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: lv.color, fontFamily: T.fontMono }}>{student.xp} XP</span>
                  </div>
                  <Progress value={getLevelProgress(student.xp)} color={lv.color} bg={lv.bg} height={4} />
                </div>
              </div>
            );
          })}
        </Card>

        <Card elevated style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: T.text, margin: 0, fontFamily: T.fontDisplay, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 6 }}><ChatText size={16} color={T.text} /> Community</h3>
            <button onClick={() => dispatch({ type: "SET_PAGE", payload: "community" })} style={{ background: T.accentLight, border: "none", borderRadius: 20, padding: "5px 14px", fontSize: 11, fontWeight: 700, color: T.accentText, cursor: "pointer", transition: "all 0.15s" }}>View All →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(state.posts || []).slice(0, 3).map(post => (
              <div key={post.id} onClick={() => dispatch({ type: "SET_PAGE", payload: "community" })}
                role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); dispatch({ type: "SET_PAGE", payload: "community" }); } }}
                style={{ cursor: "pointer", padding: "10px 12px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgMuted, transition: "all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = T.bgHover}
                onMouseLeave={e => e.currentTarget.style.background = T.bgMuted}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  {post.isAnnouncement && <span style={{ fontSize: 10, fontWeight: 700, color: "#92400E", background: "#FEF3C7", padding: "1px 5px", borderRadius: 20, display: "inline-flex", alignItems: "center" }}><Megaphone size={10} color="#92400E" /></span>}
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
