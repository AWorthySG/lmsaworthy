import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { T } from '../theme/theme.js';
import { CalendarCheck, CalendarBlank, Plus, X, CheckCircle, Warning, Clock, Users } from '../icons/icons.jsx';
import { Card, Btn, Badge, SubjectBadge, PageHeader, Select, Input, Textarea, StatCard } from '../components/ui';
import { StudentAvatar } from '../components/gamification';
import { formatDate } from '../utils/helpers.js';
import { SUBJECTS } from '../data/subjects.js';

function Attendance({ state, dispatch }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filterSubj, setFilterSubj] = useState("");
  const [view, setView] = useState("sessions");
  const [expanded, setExpanded] = useState(null);
  const [nDate, setNDate] = useState(""); const [nSubj, setNSubj] = useState(""); const [nTime, setNTime] = useState(""); const [nNotes, setNNotes] = useState("");
  const [editingNotes, setEditingNotes] = useState(null);
  const [showQR, setShowQR] = useState(null); // session ID to show QR for

  const TODAY = "2026-03-18";
  const getStudentsForSubject = (subjectId) => state.students.filter(st => st.subjects.includes(subjectId));

  const sessions = state.sessions
    .filter(s => !filterSubj || s.subject === filterSubj)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Stats
  const totalSessions = state.sessions.length;
  const todaySessions = state.sessions.filter(s => s.date === TODAY).length;
  let totalExpected = 0, totalPresent = 0;
  state.sessions.forEach(s => {
    const stu = getStudentsForSubject(s.subject);
    const rec = state.attendance[s.id] || {};
    totalExpected += stu.length;
    totalPresent += Object.values(rec).filter(v => v === "present" || v === "late").length;
  });
  const attendanceRate = totalExpected > 0 ? Math.round((totalPresent / totalExpected) * 100) : 0;

  function addSession() {
    if (!nDate || !nSubj || !nTime) return;
    dispatch({ type: "ADD_SESSION", payload: { date: nDate, subject: nSubj, time: nTime, notes: nNotes } });
    dispatch({ type: "ADD_TOAST", payload: { message: "Session added successfully", variant: "success" } });
    setNDate(""); setNSubj(""); setNTime(""); setNNotes(""); setShowAdd(false);
  }

  // Student summary view
  if (view === "students") {
    const studentStats = state.students.map(student => {
      let expected = 0, present = 0, late = 0, absent = 0;
      state.sessions.forEach(s => {
        if (student.subjects.includes(s.subject)) {
          expected++;
          const status = (state.attendance[s.id] || {})[student.id];
          if (status === "present") present++;
          else if (status === "late") late++;
          else if (status === "absent") absent++;
        }
      });
      const rate = expected > 0 ? Math.round(((present + late) / expected) * 100) : 0;
      return { ...student, expected, present, late, absent, rate };
    });

    return (
      <div>
        <PageHeader title="Attendance" subtitle="Student attendance overview"
          action={<div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" onClick={() => setView("sessions")}><CalendarCheck size={15} weight="bold" /> Sessions</Btn>
            <Btn onClick={() => setShowAdd(true)}><Plus size={15} weight="bold" /> New Session</Btn>
          </div>} />

        {showAdd && (
          <Card elevated style={{ marginBottom: 20, borderLeft: `3px solid ${T.accent}` }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: "0 0 14px" }}>Add New Session</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <Input value={nDate} onChange={setNDate} type="date" />
              <Select value={nSubj} onChange={setNSubj} options={SUBJECTS.map(s => ({ value: s.id, label: s.name }))} placeholder="Select subject" />
              <Input value={nTime} onChange={setNTime} placeholder="e.g. 14:00–15:30" />
              <Input value={nNotes} onChange={setNNotes} placeholder="Session notes (optional)" />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn onClick={addSession}><Plus size={14} weight="bold" /> Add</Btn>
              <Btn variant="secondary" onClick={() => setShowAdd(false)}><X size={14} weight="bold" /> Cancel</Btn>
            </div>
          </Card>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
          {studentStats.map(st => {
            const rateColor = st.rate >= 80 ? T.success : st.rate >= 60 ? T.warning : T.danger;
            return (
              <Card key={st.id} elevated>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <StudentAvatar student={st} size={44} radius={T.r3} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 650, color: T.text }}>{st.name}</div>
                    <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>{st.subjects.map(s => <SubjectBadge key={s} subjectId={s} small />)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: rateColor, letterSpacing: -1 }}>{st.rate}%</div>
                    <div style={{ fontSize: 11, color: T.textTer }}>attendance</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, textAlign: "center" }}>
                  <div style={{ padding: 8, background: T.bgMuted, borderRadius: T.r1 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: T.text }}>{st.expected}</div>
                    <div style={{ fontSize: 10, color: T.textTer }}>Expected</div>
                  </div>
                  <div style={{ padding: 8, background: T.successBg, borderRadius: T.r1 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: T.success }}>{st.present}</div>
                    <div style={{ fontSize: 10, color: T.textTer }}>Present</div>
                  </div>
                  <div style={{ padding: 8, background: T.warningBg, borderRadius: T.r1 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: T.warning }}>{st.late}</div>
                    <div style={{ fontSize: 10, color: T.textTer }}>Late</div>
                  </div>
                  <div style={{ padding: 8, background: T.dangerBg, borderRadius: T.r1 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: T.danger }}>{st.absent}</div>
                    <div style={{ fontSize: 10, color: T.textTer }}>Absent</div>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}><Progress value={st.rate} color={rateColor} /></div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Sessions view (default)
  return (
    <div>
      <PageHeader title="Attendance" subtitle={`${totalSessions} sessions · ${attendanceRate}% overall attendance`}
        action={<div style={{ display: "flex", gap: 8 }}>
          <Btn variant="secondary" onClick={() => setView("students")}><Users size={15} weight="bold" /> By Student</Btn>
          <Btn onClick={() => setShowAdd(!showAdd)}><Plus size={15} weight="bold" /> New Session</Btn>
        </div>} />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        <StatCard icon={CalendarCheck} value={totalSessions} label="Total Sessions" color={T.accent} />
        <StatCard icon={CalendarBlank} value={todaySessions} label="Today's Sessions" color="#3F51EC" />
        <StatCard icon={Users} value={attendanceRate + "%"} label="Attendance Rate" color="#00A85A" />
      </div>

      {/* Add session form */}
      {showAdd && (
        <Card elevated style={{ marginBottom: 20, borderLeft: `3px solid ${T.accent}` }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: "0 0 14px" }}>Add New Session</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <Input value={nDate} onChange={setNDate} type="date" />
            <Select value={nSubj} onChange={setNSubj} options={SUBJECTS.map(s => ({ value: s.id, label: s.name }))} placeholder="Select subject" />
            <Input value={nTime} onChange={setNTime} placeholder="e.g. 14:00–15:30" />
            <Input value={nNotes} onChange={setNNotes} placeholder="Session notes (optional)" />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={addSession}><Plus size={14} weight="bold" /> Add</Btn>
            <Btn variant="secondary" onClick={() => setShowAdd(false)}><X size={14} weight="bold" /> Cancel</Btn>
          </div>
        </Card>
      )}

      {/* Subject filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        <Btn variant={!filterSubj ? "primary" : "secondary"} size="sm" onClick={() => setFilterSubj("")}>All Subjects</Btn>
        {SUBJECTS.map(s => (
          <Btn key={s.id} variant={filterSubj === s.id ? "primary" : "secondary"} size="sm" onClick={() => setFilterSubj(s.id)}>{s.name}</Btn>
        ))}
      </div>

      {/* Sessions list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sessions.length === 0 && <EmptyState icon={CalendarCheck} message="No sessions found" />}
        {sessions.map(session => {
          const theme = getSubjectTheme(session.subject);
          const students = getStudentsForSubject(session.subject);
          const rec = state.attendance[session.id] || {};
          const presentCount = Object.values(rec).filter(v => v === "present").length;
          const lateCount = Object.values(rec).filter(v => v === "late").length;
          const absentCount = Object.values(rec).filter(v => v === "absent").length;
          const unmarked = students.length - presentCount - lateCount - absentCount;
          const isExpanded = expanded === session.id;
          const isToday = session.date === TODAY;

          return (
            <Card key={session.id} elevated style={{ borderLeft: `3px solid ${isToday ? T.accent : theme.accent}` }}>
              {/* Session header — clickable to expand */}
              <div onClick={() => setExpanded(isExpanded ? null : session.id)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: T.r2, background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CalendarCheck size={20} weight="duotone" color={theme.accent} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 650, color: T.text }}>{formatDate(session.date)}</span>
                    {isToday && <Badge color={T.accentText} bg={T.accentLight}>Today</Badge>}
                    {unmarked > 0 && isToday && <Badge color={T.warning} bg={T.warningBg}>{unmarked} unmarked</Badge>}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4, flexWrap: "wrap" }}>
                    <SubjectBadge subjectId={session.subject} small />
                    <span style={{ fontSize: 12, color: T.textTer }}>{session.time}</span>
                    {session.notes && <span style={{ fontSize: 12, color: T.textSec }}>· {session.notes}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {presentCount > 0 && <Badge color={T.success} bg={T.successBg} style={{ fontSize: 10 }}><CheckCircle size={12} weight="fill" /> {presentCount}</Badge>}
                  {lateCount > 0 && <Badge color={T.warning} bg={T.warningBg} style={{ fontSize: 10 }}><Clock size={12} weight="fill" /> {lateCount}</Badge>}
                  {absentCount > 0 && <Badge color={T.danger} bg={T.dangerBg} style={{ fontSize: 10 }}><XCircle size={12} weight="fill" /> {absentCount}</Badge>}
                  <CaretRight size={16} weight="bold" color={T.textTer} style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
                </div>
              </div>

              {/* Expanded — student attendance controls */}
              {isExpanded && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
                  {/* Inline notes editing */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <Notebook size={14} weight="bold" color={T.textTer} />
                    {editingNotes === session.id ? (
                      <div style={{ display: "flex", gap: 8, flex: 1 }}>
                        <Input value={session.notes} onChange={(v) => dispatch({ type: "UPDATE_SESSION_NOTES", payload: { id: session.id, notes: v } })} placeholder="Add session notes..." style={{ flex: 1 }} />
                        <Btn size="sm" variant="secondary" onClick={() => { setEditingNotes(null); dispatch({ type: "ADD_TOAST", payload: { message: "Notes saved", variant: "success" } }); }}>Done</Btn>
                      </div>
                    ) : (
                      <button onClick={() => setEditingNotes(session.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: session.notes ? T.textSec : T.textTer, fontStyle: session.notes ? "normal" : "italic", padding: "4px 0" }}>
                        {session.notes || "Add notes..."}
                      </button>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, padding: "8px 12px", background: T.bgMuted, borderRadius: T.r2, fontSize: 11, color: T.textTer }}>
                    <span style={{ fontWeight: 600 }}>Legend:</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><CheckCircle size={13} weight="fill" color={T.success} /> Present</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={13} weight="fill" color={T.warning} /> Late</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><XCircle size={13} weight="fill" color={T.danger} /> Absent</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {students.map(student => {
                      const status = rec[student.id];
                      return (
                        <div key={student.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: T.r2, background: status === "present" ? `${T.successBg}80` : status === "late" ? `${T.warningBg}80` : status === "absent" ? `${T.dangerBg}80` : T.bgMuted, transition: "background 0.2s", border: `1px solid ${status === "present" ? T.success + "30" : status === "late" ? T.warning + "30" : status === "absent" ? T.danger + "30" : T.border}` }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, #3F51EC)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                            {student.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: T.text }}>{student.name}</span>
                          {!status && <span style={{ fontSize: 11, color: T.textTer, fontStyle: "italic" }}>Not marked</span>}
                          <div style={{ display: "flex", gap: 4 }}>
                            {[
                              { key: "present", icon: CheckCircle, activeColor: T.success, activeBg: T.successBg },
                              { key: "late", icon: Clock, activeColor: T.warning, activeBg: T.warningBg },
                              { key: "absent", icon: XCircle, activeColor: T.danger, activeBg: T.dangerBg },
                            ].map(btn => (
                              <button key={btn.key}
                                onClick={() => dispatch({ type: "MARK_ATTENDANCE", payload: { sessionId: session.id, studentId: student.id, status: status === btn.key ? null : btn.key } })}
                                onMouseEnter={(e) => { if (status !== btn.key) e.currentTarget.style.background = btn.activeBg; }}
                                onMouseLeave={(e) => { if (status !== btn.key) e.currentTarget.style.background = "transparent"; }}
                                style={{ width: 34, height: 34, borderRadius: T.r1, border: `1.5px solid ${status === btn.key ? btn.activeColor : T.border}`, background: status === btn.key ? btn.activeBg : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}>
                                <btn.icon size={16} weight={status === btn.key ? "fill" : "regular"} color={status === btn.key ? btn.activeColor : T.textTer} />
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick mark all */}
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <Btn size="sm" variant="secondary" onClick={() => { students.forEach(st => dispatch({ type: "MARK_ATTENDANCE", payload: { sessionId: session.id, studentId: st.id, status: "present" } })); dispatch({ type: "ADD_TOAST", payload: { message: "All marked present", variant: "success" } }); }}>
                      <CheckCircle size={14} weight="fill" color={T.success} /> Mark All Present
                    </Btn>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ━━━ LEADERBOARD PAGE ━━━ */

export default Attendance;
