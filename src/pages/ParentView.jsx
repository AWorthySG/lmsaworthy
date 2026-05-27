import React, { useState } from 'react';
import { T } from '../theme/theme.js';
import { ClipboardText, CalendarBlank, PencilSimpleLine, Timer, Printer, Link, CopySimple, CheckCircle } from '../icons/icons.jsx';
import { AvatarDisplay } from '../components/gamification/StudentAvatar.jsx';
import { getExamCountdowns } from '../utils/helpers.js';
import { firebaseDb, ref, set } from '../config/firebase.js';

function ParentView({ state, dispatch, authUser }) {
  const [shareUrl, setShareUrl] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const exams = getExamCountdowns().slice(0, 3);
  const gradedSubs = (state.submissions || []).filter(s => s.status === "graded");
  let attended = 0;
  Object.values(state.attendance).forEach(rec => {
    attended += Object.values(rec).filter(v => v === "present" || v === "late").length;
  });

  async function handleShare() {
    setSharing(true);
    try {
      const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
      const token = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      const report = {
        studentName: authUser?.displayName || "Student",
        avatarKey: state.myAvatar || null,
        grades: gradedSubs.slice(0, 10).map(sub => {
          const hw = (state.homework || []).find(h => h.id === sub.homeworkId);
          return {
            grade: sub.grade || "",
            hwTitle: hw?.title || "Homework",
            comment: (sub.gradeComment || "").slice(0, 120),
            gradedAt: sub.gradedAt || "",
          };
        }),
        attendanceCount: attended,
        exams: exams.map(e => ({ name: e.name, date: e.date, daysLeft: e.daysLeft })),
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
      await set(ref(firebaseDb, `publicReports/${token}`), report);
      const url = `https://lms.a-worthy.com/report/${token}`;
      setShareUrl(url);
      await navigator.clipboard.writeText(url).catch(() => {});
      dispatch({ type: "ADD_TOAST", payload: { message: "Share link copied to clipboard!", variant: "success" } });
    } catch {
      dispatch({ type: "ADD_TOAST", payload: { message: "Could not generate share link. Please try again.", variant: "error" } });
    }
    setSharing(false);
  }

  async function copyUrl() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header card */}
      <div style={{ background: T.bgCard, borderRadius: T.r4, padding: "28px 24px", border: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <img src="/logo-aworthy.jpeg" alt="A Worthy Learning" style={{ height: 36, aspectRatio: "786 / 1280", objectFit: "contain", borderRadius: 8 }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: T.textTer, letterSpacing: 2, textTransform: "uppercase" }}>A Worthy · Parent Dashboard</span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 4px", fontFamily: T.fontDisplay, color: T.text }}>Progress Report</h1>
            <p style={{ fontSize: 13, color: T.textSec, margin: 0 }}>Real-time overview of your child's learning journey</p>
          </div>
          {state.myAvatar && <AvatarDisplay avatarKey={state.myAvatar} size={56} radius={T.r2} />}
        </div>

        {/* Actions */}
        <div className="no-print" style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
          <button onClick={handleShare} disabled={sharing}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: T.accent, color: "#fff", border: "none", borderRadius: T.r2, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: sharing ? "wait" : "pointer", opacity: sharing ? 0.7 : 1, transition: "opacity 0.15s" }}>
            <Link size={14} /> {sharing ? "Generating…" : "Share with Parent"}
          </button>
          <button onClick={() => window.print()}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: T.bgMuted, color: T.textSec, border: `1px solid ${T.border}`, borderRadius: T.r2, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <Printer size={14} /> Print / Save PDF
          </button>
        </div>

        {/* Inline share link */}
        {shareUrl && (
          <div className="no-print" style={{ marginTop: 14, padding: "12px 14px", background: T.accentLight, borderRadius: T.r2, border: `1px solid ${T.accent}30`, display: "flex", alignItems: "center", gap: 10 }}>
            <Link size={14} color={T.accent} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 12, color: T.accent, fontFamily: T.fontMono, wordBreak: "break-all", lineHeight: 1.4 }}>{shareUrl}</span>
            <button onClick={copyUrl}
              style={{ display: "flex", alignItems: "center", gap: 5, background: T.accent, color: "#fff", border: "none", borderRadius: T.r1, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>
              {copied ? <CheckCircle size={12} /> : <CopySimple size={12} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>

      {/* Key Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
        {[
          { label: "Homework Graded", value: gradedSubs.length, icon: <ClipboardText size={12} />, color: T.success },
          { label: "Sessions Attended", value: attended, icon: <CalendarBlank size={12} />, color: T.teal },
        ].map(s => (
          <div key={s.label} style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px", border: `1px solid ${T.border}`, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: T.textTer, fontWeight: 600, marginBottom: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>{s.icon} {s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: T.fontDisplay }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Grades */}
      {gradedSubs.length > 0 && (
        <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px 18px", border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 10, fontFamily: T.fontDisplay, display: "flex", alignItems: "center", gap: 6 }}><PencilSimpleLine size={15} color={T.accent} /> Recent Grades</div>
          {gradedSubs.slice(0, 5).map(sub => {
            const hw = state.homework.find(h => h.id === sub.homeworkId);
            return (
              <div key={sub.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: T.success, fontFamily: T.fontDisplay, minWidth: 36 }}>{sub.grade}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{hw?.title || "Homework"}</div>
                  {sub.gradeComment && <div style={{ fontSize: 11, color: T.textTer, marginTop: 2 }}>{sub.gradeComment.slice(0, 80)}…</div>}
                </div>
                <div style={{ fontSize: 10, color: T.textTer }}>{sub.gradedAt}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Exam Countdown */}
      {exams.length > 0 && (
        <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px 18px", border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 10, fontFamily: T.fontDisplay, display: "flex", alignItems: "center", gap: 6 }}><Timer size={15} color={T.accent} /> Upcoming Exams</div>
          {exams.map((e, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < exams.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: e.daysLeft <= 30 ? T.danger : T.accent, fontFamily: T.fontMono, minWidth: 40, textAlign: "center" }}>{e.daysLeft}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{e.name}</div>
                <div style={{ fontSize: 10, color: T.textTer }}>{e.date} · {e.daysLeft} days remaining</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: "center", fontSize: 11, color: T.textTer, padding: "4px 0 8px" }}>
        Generated by A Worthy Learning Platform ·{" "}
        <a href="https://lms.a-worthy.com" style={{ color: T.accent }}>lms.a-worthy.com</a>
      </div>
    </div>
  );
}

export default ParentView;
