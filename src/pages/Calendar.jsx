import React, { useState, useMemo } from 'react';
import { T } from '../theme/theme.js';
import { CaretLeft, CaretRight, CalendarBlank, ClipboardText, CalendarCheck } from '../icons/icons.jsx';
import { PageHeader } from '../components/ui';
import { getSubject, getSubjectTheme } from '../utils/helpers.js';

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function toYMD(date) {
  return date.toISOString().split('T')[0];
}

function DAY_LABELS() {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
}

function SessionChip({ session, compact }) {
  const theme = getSubjectTheme(session.subject) || T.eng;
  const subj = getSubject(session.subject);
  const label = compact
    ? (subj?.name?.split(' ').slice(-1)[0] || session.subject).slice(0, 6)
    : (subj?.name || session.subject);
  return (
    <div style={{
      padding: compact ? '2px 6px' : '5px 8px',
      borderRadius: T.r1,
      background: theme.bg,
      border: `1px solid ${theme.accent}30`,
      fontSize: compact ? 10 : 11,
      fontWeight: 700,
      color: theme.accent,
      display: 'flex', alignItems: 'center', gap: 4,
      overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
      lineHeight: 1.3,
    }}>
      <CalendarCheck size={compact ? 9 : 11} color={theme.accent} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
      {!compact && session.time && <span style={{ fontWeight: 500, color: theme.accent + 'BB' }}>{session.time}</span>}
    </div>
  );
}

function HwChip({ hw, compact }) {
  const theme = getSubjectTheme(hw.subject) || T.eng;
  const label = compact ? hw.title.slice(0, 8) : hw.title;
  return (
    <div style={{
      padding: compact ? '2px 6px' : '5px 8px',
      borderRadius: T.r1,
      background: T.bgMuted,
      border: `1px solid ${T.border}`,
      fontSize: compact ? 10 : 11,
      fontWeight: 600,
      color: T.textSec,
      display: 'flex', alignItems: 'center', gap: 4,
      overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
      lineHeight: 1.3,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: theme.accent, flexShrink: 0 }} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
      {!compact && <span style={{ fontSize: 10, color: T.textTer, fontWeight: 500 }}>due</span>}
    </div>
  );
}

