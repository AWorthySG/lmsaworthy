import React, { useState, useEffect, useRef } from 'react';
import { T } from '../../theme/theme.js';
import { SUBJECTS, TOPICS } from '../../data/subjects.js';
import { SUBJECT_RUBRICS, pickDefaultTask, rubricToText, getDefaultRubricForHomework } from '../../grading/rubrics.js';
import { extractFromFile, mergeExtractions } from '../../grading/extractText.js';
import { gradeSubmission } from '../../grading/gradeClient.js';

// Standalone AI marker — drop in any file (.docx, .pdf, photo) and get a graded response.
// Independent of the homework system; useful for marking off-platform submissions.
function AIMarker() {
  const [subject, setSubject] = useState("gp");
  const [topic, setTopic] = useState("");
  const [taskKey, setTaskKey] = useState(SUBJECT_RUBRICS.gp.defaultTaskKey);
  const [question, setQuestion] = useState("");
  const [rubric, setRubric] = useState(() => getDefaultRubricForHomework("gp", ""));
  const [rubricEdited, setRubricEdited] = useState(false);
  const [files, setFiles] = useState([]); // [File]
  const [pastedText, setPastedText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const fileInputRef = useRef(null);

  const subjMeta = SUBJECT_RUBRICS[subject] || SUBJECT_RUBRICS.general;
  const taskOptions = Object.entries(subjMeta.tasks);

  // Auto-pick task + rubric when subject or topic changes, unless tutor has edited
  useEffect(() => {
    const next = pickDefaultTask(subject, topic);
    setTaskKey(next);
  }, [subject, topic]);
  useEffect(() => {
    if (rubricEdited) return;
    setRubric(rubricToText(subject, taskKey));
  }, [subject, taskKey, rubricEdited]);

  function onFilesPicked(list) {
    const arr = Array.from(list);
    setFiles((prev) => [...prev, ...arr]);
  }

  function removeFile(idx) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function mark() {
    setError(null); setResult(null); setWarnings([]); setBusy(true);
    try {
      const extractions = await Promise.all(files.map((f) => extractFromFile(f).catch((e) => ({ warnings: [`Couldn't read ${f.name}: ${e.message}`] }))));
      const merged = mergeExtractions(extractions);
      const combinedText = [merged.text, pastedText.trim()].filter(Boolean).join("\n\n");
      if (!combinedText && (!merged.images || merged.images.length === 0)) {
        throw new Error("Upload a file or paste some text first.");
      }
      const res = await gradeSubmission({
        subject, topic, question, rubric, text: combinedText, images: merged.images,
      });
      setResult(res);
      setWarnings(merged.warnings || []);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  function clearAll() {
    setFiles([]); setPastedText(""); setQuestion(""); setResult(null); setError(null); setWarnings([]);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 32 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", background: "linear-gradient(135deg, #7C3AED, #4338CA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>AI Marker</h1>
        <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0" }}>
          Drop a .docx, .pdf, or photo of student work — get a rubric-based grade in seconds.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 16 }}>
        {/* ─── LEFT: Inputs ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <Field label="Subject">
              <select value={subject} onChange={(e) => setSubject(e.target.value)} style={selectStyle}>
                {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                <option value="general">Other</option>
              </select>
            </Field>
            <Field label="Topic">
              <select value={topic} onChange={(e) => setTopic(e.target.value)} style={selectStyle}>
                <option value="">Any</option>
                {(TOPICS[subject] || []).map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Task type">
              <select value={taskKey} onChange={(e) => { setTaskKey(e.target.value); setRubricEdited(false); }} style={selectStyle}>
                {taskOptions.map(([k, t]) => <option key={k} value={k}>{t.label}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Question / prompt (optional but helpful)">
            <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. 'To what extent should governments fund the arts?'" style={inputStyle} />
          </Field>

          <Field label="Rubric (auto-filled — edit freely)">
            <textarea
              value={rubric}
              onChange={(e) => { setRubric(e.target.value); setRubricEdited(true); }}
              rows={10}
              style={{ ...inputStyle, fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 12, lineHeight: 1.5, resize: "vertical" }} />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => { setRubric(rubricToText(subject, taskKey)); setRubricEdited(false); }} style={{ background: "none", border: "none", color: T.accent, fontSize: 11, fontWeight: 600, cursor: "pointer", padding: "4px 0" }}>
                Reset to default
              </button>
            </div>
          </Field>

          <Field label="Submission files (.docx, .pdf, .jpg, .png)">
            <input ref={fileInputRef} type="file" multiple accept=".docx,.pdf,.png,.jpg,.jpeg,.webp,.txt,.md"
              onChange={(e) => onFilesPicked(e.target.files)}
              style={{ display: "none" }} />
            <button type="button" onClick={() => fileInputRef.current?.click()}
              style={{ width: "100%", padding: "20px", borderRadius: T.r2, border: `2px dashed ${T.border}`, background: T.bgMuted, color: T.textSec, fontSize: 13, cursor: "pointer", textAlign: "center" }}>
              📎 Click to choose files
            </button>
            {files.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                {files.map((f, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r1, fontSize: 11, color: T.text }}>
                    {f.name}
                    <button onClick={() => removeFile(i)} style={{ background: "none", border: "none", color: T.textTer, cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          <Field label="Or paste text directly">
            <textarea value={pastedText} onChange={(e) => setPastedText(e.target.value)} rows={6}
              placeholder="Paste the student's essay or answer here..."
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
          </Field>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={mark} disabled={busy} style={{ flex: 1, padding: "12px 18px", borderRadius: T.r2, background: busy ? T.bgMuted : "linear-gradient(135deg, #7C3AED, #4338CA)", color: busy ? T.textTer : "#fff", border: "none", fontWeight: 700, fontSize: 14, cursor: busy ? "wait" : "pointer", boxShadow: busy ? "none" : "0 4px 16px rgba(124,58,237,0.3)" }}>
              {busy ? "Marking..." : "✨ Mark Submission"}
            </button>
            <button onClick={clearAll} disabled={busy} style={{ padding: "12px 18px", borderRadius: T.r2, background: T.bgCard, color: T.textSec, border: `1px solid ${T.border}`, fontWeight: 600, fontSize: 13, cursor: busy ? "not-allowed" : "pointer" }}>
              Reset
            </button>
          </div>
          {error && <div style={{ padding: "10px 14px", borderRadius: T.r1, background: T.dangerBg, color: T.danger, fontSize: 12 }}>{error}</div>}
        </div>

        {/* ─── RIGHT: Result ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "sticky", top: 80, alignSelf: "start", maxHeight: "calc(100dvh - 100px)", overflowY: "auto" }}>
          {!result && !busy && (
            <div style={{ padding: "40px 20px", borderRadius: T.r2, border: `1px dashed ${T.border}`, background: T.bgMuted, textAlign: "center", color: T.textTer, fontSize: 13 }}>
              Marked feedback will appear here.
            </div>
          )}
          {busy && (
            <div style={{ padding: "40px 20px", borderRadius: T.r2, background: T.bgCard, border: `1px solid ${T.border}`, textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.textSec, marginBottom: 8 }}>Marking…</div>
              <div style={{ height: 3, background: T.bgMuted, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "40%", background: "linear-gradient(90deg, #7C3AED, #4338CA)", animation: "indeterminate 1.4s ease-in-out infinite" }} />
              </div>
              <style>{`@keyframes indeterminate{0%{transform:translateX(-100%)}100%{transform:translateX(350%)}}`}</style>
            </div>
          )}
          {warnings.length > 0 && (
            <div style={{ padding: "8px 12px", borderRadius: T.r1, background: T.warningBg || "#FFF4E8", color: T.warning, fontSize: 11 }}>
              {warnings.map((w, i) => <div key={i}>⚠ {w}</div>)}
            </div>
          )}
          {result && (
            <>
              <div style={{ padding: "18px 20px", borderRadius: T.r2, background: "linear-gradient(135deg, #7C3AED, #4338CA)", color: "#fff" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.8 }}>Grade</div>
                <div style={{ fontSize: 36, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", marginTop: 2 }}>
                  {result.grade}
                  {typeof result.overallPercent === "number" && <span style={{ fontSize: 16, fontWeight: 500, marginLeft: 10, opacity: 0.8 }}>{result.overallPercent}%</span>}
                </div>
                {result.summary && <div style={{ fontSize: 13, marginTop: 8, lineHeight: 1.5, opacity: 0.95 }}>{result.summary}</div>}
              </div>

              {result.criteria?.length > 0 && (
                <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "12px 14px", border: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Criteria breakdown</div>
                  {result.criteria.map((c, i) => {
                    const pct = c.max ? Math.round((c.score / c.max) * 100) : 0;
                    return (
                      <div key={i} style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 4 }}>
                          <span>{c.label}</span>
                          <span style={{ color: pct >= 70 ? T.success : pct >= 50 ? T.warning : T.danger }}>{c.score}/{c.max}</span>
                        </div>
                        <div style={{ height: 4, background: T.bgMuted, borderRadius: 4, marginBottom: 4 }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: pct >= 70 ? T.success : pct >= 50 ? T.warning : T.danger, borderRadius: 4 }} />
                        </div>
                        {c.comment && <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.5 }}>{c.comment}</div>}
                      </div>
                    );
                  })}
                </div>
              )}

              {(result.strengths?.length > 0 || result.improvements?.length > 0) && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {result.strengths?.length > 0 && (
                    <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "12px 14px", border: `1px solid ${T.border}`, borderTop: `3px solid ${T.success}` }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: T.success, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Strengths</div>
                      <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 12, color: T.text, lineHeight: 1.5 }}>
                        {result.strengths.map((s, i) => <li key={i} style={{ marginBottom: 3 }}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  {result.improvements?.length > 0 && (
                    <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "12px 14px", border: `1px solid ${T.border}`, borderTop: `3px solid ${T.warning}` }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: T.warning, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>To improve</div>
                      <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 12, color: T.text, lineHeight: 1.5 }}>
                        {result.improvements.map((s, i) => <li key={i} style={{ marginBottom: 3 }}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {result.report && (
                <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "12px 14px", border: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Full report</div>
                  <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{result.report}</div>
                </div>
              )}

              <div style={{ fontSize: 10, color: T.textTer, padding: "0 4px" }}>
                AI marking is a draft — always review before sharing. Model: {result.model || "claude"}.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #EAE8E4",
  fontSize: 13,
  boxSizing: "border-box",
};
const selectStyle = { ...inputStyle };

function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#1C1B19", display: "block", marginBottom: 4 }}>{label}</label>
      {children}
    </div>
  );
}

export default AIMarker;
