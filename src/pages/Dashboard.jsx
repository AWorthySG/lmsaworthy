import React, { useMemo } from 'react';
import { T } from '../theme/theme.js';
import { House, Books, VideoCamera, Lightning, Target, RocketLaunch, CheckCircle, ChartLineUp, Clock, ArrowRight, BookOpen, ClipboardText, PencilSimpleLine, Bell, CalendarCheck, ChartBar, Handshake, FolderSimpleStar, PlayCircle, Users, Upload, Play, Exam, Plus, CaretRight, Megaphone, ChatText, Eye, FlowArrow } from '../icons/icons.jsx';
import { Card, Btn, Badge, SubjectBadge, Progress, StatCard, SubjectIllustration } from '../components/ui';
import { getSubject, getSubjectTheme, getExamCountdowns, getDailyChallenge, getWeeklyProgress, getWordOfTheDay, generateStudyPlan } from '../utils/helpers.js';
import PomodoroTimer from './tools/PomodoroTimer.jsx';
import { SUBJECTS, TOPICS } from '../data/subjects.js';
import { ACTIVITY_FEED } from '../data/seedData.js';

function HeroBanner() {
  return (
    <div style={{ marginBottom: 24, borderRadius: T.r4, overflow: "hidden", border: `1px solid ${T.border}`, position: "relative", background: "linear-gradient(135deg, #0F172A 0%, #1E2A4A 40%, #2D3A8C 100%)" }}>
      <style>{`
        @keyframes heroFloat1 { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(8px,-12px) rotate(3deg); } }
        @keyframes heroFloat2 { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(-6px,10px) rotate(-2deg); } }
        @keyframes heroGradShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      `}</style>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(270deg, rgba(45,58,140,0.2), rgba(212,162,84,0.08), rgba(13,148,136,0.08), rgba(45,58,140,0.2))", backgroundSize: "400% 400%", animation: "heroGradShift 15s ease infinite" }} />
      <div style={{ position: "relative", zIndex: 2, padding: "36px 32px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <img src="/logo-aworthy.jpeg" alt="A Worthy logo" style={{ height: 60, objectFit: "contain", borderRadius: 10 }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: 2, textTransform: "uppercase", fontFamily: T.fontMono }}>A Worthy · Learning Platform</span>
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, color: "#FEFEFE", lineHeight: 1.15, letterSpacing: "-0.02em", maxWidth: 480 }}>Master Every<br/><span style={{ background: "linear-gradient(135deg, #E8C078, #D4A254)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Question Type</span></div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", marginTop: 10, maxWidth: 400, lineHeight: 1.6, fontWeight: 300 }}>Structured frameworks for O-Level English, GP, and Economics.</div>
      </div>
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

/* ━━━ STUDENT DASHBOARD ━━━ */

function WelcomeHero({ state, authUser, userProfile, myHomework, mySubs, gradedHw }) {
  const firstName = (userProfile?.name || authUser?.displayName || authUser?.email || "Scholar").split(" ")[0].split("@")[0];
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const overdueCount = myHomework.filter(h => h.dueDate < todayStr && !mySubs.find(s => s.homeworkId === h.id && s.status === "graded")).length;
  const pendingCount = myHomework.filter(h => !mySubs.find(s => s.homeworkId === h.id && (s.status === "graded" || s.status === "submitted"))).length;

  return (
    <div style={{ marginBottom: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: T.text, letterSpacing: "-0.02em", marginBottom: 6 }}>
        Good {today.getHours() < 12 ? "morning" : today.getHours() < 17 ? "afternoon" : "evening"}, {firstName}
      </h1>
      <p style={{ fontSize: 14, color: T.textSec, marginBottom: 20, lineHeight: 1.5 }}>
        {overdueCount > 0
          ? <span>You have <span style={{ color: T.danger, fontWeight: 600 }}>{overdueCount} overdue {overdueCount === 1 ? "assignment" : "assignments"}</span> — worth tackling first.</span>
          : pendingCount > 0
          ? <span>{pendingCount} {pendingCount === 1 ? "task" : "tasks"} waiting for you today.</span>
          : <span>You're all caught up. Keep the momentum going.</span>
        }
      </p>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {[
          { label: "Pending",  value: pendingCount },
          { label: "Graded",   value: gradedHw.length },
          { label: "Overdue",  value: overdueCount },
        ].map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <div style={{ width: 1, background: T.border, alignSelf: "stretch" }} />}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: s.label === "Overdue" && s.value > 0 ? T.danger : T.text, letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: T.textTer, marginTop: 1 }}>{s.label}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function ExamCountdownSection() {
  const exams = getExamCountdowns().slice(0, 3);
  if (exams.length === 0) return null;
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: T.textTer, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Exam Countdown</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {exams.map((e, i) => {
          const theme = T[e.subject] || T.eng;
          const urgent = e.daysLeft <= 30;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: urgent ? T.danger : theme.accent, flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{e.name}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: urgent ? T.danger : T.textSec }}>
                {e.daysLeft} <span style={{ fontSize: 11, fontWeight: 400, color: T.textTer }}>days</span>
              </span>
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
    <div style={{ marginBottom: 28, background: T.bgCard, borderRadius: T.r3, padding: "20px", border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.accent}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: T.accent, textTransform: "uppercase", letterSpacing: "0.06em" }}>Daily Challenge</span>
        <span style={{ fontSize: 11, color: T.textTer }}>{challenge.type}</span>
      </div>
      <p style={{ fontSize: 15, fontWeight: 500, color: T.text, lineHeight: 1.5, marginBottom: 14 }}>{challenge.question}</p>
      <button style={{ background: T.accent, color: "#fff", border: "none", padding: "8px 18px", borderRadius: T.r2, fontWeight: 600, fontSize: 13, fontFamily: "inherit", cursor: "pointer" }}>
        Start writing
      </button>
    </div>
  );
}

function WordOfTheDaySection() {
  const wotd = getWordOfTheDay();
  return (
    <div style={{ marginBottom: 28, background: T.bgCard, borderRadius: T.r3, padding: "18px 20px", border: `1px solid ${T.border}` }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: T.textTer, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Word of the Day</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 22, fontWeight: 600, color: T.text, letterSpacing: "-0.02em" }}>{wotd.word}</span>
        <span style={{ fontSize: 12, color: T.textTer }}>{getSubject(wotd.subject)?.name}</span>
      </div>
      <p style={{ fontSize: 13, color: T.textSec, marginBottom: 8, lineHeight: 1.5 }}>{wotd.def}</p>
      <p style={{ fontSize: 13, color: T.textTer, fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>"{wotd.usage}"</p>
    </div>
  );
}

function WeeklyProgressSection({ state }) {
  const wp = getWeeklyProgress(state);
  return (
    <div style={{ marginTop: 20, background: T.bgCard, borderRadius: T.r3, padding: "18px 20px", border: `1px solid ${T.border}` }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: T.textTer, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>This Week</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
        {[
          { label: "Done",    value: wp.hwCompleted,   color: T.accent },
          { label: "Notes",   value: wp.notesCreated,  color: T.teal },
          { label: "Reviews", value: wp.reviewsGiven,  color: T.success },
        ].map(s => (
          <div key={s.label} style={{ textAlign: "center", padding: "10px 4px", borderRadius: T.r2, background: T.bgMuted }}>
            <div style={{ fontSize: 17, fontWeight: 600, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</div>
            <div style={{ fontSize: 10, color: T.textTer, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
      <WelcomeHero state={state} authUser={authUser} userProfile={userProfile} myHomework={myHomework} mySubs={mySubs} gradedHw={gradedHw} />
      <ExamCountdownSection />
      <DailyChallengeSection />
      <WordOfTheDaySection />

      <div style={{ marginBottom: 20 }}>
        <PomodoroTimer dispatch={dispatch} />
      </div>

      {/* Your Agenda */}
      {(pendingHw.length > 0 || gradedHw.length > 0) && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.textTer, textTransform: "uppercase", letterSpacing: "0.06em" }}>Your Agenda</div>
            <div style={{ fontSize: 11, color: T.textTer }}>{pendingHw.length + gradedHw.slice(0,3).length} items</div>
          </div>
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r3, overflow: "hidden" }}>
            {pendingHw.map((h, i) => {
              const overdue = h.dueDate < today;
              return (
                <div key={h.id} onClick={() => dispatch({ type: "SET_PAGE", payload: "homework" })}
                  role="button" tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") dispatch({ type: "SET_PAGE", payload: "homework" }); }}
                  style={{ display: "grid", gridTemplateColumns: "68px 1fr 120px", alignItems: "center", gap: 14, padding: "13px 18px", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>
                  <div style={{ fontSize: 16, color: T.textSec, fontWeight: overdue ? 600 : 400 }}>{h.dueDate?.slice(5).replace("-", " ")}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{h.title}</div>
                    <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textTer, marginTop: 2 }}>{h.subject || "Assignment"}</div>
                  </div>
                  <div style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "right", color: overdue ? T.danger : T.accent, fontWeight: 700 }}>
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
                  <div style={{ fontSize: 16, color: T.textSec }}>{sub.gradedAt?.slice(5).replace("-", " ") || "—"}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{hw?.title || "Homework"}</div>
                    {sub.gradeComment && <div style={{ fontSize: 11, color: T.textTer, marginTop: 2 }}>{sub.gradeComment.slice(0, 55)}…</div>}
                  </div>
                  <div style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "right", color: T.success, fontWeight: 700 }}>
                    Graded · {sub.grade}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Jump In */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: T.textTer, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Jump In</div>
        <div style={{ background: T.bgCard, borderRadius: T.r3, border: `1px solid ${T.border}`, overflow: "hidden" }}>
          {[
            { label: "Practice Drills", sub: "GP & English",  page: "practice-gp",   accent: T.eng.accent    },
            { label: "Infographics",    sub: "Visual notes",  page: "infographics",  accent: T.accent        },
            { label: "Model Essays",    sub: "GP examples",   page: "modelessays",   accent: T.h1econ.accent },
            { label: "Events",          sub: "Prizes & more", page: "events",        accent: T.danger        },
            { label: "Community",       sub: "Chat & share",  page: "community",     accent: T.success       },
          ].map((a, i, arr) => (
            <button key={a.page} onClick={() => dispatch({ type: "SET_PAGE", payload: a.page })}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "11px 16px", background: "transparent", border: "none", borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none", cursor: "pointer", textAlign: "left", transition: "background 0.12s" }}
              onMouseEnter={e => e.currentTarget.style.background = T.bgMuted}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.accent, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{a.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: T.textTer }}>{a.sub}</span>
                <CaretRight size={12} color={T.textTer} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Study Plan */}
      <div style={{ marginTop: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textTer, textTransform: "uppercase", letterSpacing: "0.06em" }}>Study Plan</div>
          <div style={{ fontSize: 11, color: T.textTer }}>Wk {Math.ceil(new Date().getDate() / 7)}</div>
        </div>
        <div style={{ background: T.bgCard, borderRadius: T.r3, border: `1px solid ${T.border}`, padding: "4px 16px", display: "flex", flexDirection: "column" }}>
          {generateStudyPlan(state).slice(0, 5).map((day, i) => {
            const theme = T[day.subjectId] || T.eng;
            const isToday = day.day === new Date().toLocaleDateString("en-SG", { weekday: "long" });
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "56px 40px 1fr", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: i < 4 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ fontSize: 13, color: isToday ? T.accent : T.textSec, fontWeight: isToday ? 600 : 400 }}>{day.day.slice(0, 3)} {day.date.split(" ")[1]}</div>
                <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", color: theme.text, background: theme.bg, padding: "2px 5px", borderRadius: T.r1, textAlign: "center" }}>
                  {day.subjectId?.slice(0, 3).toUpperCase()}
                </div>
                <div style={{ fontSize: 12, color: T.textSec }}>
                  {day.tasks.map(t => `${t.type} ${t.duration}`).join(" · ")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <WeeklyProgressSection state={state} />
    </div>
  );
}

function Dashboard({ state, dispatch, authUser, userProfile }) {
  const subjectProgress = useMemo(() => SUBJECTS.map((s, i) => {
    const hash = ((i + 1) * 16807) % 2147483647;
    return { ...s, progress: (hash % 40) + 30 };
  }), []);

  if (state.role === "student") return <StudentDashboard state={state} dispatch={dispatch} authUser={authUser} userProfile={userProfile} />;

  const actIcons = { upload: Upload, check: CheckCircle, play: Play, plus: Plus };
  const pendingSubmissions = state.submissions.filter(s => s.status === "submitted").length;
  const activeHomework = state.homework.filter(h => h.status === "active").length;

  return (
    <div>
      <HeroBanner />

      {/* Tutor Hero */}
      <div style={{ borderRadius: T.r3, background: T.bgCard, border: `1px solid ${T.border}`, padding: "24px 28px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ color: T.text, fontSize: 22, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.02em" }}>Welcome back</h1>
            <p style={{ color: T.textSec, fontSize: 14, margin: 0 }}>Your students are waiting — let's make today count.</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {pendingSubmissions > 0 && (
              <button onClick={() => dispatch({ type: "SET_PAGE", payload: "homework" })} style={{ display: "flex", alignItems: "center", gap: 6, background: T.dangerBg, border: `1px solid ${T.danger}30`, borderRadius: T.r2, padding: "7px 14px", cursor: "pointer", color: T.danger, fontSize: 12, fontWeight: 600 }}>
                <Bell size={13} />{pendingSubmissions} to grade
              </button>
            )}
            {activeHomework > 0 && (
              <button onClick={() => dispatch({ type: "SET_PAGE", payload: "homework" })} style={{ display: "flex", alignItems: "center", gap: 6, background: T.warningBg, border: `1px solid ${T.warning}30`, borderRadius: T.r2, padding: "7px 14px", cursor: "pointer", color: T.warning, fontSize: 12, fontWeight: 600 }}>
                <ClipboardText size={13} />{activeHomework} active tasks
              </button>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
          {[
            { label: "Take Attendance", icon: CalendarCheck, page: "attendance" },
            { label: "Grade Homework",  icon: ClipboardText,  page: "homework"   },
            { label: "View Progress",   icon: ChartBar,       page: "progress"   },
            { label: "Community",       icon: Handshake,      page: "community"  },
          ].map(a => (
            <button key={a.label} onClick={() => dispatch({ type: "SET_PAGE", payload: a.page })}
              style={{ display: "flex", alignItems: "center", gap: 7, background: T.bgMuted, border: `1px solid ${T.border}`, borderRadius: T.r2, padding: "8px 14px", cursor: "pointer", color: T.text, fontSize: 12, fontWeight: 500, transition: "all 0.12s" }}
              onMouseEnter={e => { e.currentTarget.style.background = T.bgHover; e.currentTarget.style.borderColor = T.borderHover; }}
              onMouseLeave={e => { e.currentTarget.style.background = T.bgMuted; e.currentTarget.style.borderColor = T.border; }}>
              <a.icon size={14} />{a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 28 }}>
        {[
          { icon: FolderSimpleStar, value: state.resources.length,    label: "Resources", color: T.accent,        bg: T.accentLight, page: "library"    },
          { icon: PlayCircle,       value: state.videoLessons.length, label: "Videos",    color: "#A85A38",       bg: "#F6EAE4",     page: "videos"     },
          { icon: Lightning,        value: state.quizzes.length,      label: "Quizzes",   color: "#C49030",       bg: "#F6F0E0",     page: "quizzes"    },
          { icon: Users,            value: state.students.length,     label: "Students",  color: "#4A8E9E",       bg: "#E4EFF2",     page: "progress"   },
          { icon: CalendarCheck,    value: state.sessions.length,     label: "Sessions",  color: "#3B6EA6",       bg: "#E8EFF6",     page: "attendance" },
          { icon: Handshake,        value: (state.posts || []).length,label: "Community", color: "#2E8058",       bg: "#E4F0EA",     page: "community"  },
        ].map((s, i) => (
          <div key={s.label} className="card-enter"
            role="button" tabIndex={0}
            aria-label={`Go to ${s.label}`}
            onClick={() => dispatch({ type: "SET_PAGE", payload: s.page })}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); dispatch({ type: "SET_PAGE", payload: s.page }); } }}
            style={{ "--i": i, cursor: "pointer", padding: "16px", background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + "60"; e.currentTarget.style.boxShadow = `0 4px 20px ${s.color}18`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ width: 36, height: 36, borderRadius: T.r2, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: T.text, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 10, fontWeight: 500, color: T.textTer, marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Your Subjects */}
      <h2 style={{ fontSize: 16, fontWeight: 600, color: T.text, margin: "0 0 14px", letterSpacing: "-0.01em" }}>Your Subjects</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14, marginBottom: 28 }}>
        {subjectProgress.map((s, idx) => {
          const theme = getSubjectTheme(s.id);
          return (
            <Card key={s.id} className="card-enter" style={{ "--i": idx, padding: 0, overflow: "hidden" }} onClick={() => dispatch({ type: "SET_PAGE", payload: "library" })} elevated>
              <div style={{ position: "relative", overflow: "hidden" }}>
                <SubjectIllustration subject={s.id} size={240} />
                <div style={{ position: "absolute", top: 10, left: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: T.r2, background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    <BookOpen size={16} color={theme.accent} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: theme.accent, background: "rgba(255,255,255,0.85)", padding: "2px 10px", borderRadius: 20, backdropFilter: "blur(4px)" }}>{TOPICS[s.id]?.length || 0} topics</span>
                </div>
              </div>
              <div style={{ padding: "14px 16px 16px" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 8 }}>{s.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.textSec, marginBottom: 6 }}>
                  <span>Progress</span><span style={{ color: theme.accent, fontWeight: 600 }}>{s.progress}%</span>
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
            <h2 style={{ fontSize: 16, fontWeight: 600, color: T.text, margin: "0 0 14px", letterSpacing: "-0.01em" }}>Today's Classes</h2>
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
                        <CalendarCheck size={20} color={theme.accent} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{getSubject(session.subject)?.name}</div>
                        <div style={{ fontSize: 12, color: T.textTer }}>{session.time}</div>
                      </div>
                      {marked < students.length ? (
                        <Badge color={T.warning} bg={T.warningBg}>{students.length - marked} unmarked</Badge>
                      ) : (
                        <Badge color={T.success} bg={T.successBg}><CheckCircle size={12} weight="fill" /> Done</Badge>
                      )}
                    </div>
                    {session.notes
                      ? <div style={{ fontSize: 12, color: T.textSec, background: T.bgMuted, padding: "6px 10px", borderRadius: T.r1 }}>{session.notes}</div>
                      : <div style={{ fontSize: 12, color: T.textTer, fontStyle: "italic" }}>Click to take attendance</div>
                    }
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Community Preview + Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        <Card elevated style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: T.text, margin: 0, display: "flex", alignItems: "center", gap: 6 }}><ChatText size={15} color={T.text} /> Community</h3>
            <button onClick={() => dispatch({ type: "SET_PAGE", payload: "community" })} style={{ background: T.accentLight, border: "none", borderRadius: 20, padding: "5px 14px", fontSize: 11, fontWeight: 600, color: T.accentText, cursor: "pointer" }}>View All →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(state.posts || []).slice(0, 3).map(post => (
              <div key={post.id} onClick={() => dispatch({ type: "SET_PAGE", payload: "community" })}
                role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); dispatch({ type: "SET_PAGE", payload: "community" }); } }}
                style={{ cursor: "pointer", padding: "10px 12px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgMuted, transition: "all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = T.bgHover}
                onMouseLeave={e => e.currentTarget.style.background = T.bgMuted}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  {post.isAnnouncement && <span style={{ fontSize: 10, fontWeight: 700, color: "#92400E", background: "#FEF3C7", padding: "1px 5px", borderRadius: 20, display: "inline-flex", alignItems: "center" }}><Megaphone size={10} color="#92400E" /></span>}
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{post.title}</span>
                </div>
                <div style={{ fontSize: 11, color: T.textTer }}>{post.author} · {post.comments.length} comments</div>
              </div>
            ))}
          </div>
        </Card>

        <Card elevated style={{ padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: T.text, margin: "0 0 16px" }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: "Take Attendance",      icon: CalendarCheck, page: "attendance", color: "#3F51EC" },
              { label: "Upload New Resource",  icon: Upload,        page: "library",    color: "#0C8CE9" },
              { label: "Create a Quiz",        icon: Lightning,     page: "quizzes",    color: "#6660B9" },
              { label: "View Student Progress",icon: ChartLineUp,   page: "progress",   color: "#00A85A" },
              { label: "Start Mock Exam",      icon: Target,        page: "exams",      color: "#E07800" },
            ].map((item) => (
              <button key={item.label} onClick={() => dispatch({ type: "SET_PAGE", payload: item.page })}
                onMouseEnter={(e) => e.currentTarget.style.background = T.bgHover}
                onMouseLeave={(e) => e.currentTarget.style.background = T.bgMuted}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: T.bgMuted, borderRadius: T.r2, border: "none", cursor: "pointer", transition: "all 0.15s", width: "100%", textAlign: "left" }}>
                <div style={{ width: 30, height: 30, borderRadius: T.r1, background: item.color + "14", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <item.icon size={15} color={item.color} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{item.label}</span>
                <CaretRight size={13} color={T.textTer} style={{ marginLeft: "auto" }} />
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
