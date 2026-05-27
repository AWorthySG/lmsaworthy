import React, { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line, Legend } from 'recharts';
import { T } from '../theme/theme.js';
import { ChartLineUp, ChartBar, Trophy, Star, CheckCircle, ArrowSquareOut, Users, CalendarCheck, PencilSimpleLine, Notebook, CaretRight, X, CalendarBlank, Trash, Plus } from '../icons/icons.jsx';
import { Card, Btn, Badge, SubjectBadge, Progress, PageHeader, Select, StatCard, BackBtn, FileIcon, Input, Textarea } from '../components/ui';
import { StudentAvatar } from '../components/gamification';
import { AvatarPicker } from '../components/gamification/StudentAvatar.jsx';
import { getSubject, getSubjectTheme, formatDate, getExamCountdowns } from '../utils/helpers.js';
import { SUBJECTS } from '../data/subjects.js';

const CHART_TABS = ["Grade Trend", "Submission Trend", "By Subject"];
const SUBJECT_LINE_COLORS = ["#C0392B", "#0D9488", "#D97706", "#6D28D9", "#2563EB", "#B45309", "#16A34A"];

function ChartPanel({ monthlyData, subjectData, trendData, gradedSubjects, hasGradeTrend }) {
  const [tab, setTab] = useState(hasGradeTrend ? 0 : 1);
  const tooltipStyle = { background: "#1C1B19", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.22)" };
  return (
    <Card elevated style={{ marginBottom: 20 }}>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 18, borderBottom: `1px solid ${T.border}`, paddingBottom: 12 }}>
        {CHART_TABS.map((label, i) => {
          const disabled = i === 0 && !hasGradeTrend;
          return (
            <button key={label} onClick={() => !disabled && setTab(i)}
              disabled={disabled}
              style={{ padding: "5px 14px", borderRadius: T.r5, fontSize: 12, fontWeight: 700, border: "none", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.15s",
                background: tab === i ? T.accent : "transparent",
                color: tab === i ? "#fff" : disabled ? T.textTer : T.textSec,
              }}>
              {label}{i === 0 && !hasGradeTrend ? " (no data)" : ""}
            </button>
          );
        })}
      </div>

      {/* Grade Trend */}
      {tab === 0 && (
        <div>
          <div style={{ fontSize: 11, color: T.textTer, marginBottom: 12 }}>Grade scores over time (all subjects, last 20 submissions)</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: T.textTer }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: T.textTer }} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => [`${Math.round(v)}%`, name]} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              {gradedSubjects.map((subj, i) => {
                const label = getSubject(subj)?.name?.split(" ").slice(-1)[0] || subj;
                return <Line key={subj} type="monotone" dataKey={label} stroke={SUBJECT_LINE_COLORS[i % SUBJECT_LINE_COLORS.length]} strokeWidth={2} dot={{ r: 4, fill: SUBJECT_LINE_COLORS[i % SUBJECT_LINE_COLORS.length] }} activeDot={{ r: 6 }} connectNulls />;
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Submission Trend */}
      {tab === 1 && (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: T.textTer }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: T.textTer }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, "Submissions"]} />
            <Bar dataKey="count" fill={T.accent} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* By Subject */}
      {tab === 2 && (
        subjectData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: T.textTer }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: T.textTer }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, "Submissions"]} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>{subjectData.map((e, i) => <Cell key={i} fill={e.color} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0", color: T.textTer, fontSize: 13 }}>No submissions by subject yet.</div>
        )
      )}
    </Card>
  );
}

