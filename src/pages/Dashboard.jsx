import React, { useState, useMemo } from 'react';
import { T } from '../theme/theme.js';
import {
  ArrowRight, BookOpen, ClipboardText,
  CalendarCheck, ChartLineUp, Handshake, FolderSimpleStar,
  Users, Upload, CaretRight, ChatText,
  Megaphone, Scroll, GraduationCap, Notebook, BookmarkSimple, FilePdf, FileDoc, FileVideo,
  Compass,
} from '../icons/icons.jsx';
import { SubjectBadge } from '../components/ui/Badge.jsx';
import { SubjectIllustration, DocumentViewer } from '../components/ui';
import { getSubject, getSubjectTheme, getExamCountdowns, getWeeklyProgress } from '../utils/helpers.js';
import { SUBJECTS } from '../data/subjects.js';
import { VOCAB_DRILLS } from '../data/vocabDrills.js';
import useWindowWidth from '../hooks/useWindowWidth.js';

/* ━━━ SHARED CARD PRIMITIVE ━━━ */
function DCard({ title, hint, action, children, style }) {
  return (
    <section style={{
      background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r3,
      display: 'flex', flexDirection: 'column',
      boxShadow: '0 1px 3px rgba(28,27,25,0.04)', ...style,
    }}>
      {title && (
        <header style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '15px 18px 11px', flexShrink: 0, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: -0.2, color: T.text }}>{title}</span>
          {hint && <span style={{ fontSize: 11, color: T.textTer, fontFamily: T.fontMono, letterSpacing: 0.4 }}>{hint}</span>}
          <div style={{ flex: 1 }} />
          {action}
        </header>
      )}
      <div style={{ padding: '0 18px 16px', flex: 1 }}>{children}</div>
    </section>
  );
}

/* ━━━ GREETING ━━━ */
function Greeting({ authUser, userProfile, overdueCount, pendingCount, gradedCount }) {
  const firstName = (userProfile?.name || authUser?.displayName || authUser?.email || 'Scholar')
    .split(' ')[0].split('@')[0];
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

  return (
    <div style={{ marginBottom: 22 }}>
      <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: -0.6, color: T.text, lineHeight: 1.1 }}>
        Good {timeOfDay}, {firstName}.
      </h1>
      <div style={{ marginTop: 8, fontSize: 14, color: T.textSec, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <span>
          {overdueCount > 0
            ? <><span style={{ color: T.danger, fontWeight: 600 }}>{overdueCount} overdue {overdueCount === 1 ? 'assignment' : 'assignments'}</span> — worth tackling first.</>
            : pendingCount > 0 ? `${pendingCount} ${pendingCount === 1 ? 'task' : 'tasks'} waiting for you today.`
            : "You're all caught up. Keep the momentum going."}
        </span>
        <div style={{ width: 1, height: 14, background: T.border }} />
        {[
          { label: 'Overdue', value: overdueCount, tone: overdueCount > 0 ? T.danger : undefined },
          { label: 'Pending', value: pendingCount },
          { label: 'Graded',  value: gradedCount,  tone: T.success },
        ].map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <span style={{ width: 3, height: 3, borderRadius: '50%', background: T.textTer }} />}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: T.textSec }}>
              <span style={{ fontWeight: 800, color: s.tone || T.text, fontVariantNumeric: 'tabular-nums', fontSize: 14 }}>{s.value}</span>
              {s.label}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ━━━ FOCUS CARD — "Start here": up to 3 prioritised next steps ━━━ */