function WeekView({ weekStart, events }) {
  const today = toYMD(new Date());
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(weekStart, i);
    const ds = toYMD(d);
    return {
      date: d,
      ds,
      label: DAY_LABELS()[i],
      dayNum: d.getDate(),
      isToday: ds === today,
      sessions: events.sessions.filter(s => s.date === ds),
      homework: events.homework.filter(h => h.dueDate === ds),
    };
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
      {days.map((day) => (
        <div key={day.ds} style={{
          minHeight: 120,
          background: day.isToday ? T.accentLight : T.bgCard,
          border: `1px solid ${day.isToday ? T.accent + '50' : T.border}`,
          borderRadius: T.r2, padding: 10,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: day.isToday ? T.accent : T.textTer, letterSpacing: 0.5, textTransform: 'uppercase' }}>{day.label}</span>
            <span style={{
              width: 28, height: 28, borderRadius: '50%',
              background: day.isToday ? T.accent : 'transparent',
              color: day.isToday ? '#fff' : T.text,
              fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{day.dayNum}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {day.sessions.map(s => <SessionChip key={s.id} session={s} compact />)}
            {day.homework.map(h => <HwChip key={h.id} hw={h} compact />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function MonthView({ monthStart, events }) {
  const today = toYMD(new Date());
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Start from Monday of the week containing the 1st
  const gridStart = getMonday(firstDay);
  // Number of cells needed (always show at least 5 weeks)
  const totalDays = Math.ceil((lastDay.getDate() + (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1)) / 7) * 7;
  const cells = Array.from({ length: Math.max(totalDays, 35) }, (_, i) => {
    const d = addDays(gridStart, i);
    const ds = toYMD(d);
    return {
      date: d,
      ds,
      dayNum: d.getDate(),
      inMonth: d.getMonth() === month,
      isToday: ds === today,
      sessions: events.sessions.filter(s => s.date === ds),
      homework: events.homework.filter(h => h.dueDate === ds),
    };
  });

  return (
    <div>
      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
        {DAY_LABELS().map(l => (
          <div key={l} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: T.textTer, padding: '4px 0', letterSpacing: 0.5, textTransform: 'uppercase' }}>{l}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cells.map((cell) => {
          const hasEvents = cell.sessions.length > 0 || cell.homework.length > 0;
          return (
            <div key={cell.ds} style={{
              minHeight: 80,
              background: cell.isToday ? T.accentLight : cell.inMonth ? T.bgCard : T.bgMuted,
              border: `1px solid ${cell.isToday ? T.accent + '60' : T.border}`,
              borderRadius: T.r1, padding: 6,
              opacity: cell.inMonth ? 1 : 0.45,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: cell.isToday ? T.accent : 'transparent',
                color: cell.isToday ? '#fff' : cell.inMonth ? T.text : T.textTer,
                fontSize: 12, fontWeight: cell.isToday ? 700 : 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: hasEvents ? 4 : 0,
              }}>{cell.dayNum}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {cell.sessions.slice(0, 2).map(s => <SessionChip key={s.id} session={s} compact />)}
                {cell.homework.slice(0, 2).map(h => <HwChip key={h.id} hw={h} compact />)}
                {(cell.sessions.length + cell.homework.length > 2) && (
                  <span style={{ fontSize: 10, color: T.textTer, fontWeight: 600 }}>+{cell.sessions.length + cell.homework.length - 2} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DetailCard({ title, items }) {
  if (!items.length) return null;
  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r2, padding: 16, marginTop: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.textTer, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, i) => {
          const theme = getSubjectTheme(item.subject) || T.eng;
          const subj = getSubject(item.subject);
          return (
            <div key={item.id || i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px', borderRadius: T.r1, background: theme.bg }}>
              <div style={{ width: 36, height: 36, borderRadius: T.r1, background: theme.accent + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {item.time !== undefined
                  ? <CalendarCheck size={16} color={theme.accent} />
                  : <ClipboardText size={16} color={theme.accent} />
                }
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{item.title || subj?.name || item.subject}</div>
                <div style={{ fontSize: 11, color: T.textSec, marginTop: 2 }}>
                  {item.date || item.dueDate}
                  {item.time && ` · ${item.time}`}
                  {item.notes && ` · ${item.notes.slice(0, 40)}`}
                </div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: theme.accent + '20', color: theme.accent }}>
                {(subj?.name?.split(' ').slice(-1)[0] || item.subject || 'Session').toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Calendar({ state }) {
  const [view, setView] = useState('week');
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const weekStart = useMemo(() => getMonday(cursor), [cursor]);
  const monthStart = useMemo(() => {
    const d = new Date(cursor);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [cursor]);

  const activeSessions = useMemo(() => Array.isArray(state.sessions) ? state.sessions.filter(s => s.date) : [], [state.sessions]);
  const activeHomework = useMemo(() => Array.isArray(state.homework) ? state.homework.filter(h => h.status === 'active' && h.dueDate) : [], [state.homework]);

  const events = useMemo(() => ({
    sessions: activeSessions,
    homework: activeHomework,
  }), [activeSessions, activeHomework]);

  // Upcoming sessions and homework in the visible window
  const upcomingSessions = useMemo(() => {
    const today = toYMD(new Date());
    return activeSessions.filter(s => s.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  }, [activeSessions]);
  const upcomingHw = useMemo(() => {
    const today = toYMD(new Date());
    return activeHomework.filter(h => h.dueDate >= today).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5);
  }, [activeHomework]);

  function prev() {
    if (view === 'week') setCursor(d => addDays(d, -7));
    else setCursor(d => { const nd = new Date(d); nd.setMonth(nd.getMonth() - 1); return nd; });
  }
  function next() {
    if (view === 'week') setCursor(d => addDays(d, 7));
    else setCursor(d => { const nd = new Date(d); nd.setMonth(nd.getMonth() + 1); return nd; });
  }
  function goToday() { const d = new Date(); d.setHours(0, 0, 0, 0); setCursor(d); }

  const periodLabel = view === 'week'
    ? (() => {
        const end = addDays(weekStart, 6);
        const startStr = weekStart.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' });
        const endStr = end.toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });
        return `${startStr} – ${endStr}`;
      })()
    : monthStart.toLocaleDateString('en-SG', { month: 'long', year: 'numeric' });

  return (
    <div>
      <PageHeader title="Calendar" subtitle="Sessions, homework due dates, and upcoming events" />

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={prev} aria-label="Previous"
            style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: T.r1, border: `1px solid ${T.border}`, background: T.bgCard, cursor: 'pointer' }}>
            <CaretLeft size={14} color={T.textSec} />
          </button>
          <button onClick={next} aria-label="Next"
            style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: T.r1, border: `1px solid ${T.border}`, background: T.bgCard, cursor: 'pointer' }}>
            <CaretRight size={14} color={T.textSec} />
          </button>
          <button onClick={goToday}
            style={{ padding: '6px 14px', borderRadius: T.r1, border: `1px solid ${T.border}`, background: T.bgCard, color: T.textSec, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            Today
          </button>
        </div>
        <span style={{ flex: 1, fontSize: 16, fontWeight: 700, color: T.text, letterSpacing: -0.3 }}>{periodLabel}</span>
        <div style={{ display: 'flex', gap: 3 }}>
          {['week', 'month'].map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding: '6px 14px', borderRadius: T.r1, border: `1px solid ${view === v ? T.accent : T.border}`, background: view === v ? T.accentLight : T.bgCard, color: view === v ? T.accentText : T.textSec, fontSize: 12, fontWeight: view === v ? 700 : 500, cursor: 'pointer', textTransform: 'capitalize' }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
        {[
          { color: T.omath.accent, bg: T.omath.bg, label: 'Session' },
          { color: T.textSec, bg: T.bgMuted, label: 'Homework due' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: T.textSec }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: l.bg, border: `1px solid ${l.color}40` }} />
            {l.label}
          </div>
        ))}
      </div>

      {view === 'week'
        ? <WeekView weekStart={weekStart} events={events} />
        : <MonthView monthStart={monthStart} events={events} />
      }

      <DetailCard title="Upcoming Sessions" items={upcomingSessions} />
      <DetailCard title="Upcoming Homework Deadlines" items={upcomingHw.map(h => ({ ...h, title: h.title }))} />
    </div>
  );
}
