import React, { useEffect, useState } from 'react';
import { T } from '../theme/theme.js';
import { firebaseDb, ref, get } from '../config/firebase.js';
import { AvatarDisplay } from '../components/gamification/StudentAvatar.jsx';
import { ClipboardText, CalendarBlank, PencilSimpleLine, Timer, Printer, Warning, Notebook } from '../icons/icons.jsx';

function GradeTag({ grade }) {
  const pct = parseFloat(grade);
  const color = !isNaN(pct) ? (pct >= 75 ? T.success : pct >= 50 ? T.warning : T.danger) : T.accent;
  return (
    <span style={{ fontWeight: 800, color, fontFamily: T.fontMono, fontSize: 15, minWidth: 42, display: "inline-block" }}>
      {grade}
    </span>
  );
}

export default function PublicReport({ token }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState(!token ? "Invalid report link." : null);

  useEffect(() => {
    if (!token) return;
    get(ref(firebaseDb, `publicReports/${token}`))
      .then(snap => {
        if (!snap.exists()) {
          setError("This report link has expired or is invalid.");
        } else {
          const data = snap.val();
          if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
            setError("This report link has expired. Please ask for a new one.");
          } else {
            setReport(data);
          }
        }
      })
      .catch(() => setError("Could not load this report. Please check your connection and try again."))
      .finally(() => setLoading(false));
  }, [token]);

  const bg = "#FAFAF7";

  if (loading) {
    return (
      <div style={{ minHeight: "100dvh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: 32 }}>
        <img src="/logo-aworthy.jpeg" alt="A Worthy" style={{ height: 48, aspectRatio: "786 / 1280", objectFit: "contain", borderRadius: 8 }} />
        <div style={{ fontSize: 13, color: T.textTer, fontFamily: T.fontDisplay }}>Loading report…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100dvh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: 32, textAlign: "center" }}>
        <img src="/logo-aworthy.jpeg" alt="A Worthy" style={{ height: 48, aspectRatio: "786 / 1280", objectFit: "contain", borderRadius: 8 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.danger }}>
          <Warning size={20} />
          <span style={{ fontWeight: 600, fontSize: 15 }}>{error}</span>
        </div>
        <div style={{ fontSize: 12, color: T.textTer }}>Contact your tutor for an updated link.</div>
      </div>
    );
  }

  const grades = Array.isArray(report.grades) ? report.grades : [];
  const exams = Array.isArray(report.exams) ? report.exams : [];
  const recentSessions = Array.isArray(report.recentSessions) ? report.recentSessions : [];
  const generatedDate = report.generatedAt
    ? new Date(report.generatedAt).toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  return (
    <div style={{ minHeight: "100dvh", background: bg, fontFamily: T.fontBody, color: T.text, fontSize: 14, lineHeight: 1.6 }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px 64px" }}>

        {/* Header card */}
        <div style={{ background: "#1C1B19", borderRadius: 16, padding: "28px 28px 24px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: `${T.accent}22`, pointerEvents: "none" }} />
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <img src="/logo-aworthy.jpeg" alt="A Worthy" style={{ height: 32, aspectRatio: "786 / 1280", objectFit: "contain", borderRadius: 6 }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase" }}>A Worthy · Progress Report</span>
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 4px", fontFamily: T.fontDisplay }}>
                {report.studentName || "Student"} — Progress Report
              </h1>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: 0 }}>Generated {generatedDate}</p>
            </div>
            {report.avatarKey && <AvatarDisplay avatarKey={report.avatarKey} size={52} radius={10} />}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", border: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.textTer, fontSize: 11, fontWeight: 600, marginBottom: 6 }}>
              <ClipboardText size={13} /> Assignments Graded
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, color: T.success, fontFamily: T.fontDisplay }}>{grades.length}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", border: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.textTer, fontSize: 11, fontWeight: 600, marginBottom: 6 }}>
              <CalendarBlank size={13} /> Sessions Attended
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, color: "#0D9488", fontFamily: T.fontDisplay }}>{report.attendanceCount ?? 0}</div>
          </div>
        </div>

        {/* Recent grades */}
        {grades.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 12, padding: "20px 20px", border: `1px solid ${T.border}`, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13, marginBottom: 14, color: T.text }}>
              <PencilSimpleLine size={15} color={T.accent} /> Recent Grades
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {grades.map((g, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "10px 0", borderBottom: i < grades.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <GradeTag grade={g.grade} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: T.text, marginBottom: 2 }}>{g.hwTitle}</div>
                    {g.comment && <div style={{ fontSize: 11, color: T.textTer, lineHeight: 1.4 }}>{g.comment}</div>}
                  </div>
                  {g.gradedAt && <div style={{ fontSize: 10, color: T.textTer, flexShrink: 0, marginTop: 2 }}>{g.gradedAt}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Session notes */}
        {recentSessions.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 12, padding: "20px 20px", border: `1px solid ${T.border}`, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13, marginBottom: 14, color: T.text }}>
              <Notebook size={15} color={T.accent} /> Recent Session Notes
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {recentSessions.map((s, i) => (
                <div key={i} style={{ padding: "10px 0", borderBottom: i < recentSessions.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: T.textTer, marginBottom: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    {s.date}{s.subject ? ` · ${s.subject.toUpperCase()}` : ""}
                  </div>
                  <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6 }}>{s.notes}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exam countdowns */}
        {exams.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 12, padding: "20px 20px", border: `1px solid ${T.border}`, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13, marginBottom: 14, color: T.text }}>
              <Timer size={15} color={T.accent} /> Upcoming Exams
            </div>
            {exams.map((e, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: i < exams.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: e.daysLeft <= 30 ? T.danger : T.accent, fontFamily: T.fontMono, minWidth: 40, textAlign: "center" }}>{e.daysLeft}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: T.text }}>{e.name}</div>
                  <div style={{ fontSize: 11, color: T.textTer }}>{e.date} · {e.daysLeft} days remaining</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", paddingTop: 16 }}>
          <button onClick={() => window.print()} className="no-print"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: T.accent, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 14 }}>
            <Printer size={15} /> Save as PDF
          </button>
          <div style={{ fontSize: 11, color: T.textTer }}>
            Generated by A Worthy Learning Platform ·{" "}
            <a href="https://lms.a-worthy.com" style={{ color: T.accent }}>lms.a-worthy.com</a>
          </div>
        </div>
      </div>
    </div>
  );
}