function FocusCard({ state, dispatch, enrolledSubjects }) {
  const today = new Date().toISOString().split('T')[0];
  const activeHw = (state.homework || []).filter(h => h.status === 'active');
  const subs = state.submissions || [];

  const steps = [];

  // 1) Resume / start a homework task (in-progress → overdue → any not-started)
  let resumeSub = subs.find(s => s.status === 'in_progress');
  if (!resumeSub) resumeSub = subs.find(s => {
    const hw = activeHw.find(h => h.id === s.homeworkId);
    return hw && hw.dueDate < today && s.status === 'not_started';
  });
  if (!resumeSub) resumeSub = subs.find(s => {
    const hw = activeHw.find(h => h.id === s.homeworkId);
    return hw && s.status === 'not_started';
  });
  const resumeHw = resumeSub ? state.homework.find(h => h.id === resumeSub.homeworkId) : null;
  if (resumeHw) {
    const overdue = resumeHw.dueDate < today;
    const verb = resumeSub.status === 'in_progress' ? 'Finish' : overdue ? 'Catch up on' : 'Start';
    steps.push({
      key: 'hw',
      icon: ClipboardText,
      color: overdue ? T.danger : (getSubjectTheme(resumeHw.subject)?.accent || T.accent),
      label: `${verb} “${resumeHw.title}”`,
      meta: overdue ? `Overdue · was due ${resumeHw.dueDate}` : `Due ${resumeHw.dueDate}`,
      page: 'homework',
    });
  }

  // 2) Mistakes due for spaced-repetition review
  const mistakes = Array.isArray(state.mistakes) ? state.mistakes : [];
  const dueMistakes = mistakes.filter(m => !m.reviewed || !m.nextReview || m.nextReview <= today);
  if (dueMistakes.length > 0) {
    steps.push({
      key: 'mistakes',
      icon: Notebook,
      color: T.amath.accent,
      label: `Review ${dueMistakes.length} item${dueMistakes.length > 1 ? 's' : ''} in your Mistake Journal`,
      meta: 'Spaced repetition keeps it stuck',
      page: 'mistakes',
    });
  }

  // 3) Nearest exam → nudge to plan revision (only exams for subjects the student takes)
  const exams = (getExamCountdowns(state?.customExams) || [])
    .filter(e => !enrolledSubjects || !e.subject || enrolledSubjects.includes(e.subject));
  if (exams.length > 0) {
    const e = exams[0];
    steps.push({
      key: 'exam',
      icon: CalendarCheck,
      color: T.gp.accent,
      label: `${e.daysLeft} day${e.daysLeft !== 1 ? 's' : ''} to ${e.name}`,
      meta: 'Plan your revision timetable',
      page: 'revisiontimetable',
    });
  }

  // Friendly starters fill any remaining slots (and cover brand-new students)
  const starters = [
    { key: 'subjects', icon: Compass, color: T.eng.accent, label: 'Explore your subjects', meta: 'Resources & practice papers', page: 'subjects' },
    { key: 'vocab', icon: Scroll, color: T.h1econ.accent, label: 'Build your vocabulary', meta: 'Flashcards & quick quizzes', page: 'vocab' },
    { key: 'community', icon: Handshake, color: T.success, label: 'Say hello in the Community', meta: 'Chat, ask & share', page: 'community' },
  ];
  for (const s of starters) {
    if (steps.length >= 3) break;
    if (!steps.some(x => x.key === s.key)) steps.push(s);
  }

  const top = steps.slice(0, 3);
  const allClear = !resumeHw && dueMistakes.length === 0;

  return (
    <div style={{
      background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r3,
      boxShadow: '0 1px 3px rgba(28,27,25,0.04)', marginBottom: 20, overflow: 'hidden',
      borderLeft: `3px solid ${T.accent}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px 10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: -0.2, color: T.text }}>Start here</span>
        <span style={{ fontSize: 11, color: T.textTer }}>
          {allClear ? "You're all caught up — here's what's worth a look" : 'Your next steps'}
        </span>
      </div>
      <div style={{ padding: '0 8px 8px' }}>
        {top.map((step) => (
          <button
            key={step.key}
            onClick={() => dispatch({ type: 'SET_PAGE', payload: step.page })}
            style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 10px', background: 'transparent', border: 'none', borderRadius: T.r2, cursor: 'pointer', textAlign: 'left', fontFamily: T.fontBody, transition: 'background 0.12s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = T.bgHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{ width: 34, height: 34, borderRadius: T.r2, background: step.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <step.icon size={16} color={step.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{step.label}</div>
              <div style={{ fontSize: 11.5, color: T.textSec, marginTop: 1 }}>{step.meta}</div>
            </div>
            <ArrowRight size={14} color={T.textTer} style={{ flexShrink: 0 }} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ━━━ ASSIGNMENTS ━━━ */
function AssignmentsCard({ state, dispatch }) {
  const [tab, setTab] = useState('due');
  const today = new Date().toISOString().split('T')[0];
  const allHw = Array.isArray(state.homework) ? state.homework : [];
  const activeHw = allHw.filter(h => h.status === 'active');
  const subs = Array.isArray(state.submissions) ? state.submissions : [];

  const dueItems = activeHw
    .map(h => ({ hw: h, sub: subs.find(s => s.homeworkId === h.id) }))
    .filter(({ sub }) => sub && (sub.status === 'not_started' || sub.status === 'in_progress'))
    .sort((a, b) => (a.hw.dueDate || '').localeCompare(b.hw.dueDate || ''));

  const submittedItems = subs
    .filter(s => s.status === 'submitted')
    .map(s => ({ sub: s, hw: allHw.find(h => h.id === s.homeworkId) }))
    .filter(({ hw }) => hw);

  const returnedItems = subs
    .filter(s => s.status === 'graded')
    .sort((a, b) => (b.gradedAt || '').localeCompare(a.gradedAt || ''))
    .slice(0, 5)
    .map(s => ({ sub: s, hw: allHw.find(h => h.id === s.homeworkId) }))
    .filter(({ hw }) => hw);

  const tabs = [
    { id: 'due', label: 'Due', count: dueItems.length },
    { id: 'submitted', label: 'Submitted', count: submittedItems.length },
    { id: 'returned', label: 'Returned', count: returnedItems.length },
  ];
  const items = tab === 'due' ? dueItems : tab === 'submitted' ? submittedItems : returnedItems;

  return (
    <DCard
      title="Assignments"
      action={
        <div style={{ display: 'flex', gap: 2 }}>
          {tabs.map(({ id, label, count }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px',
              borderRadius: T.r1, cursor: 'pointer', border: 'none', fontFamily: T.fontBody,
              background: tab === id ? T.bgMuted : 'transparent',
              color: tab === id ? T.text : T.textSec,
              fontSize: 12, fontWeight: tab === id ? 700 : 500,
            }}>
              {label}
              <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 999, fontVariantNumeric: 'tabular-nums', color: T.textSec, background: tab === id ? T.bgCard : 'transparent', border: tab === id ? `1px solid ${T.border}` : '1px solid transparent' }}>
                {count}
              </span>
            </button>
          ))}
        </div>
      }
    >
      {items.length === 0 ? (
        <div style={{ padding: '6px 0', fontSize: 13, color: T.textTer, fontStyle: 'italic' }}>
          {tab === 'due' ? 'No pending assignments.' : tab === 'submitted' ? 'Nothing awaiting feedback yet.' : 'No returned work yet.'}
        </div>
      ) : (
        <div>
          {items.map(({ hw, sub }, i) => {
            if (!hw) return null;
            const isOverdue = hw.dueDate < today;
            const theme = getSubjectTheme(hw.subject) || T.eng;
            return (
              <div key={sub?.id || i}
                onClick={() => dispatch({ type: 'SET_PAGE', payload: 'homework' })}
                role="button" tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') dispatch({ type: 'SET_PAGE', payload: 'homework' }); }}
                style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 0', borderTop: i === 0 ? 'none' : `1px solid ${T.border}`, cursor: 'pointer' }}>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.5, padding: '3px 7px', borderRadius: T.r1, background: theme.accent + '18', color: theme.accent, minWidth: 34, textAlign: 'center', flexShrink: 0 }}>
                  {(hw.subject || 'GEN').slice(0, 3).toUpperCase()}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{hw.title}</div>
                  <div style={{ fontSize: 11, marginTop: 2 }}>
                    {tab === 'returned'
                      ? <span style={{ color: T.success, fontWeight: 600 }}>Graded · {sub.grade}</span>
                      : isOverdue && tab === 'due'
                      ? <span style={{ color: T.danger, fontWeight: 600 }}>Overdue · {hw.dueDate}</span>
                      : <span style={{ color: T.textSec }}>Due {hw.dueDate}</span>}
                  </div>
                </div>
                <button style={{ padding: '5px 11px', borderRadius: T.r1, background: isOverdue && tab === 'due' ? T.dangerBg : T.bgMuted, color: isOverdue && tab === 'due' ? T.danger : T.textSec, border: `1px solid ${isOverdue && tab === 'due' ? T.danger + '30' : T.border}`, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                  {tab === 'returned' ? 'View' : tab === 'submitted' ? 'View' : isOverdue ? 'Start' : 'Open'} <ArrowRight size={11} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </DCard>
  );
}

/* ━━━ JUMP IN ━━━ */
function JumpInCard({ dispatch }) {
  const tiles = [
    { label: 'Vocabulary',   meta: 'Flashcards & quizzes', icon: Scroll,        color: T.eng.accent,    page: 'vocab'        },
    { label: 'Model Essays', meta: 'GP examples',           icon: GraduationCap, color: T.gp.accent,     page: 'modelessays'  },
    { label: 'Mistake Log',  meta: 'Track your errors',     icon: Notebook,      color: T.accent,        page: 'checklist'    },
    { label: 'Community',    meta: 'Chat & share',          icon: Handshake,     color: T.success,       page: 'community'    },
  ];
  return (
    <DCard title="Jump in" action={
      <button onClick={() => dispatch({ type: 'SET_PAGE', payload: 'subjects' })}
        style={{ fontSize: 12, color: T.accent, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
        My subjects →
      </button>
    }>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {tiles.map(tile => (
          <button key={tile.label} onClick={() => dispatch({ type: 'SET_PAGE', payload: tile.page })}
            style={{ padding: '12px 8px', borderRadius: T.r2, background: T.bg, border: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer', textAlign: 'left', minHeight: 84, transition: 'border-color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = tile.color + '60'}
            onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
            <div style={{ width: 26, height: 26, borderRadius: T.r1, background: tile.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <tile.icon size={14} color={tile.color} />
            </div>
            <div style={{ marginTop: 'auto' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.text }}>{tile.label}</div>
              <div style={{ fontSize: 10, color: T.textSec, marginTop: 1 }}>{tile.meta}</div>
            </div>
          </button>
        ))}
      </div>
    </DCard>
  );
}

/* ━━━ WEEK PROGRESS ━━━ */
function WeekProgressCard({ state }) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const activeDates = new Set([
    ...(state.studyLogs || []).map(l => new Date(l.timestamp).toISOString().split('T')[0]),
    ...(state.submissions || []).filter(s => s.submittedAt).map(s => s.submittedAt),
  ]);
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() - (6 - i));
    const ds = d.toISOString().split('T')[0];
    return { ds, label: d.toLocaleDateString('en-SG', { weekday: 'narrow' }), done: activeDates.has(ds), isToday: ds === todayStr };
  });
  const doneCount = last7.filter(d => d.done).length;
  const wp = getWeeklyProgress(state);

  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    if (activeDates.has(d.toISOString().split('T')[0])) { streak++; } else if (i > 0) break;
  }

  return (
    <DCard title="This week" hint={`WK ${Math.ceil(new Date().getDate() / 7)}`}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, fontVariantNumeric: 'tabular-nums', color: T.text }}>{doneCount}</span>
        <span style={{ fontSize: 13, color: T.textSec }}>of 7 days active</span>
        <div style={{ flex: 1 }} />
        {streak > 1 && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 999, background: T.accentLight, color: T.accent, fontSize: 11, fontWeight: 700 }}>
            {streak}-day streak
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 5 }}>
        {last7.map((day, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <div style={{
              width: '100%', height: 26, borderRadius: T.r1,
              background: day.done ? T.accent : T.bgMuted,
              border: day.isToday ? `1.5px dashed ${T.accent}` : `1px solid ${T.border}`,
              opacity: day.done ? 1 : 0.55,
            }} />
            <span style={{ fontSize: 9, color: day.isToday ? T.accent : T.textTer, fontWeight: day.isToday ? 700 : 400 }}>{day.label}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
        {[
          { label: 'HW Done',    value: wp.hwCompleted, color: T.accent },
          { label: 'Study Days', value: wp.studyDays,   color: T.teal },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center', padding: '8px 4px', borderRadius: T.r2, background: T.bgMuted }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            <div style={{ fontSize: 10, color: T.textTer, marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </DCard>
  );
}

/* ━━━ EXAM COUNTDOWN ━━━ */
function ExamCountdownCard({ state, enrolledSubjects }) {
  const exams = getExamCountdowns(state?.customExams)
    .filter(e => !enrolledSubjects || !e.subject || enrolledSubjects.includes(e.subject))
    .slice(0, 4);
  if (!exams.length) return null;
  return (
    <DCard title="Exam countdown">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {exams.map((e, i) => {
          const theme = T[e.subject] || T.eng;
          const urgent = e.daysLeft <= 30;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i === 0 ? 'none' : `1px solid ${T.border}` }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: urgent ? T.danger : theme.accent, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: T.text, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</span>
              {e.isCustom && <span style={{ fontSize: 9, fontWeight: 700, color: T.textTer, background: T.bgMuted, border: `1px solid ${T.border}`, padding: '1px 5px', borderRadius: 8, flexShrink: 0 }}>Custom</span>}
              <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 800, fontSize: 14, color: urgent ? T.danger : T.text, flexShrink: 0 }}>{e.daysLeft}</span>
              <span style={{ fontSize: 11, color: T.textTer, flexShrink: 0 }}>days</span>
            </div>
          );
        })}
      </div>
    </DCard>
  );
}

/* ━━━ RECENTLY RETURNED ━━━ */
function GradeHistoryCard({ state, dispatch }) {
  const allHwGH = Array.isArray(state.homework) ? state.homework : [];
  const graded = (Array.isArray(state.submissions) ? state.submissions : [])
    .filter(s => s.status === 'graded' && s.grade)
    .sort((a, b) => (b.gradedAt || '').localeCompare(a.gradedAt || ''))
    .slice(0, 6)
    .map(s => ({ sub: s, hw: allHwGH.find(h => h.id === s.homeworkId) }))
    .filter(({ hw }) => hw);

  if (!graded.length) return null;

  const gradeColor = g => {
    if (!g) return T.textSec;
    const u = g.toUpperCase();
    if (u.startsWith('A')) return T.success;
    if (u.startsWith('B')) return T.accent;
    return T.warning;
  };

  // Subject averages (count graded per subject)
  const bySub = {};
  graded.forEach(({ hw }) => {
    if (hw?.subject) bySub[hw.subject] = (bySub[hw.subject] || 0) + 1;
  });

  return (
    <DCard title="Grade history" action={
      <button onClick={() => dispatch({ type: 'SET_PAGE', payload: 'homework' })}
        style={{ fontSize: 12, color: T.accent, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
        See all →
      </button>
    }>
      {/* Recent grade strip */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {graded.map(({ sub, hw }, i) => {
          const theme = T[hw?.subject] || T.eng;
          return (
            <div key={i} title={`${hw?.title} · ${sub.gradedAt || ''}`}
              style={{ width: 36, height: 36, borderRadius: T.r1, background: gradeColor(sub.grade) + '15', border: `1px solid ${gradeColor(sub.grade)}40`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, cursor: 'default' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: gradeColor(sub.grade), lineHeight: 1 }}>{sub.grade}</span>
              <span style={{ fontSize: 8, color: theme.accent, fontWeight: 700, letterSpacing: 0.3 }}>{hw?.subject?.toUpperCase().slice(0, 3)}</span>
            </div>
          );
        })}
      </div>
      {/* Subject breakdown */}
      {Object.keys(bySub).length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {Object.entries(bySub).map(([subj, count]) => {
            const theme = T[subj] || T.eng;
            return (
              <span key={subj} style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: theme.bg, color: theme.accent, border: `1px solid ${theme.accent}30` }}>
                {subj.toUpperCase()} · {count} graded
              </span>
            );
          })}
        </div>
      )}
    </DCard>
  );
}

/* ━━━ WORD OF THE DAY ━━━ */
function WordOfTheDayCard({ dispatch }) {
  const dayIdx = Math.floor(Date.now() / 86400000) % VOCAB_DRILLS.length; // eslint-disable-line react-hooks/purity -- intentional date-based daily word rotation
  const word = VOCAB_DRILLS[dayIdx];

  const CAT_COLOR = {
    "Tone Words":         T.eng.accent,
    "Connotation":        T.gp.accent,
    "Discourse Markers":  T.omath.accent,
    "Literary Devices":   T.amath.accent,
    "Paraphrasing":       T.h1econ.accent,
    "Evaluative Language": T.h2econ.accent,
  };
  const accent = CAT_COLOR[word.cat] || T.accent;

  return (
    <DCard title="Word of the day" hint={word.cat.toUpperCase()}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4, color: T.text }}>{word.word}</span>
        <span style={{ fontSize: 11, color: T.textTer, fontFamily: T.fontMono }}>{word.pos}</span>
      </div>
      <div style={{ fontSize: 13, color: T.textSec, lineHeight: 1.5, marginBottom: 8 }}>{word.def}</div>
      <div style={{ fontSize: 12, color: T.textTer, fontStyle: 'italic', padding: '8px 12px', background: accent + '0D', borderLeft: `3px solid ${accent}40`, borderRadius: `0 ${T.r1} ${T.r1} 0`, lineHeight: 1.5, marginBottom: 10 }}>
        "{word.example}"
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: T.r1, background: accent + '18', color: accent, fontWeight: 700 }}>
          {word.upgrade.weak} → {word.upgrade.strong}
        </span>
        <button onClick={() => dispatch({ type: 'SET_PAGE', payload: 'vocab' })}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: T.accent, fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          Practise all <ArrowRight size={12} />
        </button>
      </div>
    </DCard>
  );
}

/* ━━━ RECENT SESSIONS ━━━ */
function RecentSessionsCard({ state, dispatch }) {
  const sessions = useMemo(() =>
    (state.sessions || [])
      .filter(s => s.notes)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 3),
    [state.sessions]
  );
  if (!sessions.length) return null;
  return (
    <DCard title="Recent sessions" action={
      <button onClick={() => dispatch({ type: 'SET_PAGE', payload: 'attendance' })}
        style={{ fontSize: 12, color: T.accent, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
    }>
      {sessions.map((s, i) => {
        const theme = T[s.subject] || T.eng;
        return (
          <div key={s.id} style={{ padding: '9px 0', borderTop: i === 0 ? 'none' : `1px solid ${T.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: theme.accent, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: T.textSec, fontFamily: T.fontMono }}>{s.date}</span>
              <SubjectBadge subjectId={s.subject} small />
            </div>
            <p style={{ margin: 0, fontSize: 12, color: T.text, lineHeight: 1.55, paddingLeft: 14 }}>{s.notes}</p>
          </div>
        );
      })}
    </DCard>
  );
}

