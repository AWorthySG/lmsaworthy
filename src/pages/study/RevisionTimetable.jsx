import React, { useState, useMemo } from 'react';
import { T } from '../../theme/theme.js';
import { Table, Printer, CaretDown, CaretUp, CalendarBlank } from '../../icons/icons.jsx';
import { Card, Btn, PageHeader, Badge } from '../../components/ui';
import { getExamCountdowns, getSubjectTheme } from '../../utils/helpers.js';
import { SUBJECTS } from '../../data/subjects.js';

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const ACTIVITY_TYPES = [
  { type: "Past Paper", duration: "60 min" },
  { type: "Practice Drills", duration: "30 min" },
  { type: "Essay Practice", duration: "45 min" },
  { type: "Example Review", duration: "20 min" },
  { type: "Vocabulary", duration: "15 min" },
];

function generateTimetable({ subjects, selectedDays, hoursPerDay, weeksAhead, customExams }) {
  if (!subjects.length || !selectedDays.length) return [];

  const exams = getExamCountdowns(customExams);

  // Build weighted subject pool — subjects with sooner exams appear more
  const pool = [];
  subjects.forEach(sid => {
    const soonest = exams.find(e => e.subject === sid);
    const weight = soonest ? Math.max(1, Math.min(8, Math.floor(90 / Math.max(soonest.daysLeft, 1)))) : 1;
    for (let i = 0; i < weight; i++) pool.push(sid);
  });

  const JS_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const start = new Date();
  const result = [];
  let poolIdx = 0;
  let actIdx = 0;

  for (let d = 0; d < weeksAhead * 7; d++) {
    const date = new Date(start);
    date.setDate(date.getDate() + d);
    const dayName = JS_DAYS[date.getDay()];
    if (!selectedDays.includes(dayName)) continue;

    const blocksPerDay = Math.max(1, Math.round(hoursPerDay * 2));
    const blocks = [];

    for (let b = 0; b < blocksPerDay; b++) {
      const sid = pool[poolIdx % pool.length];
      poolIdx++;
      const act = ACTIVITY_TYPES[actIdx % ACTIVITY_TYPES.length];
      actIdx++;
      blocks.push({ subjectId: sid, activity: act.type, duration: act.duration });
    }

    result.push({
      date: date.toISOString().split("T")[0],
      dayName: dayName.slice(0, 3),
      fullDate: date.toLocaleDateString("en-SG", { day: "numeric", month: "short" }),
      blocks,
    });
  }

  return result;
}

