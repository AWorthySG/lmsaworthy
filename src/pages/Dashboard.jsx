import React, { useState, useMemo } from 'react';
import { T } from '../theme/theme.js';
import {
  CheckCircle, ArrowRight, BookOpen, ClipboardText,
  Bell, CalendarCheck, ChartLineUp, Handshake, FolderSimpleStar,
  Users, Upload, CaretRight, ChatText, Sparkle,
  Megaphone, Scroll, GraduationCap, Notebook,
} from '../icons/icons.jsx';
import { SubjectIllustration } from '../components/ui';
import { getSubject, getSubjectTheme, getExamCountdowns, getWeeklyProgress, generateStudyPlan } from '../utils/helpers.js';
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

/* ━━━ SUBJECT CHIP ━━━ */
function SubjectChip({ subject }) {
  const theme = getSubjectTheme(subject) || T.eng;
  const subj = getSubject(subject);
  const label = subj ? subj.name.split(' ').slice(0, 2).join(' ') : (subject || 'General').toUpperCase();
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase',
      color: T.text, background: '#fff', border: `1px solid ${theme.accent}40`,
      borderRadius: T.r1, padding: '2px 8px',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: theme.accent }} />
      {label}
    </span>
  );
}

/* ━━━ RESUME CARD ━━━ */
function ResumeCard({ state, dispatch }) {
  const today = new Date().toISOString().split('T')[0];
  const activeHw = state.homework.filter(h => h.status === 'active');
  const subs = state.submissions || [];

  let resumeSub = subs.find(s => s.status === 'in_progress');
  if (!resumeSub) {
    resumeSub = subs.find(s => {
      const hw = activeHw.find(h => h.id === s.homeworkId);
      return hw && hw.dueDate < today && s.status === 'not_started';
    });
  }
  if (!resumeSub) resumeSub = subs.find(s => s.status === 'not_started');
  const resumeHw = resumeSub ? state.homework.find(h => h.id === resumeSub.homeworkId) : null;

  if (!resumeHw) {
    return (
      <div style={{
        background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r3,
        padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 20,
        boxShadow: '0 1px 3px rgba(28,27,25,0.04)', marginBottom: 20,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: T.textSec, marginBottom: 6 }}>
            Nothing overdue — great work!
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.3, color: T.text }}>Build your vocabulary</div>
          <div style={{ fontSize: 13, color: T.textSec, marginTop: 4 }}>Practise high-value words with flashcards and quizzes</div>
        </div>
        <button onClick={() => dispatch({ type: 'SET_PAGE', payload: 'vocab' })}
          style={{ padding: '11px 20px', borderRadius: T.r2, background: T.accent, color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          Vocab Builder <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  const subjectTheme = getSubjectTheme(resumeHw.subject) || T.eng;
  const isOverdue = resumeHw.dueDate < today;
  const statusLabel = resumeSub.status === 'in_progress' ? 'In Progress' : isOverdue ? 'Overdue' : 'Not Started';

  return (
    <div style={{
      background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r3,
      padding: 20, display: 'flex', alignItems: 'stretch', gap: 18,
      boxShadow: '0 1px 3px rgba(28,27,25,0.04)', marginBottom: 20, overflow: 'hidden',
    }}>
      <div style={{
        width: 90, flexShrink: 0, borderRadius: T.r2, background: subjectTheme.bg,
        border: `1px solid ${T.border}`, padding: '10px 8px',
        display: 'flex', flexDirection: 'column', gap: 4, position: 'relative',
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: subjectTheme.accent, letterSpacing: 0.5, textTransform: 'uppercase' }}>
          {resumeHw.subject?.toUpperCase()}
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[90, 70, 85, 45, 60].map((w, i) => (
            <div key={i} style={{ height: 3, background: subjectTheme.accent + '30', borderRadius: 2, width: `${w}%` }} />
          ))}
        </div>
        {isOverdue && <div style={{ position: 'absolute', top: 7, right: 7, width: 6, height: 6, borderRadius: '50%', background: T.danger }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: isOverdue ? T.danger : T.accent, display: 'flex', alignItems: 'center', gap: 5 }}>
          <ArrowRight size={11} />
          {isOverdue ? 'Overdue assignment' : 'Pick up where you left off'}
        </div>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1.2, color: T.text }}>{resumeHw.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <SubjectChip subject={resumeHw.subject} />
          <span style={{ fontSize: 11, color: T.textSec }}>{isOverdue ? `Was due ${resumeHw.dueDate}` : `Due ${resumeHw.dueDate}`}</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: T.textTer }} />
          <span style={{ fontSize: 11, color: statusLabel === 'In Progress' ? T.accent : T.textSec, fontWeight: 600 }}>{statusLabel}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, flexShrink: 0 }}>
        <button onClick={() => dispatch({ type: 'SET_PAGE', payload: 'homework' })}
          style={{ padding: '10px 18px', borderRadius: T.r2, background: isOverdue ? T.danger : T.accent, color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          Open assignment <ArrowRight size={13} />
        </button>
        <button style={{ background: 'transparent', border: 'none', color: T.textSec, fontSize: 12, fontFamily: T.fontBody, cursor: 'pointer', padding: '2px 0', textAlign: 'center' }}>
          Show something else
        </button>
      </div>
    </div>
  );
}