/* ━━━ BOOKMARKS ━━━ */
function BookmarksCard({ state, dispatch }) {
  const [viewing, setViewing] = useState(null);

  const bookmarked = useMemo(() => {
    const ids = new Set(state.bookmarks || []);
    return (state.resources || []).filter(r => ids.has(r.id)).slice(0, 4);
  }, [state.bookmarks, state.resources]);

  if (!bookmarked.length) return null;

  const fileIcon = (type) => {
    if (type === 'pdf') return <FilePdf size={12} color="#dc2626" />;
    if (type === 'docx') return <FileDoc size={12} color={T.accentText} />;
    return <FileVideo size={12} color="#2563EB" />;
  };

  return (
    <>
      {viewing && <DocumentViewer resource={viewing} onClose={() => setViewing(null)} />}
      <DCard title="Your bookmarks" action={
        <button onClick={() => dispatch({ type: 'SET_PAGE', payload: 'library' })}
          style={{ fontSize: 12, color: T.accent, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
          <BookmarkSimple size={12} /> All →
        </button>
      }>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {bookmarked.map((r, i) => {
            const theme = getSubjectTheme(r.subject) || T.eng;
            return (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: i === 0 ? 'none' : `1px solid ${T.border}` }}>
                <div style={{ width: 30, height: 30, borderRadius: T.r1, background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {fileIcon(r.type)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
                  <div style={{ fontSize: 10, color: T.textTer, marginTop: 2 }}>
                    <span style={{ color: theme.accent, fontWeight: 700 }}>{(getSubject(r.subject)?.name || r.subject).split(' ').slice(-1)[0]}</span>
                    {r.topic && <> · {r.topic}</>}
                  </div>
                </div>
                <button onClick={() => setViewing(r)}
                  style={{ padding: '4px 10px', borderRadius: T.r1, background: T.bgMuted, border: `1px solid ${T.border}`, fontSize: 11, fontWeight: 600, color: T.textSec, cursor: 'pointer', flexShrink: 0 }}>
                  View
                </button>
              </div>
            );
          })}
        </div>
      </DCard>
    </>
  );
}

/* ━━━ STUDENT DASHBOARD ━━━ */
function StudentDashboard({ state, dispatch, authUser, userProfile, enrolledSubjects }) {
  const winW = useWindowWidth();
  const isMobile = winW < 768;
  const today = new Date().toISOString().split('T')[0];

  // Match the logged-in account to a roster entry by email (same pattern as StudentHomework).
  const myStudentId = useMemo(() => {
    const students = Array.isArray(state.students) ? state.students : [];
    const email = authUser?.email || userProfile?.email;
    if (!email) return null;
    return students.find(s => s.email?.toLowerCase() === email.toLowerCase())?.id ?? null;
  }, [state.students, authUser, userProfile]);

  // Scope every card to THIS student: only their own submissions, and only homework,
  // sessions, and resources in the subjects they're enrolled in. An unmatched account
  // sees no submission data at all — never another student's work or grades.
  const scoped = useMemo(() => {
    const inSubjects = (subj) => !enrolledSubjects || !subj || enrolledSubjects.includes(subj);
    return {
      ...state,
      homework: (Array.isArray(state.homework) ? state.homework : []).filter(h => inSubjects(h.subject)),
      submissions: myStudentId != null
        ? (Array.isArray(state.submissions) ? state.submissions : []).filter(s => s.studentId === myStudentId)
        : [],
      sessions: (Array.isArray(state.sessions) ? state.sessions : []).filter(s => inSubjects(s.subject)),
      resources: (Array.isArray(state.resources) ? state.resources : []).filter(r => inSubjects(r.subject)),
    };
  }, [state, enrolledSubjects, myStudentId]);

  const activeHw = scoped.homework.filter(h => h.status === 'active');
  const subs = scoped.submissions;

  const overdueCount = activeHw.filter(h => {
    const sub = subs.find(s => s.homeworkId === h.id);
    return h.dueDate < today && sub && sub.status !== 'graded' && sub.status !== 'submitted';
  }).length;
  const pendingCount = activeHw.filter(h => {
    const sub = subs.find(s => s.homeworkId === h.id);
    return sub && sub.status !== 'graded' && sub.status !== 'submitted';
  }).length;
  const gradedCount = subs.filter(s => s.status === 'graded').length;

  return (
    <div>
      <Greeting authUser={authUser} userProfile={userProfile} overdueCount={overdueCount} pendingCount={pendingCount} gradedCount={gradedCount} />
      <FocusCard state={scoped} dispatch={dispatch} enrolledSubjects={enrolledSubjects} />
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.55fr 1fr', gap: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AssignmentsCard state={scoped} dispatch={dispatch} />
          <JumpInCard dispatch={dispatch} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <WeekProgressCard state={scoped} />
          <RecentSessionsCard state={scoped} dispatch={dispatch} />
          <BookmarksCard state={scoped} dispatch={dispatch} />
          <ExamCountdownCard state={scoped} enrolledSubjects={enrolledSubjects} />
          <GradeHistoryCard state={scoped} dispatch={dispatch} />
          <WordOfTheDayCard dispatch={dispatch} />
        </div>
      </div>
    </div>
  );
}

/* ━━━ TUTOR GREETING ━━━ */
function TutorGreeting({ authUser, userProfile, pendingSubmissions, activeHomework }) {
  const firstName = (userProfile?.name || authUser?.displayName || authUser?.email || 'Tutor')
    .split(' ')[0].split('@')[0];
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: T.textTer, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, fontFamily: T.fontMono }}>
        Good {timeOfDay}
      </div>
      <h1 style={{ margin: '0 0 10px', fontSize: 34, fontWeight: 800, letterSpacing: -0.8, color: T.text, lineHeight: 1.05 }}>
        Welcome to the A-Worthy World, {firstName}.
      </h1>
      <p style={{ margin: 0, fontSize: 15, color: T.textSec, lineHeight: 1.5 }}>
        {pendingSubmissions > 0
          ? <><span style={{ color: T.danger, fontWeight: 600 }}>{pendingSubmissions} submission{pendingSubmissions > 1 ? 's' : ''} awaiting your review.</span> Your A-Worthlings are counting on you.</>
          : activeHomework > 0
            ? `${activeHomework} active assignment${activeHomework > 1 ? 's' : ''} running — all caught up on grading.`
            : "All caught up. A great time to set new assignments."}
      </p>
    </div>
  );
}

