import React, { useState, useEffect } from 'react';
import { T, SUBJ_THEME } from '../../theme/theme.js';
import { ArrowLeft, Plus, ClipboardText, Clock, Warning, Sparkle } from '../../icons/icons.jsx';
import { SUBJECTS, TOPICS } from '../../data/subjects.js';
import { getSubject } from '../../utils/helpers.js';
import { getDefaultRubricForHomework } from '../tools/rubrics.js';
import { extractFromUrl, mergeExtractions } from '../tools/extractText.js';
import { gradeSubmission as gradeSubmissionAPI } from '../tools/gradeClient.js';

const HW_STATUS = {
  not_started: { label: "Not Started", color: "#8E99AE", bg: "#EFF1F7" },
  in_progress: { label: "In Progress", color: "#024F94", bg: "#E8F4FD" },
  submitted: { label: "Submitted", color: "#D4940A", bg: "#FFF4E8" },
  graded: { label: "Graded", color: "#2BAA6E", bg: "#E6F7F0" },
};

function TutorHomework({ state, dispatch }) {
  const [view, setView] = useState("list"); // list | create | detail | bulkGrade
  const [selectedHw, setSelectedHw] = useState(null);
  const [filterSubj, setFilterSubj] = useState("all");
  const [gradingId, setGradingId] = useState(null);
  const [gradeVal, setGradeVal] = useState("");
  const [gradeComment, setGradeComment] = useState("");
  // bulk grading flow removed
  // Create form state
  const [fTitle, setFTitle] = useState("");
  const [fSubj, setFSubj] = useState("eng");
  const [fTopic, setFTopic] = useState("");
  const [fDue, setFDue] = useState("");
  const [fInstructions, setFInstructions] = useState("");
  const [fRubric, setFRubric] = useState("");
  const [fRubricEdited, setFRubricEdited] = useState(false);
  const [fAssignAll, setFAssignAll] = useState(true);
  const [fAssignIds, setFAssignIds] = useState([]);
  // AI grading state
  const [aiBusyId, setAiBusyId] = useState(null);
  // Detail-view rubric editor
  const [rubricEditing, setRubricEditing] = useState(false);
  const [rubricDraft, setRubricDraft] = useState("");

  // Auto-fill rubric when subject or topic changes (unless tutor has manually edited it)
  useEffect(() => {
    if (view !== "create" || fRubricEdited) return;
    setFRubric(getDefaultRubricForHomework(fSubj, fTopic));
  }, [fSubj, fTopic, view, fRubricEdited]);

  const hw = state.homework.filter(h => h.status === "active");
  const filtered = filterSubj === "all" ? hw : hw.filter(h => h.subject === filterSubj);
  const today = new Date().toISOString().split("T")[0];

  function getSubs(hwId) { return state.submissions.filter(s => s.homeworkId === hwId); }
  function getStudent(id) { return state.students.find(s => s.id === id); }

  const pendingGrading = state.submissions.filter(s => s.status === "submitted").length;
  const overdueCount = hw.filter(h => h.dueDate < today && getSubs(h.id).some(s => s.status !== "graded")).length;

  function openDetail(h) { setSelectedHw(h); setGradingId(null); setRubricEditing(false); setView("detail"); }

  function saveRubric() {
    if (!selectedHw) return;
    dispatch({ type: "UPDATE_HOMEWORK_RUBRIC", payload: { homeworkId: selectedHw.id, rubric: rubricDraft } });
    setSelectedHw({ ...selectedHw, rubric: rubricDraft });
    setRubricEditing(false);
    dispatch({ type: "ADD_TOAST", payload: { message: "Rubric updated", variant: "success" } });
  }

  function submitGrade(subId) {
    dispatch({ type: "GRADE_SUBMISSION", payload: { submissionId: subId, grade: gradeVal, gradeComment } });
    dispatch({ type: "ADD_TOAST", payload: { message: "Submission graded", variant: "success" } });
    setGradingId(null); setGradeVal(""); setGradeComment("");
  }

  function openCreate() {
    setFTitle(""); setFSubj("eng"); setFTopic(""); setFDue(""); setFInstructions("");
    setFRubric(getDefaultRubricForHomework("eng", "")); setFRubricEdited(false);
    setFAssignAll(true); setFAssignIds([]);
    setView("create");
  }

  function saveHomework() {
    if (!fTitle.trim() || !fDue) return;
    dispatch({ type: "ADD_HOMEWORK", payload: { title: fTitle, subject: fSubj, topic: fTopic || TOPICS[fSubj]?.[0] || "", dueDate: fDue, instructions: fInstructions, rubric: fRubric, attachedResources: [], assignedTo: fAssignAll ? "all" : fAssignIds } });
    dispatch({ type: "ADD_TOAST", payload: { message: "Homework assigned!", variant: "success" } });
    setView("list");
  }

  async function runAiGrade(sub) {
    if (!selectedHw) return;
    setAiBusyId(sub.id);
    try {
      if (!sub.fileUrls || sub.fileUrls.length === 0) {
        if (!sub.studentNotes?.trim()) throw new Error("This submission has no attached files or text to mark.");
      }
      // Extract content from each attached file (in parallel)
      const extractions = await Promise.all(
        (sub.fileUrls || []).map(f => extractFromUrl(f.url, f.name).catch(e => ({ warnings: [`Couldn't read ${f.name}: ${e.message}`] })))
      );
      const merged = mergeExtractions(extractions);
      // Append student notes as additional text context if present
      const combinedText = [merged.text, sub.studentNotes ? `\n\n[Student note: ${sub.studentNotes}]` : ""].filter(Boolean).join("");
      const result = await gradeSubmissionAPI({
        subject: selectedHw.subject,
        topic: selectedHw.topic,
        question: selectedHw.title,
        rubric: selectedHw.rubric || "",
        instructions: selectedHw.instructions || "",
        text: combinedText,
        images: merged.images,
      });
      dispatch({ type: "SAVE_AI_GRADE", payload: { submissionId: sub.id, aiGrade: result } });
      // Pre-fill the grading panel with AI's suggestion
      setGradingId(sub.id);
      setGradeVal(result.grade || "");
      setGradeComment(result.summary || "");
      dispatch({ type: "ADD_TOAST", payload: { message: "AI marking ready — review and adjust.", variant: "success" } });
    } catch (err) {
      dispatch({ type: "ADD_TOAST", payload: { message: "Auto-grade failed: " + (err.message || err), variant: "error" } });
    } finally {
      setAiBusyId(null);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 96px)", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {view !== "list" && (
            <button onClick={() => setView("list")} style={{ width: 32, height: 32, borderRadius: T.r1, background: T.bgMuted, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowLeft size={16} color={T.textSec} />
            </button>
          )}
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: T.text, margin: 0, fontFamily: T.fontDisplay }}>
              {view === "create" ? "Assign Homework" : view === "detail" ? selectedHw?.title : "Homework"}
            </h1>
            <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0", fontWeight: 400 }}>
              {view === "create" ? "Create and assign to students" : view === "detail" ? `${getSubject(selectedHw?.subject)?.name} · Due ${selectedHw?.dueDate}` : "Manage assignments and grade submissions"}
            </p>
          </div>
        </div>
        {view === "list" && (
          <button onClick={openCreate} style={{ padding: "8px 18px", borderRadius: T.r2, background: T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: T.shadowAccent }}>
            <Plus size={15} /> Assign Homework
          </button>
        )}
      </div>

      {/* ═══ LIST VIEW ═══ */}
      {view === "list" && (
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Stats row */}
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { label: "Active", value: hw.length, color: T.accent },
              { label: "Pending Grading", value: pendingGrading, color: T.warning },
              { label: "Overdue", value: overdueCount, color: T.danger },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, background: T.bgCard, borderRadius: T.r2, padding: "14px 16px", border: `1px solid ${T.border}`, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: T.fontDisplay }}>{s.value}</div>
                <div style={{ fontSize: 11, color: T.textSec, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Subject filter */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button onClick={() => setFilterSubj("all")} style={{ padding: "5px 12px", borderRadius: 20, border: `2px solid ${filterSubj === "all" ? T.accent : T.border}`, background: filterSubj === "all" ? T.accentLight : T.bgCard, color: filterSubj === "all" ? T.accent : T.textSec, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>All</button>
            {SUBJECTS.map(subj => (
              <button key={subj.id} onClick={() => setFilterSubj(subj.id)} style={{ padding: "5px 12px", borderRadius: 20, border: `2px solid ${filterSubj === subj.id ? (SUBJ_THEME[subj.id]?.accent || T.accent) : T.border}`, background: filterSubj === subj.id ? (SUBJ_THEME[subj.id]?.bg || T.accentLight) : T.bgCard, color: filterSubj === subj.id ? (SUBJ_THEME[subj.id]?.accent || T.accent) : T.textSec, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>{subj.name}</button>
            ))}
          </div>

          {/* Homework cards */}
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: T.textTer }}>No active homework. Click "Assign Homework" to create one.</div>}
          {filtered.map(h => {
            const subs = getSubs(h.id);
            const subTheme = SUBJ_THEME[h.subject] || T.eng;
            const isOverdue = h.dueDate < today;
            const graded = subs.filter(s => s.status === "graded").length;
            const submitted = subs.filter(s => s.status === "submitted").length;
            const total = subs.length;
            return (
              <button key={h.id} onClick={() => openDetail(h)}
                style={{ display: "flex", gap: 14, padding: "16px 18px", borderRadius: T.r2, border: `1px solid ${isOverdue ? T.danger + "44" : T.border}`, background: T.bgCard, cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.15s", boxShadow: T.shadow1 }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = T.shadow2; e.currentTarget.style.borderColor = subTheme.accent; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = T.shadow1; e.currentTarget.style.borderColor = isOverdue ? T.danger + "44" : T.border; }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: subTheme.accent, background: subTheme.bg, padding: "2px 8px", borderRadius: 20 }}>{getSubject(h.subject)?.name}</span>
                    {h.topic && <span style={{ fontSize: 10, color: T.textTer }}>{h.topic}</span>}
                    {isOverdue && <span style={{ fontSize: 9, fontWeight: 700, color: T.danger, background: T.dangerBg, padding: "1px 6px", borderRadius: 10 }}>OVERDUE</span>}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 6 }}>{h.title}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11 }}>
                    <span style={{ color: T.textSec }}>Due: <strong>{h.dueDate}</strong></span>
                    <span style={{ color: T.textTer }}>·</span>
                    <span style={{ color: T.success, fontWeight: 600 }}>{graded} graded</span>
                    {submitted > 0 && <span style={{ color: T.warning, fontWeight: 600 }}>{submitted} pending</span>}
                  </div>
                  {/* Progress bar */}
                  <div style={{ display: "flex", height: 4, borderRadius: 4, overflow: "hidden", marginTop: 8, background: T.bgMuted }}>
                    {total > 0 && <>
                      <div style={{ width: `${(graded / total) * 100}%`, background: T.success, transition: "width 0.3s" }} />
                      <div style={{ width: `${(submitted / total) * 100}%`, background: T.warning, transition: "width 0.3s" }} />
                      <div style={{ width: `${(subs.filter(s => s.status === "in_progress").length / total) * 100}%`, background: T.navyMid, transition: "width 0.3s" }} />
                    </>}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: T.navy, fontFamily: T.fontDisplay }}>{graded}/{total}</div>
                  <div style={{ fontSize: 10, color: T.textTer }}>graded</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ═══ CREATE VIEW ═══ */}
      {view === "create" && (
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", maxWidth: 640 }}>
          <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "20px", border: `1px solid ${T.border}`, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: T.text, display: "block", marginBottom: 4 }}>Title *</label>
                <input value={fTitle} onChange={e => setFTitle(e.target.value)} placeholder="e.g. Comprehension Practice — Inference" style={{ width: "100%", padding: "8px 10px", borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 13, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: T.text, display: "block", marginBottom: 4 }}>Due Date *</label>
                <input type="date" value={fDue} onChange={e => setFDue(e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 13, boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: T.text, display: "block", marginBottom: 4 }}>Subject</label>
                <select value={fSubj} onChange={e => { setFSubj(e.target.value); setFTopic(""); }} style={{ width: "100%", padding: "8px 10px", borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 13, boxSizing: "border-box" }}>
                  {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: T.text, display: "block", marginBottom: 4 }}>Topic</label>
                <select value={fTopic} onChange={e => setFTopic(e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 13, boxSizing: "border-box" }}>
                  <option value="">Select topic</option>
                  {(TOPICS[fSubj] || []).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: T.text, display: "block", marginBottom: 4 }}>Instructions</label>
              <textarea value={fInstructions} onChange={e => setFInstructions(e.target.value)} rows={4} placeholder="Describe the homework task, requirements, and any guidelines..." style={{ width: "100%", padding: "10px 12px", borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 13, resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: T.text }}>Marking Rubric <span style={{ color: T.textTer, fontWeight: 500 }}>· used by AI auto-grade</span></label>
                <button type="button" onClick={() => { setFRubric(getDefaultRubricForHomework(fSubj, fTopic)); setFRubricEdited(false); }}
                  style={{ background: "none", border: "none", color: T.accent, fontSize: 11, fontWeight: 600, cursor: "pointer", padding: 0 }}>
                  Reset to default
                </button>
              </div>
              <textarea
                value={fRubric}
                onChange={e => { setFRubric(e.target.value); setFRubricEdited(true); }}
                rows={9}
                placeholder="The rubric the AI will use when marking. Defaults are filled in based on subject + topic — edit freely."
                style={{ width: "100%", padding: "10px 12px", borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 12, resize: "vertical", boxSizing: "border-box", lineHeight: 1.5, fontFamily: T.fontMono }} />
              <div style={{ fontSize: 10, color: T.textTer, marginTop: 4 }}>
                Add a model answer or "look for X, Y, Z" notes for sharper marking. Leave blank to skip AI marking on this homework.
              </div>
            </div>
            {/* Assign to */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: T.text, display: "block", marginBottom: 6 }}>Assign To</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <button onClick={() => setFAssignAll(true)} style={{ padding: "6px 14px", borderRadius: 20, border: `2px solid ${fAssignAll ? T.accent : T.border}`, background: fAssignAll ? T.accentLight : T.bgCard, color: fAssignAll ? T.accent : T.textSec, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>All Students</button>
                <button onClick={() => setFAssignAll(false)} style={{ padding: "6px 14px", borderRadius: 20, border: `2px solid ${!fAssignAll ? T.accent : T.border}`, background: !fAssignAll ? T.accentLight : T.bgCard, color: !fAssignAll ? T.accent : T.textSec, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Select Students</button>
              </div>
              {!fAssignAll && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {state.students.map(st => (
                    <label key={st.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: T.r1, background: fAssignIds.includes(st.id) ? T.accentLight : T.bgMuted, cursor: "pointer", fontSize: 12 }}>
                      <input type="checkbox" checked={fAssignIds.includes(st.id)} onChange={e => setFAssignIds(ids => e.target.checked ? [...ids, st.id] : ids.filter(id => id !== st.id))} />
                      <span style={{ fontWeight: 600, color: T.text }}>{st.name}</span>
                      <span style={{ fontSize: 10, color: T.textTer }}>{st.subjects?.join(", ")}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <button onClick={saveHomework} disabled={!fTitle.trim() || !fDue} style={{ padding: "10px 24px", borderRadius: T.r2, background: fTitle.trim() && fDue ? T.gradPrimary : T.bgMuted, color: fTitle.trim() && fDue ? "#fff" : T.textTer, fontWeight: 700, fontSize: 13, border: "none", cursor: fTitle.trim() && fDue ? "pointer" : "not-allowed", alignSelf: "flex-start", boxShadow: fTitle.trim() && fDue ? T.shadowAccent : "none" }}>
              Assign Homework
            </button>
          </div>
        </div>
      )}

      {/* ═══ DETAIL VIEW ═══ */}
      {view === "detail" && selectedHw && (() => {
        const subs = getSubs(selectedHw.id);
        const subTheme = SUBJ_THEME[selectedHw.subject] || T.eng;
        return (
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Info card */}
            <div style={{ background: subTheme.bg, borderRadius: T.r2, padding: "16px 18px", border: `1px solid ${subTheme.accent}33` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: subTheme.accent, background: "#fff", padding: "2px 8px", borderRadius: 20 }}>{getSubject(selectedHw.subject)?.name} · {selectedHw.topic}</span>
                  <div style={{ fontSize: 12, color: T.textSec, marginTop: 8 }}>Due: <strong>{selectedHw.dueDate}</strong> · Created: {selectedHw.createdAt}</div>
                </div>
                <button onClick={() => { if (!window.confirm("Archive this homework? Students will no longer see it.")) return; dispatch({ type: "ARCHIVE_HOMEWORK", payload: selectedHw.id }); setView("list"); }} style={{ padding: "4px 10px", borderRadius: T.r1, background: T.dangerBg, border: `1px solid ${T.danger}33`, color: T.danger, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>Archive</button>
              </div>
              {selectedHw.instructions && (
                <div style={{ marginTop: 10, fontSize: 13, color: T.text, lineHeight: 1.7, whiteSpace: "pre-line" }}>{selectedHw.instructions}</div>
              )}
            </div>

            {/* Rubric card — collapsed by default, edit in place */}
            <details style={{ background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, padding: "10px 14px" }}>
              <summary style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", listStyle: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>Marking Rubric</span>
                  <span style={{ fontSize: 10, color: T.textTer }}>
                    {selectedHw.rubric?.trim() ? `${selectedHw.rubric.trim().split(/\s+/).length} words` : "not set — auto-grade will use defaults"}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: T.accent, fontWeight: 600 }}>{rubricEditing ? "" : "View / Edit"}</span>
              </summary>
              <div style={{ marginTop: 10 }}>
                {rubricEditing ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <textarea
                      value={rubricDraft}
                      onChange={(e) => setRubricDraft(e.target.value)}
                      rows={10}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 12, resize: "vertical", boxSizing: "border-box", lineHeight: 1.5, fontFamily: T.fontMono }} />
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button onClick={() => setRubricDraft(getDefaultRubricForHomework(selectedHw.subject, selectedHw.topic))}
                        style={{ background: "none", border: "none", color: T.accent, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                        Use default for {getSubject(selectedHw.subject)?.name}
                      </button>
                      <div style={{ flex: 1 }} />
                      <button onClick={() => setRubricEditing(false)}
                        style={{ padding: "6px 14px", borderRadius: T.r1, background: T.bgCard, color: T.textSec, border: `1px solid ${T.border}`, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        Cancel
                      </button>
                      <button onClick={saveRubric}
                        style={{ padding: "6px 14px", borderRadius: T.r1, background: T.success, color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {selectedHw.rubric?.trim() ? (
                      <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: T.fontMono, background: T.bgMuted, padding: "10px 12px", borderRadius: T.r1 }}>
                        {selectedHw.rubric}
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: T.textTer, lineHeight: 1.5 }}>
                        No rubric set. Add one so the AI auto-grade has clear criteria to mark against.
                      </div>
                    )}
                    <button
                      onClick={() => { setRubricDraft(selectedHw.rubric || getDefaultRubricForHomework(selectedHw.subject, selectedHw.topic)); setRubricEditing(true); }}
                      style={{ marginTop: 8, padding: "6px 14px", borderRadius: T.r1, background: T.bgMuted, color: T.text, border: `1px solid ${T.border}`, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      {selectedHw.rubric?.trim() ? "Edit rubric" : "Add rubric"}
                    </button>
                  </div>
                )}
              </div>
            </details>

            {/* Submissions table */}
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginTop: 4 }}>Submissions ({subs.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {subs.map(sub => {
                const st = getStudent(sub.studentId);
                const statusInfo = HW_STATUS[sub.status];
                const isGrading = gradingId === sub.id;
                return (
                  <div key={sub.id} style={{ background: T.bgCard, borderRadius: T.r2, border: `1px solid ${isGrading ? T.accent : T.border}`, overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: subTheme.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: subTheme.accent, flexShrink: 0 }}>{st?.name?.charAt(0)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{st?.name}</div>
                        {sub.submittedAt && <div style={{ fontSize: 10, color: T.textTer }}>Submitted {sub.submittedAt}</div>}
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: statusInfo.color, background: statusInfo.bg, padding: "3px 10px", borderRadius: 20 }}>{statusInfo.label}</span>
                      {sub.grade && <span style={{ fontSize: 14, fontWeight: 800, color: T.success, fontFamily: T.fontDisplay }}>{sub.grade}</span>}
                      {sub.aiGrade && !sub.grade && (
                        <span title="AI suggested grade — pending tutor review" style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", background: "#F3E8FF", padding: "3px 8px", borderRadius: 20 }}>
                          AI: {sub.aiGrade.grade}
                        </span>
                      )}
                      {sub.status === "submitted" && (
                        <>
                          <button
                            onClick={() => runAiGrade(sub)}
                            disabled={aiBusyId === sub.id}
                            title={selectedHw.rubric ? "Auto-grade with AI using the rubric" : "No rubric set — add one in the homework details for sharper marking."}
                            style={{ padding: "4px 10px", borderRadius: T.r1, background: aiBusyId === sub.id ? T.bgMuted : "#7C3AED", color: aiBusyId === sub.id ? T.textTer : "#fff", fontWeight: 700, fontSize: 11, border: "none", cursor: aiBusyId === sub.id ? "wait" : "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
                            {aiBusyId === sub.id ? "Marking..." : <><Sparkle size={11} /> Auto-grade</>}
                          </button>
                          <button onClick={() => { setGradingId(isGrading ? null : sub.id); setGradeVal(sub.aiGrade?.grade || ""); setGradeComment(sub.aiGrade?.summary || ""); }}
                            style={{ padding: "4px 12px", borderRadius: T.r1, background: T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 11, border: "none", cursor: "pointer" }}>
                            Grade
                          </button>
                        </>
                      )}
                    </div>
                    {/* Student uploaded files */}
                    {sub.fileUrls?.length > 0 && (
                      <div style={{ padding: "0 16px 8px 60px", display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {sub.fileUrls.map((f, i) => (
                          <a key={i} href={f.url} target="_blank" rel="noopener noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", background: T.bgMuted, borderRadius: T.r1, fontSize: 10, color: T.accent, fontWeight: 600, textDecoration: "none", border: `1px solid ${T.border}` }}>
                            {f.name}
                          </a>
                        ))}
                      </div>
                    )}
                    {/* Student notes */}
                    {sub.studentNotes && (
                      <div style={{ padding: "0 16px 8px 60px", fontSize: 12, color: T.textSec, fontStyle: "italic" }}>"{sub.studentNotes}"</div>
                    )}
                    {/* Grade comment */}
                    {sub.gradeComment && (
                      <div style={{ padding: "0 16px 10px 60px" }}>
                        <div style={{ background: T.successBg, borderRadius: T.r1, padding: "8px 10px", fontSize: 12, color: T.text, lineHeight: 1.5, borderLeft: `3px solid ${T.success}` }}>
                          <span style={{ fontWeight: 700, color: T.success }}>Feedback: </span>{sub.gradeComment}
                        </div>
                      </div>
                    )}
                    {/* AI feedback panel */}
                    {sub.aiGrade && (
                      <div style={{ padding: "0 16px 12px 60px", animation: "fadeSlideIn 0.15s ease" }}>
                        <div style={{ background: "#FAF7FF", border: "1px solid #7C3AED33", borderLeft: "3px solid #7C3AED", borderRadius: T.r1, padding: "10px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 11, fontWeight: 800, color: "#7C3AED", letterSpacing: "0.05em", textTransform: "uppercase" }}>AI Suggestion</span>
                              <span style={{ fontSize: 16, fontWeight: 800, color: "#7C3AED" }}>{sub.aiGrade.grade}</span>
                              {typeof sub.aiGrade.overallPercent === "number" && <span style={{ fontSize: 11, color: T.textTer }}>{sub.aiGrade.overallPercent}%</span>}
                            </div>
                            <button onClick={() => { if (window.confirm("Clear this AI grade?")) dispatch({ type: "CLEAR_AI_GRADE", payload: sub.id }); }} style={{ background: "none", border: "none", color: T.textTer, fontSize: 11, cursor: "pointer" }}>Clear</button>
                          </div>
                          {sub.aiGrade.summary && <div style={{ fontSize: 12, color: T.text, marginBottom: 8, lineHeight: 1.5 }}>{sub.aiGrade.summary}</div>}
                          {sub.aiGrade.criteria?.length > 0 && (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 6, marginBottom: 8 }}>
                              {sub.aiGrade.criteria.map((c, i) => (
                                <div key={i} style={{ background: "#fff", borderRadius: T.r1, padding: "6px 10px", border: "1px solid #EAE8E4" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, color: T.text }}>
                                    <span>{c.label}</span>
                                    <span style={{ color: "#7C3AED" }}>{c.score}/{c.max}</span>
                                  </div>
                                  {c.comment && <div style={{ fontSize: 10, color: T.textSec, marginTop: 2, lineHeight: 1.4 }}>{c.comment}</div>}
                                </div>
                              ))}
                            </div>
                          )}
                          {(sub.aiGrade.strengths?.length > 0 || sub.aiGrade.improvements?.length > 0) && (
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}>
                              {sub.aiGrade.strengths?.length > 0 && (
                                <div>
                                  <div style={{ fontSize: 10, fontWeight: 800, color: T.success, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Strengths</div>
                                  <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 11, color: T.text, lineHeight: 1.5 }}>
                                    {sub.aiGrade.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                  </ul>
                                </div>
                              )}
                              {sub.aiGrade.improvements?.length > 0 && (
                                <div>
                                  <div style={{ fontSize: 10, fontWeight: 800, color: T.warning, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>To improve</div>
                                  <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 11, color: T.text, lineHeight: 1.5 }}>
                                    {sub.aiGrade.improvements.map((s, i) => <li key={i}>{s}</li>)}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                          {sub.aiGrade.report && (
                            <details style={{ marginTop: 4 }}>
                              <summary style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", cursor: "pointer" }}>Full AI report</summary>
                              <div style={{ marginTop: 6, fontSize: 12, color: T.text, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{sub.aiGrade.report}</div>
                            </details>
                          )}
                          <div style={{ fontSize: 10, color: T.textTer, marginTop: 8, fontStyle: "italic" }}>
                            AI marking is a draft. Always review before saving. Model: {sub.aiGrade.model || "claude"}.
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Inline grading panel */}
                    {isGrading && (
                      <div style={{ padding: "0 16px 14px 60px", animation: "fadeSlideIn 0.15s ease" }}>
                        <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                          <div style={{ width: 80 }}>
                            <label style={{ fontSize: 10, fontWeight: 700, color: T.textSec, display: "block", marginBottom: 3 }}>Grade</label>
                            <input value={gradeVal} onChange={e => setGradeVal(e.target.value)} placeholder="A, B+..." style={{ width: "100%", padding: "6px 8px", borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 13, fontWeight: 700, boxSizing: "border-box" }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: 10, fontWeight: 700, color: T.textSec, display: "block", marginBottom: 3 }}>Feedback</label>
                            <input value={gradeComment} onChange={e => setGradeComment(e.target.value)} placeholder="Strengths, areas for improvement..." style={{ width: "100%", padding: "6px 8px", borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 13, boxSizing: "border-box" }} />
                          </div>
                        </div>
                        <button onClick={() => submitGrade(sub.id)} disabled={!gradeVal.trim()} style={{ padding: "6px 16px", borderRadius: T.r1, background: gradeVal.trim() ? T.success : T.bgMuted, color: gradeVal.trim() ? "#fff" : T.textTer, fontWeight: 700, fontSize: 12, border: "none", cursor: gradeVal.trim() ? "pointer" : "not-allowed" }}>
                          Save Grade
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ━━━ DAILY REWARD MODAL ━━━ */

export default TutorHomework;