/* ━━━ TODAY'S PLAN ━━━ */
function TodaysPlanCard({ state }) {
  const today = new Date().toISOString().split('T')[0];
  const todayHint = new Date().toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase();
  const todayName = new Date().toLocaleDateString('en-SG', { weekday: 'long' });
  const plan = generateStudyPlan(state);
  const todayPlan = plan.find(d => d.day === todayName);

  const hwTasks = state.homework
    .filter(h => h.status === 'active' && h.dueDate <= today)
    .map(h => {
      const sub = (state.submissions || []).find(s => s.homeworkId === h.id);
      return { label: h.title, subject: h.subject, meta: h.dueDate === today ? 'Due today' : 'Overdue', done: sub?.status === 'submitted' || sub?.status === 'graded', overdue: h.dueDate < today };
    });

  const planTasks = (todayPlan?.tasks || []).map(t => ({
    label: `${t.type} — ${todayPlan.subjectId?.toUpperCase().slice(0, 3)} ${t.duration}`,
    subject: todayPlan.subjectId, meta: t.duration, done: false, overdue: false,
  }));

  const tasks = [...hwTasks, ...planTasks].slice(0, 5);
  const doneCount = tasks.filter(t => t.done).length;

  return (
    <DCard
      title="Today's plan" hint={todayHint}
      action={tasks.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: T.textTer, fontFamily: T.fontMono }}>{doneCount}/{tasks.length}</span>
          <div style={{ width: 52, height: 4, borderRadius: 999, background: T.bgMuted, overflow: 'hidden' }}>
            <div style={{ width: `${tasks.length > 0 ? (doneCount / tasks.length) * 100 : 0}%`, height: '100%', background: T.accent, borderRadius: 999 }} />
          </div>
        </div>
      )}
    >
      {tasks.length === 0 ? (
        <div style={{ padding: '6px 0', fontSize: 13, color: T.textTer, fontStyle: 'italic' }}>No tasks for today — great time to practice!</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {tasks.map((task, i) => {
            const theme = getSubjectTheme(task.subject) || T.eng;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 0', borderTop: i === 0 ? 'none' : `1px solid ${T.border}` }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                  border: `1.5px solid ${task.done ? theme.accent : T.border}`,
                  background: task.done ? theme.accent : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {task.done && <CheckCircle size={12} color="#fff" weight="fill" />}
                </div>
                <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: task.done ? T.textTer : T.text, textDecoration: task.done ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {task.label}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, padding: '2px 6px', borderRadius: T.r1, background: theme.accent + '18', color: theme.accent, flexShrink: 0 }}>
                  {(task.subject || 'GEN').slice(0, 3).toUpperCase()}
                </span>
                {task.overdue && <span style={{ fontSize: 10, fontWeight: 700, color: T.danger, flexShrink: 0 }}>LATE</span>}
                <span style={{ fontSize: 11, color: T.textSec, minWidth: 50, textAlign: 'right', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{task.meta}</span>
              </div>
            );
          })}
        </div>
      )}
    </DCard>
  );
}