export default function RevisionTimetable({ state, enrolledSubjects }) {
  const [subjects, setSubjects] = useState(() => enrolledSubjects ? SUBJECTS.filter(s => enrolledSubjects.includes(s.id)).map(s => s.id) : SUBJECTS.map(s => s.id));
  const [selectedDays, setSelectedDays] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [weeksAhead, setWeeksAhead] = useState(2);
  const [generated, setGenerated] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);

  function toggleSubject(id) {
    setSubjects(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  }
  function toggleDay(day) {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  }

  const subjectsKey = subjects.join(",");
  const daysKey = selectedDays.join(",");

  const timetable = useMemo(() => {
    if (!generated) return [];
    return generateTimetable({
      subjects: subjectsKey.split(",").filter(Boolean),
      selectedDays: daysKey.split(",").filter(Boolean),
      hoursPerDay,
      weeksAhead,
      customExams: state.customExams || [],
    });
  }, [generated, subjectsKey, daysKey, hoursPerDay, weeksAhead, state.customExams]);

  // Group days into calendar weeks (Mon-Sun buckets)
  const weekGroups = useMemo(() => {
    if (!timetable.length) return [];
    const firstDate = new Date(timetable[0].date);
    const groups = [];
    timetable.forEach(day => {
      const diff = Math.floor((new Date(day.date) - firstDate) / (7 * 86400000));
      if (!groups[diff]) groups[diff] = [];
      groups[diff].push(day);
    });
    return groups.filter(Boolean);
  }, [timetable]);

  const exams = useMemo(() => getExamCountdowns(state.customExams), [state.customExams]);

  const urgentSubjects = useMemo(() => {
    const set = new Set(exams.filter(e => e.daysLeft <= 60).map(e => e.subject));
    return set;
  }, [exams]);

  const totalHours = useMemo(() => {
    return timetable.reduce((sum, day) => sum + day.blocks.reduce((s, b) => {
      const act = ACTIVITY_TYPES.find(a => a.type === b.activity);
      const mins = act ? parseInt(act.duration) : 30;
      return s + mins;
    }, 0), 0) / 60;
  }, [timetable]);

  return (
    <div>
      <PageHeader
        title="Revision Timetable"
        subtitle="Auto-generate a weighted study schedule"
        action={generated ? (
          <Btn variant="secondary" onClick={() => window.print()} className="no-print">
            <Printer size={14} weight="bold" /> Print
          </Btn>
        ) : null}
      />

      {/* Config card */}
      <Card elevated style={{ marginBottom: 20 }} className="no-print">
        <button
          onClick={() => setConfigOpen(o => !o)}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0, width: "100%", textAlign: "left" }}
        >
          <Table size={16} color={T.accent} />
          <span style={{ fontSize: 14, fontWeight: 700, color: T.text, flex: 1 }}>Configure Timetable</span>
          {configOpen ? <CaretUp size={14} color={T.textTer} /> : <CaretDown size={14} color={T.textTer} />}
        </button>

        {configOpen && (
          <div style={{ marginTop: 18 }}>
            {/* Subjects */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.textSec, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Subjects to include
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {SUBJECTS.map(s => {
                  const theme = getSubjectTheme(s.id);
                  const active = subjects.includes(s.id);
                  const urgent = urgentSubjects.has(s.id);
                  return (
                    <button key={s.id} onClick={() => toggleSubject(s.id)}
                      style={{ padding: "5px 12px", borderRadius: T.r2, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1.5px solid ${active ? theme.accent : T.border}`, background: active ? theme.bg : "transparent", color: active ? theme.accent : T.textTer, display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s" }}>
                      {s.name}
                      {urgent && <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, flexShrink: 0 }} title="Exam within 60 days" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Days of week */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.textSec, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Study days
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {DAYS_OF_WEEK.map(day => {
                  const active = selectedDays.includes(day);
                  return (
                    <button key={day} onClick={() => toggleDay(day)}
                      style={{ width: 40, height: 40, borderRadius: T.r2, fontSize: 11, fontWeight: 700, cursor: "pointer", border: `1.5px solid ${active ? T.accent : T.border}`, background: active ? T.accentLight : "transparent", color: active ? T.accentText : T.textTer, transition: "all 0.15s" }}>
                      {day.slice(0, 1)}{day.slice(1, 2).toLowerCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hours & weeks */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.textSec, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Hours per study day: <span style={{ color: T.accent }}>{hoursPerDay}h</span>
                </div>
                <input type="range" min={1} max={6} value={hoursPerDay} onChange={e => setHoursPerDay(Number(e.target.value))}
                  style={{ width: "100%", accentColor: T.accent }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.textTer, marginTop: 2 }}>
                  <span>1h</span><span>6h</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.textSec, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Weeks ahead: <span style={{ color: T.accent }}>{weeksAhead}</span>
                </div>
                <input type="range" min={1} max={4} value={weeksAhead} onChange={e => setWeeksAhead(Number(e.target.value))}
                  style={{ width: "100%", accentColor: T.accent }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.textTer, marginTop: 2 }}>
                  <span>1</span><span>4</span>
                </div>
              </div>
            </div>

            <Btn onClick={() => { setGenerated(false); setTimeout(() => setGenerated(true), 0); setConfigOpen(false); }}
              disabled={!subjects.length || !selectedDays.length}>
              <Table size={14} /> Generate Timetable
            </Btn>
          </div>
        )}
      </Card>

      {/* Generated timetable */}
      {timetable.length === 0 && !generated && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: T.textTer }}>
          <CalendarBlank size={40} color={T.border} style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: T.textSec }}>Configure and generate your timetable above</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Subjects with upcoming exams will be weighted for more practice time.</div>
        </div>
      )}

      {timetable.length > 0 && (
        <>
          {/* Summary bar */}
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }} className="no-print">
            <div style={{ padding: "8px 16px", background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, fontSize: 13 }}>
              <span style={{ fontWeight: 700, color: T.accent }}>{timetable.length}</span>
              <span style={{ color: T.textSec, marginLeft: 4 }}>study days</span>
            </div>
            <div style={{ padding: "8px 16px", background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, fontSize: 13 }}>
              <span style={{ fontWeight: 700, color: T.accent }}>{totalHours.toFixed(1)}h</span>
              <span style={{ color: T.textSec, marginLeft: 4 }}>total study time</span>
            </div>
            {[...urgentSubjects].filter(sid => subjects.includes(sid)).length > 0 && (
              <div style={{ padding: "8px 16px", background: "#FEF3C7", borderRadius: T.r2, border: "1px solid #FDE68A", fontSize: 12, color: "#92400E", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, flexShrink: 0 }} />
                Exam-priority weighting applied
              </div>
            )}
          </div>

          {/* Week sections */}
          {weekGroups.map((week, wi) => {
            const firstDay = week[0];
            const lastDay = week[week.length - 1];
            return (
              <div key={wi} style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                  Week {wi + 1} — {firstDay.fullDate} to {lastDay.fullDate}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(week.length, 5)}, 1fr)`, gap: 10 }}>
                  {week.map((day, di) => (
                    <Card key={di} style={{ padding: 12 }}>
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 13, fontWeight: 750, color: T.text }}>{day.dayName}</div>
                        <div style={{ fontSize: 11, color: T.textTer }}>{day.fullDate}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {day.blocks.map((block, bi) => {
                          const theme = getSubjectTheme(block.subjectId);
                          const subj = SUBJECTS.find(s => s.id === block.subjectId);
                          return (
                            <div key={bi} style={{ padding: "7px 10px", borderRadius: T.r1, background: theme.bg, borderLeft: `3px solid ${theme.accent}` }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: theme.accent }}>{subj?.name || block.subjectId}</div>
                              <div style={{ fontSize: 10, color: T.textSec, marginTop: 2 }}>{block.activity}</div>
                              <div style={{ fontSize: 9, color: T.textTer, marginTop: 1 }}>{block.duration}</div>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div style={{ marginTop: 12, padding: "12px 16px", background: T.bgMuted, borderRadius: T.r2, display: "flex", flexWrap: "wrap", gap: 10 }} className="no-print">
            {SUBJECTS.filter(s => subjects.includes(s.id)).map(s => {
              const theme = getSubjectTheme(s.id);
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: theme.accent }} />
                  <span style={{ color: T.textSec }}>{s.name}</span>
                  {urgentSubjects.has(s.id) && <Badge color="#92400E" bg="#FEF3C7" style={{ fontSize: 9 }}>Exam soon</Badge>}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
