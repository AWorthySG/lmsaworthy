import React, { useState, useRef } from 'react';
import { T, SUBJ_THEME } from '../../theme/theme.js';
import { ArrowLeft, ArrowRight, ClipboardText, Clock, Warning, CheckCircle, Upload, X, FilePdf, FileDoc, FileVideo } from '../../icons/icons.jsx';
import { getSubject } from '../../utils/helpers.js';
import { firebaseStorage, storageRef, uploadBytes, getDownloadURL } from '../../config/firebase.js';

const HW_STATUS = {
  not_started: { label: "Not Started", color: "#8E99AE", bg: "#EFF1F7" },
  in_progress: { label: "In Progress", color: "#024F94", bg: "#E8F4FD" },
  submitted: { label: "Submitted", color: "#D4940A", bg: "#FFF4E8" },
  graded: { label: "Graded", color: "#2BAA6E", bg: "#E6F7F0" },
};

function StudentHomework({ state, dispatch }) {
  const [selectedHw, setSelectedHw] = useState(null);
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState([]); // { name, url, uploading }
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const today = new Date().toISOString().split("T")[0];

  const hw = state.homework.filter(h => h.status === "active");
  // For students we show all homework (in a real app, filter by student ID)
  const mySubs = state.submissions;

  function getMySubmission(hwId) { return mySubs.find(s => s.homeworkId === hwId); }

  // Open a homework detail
  function openHw(h) {
    const sub = getMySubmission(h.id);
    setSelectedHw(h);
    setNotes(sub?.studentNotes || "");
    setFiles((sub?.fileUrls || []).map(f => ({ name: f.name || f.url.split("/").pop(), url: f.url, uploading: false })));
  }

  // Upload files to Firebase Storage
  async function handleFileUpload(fileList) {
    const newFiles = Array.from(fileList);
    if (newFiles.length === 0) return;
    setUploading(true);
    const uploaded = [];
    for (const file of newFiles) {
      // Add placeholder immediately
      const placeholder = { name: file.name, url: "", uploading: true };
      setFiles(prev => [...prev, placeholder]);
      try {
        const path = `homework/${selectedHw.id}/${Date.now()}_${file.name}`;
        const fileRef = storageRef(firebaseStorage, path);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        uploaded.push({ name: file.name, url, uploading: false });
        setFiles(prev => prev.map(f => f.name === file.name && f.uploading ? { name: file.name, url, uploading: false } : f));
      } catch (err) {
        console.error("Upload failed:", err);
        setFiles(prev => prev.filter(f => !(f.name === file.name && f.uploading)));
        dispatch({ type: "ADD_TOAST", payload: { message: `Failed to upload ${file.name}`, variant: "error" } });
      }
    }
    setUploading(false);
  }

  function removeFile(idx) { setFiles(prev => prev.filter((_, i) => i !== idx)); }

  // Drag and drop handlers
  function handleDrop(e) { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files); }

  // Save draft
  function saveDraft() {
    const sub = getMySubmission(selectedHw.id);
    if (!sub) return;
    dispatch({ type: "SAVE_HOMEWORK_DRAFT", payload: { submissionId: sub.id, studentNotes: notes, fileUrls: files.filter(f => f.url).map(f => ({ name: f.name, url: f.url })) } });
    dispatch({ type: "ADD_TOAST", payload: { message: "Draft saved", variant: "success" } });
  }

  // Submit homework
  function submitHomework() {
    const sub = getMySubmission(selectedHw.id);
    if (!sub) return;
    dispatch({ type: "SUBMIT_HOMEWORK", payload: { submissionId: sub.id, studentNotes: notes, fileUrls: files.filter(f => f.url).map(f => ({ name: f.name, url: f.url })) } });
    dispatch({ type: "ADD_TOAST", payload: { message: "Homework submitted! 🎉", variant: "success" } });
    setSelectedHw(null);
  }

  // ═══ DETAIL VIEW — submission form ═══
  if (selectedHw) {
    const sub = getMySubmission(selectedHw.id);
    const subTheme = SUBJ_THEME[selectedHw.subject] || T.eng;
    const statusInfo = sub ? HW_STATUS[sub.status] : HW_STATUS.not_started;
    const isSubmitted = sub?.status === "submitted" || sub?.status === "graded";
    const isOverdue = selectedHw.dueDate < today;

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 96px)", gap: 16 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <button onClick={() => setSelectedHw(null)} style={{ width: 32, height: 32, borderRadius: T.r1, background: T.bgMuted, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowLeft size={16} color={T.textSec} />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{selectedHw.title}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: subTheme.accent, background: subTheme.bg, padding: "2px 8px", borderRadius: 20 }}>{getSubject(selectedHw.subject)?.name}</span>
              <span style={{ fontSize: 11, color: isOverdue ? T.danger : T.textTer, fontWeight: isOverdue ? 700 : 400 }}>Due {selectedHw.dueDate}{isOverdue ? " — OVERDUE" : ""}</span>
            </div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: statusInfo.color, background: statusInfo.bg, padding: "4px 12px", borderRadius: 20 }}>{statusInfo.label}</span>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Instructions card */}
          <div style={{ background: subTheme.bg, borderRadius: T.r2, padding: "16px 18px", border: `1px solid ${subTheme.accent}33` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: subTheme.accent, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Instructions</div>
            <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7, whiteSpace: "pre-line" }}>{selectedHw.instructions || "No instructions provided."}</div>
          </div>

          {/* Grade feedback (if graded) */}
          {sub?.status === "graded" && (
            <div style={{ background: T.successBg, borderRadius: T.r2, padding: "16px 18px", border: `1px solid ${T.success}33` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: T.success, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{sub.grade}</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.success, textTransform: "uppercase", letterSpacing: 0.5 }}>Your Grade</div>
                  <div style={{ fontSize: 10, color: T.textTer }}>Graded on {sub.gradedAt}</div>
                </div>
              </div>
              {sub.gradeComment && <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6, borderTop: `1px solid ${T.success}22`, paddingTop: 10 }}>{sub.gradeComment}</div>}
            </div>
          )}

          {/* Submission form (not shown if already submitted/graded) */}
          {!isSubmitted && (
            <>
              {/* File upload area */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 8 }}>Upload Your Work</div>
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragOver ? T.accent : T.border}`,
                    borderRadius: T.r2,
                    padding: "28px 20px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: dragOver ? T.accentLight : T.bgMuted,
                    transition: "all 0.2s",
                  }}>
                  <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.heic,.txt" style={{ display: "none" }}
                    onChange={e => { handleFileUpload(e.target.files); e.target.value = ""; }} />
                  <Upload size={28} style={{ marginBottom: 8, opacity: 0.6 }} />
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
                    {dragOver ? "Drop files here" : "Click or drag files to upload"}
                  </div>
                  <div style={{ fontSize: 11, color: T.textTer, marginTop: 4 }}>PDF, Word, images — max 10 MB each</div>
                </div>
              </div>

              {/* Uploaded files list */}
              {files.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {files.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}` }}>
                      {f.name.endsWith(".pdf") ? <FilePdf size={20} /> : f.name.match(/\.(jpg|jpeg|png|heic)$/i) ? <FileVideo size={20} /> : <FileDoc size={20} />}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                        {f.uploading && <div style={{ fontSize: 10, color: T.accent }}>Uploading...</div>}
                        {f.url && !f.uploading && <div style={{ fontSize: 10, color: T.success }}>✓ Uploaded</div>}
                      </div>
                      {f.url && <a href={f.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: 10, color: T.accent, fontWeight: 600 }}>View</a>}
                      <button onClick={() => removeFile(i)} style={{ width: 24, height: 24, borderRadius: T.r1, background: T.dangerBg, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <X size={12} color={T.danger} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 6 }}>Notes for Tutor <span style={{ fontWeight: 400, color: T.textTer }}>(optional)</span></div>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                  placeholder="Any comments, questions, or notes about your submission..."
                  style={{ width: "100%", padding: "10px 12px", borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 13, resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }} />
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 10, paddingBottom: 20 }}>
                <button onClick={saveDraft} style={{ padding: "10px 20px", borderRadius: T.r2, background: T.bgMuted, border: `1px solid ${T.border}`, color: T.textSec, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  Save Draft
                </button>
                <button onClick={submitHomework} disabled={uploading}
                  style={{ padding: "10px 24px", borderRadius: T.r2, background: uploading ? T.bgMuted : T.gradPrimary, color: uploading ? T.textTer : "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: uploading ? "not-allowed" : "pointer", boxShadow: uploading ? "none" : T.shadowAccent, display: "flex", alignItems: "center", gap: 6 }}>
                  {uploading ? "Uploading..." : "Submit Homework"}
                </button>
              </div>
            </>
          )}

          {/* Show submitted files for already submitted work */}
          {isSubmitted && (sub?.fileUrls?.length > 0) && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 8 }}>Submitted Files</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {sub.fileUrls.map((f, i) => (
                  <a key={i} href={f.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, textDecoration: "none", color: T.text }}>
                    {f.name?.endsWith(".pdf") ? <FilePdf size={20} /> : <FileDoc size={20} />}
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{f.name}</span>
                    <span style={{ marginLeft: "auto", fontSize: 10, color: T.accent, fontWeight: 600 }}>View ↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}
          {isSubmitted && sub?.studentNotes && (
            <div style={{ background: T.bgMuted, borderRadius: T.r2, padding: "12px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.textTer, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Your Notes</div>
              <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6 }}>{sub.studentNotes}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══ LIST VIEW — all homework ═══
  const overdueCount = hw.filter(h => h.dueDate < today && getMySubmission(h.id)?.status !== "graded").length;
  const submittedCount = hw.filter(h => { const s = getMySubmission(h.id); return s?.status === "submitted" || s?.status === "graded"; }).length;
  const pendingCount = hw.length - submittedCount;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 96px)", gap: 16 }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ width: 38, height: 38, borderRadius: T.r2, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ClipboardText size={20} weight="duotone" color={T.accent} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: T.text, margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>My Homework</h1>
            <p style={{ color: T.textSec, fontSize: 13, margin: 0 }}>View assignments and submit your work</p>
          </div>
        </div>
        {/* Summary pills */}
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 600, color: T.textSec }}>
            <ClipboardText size={12} color={T.accent} />{hw.length} total
          </div>
          {pendingCount > 0 && <div style={{ display: "flex", alignItems: "center", gap: 5, background: T.warningBg, border: `1px solid ${T.warning}33`, borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: T.warning }}>
            <Clock size={12} weight="fill" />{pendingCount} pending
          </div>}
          {overdueCount > 0 && <div style={{ display: "flex", alignItems: "center", gap: 5, background: T.dangerBg, border: `1px solid ${T.danger}33`, borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: T.danger }}>
            <Warning size={12} weight="fill" />{overdueCount} overdue
          </div>}
          {submittedCount > 0 && <div style={{ display: "flex", alignItems: "center", gap: 5, background: T.successBg, border: `1px solid ${T.success}33`, borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: T.success }}>
            <CheckCircle size={12} weight="fill" />{submittedCount} done
          </div>}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {hw.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 20px", color: T.textTer }}>
            <CheckCircle size={40} color={T.success} style={{ marginBottom: 12, opacity: 0.5 }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: T.textSec, marginBottom: 4 }}>All clear!</div>
            <div style={{ fontSize: 13 }}>No homework assigned yet. Enjoy your free time! 🎉</div>
          </div>
        )}
        {hw.map(h => {
          const sub = getMySubmission(h.id);
          const subTheme = SUBJ_THEME[h.subject] || T.eng;
          const isOverdue = h.dueDate < today && sub?.status !== "graded";
          const statusInfo = sub ? HW_STATUS[sub.status] : HW_STATUS.not_started;
          const daysUntilDue = Math.ceil((new Date(h.dueDate) - new Date(today)) / 86400000);
          const urgency = isOverdue ? "overdue" : daysUntilDue <= 2 ? "urgent" : "normal";
          const urgencyBorder = urgency === "overdue" ? T.danger + "55" : urgency === "urgent" ? T.warning + "55" : T.border;
          const urgencyBg = urgency === "overdue" ? T.dangerBg : urgency === "urgent" ? T.warningBg : T.bgCard;
          return (
            <button key={h.id} onClick={() => openHw(h)}
              style={{ display: "flex", gap: 0, padding: 0, borderRadius: T.r2, border: `1px solid ${urgencyBorder}`, background: urgencyBg, cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.18s", overflow: "hidden" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = T.shadow2; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              {/* Subject accent bar */}
              <div style={{ width: 4, background: subTheme.accent, flexShrink: 0 }} />
              <div style={{ display: "flex", gap: 12, padding: "14px 16px", flex: 1, alignItems: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: T.r2, background: subTheme.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ClipboardText size={20} color={subTheme.accent} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: subTheme.accent, background: subTheme.bg, padding: "2px 8px", borderRadius: 20 }}>{getSubject(h.subject)?.name}</span>
                    {h.topic && <span style={{ fontSize: 10, color: T.textTer }}>{h.topic}</span>}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.title}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Clock size={11} color={isOverdue ? T.danger : daysUntilDue <= 2 ? T.warning : T.textTer} />
                    <span style={{ fontSize: 11, fontWeight: isOverdue ? 700 : 400, color: isOverdue ? T.danger : daysUntilDue <= 2 ? T.warning : T.textTer }}>
                      {isOverdue ? `Overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? "s" : ""}` : daysUntilDue === 0 ? "Due today!" : daysUntilDue === 1 ? "Due tomorrow" : `Due ${h.dueDate}`}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: statusInfo.color, background: statusInfo.bg, padding: "3px 10px", borderRadius: 20 }}>{statusInfo.label}</span>
                  {sub?.grade && <span style={{ fontSize: 18, fontWeight: 800, color: T.success, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{sub.grade}</span>}
                  <ArrowRight size={14} color={T.textTer} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ━━━ TUTOR HOMEWORK — create assignments, grade submissions ━━━ */

export default StudentHomework;