/* ━━━ ASSIGNMENTS ━━━ */
function AssignmentsCard({ state, dispatch }) {
  const [tab, setTab] = useState('due');
  const today = new Date().toISOString().split('T')[0];
  const activeHw = state.homework.filter(h => h.status === 'active');
  const subs = state.submissions || [];

  const dueItems = activeHw
    .map(h => ({ hw: h, sub: subs.find(s => s.homeworkId === h.id) }))
    .filter(({ sub }) => sub && (sub.status === 'not_started' || sub.status === 'in_progress'))
    .sort((a, b) => (a.hw.dueDate || '').localeCompare(b.hw.dueDate || ''));

  const submittedItems = subs
    .filter(s => s.status === 'submitted')
    .map(s => ({ sub: s, hw: state.homework.find(h => h.id === s.homeworkId) }))
    .filter(({ hw }) => hw);

  const returnedItems = subs
    .filter(s => s.status === 'graded')
    .sort((a, b) => (b.gradedAt || '').localeCompare(a.gradedAt || ''))
    .slice(0, 5)
    .map(s => ({ sub: s, hw: state.homework.find(h => h.id === s.homeworkId) }))
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
    { label: 'Mistake Log',  meta: 'Track your errors',     icon: Notebook,      color: T.accent,        page: 'mistakes'     },
    { label: 'Community',    meta: 'Chat & share',          icon: Handshake,     color: T.success,       page: 'community'    },
  ];
  return (
    <DCard title="Jump in" action={
      <button onClick={() => dispatch({ type: 'SET_PAGE', payload: 'library-eng' })}
        style={{ fontSize: 12, color: T.accent, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
        Browse library →
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
    ...(state.notes || []).map(n => n.createdAt),
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
          { label: 'HW Done', value: wp.hwCompleted, color: T.accent },
          { label: 'Notes',   value: wp.notesCreated, color: T.teal },
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
function ExamCountdownCard() {
  const exams = getExamCountdowns().slice(0, 4);
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
function RecentlyReturnedCard({ state, dispatch }) {
  const returned = (state.submissions || [])
    .filter(s => s.status === 'graded')
    .sort((a, b) => (b.gradedAt || '').localeCompare(a.gradedAt || ''))
    .slice(0, 3)
    .map(s => ({ sub: s, hw: state.homework.find(h => h.id === s.homeworkId) }))
    .filter(({ hw }) => hw);

  if (!returned.length) return null;

  const gradeColor = g => {
    if (!g) return T.textSec;
    const u = g.toUpperCase();
    if (u.startsWith('A')) return T.success;
    if (u.startsWith('B')) return T.accent;
    return T.warning;
  };

  return (
    <DCard title="Recently returned" action={
      <button onClick={() => dispatch({ type: 'SET_PAGE', payload: 'homework' })}
        style={{ fontSize: 12, color: T.accent, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
        See all →
      </button>
    }>
      <div>
        {returned.map(({ sub, hw }, i) => (
          <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 0', borderTop: i === 0 ? 'none' : `1px solid ${T.border}` }}>
            <div style={{ width: 38, height: 38, borderRadius: T.r2, background: gradeColor(sub.grade) + '18', color: gradeColor(sub.grade), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
              {sub.grade || '—'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{hw.title}</div>
              {sub.gradeComment && <div style={{ fontSize: 11, color: T.textSec, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.gradeComment.slice(0, 50)}</div>}
            </div>
            <span style={{ fontSize: 11, color: T.textTer, fontFamily: T.fontMono, flexShrink: 0 }}>{sub.gradedAt || ''}</span>
          </div>
        ))}
      </div>
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
          Practice all <ArrowRight size={12} />
        </button>
      </div>
    </DCard>
  );
}

/* ━━━ STUDENT DASHBOARD ━━━ */
function StudentDashboard({ state, dispatch, authUser, userProfile }) {
  const winW = useWindowWidth();
  const isMobile = winW < 768;
  const today = new Date().toISOString().split('T')[0];
  const activeHw = state.homework.filter(h => h.status === 'active');
  const subs = state.submissions || [];

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
      <ResumeCard state={state} dispatch={dispatch} />
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.55fr 1fr', gap: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TodaysPlanCard state={state} />
          <AssignmentsCard state={state} dispatch={dispatch} />
          <JumpInCard dispatch={dispatch} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <WeekProgressCard state={state} />
          <ExamCountdownCard />
          <RecentlyReturnedCard state={state} dispatch={dispatch} />
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
          ? <><span style={{ color: T.danger, fontWeight: 600 }}>{pendingSubmissions} submission{pendingSubmissions > 1 ? 's' : ''} awaiting your review.</span> Your students are counting on you.</>
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
    { icon: Users,            value: (state.students || []).length,                              label: 'Students',   color: T.omath.accent, bg: T.omath.bg,    page: 'progress',    urgent: false },
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
                { label: 'Student Progress',  icon: ChartLineUp,   page: 'progress',      color: T.success      },
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
function Dashboard({ state, dispatch, authUser, userProfile }) {
  return <TutorDashboard state={state} dispatch={dispatch} authUser={authUser} userProfile={userProfile} />;
}

export { StudentDashboard };
export default Dashboard;