/* ━━━ QUICK ACTION PILLS ━━━ */
function QuickActionPills({ dispatch, pendingSubmissions }) {
  const actions = [
    { label: 'Grade Homework',  icon: ClipboardText, page: 'homework',    urgent: pendingSubmissions > 0, badge: pendingSubmissions },
    { label: 'Take Attendance', icon: CalendarCheck, page: 'attendance',  urgent: false },
    { label: 'View Progress',   icon: ChartLineUp,   page: 'progress',    urgent: false },
    { label: 'Community',       icon: Handshake,     page: 'community',   urgent: false },
  ];
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
      {actions.map(a => (
        <button key={a.label} onClick={() => dispatch({ type: 'SET_PAGE', payload: a.page })}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: T.r5, border: `1px solid ${a.urgent ? T.accent : T.border}`, background: a.urgent ? T.accent : T.bgCard, color: a.urgent ? '#fff' : T.text, fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.12s', fontFamily: T.fontBody }}>
          <a.icon size={14} color={a.urgent ? '#fff' : T.textSec} />
          {a.label}
          {a.urgent && a.badge > 0 && (
            <span style={{ background: 'rgba(255,255,255,0.28)', borderRadius: 999, fontSize: 10, fontWeight: 800, padding: '1px 7px', fontVariantNumeric: 'tabular-nums' }}>
              {a.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ━━━ UPCOMING SESSIONS ━━━ */
function UpcomingSessionsCard({ state, dispatch }) {
  const today = new Date().toISOString().split('T')[0];
  const upcoming = (state.sessions || [])
    .filter(s => s.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  if (!upcoming.length) return null;

  return (
    <DCard title="Upcoming sessions" action={
      <button onClick={() => dispatch({ type: 'SET_PAGE', payload: 'attendance' })}
        style={{ fontSize: 12, color: T.accent, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
        View all →
      </button>
    }>
      <div>
        {upcoming.map((session, i) => {
          const theme = getSubjectTheme(session.subject) || T.eng;
          const isToday = session.date === today;
          const d = new Date(session.date + 'T12:00:00');
          return (
            <div key={session.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderTop: i === 0 ? 'none' : `1px solid ${T.border}` }}>
              <div style={{ width: 40, height: 40, borderRadius: T.r2, background: theme.bg, border: `1px solid ${theme.accent}22`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: theme.accent, lineHeight: 1.1 }}>{d.getDate()}</span>
                <span style={{ fontSize: 8, fontWeight: 700, color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {d.toLocaleDateString('en-SG', { month: 'short' })}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {getSubject(session.subject)?.name || session.subject}
                </div>
                <div style={{ fontSize: 11, color: T.textSec, marginTop: 2 }}>{session.time || 'Time TBC'}</div>
              </div>
              {isToday && (
                <span style={{ fontSize: 10, fontWeight: 700, color: T.accent, background: T.accentLight, padding: '3px 9px', borderRadius: 999, flexShrink: 0 }}>Today</span>
              )}
            </div>
          );
        })}
      </div>
    </DCard>
  );
}

/* ━━━ TUTOR DASHBOARD ━━━ */
function TutorDashboard({ state, dispatch, authUser, userProfile }) {
  const winW = useWindowWidth();
  const isMobile = winW < 768;
  const pendingSubmissions = (state.submissions || []).filter(s => s.status === 'submitted').length;
  const activeHomework = (state.homework || []).filter(h => h.status === 'active').length;

  const subjectProgress = useMemo(() => SUBJECTS.map(s => ({
    ...s,
    resourceCount: (state.resources || []).filter(r => r.subject === s.id).length,
  })), [state.resources]);

  const stats = [
    { icon: FolderSimpleStar, value: (state.resources || []).length,                            label: 'Resources',  color: T.accent,       bg: T.accentLight, page: 'library-eng', urgent: false },
    { icon: ClipboardText,    value: pendingSubmissions,                                         label: 'To Grade',   color: T.accent,       bg: T.accentLight, page: 'homework',    urgent: pendingSubmissions > 0 },
    { icon: Users,            value: (state.students || []).length,                              label: 'A-Worthlings', color: T.omath.accent, bg: T.omath.bg,    page: 'progress',    urgent: false },
    { icon: CalendarCheck,    value: (state.sessions || []).length,                              label: 'Sessions',   color: T.gp.accent,    bg: T.gp.bg,       page: 'attendance',  urgent: false },
    { icon: ChatText,         value: (state.posts || []).length,                                 label: 'Community',  color: T.success,      bg: T.successBg,   page: 'community',   urgent: false },
  ];

  return (
    <div>
      <TutorGreeting authUser={authUser} userProfile={userProfile} pendingSubmissions={pendingSubmissions} activeHomework={activeHomework} />
      <QuickActionPills dispatch={dispatch} pendingSubmissions={pendingSubmissions} />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label}
            role="button" tabIndex={0} aria-label={`Go to ${s.label}`}
            onClick={() => dispatch({ type: 'SET_PAGE', payload: s.page })}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dispatch({ type: 'SET_PAGE', payload: s.page }); } }}
            style={{ padding: 16, background: s.urgent ? T.accentLight : T.bgCard, borderRadius: T.r2, border: `1px solid ${s.urgent ? T.accent + '50' : T.border}`, cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + '80'; e.currentTarget.style.boxShadow = `0 4px 16px ${s.color}18`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = s.urgent ? T.accent + '50' : T.border; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ width: 36, height: 36, borderRadius: T.r2, background: s.urgent ? T.accent + '20' : s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <s.icon size={18} color={s.urgent ? T.accent : s.color} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.urgent ? T.accent : T.text, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: s.urgent ? T.accent : T.textTer, marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main 2-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr', gap: 20, alignItems: 'start' }}>

        {/* Left — subjects + upcoming sessions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.textTer, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Your Subjects</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 10 }}>
              {subjectProgress.map(s => {
                const theme = getSubjectTheme(s.id);
                return (
                  <div key={s.id}
                    onClick={() => dispatch({ type: 'SET_PAGE', payload: `library-${s.id}` })}
                    style={{ background: T.bgCard, borderRadius: T.r3, border: `1px solid ${T.border}`, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent + '60'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = 'none'; }}>
                    <SubjectIllustration subject={s.id} size={175} />
                    <div style={{ padding: '10px 12px 12px' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 4 }}>{s.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <FolderSimpleStar size={11} color={theme.accent} />
                        <span style={{ fontSize: 11, color: T.textSec }}>
                          <span style={{ fontWeight: 700, color: theme.accent }}>{s.resourceCount}</span>{' '}
                          resource{s.resourceCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <UpcomingSessionsCard state={state} dispatch={dispatch} />
        </div>

        {/* Right — community + quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <DCard title="Community" action={
            <button onClick={() => dispatch({ type: 'SET_PAGE', payload: 'community' })}
              style={{ fontSize: 12, color: T.accent, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
              View all →
            </button>
          }>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {(state.posts || []).slice(0, 3).map((post) => (
                <div key={post.id}
                  onClick={() => dispatch({ type: 'SET_PAGE', payload: 'community' })}
                  role="button" tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dispatch({ type: 'SET_PAGE', payload: 'community' }); } }}
                  style={{ cursor: 'pointer', padding: '9px 11px', borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgMuted, transition: 'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = T.bgHover}
                  onMouseLeave={e => e.currentTarget.style.background = T.bgMuted}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                    {post.isAnnouncement && <Megaphone size={10} color="#92400E" />}
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</span>
                  </div>
                  <div style={{ fontSize: 11, color: T.textTer }}>{post.author} · {post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}</div>
                </div>
              ))}
              {(state.posts || []).length === 0 && (
                <div style={{ fontSize: 13, color: T.textTer, fontStyle: 'italic', padding: '4px 0' }}>No posts yet.</div>
              )}
            </div>
          </DCard>

          <DCard title="Quick Actions">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[
                { label: 'Take Attendance',   icon: CalendarCheck, page: 'attendance',    color: T.omath.accent },
                { label: 'Upload Resource',   icon: Upload,        page: 'library-eng',   color: T.amath.accent },
                { label: 'A-Worthling Progress', icon: ChartLineUp, page: 'progress',      color: T.success      },
                { label: 'Past Papers',       icon: BookOpen,      page: 'pastpapers-gp', color: T.gp.accent    },
              ].map(item => (
                <button key={item.label} onClick={() => dispatch({ type: 'SET_PAGE', payload: item.page })}
                  onMouseEnter={e => e.currentTarget.style.background = T.bgHover}
                  onMouseLeave={e => e.currentTarget.style.background = T.bgMuted}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: T.bgMuted, borderRadius: T.r2, border: 'none', cursor: 'pointer', transition: 'all 0.15s', width: '100%', textAlign: 'left', fontFamily: T.fontBody }}>
                  <div style={{ width: 28, height: 28, borderRadius: T.r1, background: item.color + '14', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <item.icon size={14} color={item.color} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{item.label}</span>
                  <CaretRight size={12} color={T.textTer} style={{ marginLeft: 'auto' }} />
                </button>
              ))}
            </div>
          </DCard>
        </div>
      </div>
    </div>
  );
}

/* ━━━ ROOT EXPORT ━━━ */
function Dashboard({ state, dispatch, authUser, userProfile, enrolledSubjects }) {
  // Role-aware landing: A-Worthlings (students) get the calm, learning-focused
  // StudentDashboard scoped to their own data and enrolled subjects; tutors get
  // the admin-oriented TutorDashboard with the full picture.
  if (state.role === 'tutor') {
    return <TutorDashboard state={state} dispatch={dispatch} authUser={authUser} userProfile={userProfile} />;
  }
  return <StudentDashboard state={state} dispatch={dispatch} authUser={authUser} userProfile={userProfile} enrolledSubjects={enrolledSubjects} />;
}

export { StudentDashboard };
export default Dashboard;