// Convert a grade string (e.g. "85%", "40/50", "A+", "B", "72") to 0-100.
function parseGrade(g) {
  if (!g) return null;
  const s = String(g).trim();
  const pct = s.match(/^(\d+(\.\d+)?)%$/);
  if (pct) return Math.min(100, parseFloat(pct[1]));
  const frac = s.match(/^(\d+(\.\d+)?)\s*\/\s*(\d+(\.\d+)?)$/);
  if (frac) return Math.min(100, (parseFloat(frac[1]) / parseFloat(frac[3])) * 100);
  const num = s.match(/^(\d+(\.\d+)?)$/);
  if (num) { const n = parseFloat(num[1]); return n <= 100 ? n : null; }
  const letter = { 'A+': 97, 'A': 93, 'A-': 90, 'B+': 87, 'B': 83, 'B-': 80, 'C+': 77, 'C': 73, 'C-': 70, 'D+': 67, 'D': 63, 'D-': 60, 'E': 45, 'F': 30 };
  return letter[s.toUpperCase()] ?? null;
}

function ProgressTracker({ state, dispatch }) {
  const [sel, setSel] = useState(null);
  const [showNewReport, setShowNewReport] = useState(false);
  const [reportMonth, setReportMonth] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [editingReport, setEditingReport] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState(false);
  const [enrollEmail, setEnrollEmail] = useState("");
  const [showExamManager, setShowExamManager] = useState(false);
  const [examName, setExamName] = useState("");
  const [examSubject, setExamSubject] = useState("eng");
  const [examDate, setExamDate] = useState("");
  const [examPaper, setExamPaper] = useState("");

  if (sel) {
    const student = state.students.find((s) => s.id === sel);
    if (!student) return null;
    const studentSubs = state.submissions.filter(s => s.studentId === student.id);
    // Monthly submission trend (last 6 months with submissions)
    const monthBuckets = {};
    studentSubs.filter(s => s.submittedAt).forEach(s => {
      const month = s.submittedAt.slice(0, 7);
      monthBuckets[month] = (monthBuckets[month] || 0) + 1;
    });
    const monthlyData = Object.entries(monthBuckets)
      .sort(([a], [b]) => a.localeCompare(b)).slice(-6)
      .map(([month, count]) => ({ date: month.slice(5), count }));
    // Submissions by subject (via homework lookup)
    const subjectBuckets = {};
    studentSubs.forEach(s => {
      const hw = state.homework.find(h => h.id === s.homeworkId);
      if (!hw?.subject) return;
      subjectBuckets[hw.subject] = (subjectBuckets[hw.subject] || 0) + 1;
    });
    const subjectData = Object.entries(subjectBuckets).map(([subj, count]) => ({
      name: getSubject(subj)?.name?.split(" ").slice(-2).join(" ") || subj,
      value: count,
      color: getSubjectTheme(subj).accent,
    }));

    // Grade trend: graded subs sorted by gradedAt, one point per submission
    const gradedSubs = studentSubs
      .filter(s => s.status === "graded" && s.grade && s.gradedAt)
      .map(s => {
        const hw = state.homework.find(h => h.id === s.homeworkId);
        return { ...s, subject: hw?.subject || "other", numeric: parseGrade(s.grade) };
      })
      .filter(s => s.numeric !== null)
      .sort((a, b) => a.gradedAt.localeCompare(b.gradedAt));

    // Build a timeline where each row is a gradedAt date and columns are subjects
    const gradedSubjects = [...new Set(gradedSubs.map(s => s.subject))];
    const trendByDate = {};
    gradedSubs.forEach(s => {
      if (!trendByDate[s.gradedAt]) trendByDate[s.gradedAt] = { date: s.gradedAt.slice(5) };
      const key = getSubject(s.subject)?.name?.split(" ").slice(-1)[0] || s.subject;
      trendByDate[s.gradedAt][key] = s.numeric;
    });
    const trendData = Object.values(trendByDate).slice(-20);
    const hasGradeTrend = trendData.length >= 2;

    return (
      <div>
        <BackBtn onClick={() => { setSel(null); setEditingAvatar(false); setEditingEnrollment(false); }} />
        <Card elevated style={{ padding: "24px 32px", marginBottom: 20, borderTop: `3px solid ${T.accent}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: editingAvatar ? 16 : 20 }}>
            <button
              onClick={() => setEditingAvatar(v => !v)}
              title="Change avatar"
              style={{ position: "relative", background: "none", border: "none", padding: 0, cursor: "pointer", borderRadius: T.r3 }}
            >
              <StudentAvatar student={student} avatarMap={state.studentAvatars} size={52} radius={T.r3} />
              <div style={{ position: "absolute", bottom: -4, right: -4, width: 20, height: 20, borderRadius: "50%", background: T.accent, border: `2px solid ${T.bgCard}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PencilSimpleLine size={10} weight="bold" color="#fff" />
              </div>
            </button>
            <div style={{ flex: 1 }}>
              <h1 style={{ color: T.text, fontSize: 22, fontWeight: 800, margin: "0 0 4px", letterSpacing: -0.3 }}>{student.name}</h1>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{(student.subjects || []).map((s) => <SubjectBadge key={s} subjectId={s} small />)}</div>
            </div>
          </div>
          {editingAvatar && (
            <div style={{ marginBottom: 16 }}>
              <AvatarPicker
                value={state.studentAvatars?.[student.id]}
                onSave={(key) => {
                  dispatch({ type: "UPDATE_STUDENT_AVATAR", payload: { studentId: student.id, avatar: key } });
                  dispatch({ type: "ADD_TOAST", payload: { message: "Avatar updated", variant: "success" } });
                  setEditingAvatar(false);
                }}
                onCancel={() => setEditingAvatar(false)}
              />
            </div>
          )}

          {/* Enrollment settings */}
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
            <button
              onClick={() => { setEditingEnrollment(v => !v); setEnrollEmail(student.email || ""); }}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0, color: T.textSec, fontSize: 12, fontWeight: 600 }}
            >
              <PencilSimpleLine size={13} /> Enrollment settings {editingEnrollment ? "▲" : "▼"}
            </button>

            {editingEnrollment && (
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Login email */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>A-Worthling Login Email</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="email"
                      value={enrollEmail}
                      onChange={e => setEnrollEmail(e.target.value)}
                      placeholder="student@email.com"
                      style={{ flex: 1, padding: "8px 12px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgMuted, fontSize: 13, color: T.text, fontFamily: T.fontBody, outline: "none" }}
                    />
                    <button
                      onClick={() => {
                        dispatch({ type: "UPDATE_STUDENT", payload: { id: student.id, email: enrollEmail.trim().toLowerCase() } });
                        dispatch({ type: "ADD_TOAST", payload: { message: "Login email saved", variant: "success" } });
                      }}
                      style={{ padding: "8px 16px", borderRadius: T.r2, background: T.accent, color: "#fff", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, flexShrink: 0 }}
                    >
                      Save
                    </button>
                  </div>
                  <div style={{ fontSize: 11, color: T.textTer, marginTop: 5 }}>Must match the email the A-Worthling uses to log in. Controls which subjects they see in the sidebar.</div>
                </div>

                {/* Subject toggles */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Enrolled Subjects</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {SUBJECTS.map(subj => {
                      const theme = getSubjectTheme(subj.id);
                      const enrolled = student.subjects?.includes(subj.id);
                      return (
                        <button
                          key={subj.id}
                          onClick={() => {
                            const current = student.subjects || [];
                            const next = enrolled
                              ? current.filter(s => s !== subj.id)
                              : [...current, subj.id];
                            dispatch({ type: "UPDATE_STUDENT", payload: { id: student.id, subjects: next } });
                          }}
                          style={{
                            padding: "5px 12px", borderRadius: T.r5, fontSize: 12, fontWeight: 600,
                            border: `1.5px solid ${enrolled ? theme.accent : T.border}`,
                            background: enrolled ? theme.bg : "transparent",
                            color: enrolled ? theme.accent : T.textSec,
                            cursor: "pointer", transition: "all 0.15s",
                          }}
                        >
                          {enrolled ? "✓ " : ""}{subj.name.split(" ").slice(-2).join(" ")}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
        <ChartPanel
          monthlyData={monthlyData} subjectData={subjectData}
          trendData={trendData} gradedSubjects={gradedSubjects}
          hasGradeTrend={hasGradeTrend}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Card elevated>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: "0 0 14px" }}>Topic Completion</h3>
            {Object.entries(student.topicCompletion || {}).map(([subj, topics]) => {
              const theme = getSubjectTheme(subj);
              return (
                <div key={subj} style={{ marginBottom: 18 }}>
                  <SubjectBadge subjectId={subj} small />
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                    {Object.entries(topics).map(([topic, pct]) => (
                      <div key={topic}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.textSec, marginBottom: 4 }}><span>{topic}</span><span style={{ color: theme.accent, fontWeight: 700 }}>{pct}%</span></div><Progress value={pct} color={theme.accent} bg={theme.bg} /></div>
                    ))}
                  </div>
                </div>
              );
            })}
          </Card>
          <Card elevated>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: "0 0 14px" }}>Recent Submissions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {state.submissions.filter(s => s.studentId === student.id).slice(0, 5).map((sub, idx) => {
                const hw = state.homework.find(h => h.id === sub.homeworkId);
                return (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: T.bgMuted, borderRadius: T.r2, border: `1px solid ${T.border}` }}>
                    <div><div style={{ fontSize: 13, fontWeight: 550, color: T.text }}>{hw?.title || "Assignment"}</div><div style={{ fontSize: 11, color: T.textTer }}>{formatDate(sub.submittedAt)}</div></div>
                    <div style={{ textAlign: "right" }}><div style={{ fontSize: 12, fontWeight: 700, color: sub.status === "graded" ? T.success : sub.status === "submitted" ? T.warning : T.textTer, textTransform: "capitalize" }}>{sub.status}</div>{sub.grade && <div style={{ fontSize: 11, color: T.textTer }}>{sub.grade}</div>}</div>
                  </div>
                );
              })}
              {state.submissions.filter(s => s.studentId === student.id).length === 0 && (
                <div style={{ fontSize: 13, color: T.textTer, padding: "8px 0" }}>No submissions yet.</div>
              )}
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: "20px 0 14px" }}>Materials Accessed</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {(student.materialsAccessed || []).map((rId) => {
                const resource = state.resources.find((r) => r.id === rId);
                if (!resource) return null;
                return <div key={rId} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: 13, color: T.text }}><div style={{ width: 26, height: 26, borderRadius: T.r1, background: resource.type === "pdf" ? T.dangerBg : resource.type === "video" ? "#DBEAFE" : T.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}><FileIcon type={resource.type} size={13} /></div>{resource.title}</div>;
              })}
            </div>
          </Card>
        </div>

        {/* ━━━ MONTHLY PROGRESS REPORTS ━━━ */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: T.text, margin: 0, letterSpacing: -0.3 }}>Monthly Progress Reports</h2>
            <Btn onClick={() => { setShowNewReport(!showNewReport); setEditingReport(null); setViewingReport(null); }}><PencilSimpleLine size={15} weight="bold" /> Write Report</Btn>
          </div>

          {/* New / Edit report form */}
          {(showNewReport || editingReport) && (
            <Card elevated style={{ marginBottom: 20, borderLeft: `3px solid ${T.accent}` }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: "0 0 14px" }}>
                {editingReport ? `Edit Report — ${editingReport.title}` : `New Report for ${student.name}`}
              </h3>
              {!editingReport && (
                <div style={{ marginBottom: 14 }}>
                  <Input value={reportMonth} onChange={setReportMonth} type="month" style={{ maxWidth: 220 }} />
                </div>
              )}
              <Textarea
                value={editingReport ? editingReport.content : reportContent}
                onChange={(v) => editingReport ? setEditingReport({ ...editingReport, content: v }) : setReportContent(v)}
                placeholder={`Write a progress report for ${student.name} (~300 words). Cover overall progress, subject-specific performance, strengths, areas for improvement, and recommendations for parents...`}
                rows={14}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                <div style={{ fontSize: 12, color: T.textTer }}>
                  {(editingReport ? editingReport.content : reportContent).split(/\s+/).filter(Boolean).length} words
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn variant="secondary" onClick={() => { setShowNewReport(false); setEditingReport(null); setReportContent(""); setReportMonth(""); }}><X size={14} weight="bold" /> Cancel</Btn>
                  {editingReport ? (
                    <Btn onClick={() => {
                      dispatch({ type: "UPDATE_REPORT", payload: { id: editingReport.id, content: editingReport.content } });
                      dispatch({ type: "ADD_TOAST", payload: { message: "Report updated", variant: "success" } });
                      setEditingReport(null);
                    }}><CheckCircle size={14} weight="bold" /> Save Changes</Btn>
                  ) : (
                    <Btn onClick={() => {
                      if (!reportMonth || !reportContent.trim()) return;
                      const monthLabel = new Date(reportMonth + "-01").toLocaleDateString("en-GB", { month: "long", year: "numeric" });
                      dispatch({ type: "ADD_REPORT", payload: { studentId: student.id, month: reportMonth, title: monthLabel, content: reportContent } });
                      dispatch({ type: "ADD_TOAST", payload: { message: `Report for ${monthLabel} created`, variant: "success" } });
                      setReportContent(""); setReportMonth(""); setShowNewReport(false);
                    }} disabled={!reportMonth || !reportContent.trim()}><CheckCircle size={14} weight="bold" /> Save Report</Btn>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Viewing a report */}
          {viewingReport && (
            <Card elevated style={{ marginBottom: 20, borderTop: `3px solid ${T.accent}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, margin: "0 0 6px" }}>{viewingReport.title}</h3>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: T.textTer }}>Written {formatDate(viewingReport.createdAt)}</span>
                    {viewingReport.sharedWithParents
                      ? <Badge color={T.success} bg={T.successBg}><CheckCircle size={11} weight="fill" /> Shared with Parents</Badge>
                      : <Badge color={T.textSec} bg={T.bgMuted}>Draft</Badge>
                    }
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn size="sm" variant="secondary" onClick={() => { setEditingReport({ ...viewingReport }); setViewingReport(null); setShowNewReport(false); }}><PencilSimpleLine size={13} weight="bold" /> Edit</Btn>
                  {!viewingReport.sharedWithParents ? (
                    <Btn size="sm" onClick={() => {
                      dispatch({ type: "SHARE_REPORT", payload: viewingReport.id });
                      dispatch({ type: "ADD_TOAST", payload: { message: "Report shared with parents", variant: "success" } });
                      setViewingReport({ ...viewingReport, sharedWithParents: true });
                    }}><ArrowSquareOut size={13} weight="bold" /> Share with Parents</Btn>
                  ) : (
                    <Btn size="sm" variant="danger" onClick={() => {
                      dispatch({ type: "UNSHARE_REPORT", payload: viewingReport.id });
                      dispatch({ type: "ADD_TOAST", payload: { message: "Report unshared", variant: "info" } });
                      setViewingReport({ ...viewingReport, sharedWithParents: false });
                    }}><X size={13} weight="bold" /> Unshare</Btn>
                  )}
                  <Btn size="sm" variant="ghost" onClick={() => setViewingReport(null)}><X size={13} weight="bold" /></Btn>
                </div>
              </div>
              <div style={{ fontSize: 14, color: T.text, lineHeight: 1.8, whiteSpace: "pre-wrap", background: T.bgMuted, padding: "20px 24px", borderRadius: T.r2, border: `1px solid ${T.border}` }}>
                {viewingReport.content}
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: T.textTer, textAlign: "right" }}>
                {viewingReport.content.split(/\s+/).filter(Boolean).length} words
              </div>
            </Card>
          )}

          {/* Report list */}
          {!viewingReport && !editingReport && (() => {
            const studentReports = state.reports.filter(r => r.studentId === student.id).sort((a, b) => b.month.localeCompare(a.month));
            if (studentReports.length === 0) return (
              <Card elevated style={{ textAlign: "center", padding: 40 }}>
                <div style={{ width: 56, height: 56, borderRadius: T.r3, background: T.accentLight, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <Notebook size={24} weight="duotone" color={T.accent} />
                </div>
                <p style={{ fontSize: 14, color: T.textSec, fontWeight: 500, margin: "0 0 12px" }}>No progress reports yet</p>
                <Btn onClick={() => setShowNewReport(true)}><PencilSimpleLine size={14} weight="bold" /> Write First Report</Btn>
              </Card>
            );
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {studentReports.map(report => (
                  <Card key={report.id} onClick={() => { setViewingReport(report); setShowNewReport(false); setEditingReport(null); }} elevated style={{ padding: 18, borderLeft: `3px solid ${report.sharedWithParents ? T.success : T.accent}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: T.r2, background: report.sharedWithParents ? T.successBg : T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Notebook size={20} weight="duotone" color={report.sharedWithParents ? T.success : T.accent} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 650, color: T.text }}>{report.title}</div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
                          <span style={{ fontSize: 12, color: T.textTer }}>Written {formatDate(report.createdAt)}</span>
                          {report.sharedWithParents
                            ? <Badge color={T.success} bg={T.successBg} style={{ fontSize: 10 }}><CheckCircle size={11} weight="fill" /> Shared</Badge>
                            : <Badge color={T.textSec} bg={T.bgMuted} style={{ fontSize: 10 }}>Draft</Badge>
                          }
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: T.textTer, textAlign: "right", flexShrink: 0 }}>
                        {report.content.split(/\s+/).filter(Boolean).length} words
                      </div>
                      <CaretRight size={16} weight="bold" color={T.textTer} />
                    </div>
                  </Card>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    );
  }

  const allCountdowns = getExamCountdowns(state.customExams || []);

  return (
    <div>
      <PageHeader title="A-Worthling Progress" subtitle="Track performance and completion" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
        {(Array.isArray(state.students) ? state.students : []).map((student) => {
          const subs = (Array.isArray(state.submissions) ? state.submissions : []).filter(s => s.studentId === student.id);
          const submittedCount = subs.filter(s => s.status === "submitted" || s.status === "graded").length;
          const gradedCount = subs.filter(s => s.status === "graded").length;
          return (
            <Card key={student.id} onClick={() => setSel(student.id)} elevated>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <StudentAvatar student={student} avatarMap={state.studentAvatars} size={48} radius={T.r3} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{student.name}</div>
                  <div style={{ display: "flex", gap: 4, marginTop: 5, flexWrap: "wrap" }}>
                    {(student.subjects || []).map((s) => <SubjectBadge key={s} subjectId={s} small />)}
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, textAlign: "center" }}>
                <div style={{ padding: 10, background: T.accentLight, borderRadius: T.r2 }}><div style={{ fontSize: 20, fontWeight: 700, color: T.accent }}>{submittedCount}</div><div style={{ fontSize: 11, color: T.textTer }}>Submitted</div></div>
                <div style={{ padding: 10, background: T.successBg, borderRadius: T.r2 }}><div style={{ fontSize: 20, fontWeight: 700, color: T.success }}>{gradedCount}</div><div style={{ fontSize: 11, color: T.textTer }}>Graded</div></div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ━━━ CUSTOM EXAM DATES ━━━ */}
      <div style={{ marginTop: 32 }}>
        <button
          onClick={() => setShowExamManager(v => !v)}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: showExamManager ? 16 : 0 }}
        >
          <div style={{ width: 32, height: 32, borderRadius: T.r2, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CalendarBlank size={16} color={T.accent} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>Manage Exam Dates</span>
          <span style={{ fontSize: 12, color: T.textTer, marginLeft: 4 }}>({allCountdowns.length} upcoming)</span>
          <CaretRight size={14} color={T.textTer} style={{ transform: showExamManager ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
        </button>

        {showExamManager && (
          <Card elevated style={{ borderLeft: `3px solid ${T.accent}` }}>
            {/* Add form */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Add Custom Exam</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: T.textTer, marginBottom: 4 }}>Exam Name *</div>
                  <input
                    value={examName}
                    onChange={e => setExamName(e.target.value)}
                    placeholder="e.g. O-Level English Paper 1"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgMuted, fontSize: 13, color: T.text, fontFamily: T.fontBody, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: T.textTer, marginBottom: 4 }}>Date *</div>
                  <input
                    type="date"
                    value={examDate}
                    onChange={e => setExamDate(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgMuted, fontSize: 13, color: T.text, fontFamily: T.fontBody, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: T.textTer, marginBottom: 4 }}>Subject</div>
                  <Select value={examSubject} onChange={setExamSubject} options={SUBJECTS.map(s => ({ value: s.id, label: s.name }))} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: T.textTer, marginBottom: 4 }}>Paper label (optional)</div>
                  <input
                    value={examPaper}
                    onChange={e => setExamPaper(e.target.value)}
                    placeholder="e.g. Paper 1"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgMuted, fontSize: 13, color: T.text, fontFamily: T.fontBody, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>
              <Btn
                disabled={!examName.trim() || !examDate}
                onClick={() => {
                  dispatch({ type: "ADD_CUSTOM_EXAM", payload: { name: examName.trim(), date: examDate, subject: examSubject, paper: examPaper.trim() || "Paper 1" } });
                  dispatch({ type: "ADD_TOAST", payload: { message: "Custom exam added", variant: "success" } });
                  setExamName(""); setExamDate(""); setExamPaper("");
                }}
              >
                <Plus size={14} weight="bold" /> Add Exam
              </Btn>
            </div>

            {/* Countdown list */}
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>All Upcoming Exams</div>
              {allCountdowns.length === 0 ? (
                <div style={{ fontSize: 13, color: T.textTer, fontStyle: "italic" }}>No upcoming exams.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {allCountdowns.map((e, i) => {
                    const theme = T[e.subject] || T.eng;
                    const urgent = e.daysLeft <= 30;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderTop: i === 0 ? "none" : `1px solid ${T.border}` }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: urgent ? T.danger : theme.accent, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {e.name}
                            {e.isCustom && <span style={{ marginLeft: 7, fontSize: 9, fontWeight: 700, color: T.textTer, background: T.bgMuted, border: `1px solid ${T.border}`, padding: "1px 5px", borderRadius: 8 }}>Custom</span>}
                          </div>
                          <div style={{ fontSize: 11, color: T.textTer }}>{e.date} · {e.paper}</div>
                        </div>
                        <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 800, fontSize: 14, color: urgent ? T.danger : T.text, flexShrink: 0 }}>{e.daysLeft}d</span>
                        {e.isCustom && (
                          <button
                            onClick={() => {
                              if (!window.confirm(`Delete "${e.name}"?`)) return;
                              dispatch({ type: "DELETE_CUSTOM_EXAM", payload: e.id });
                              dispatch({ type: "ADD_TOAST", payload: { message: "Exam removed", variant: "info" } });
                            }}
                            aria-label={`Delete ${e.name}`}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: T.danger, display: "flex", alignItems: "center", flexShrink: 0 }}
                          >
                            <Trash size={14} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ━━━ ATTENDANCE ━━━ */

export default ProgressTracker;
