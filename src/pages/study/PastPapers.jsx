import React, { useState, useMemo, useCallback, useRef } from 'react';
import { T } from '../../theme/theme.js';
import { SUBJECTS } from '../../data/subjects.js';
import { FilePdf, FileDoc, Folder, FolderOpen, Upload, Trash, DownloadSimple, Eye, X, Plus, CaretRight, Timer, CheckCircle, Warning } from '../../icons/icons.jsx';
import { PageHeader, Input, Select } from '../../components/ui';
import { firebaseStorage, storageRef, uploadBytesResumable, getDownloadURL } from '../../config/firebase.js';
import useTimer from '../../hooks/useTimer.js';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 2014 }, (_, i) => CURRENT_YEAR - i);

const SG_SCHOOLS = [
  "Raffles Institution", "Hwa Chong Institution", "Anglo-Chinese School (Independent)",
  "Victoria Junior College", "National Junior College", "Temasek Junior College",
  "Catholic Junior College", "Anderson Serangoon Junior College", "Nanyang Junior College",
  "Jurong Pioneer Junior College", "Eunoia Junior College", "Yishun Innova Junior College",
  "St Andrew's Junior College", "Tampines Meridian Junior College",
  "Raffles Girls' School", "Crescent Girls' School", "Cedar Girls' Secondary School",
  "Dunman High School", "Tanjong Katong Girls' School", "CHIJ St Nicholas Girls' School",
  "Anglo-Chinese School (Barker Road)", "St Joseph's Institution", "Presbyterian High School",
  "Bukit Timah Secondary School", "River Valley High School",
  "Cambridge O-Level (10-Year Series)", "TYS Mixed Compilation", "Other",
];

const TIMER_DURATIONS = [30, 45, 60, 90, 120];

/* ── PDF Viewer Modal with optional countdown timer ── */
function DocViewer({ url, title, timedMinutes, onClose, onTimedComplete }) {
  const isMobile = window.innerWidth < 768;
  const isUrlValid = typeof url === 'string' && (url.startsWith('http') || url.startsWith('/resources/'));
  const absoluteUrl = isUrlValid ? (url.startsWith('http') ? url : window.location.origin + url) : '';
  const [timerStarted, setTimerStarted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  const handleEnd = useCallback(() => {
    setTimeUp(true);
    onTimedComplete?.();
  }, [onTimedComplete]);

  const { display, running, start, stop } = useTimer(timedMinutes || 60, handleEnd);

  React.useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  // Auto-start timer when viewer opens in timed mode
  React.useEffect(() => {
    if (timedMinutes && !timerStarted) { start(); setTimerStarted(true); }
  }, [timedMinutes, timerStarted, start]);

  const timerColor = timeUp ? T.danger : display < "00:10" ? T.danger : display < "00:30" ? "#D4940A" : T.success;

  return (
    <div role="dialog" aria-modal="true" aria-label={`Viewing: ${title}`}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div style={{ background: T.bgCard, borderRadius: T.r3, width: "100%", maxWidth: 920, height: "87vh", display: "flex", flexDirection: "column", overflow: "hidden", border: `1px solid ${T.border}` }}
        onClick={e => e.stopPropagation()}>
        <div style={{ padding: "12px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "50%" }}>{title}</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Countdown timer chip */}
            {timedMinutes && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: T.r1, background: timeUp ? T.dangerBg : "#1C1B19", border: `1px solid ${timerColor}44` }}>
                <Timer size={13} color={timeUp ? T.danger : "#fff"} />
                <span style={{ fontSize: 14, fontWeight: 800, color: timeUp ? T.danger : "#fff", fontFamily: "monospace", letterSpacing: 1 }}>{timeUp ? "Time's up!" : display}</span>
                {!timeUp && (
                  <button onClick={e => { e.stopPropagation(); running ? stop() : start(); }}
                    style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", background: "none", border: "none", cursor: "pointer", padding: "0 2px" }}>
                    {running ? "Pause" : "Resume"}
                  </button>
                )}
              </div>
            )}
            {isUrlValid && (
              <a href={absoluteUrl} target="_blank" rel="noopener noreferrer"
                style={{ padding: "5px 14px", borderRadius: T.r1, background: T.accent, color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                Open in new tab
              </a>
            )}
            <button onClick={onClose} style={{ padding: "5px 12px", borderRadius: T.r1, border: `1px solid ${T.border}`, background: "transparent", color: T.textSec, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Close
            </button>
          </div>
        </div>
        {/* Time's up banner */}
        {timeUp && (
          <div style={{ background: T.dangerBg, padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Timer size={16} color={T.danger} />
              <span style={{ fontSize: 13, fontWeight: 700, color: T.danger }}>Time's up! Close this viewer when you're ready.</span>
            </div>
            <button onClick={onClose} style={{ padding: "5px 14px", borderRadius: T.r1, background: T.danger, color: "#fff", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
              Finish
            </button>
          </div>
        )}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {!isUrlValid ? (
            <div style={{ textAlign: "center", padding: 32, color: T.textSec, fontSize: 13, lineHeight: 1.6 }}>
              <Warning size={32} color={T.warning} style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 8 }}>Document URL unavailable</div>
              This document has no valid URL. Please delete it and re-upload the file.
            </div>
          ) : isMobile ? (
            <div style={{ textAlign: "center", padding: 32, color: T.textSec, fontSize: 13, lineHeight: 1.6 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 8 }}>{title}</div>
              Open this PDF in a new tab for the best reading experience on mobile.
            </div>
          ) : url.startsWith('/resources/') ? (
            <iframe src={absoluteUrl} title={title} style={{ width: "100%", height: "100%", border: "none" }} />
          ) : (
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}&embedded=true`}
              title={title} style={{ width: "100%", height: "100%", border: "none" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Upload Panel ── */
function UploadPanel({ activeSubj, state, dispatch, onClose }) {
  const [year, setYear] = useState(String(CURRENT_YEAR));
  const [school, setSchool] = useState("");
  const [queue, setQueue] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  function addFiles(files) {
    const valid = Array.from(files).filter(f => {
      const isPdf = f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
      const isDocx = f.name.toLowerCase().endsWith(".docx") || f.type.includes("wordprocessingml");
      return isPdf || isDocx;
    });
    if (valid.length < files.length) {
      dispatch({ type: "ADD_TOAST", payload: { message: "Only PDF and DOCX files are supported.", variant: "error" } });
    }
    setQueue(prev => [...prev, ...valid.map(f => ({
      uid: Math.random().toString(36).slice(2),
      file: f,
      label: f.name.replace(/\.[^/.]+$/, ''),
      fileType: (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) ? "pdf" : "docx",
      progress: 0,
      status: 'pending',
    }))]);
  }

  function removeFromQueue(uid) { setQueue(prev => prev.filter(q => q.uid !== uid)); }

  function updateQueueItem(uid, updates) {
    setQueue(prev => prev.map(q => q.uid === uid ? { ...q, ...updates } : q));
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }

  async function handleUpload() {
    if (!year || !school || queue.filter(q => q.status === 'pending').length === 0) return;
    setIsUploading(true);
    const pending = queue.filter(q => q.status === 'pending');
    let successCount = 0;
    for (const item of pending) {
      const path = `past-papers/${activeSubj}/${year}/${school}/${Date.now()}_${item.file.name}`;
      const sRef = storageRef(firebaseStorage, path);
      await new Promise((resolve) => {
        const task = uploadBytesResumable(sRef, item.file);
        task.on('state_changed',
          (snap) => {
            const p = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
            updateQueueItem(item.uid, { progress: p, status: 'uploading' });
          },
          () => { updateQueueItem(item.uid, { status: 'error' }); resolve(); },
          async () => {
            const url = await getDownloadURL(task.snapshot.ref);
            dispatch({
              type: "ADD_PAST_PAPER_DOC",
              payload: { name: item.label || item.file.name, fileName: item.file.name, url, subject: activeSubj, fileType: item.fileType, year: Number(year), school, uploadedAt: new Date().toISOString().split("T")[0], uploadedBy: state.userProfile?.name || "Tutor" },
            });
            updateQueueItem(item.uid, { status: 'done', progress: 100 });
            successCount++;
            resolve();
          }
        );
      });
    }
    setIsUploading(false);
    if (successCount > 0) {
      dispatch({ type: "ADD_TOAST", payload: { message: `${successCount} paper${successCount > 1 ? 's' : ''} uploaded.`, variant: "success" } });
      setTimeout(onClose, 700);
    }
  }

  const pendingCount = queue.filter(q => q.status === 'pending').length;
  const uploadedCount = queue.filter(q => q.status === 'done').length;

  return (
    <div style={{ background: T.bgCard, borderRadius: T.r2, border: `1.5px solid ${T.accent}`, padding: 20, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Upload Practice Papers</span>
        <button onClick={onClose} aria-label="Close upload panel" style={{ background: "none", border: "none", cursor: "pointer", color: T.textTer, padding: 4 }}><X size={16} /></button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 4 }}>Year *</label>
          <Select value={year} onChange={setYear} options={YEARS.map(y => ({ value: String(y), label: String(y) }))} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 4 }}>School / Source *</label>
          <input list="school-list" value={school} onChange={e => setSchool(e.target.value)}
            placeholder="e.g. Raffles Institution"
            style={{ width: "100%", padding: "8px 12px", borderRadius: T.r1, border: `1px solid ${T.border}`, background: T.bgCard, fontSize: 13, color: T.text, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
          <datalist id="school-list">
            {SG_SCHOOLS.map(s => <option key={s} value={s} />)}
          </datalist>
        </div>
      </div>
      {/* Drag-and-drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{ border: `2px dashed ${dragging ? T.accent : T.border}`, borderRadius: T.r2, background: dragging ? T.accentLight : T.bgMuted, padding: "24px 20px", textAlign: "center", cursor: "pointer", marginBottom: 14, transition: "all 0.15s" }}>
        <Upload size={22} color={dragging ? T.accent : T.textTer} style={{ display: "block", margin: "0 auto 8px" }} />
        <div style={{ fontSize: 13, fontWeight: 600, color: dragging ? T.accent : T.textSec, marginBottom: 4 }}>Drop PDFs or DOCX files here, or click to browse</div>
        <div style={{ fontSize: 11, color: T.textTer }}>Multiple files supported</div>
        <input ref={fileInputRef} type="file" multiple accept=".pdf,.docx" style={{ display: "none" }}
          onChange={e => { addFiles(e.target.files); e.target.value = ''; }} />
      </div>
      {/* File queue */}
      {queue.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 8 }}>
            {queue.length} file{queue.length !== 1 ? 's' : ''}{uploadedCount > 0 ? ` · ${uploadedCount} uploaded` : ''}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 240, overflowY: "auto" }}>
            {queue.map(item => (
              <div key={item.uid} style={{ background: T.bgMuted, borderRadius: T.r1, padding: "9px 12px", border: `1px solid ${item.status === 'error' ? T.danger : item.status === 'done' ? T.success + '60' : T.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: item.status === 'uploading' ? 6 : 0 }}>
                  {item.fileType === 'pdf' ? <FilePdf size={14} color="#DC2626" style={{ flexShrink: 0 }} /> : <FileDoc size={14} color={T.accent} style={{ flexShrink: 0 }} />}
                  <input value={item.label} onChange={e => updateQueueItem(item.uid, { label: e.target.value })}
                    disabled={item.status !== 'pending'} aria-label="Paper label"
                    style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 12, fontWeight: 600, color: T.text, fontFamily: "inherit", minWidth: 0 }} />
                  {item.status === 'done' && <CheckCircle size={13} color={T.success} weight="fill" />}
                  {item.status === 'error' && <Warning size={13} color={T.danger} />}
                  {item.status === 'pending' && (
                    <button onClick={() => removeFromQueue(item.uid)} aria-label="Remove"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: T.textTer, flexShrink: 0 }}>
                      <X size={11} weight="bold" />
                    </button>
                  )}
                </div>
                {item.status === 'uploading' && (
                  <div style={{ background: T.border, borderRadius: 4, height: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${item.progress}%`, background: T.accent, borderRadius: 4, transition: "width 0.3s" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={handleUpload} disabled={!year || !school || pendingCount === 0 || isUploading}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: T.r5, background: (!year || !school || pendingCount === 0 || isUploading) ? T.bgMuted : T.accent, color: (!year || !school || pendingCount === 0 || isUploading) ? T.textTer : "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: (!year || !school || pendingCount === 0 || isUploading) ? "default" : "pointer" }}>
          <Upload size={13} />
          {isUploading ? "Uploading…" : `Upload ${pendingCount > 0 ? pendingCount + ' file' + (pendingCount !== 1 ? 's' : '') : ''}`}
        </button>
        <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: T.r5, background: T.bgMuted, color: T.textSec, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}>Cancel</button>
        {isUploading && <span style={{ fontSize: 12, color: T.textSec }}>{uploadedCount} / {queue.length} complete</span>}
      </div>
    </div>
  );
}

/* ── Past Papers ── */
function PastPapers({ state, dispatch, defaultSubject }) {
  const [activeSubj, setActiveSubj] = useState(defaultSubject || SUBJECTS[0].id);
  const [viewingDoc, setViewingDoc] = useState(null); // { url, title, timedMinutes? }
  const [showUpload, setShowUpload] = useState(false);
  const [expandedYears, setExpandedYears] = useState({});
  const [expandedSchools, setExpandedSchools] = useState({});
  const [timerPickerDoc, setTimerPickerDoc] = useState(null); // doc being configured for timed practice

  const isTutor = state.role === "tutor";
  const allDocs = state.pastPaperDocs || [];
  const subjDocs = allDocs.filter(d => d.subject === activeSubj);
  const activeTheme = T[activeSubj] || T.eng;

  function handleDelete(id) {
    if (!window.confirm("Remove this document from the folder?")) return;
    dispatch({ type: "DELETE_PAST_PAPER_DOC", payload: id });
  }

  function handleTimedComplete(doc, minutes) {
    dispatch({
      type: "LOG_STUDY_TIME",
      payload: { type: "timedPractice", docId: doc.id, docName: doc.name, subject: doc.subject, durationMin: minutes },
    });
    dispatch({ type: "ADD_TOAST", payload: { message: `Timed session logged: ${minutes} min on "${doc.name}"`, variant: "success" } });
  }

  // Group by year desc, then by school asc
  const grouped = useMemo(() => {
    const byYear = {};
    subjDocs.forEach(doc => {
      const y = doc.year || "Uncategorised";
      const s = doc.school || "Uncategorised";
      if (!byYear[y]) byYear[y] = {};
      if (!byYear[y][s]) byYear[y][s] = [];
      byYear[y][s].push(doc);
    });
    // Sort years descending, schools ascending
    return Object.keys(byYear)
      .sort((a, b) => {
        if (a === "Uncategorised") return 1;
        if (b === "Uncategorised") return -1;
        return Number(b) - Number(a);
      })
      .map(year => ({
        year,
        schools: Object.keys(byYear[year]).sort().map(school => ({
          school,
          docs: byYear[year][school].sort((a, b) => a.name.localeCompare(b.name)),
        })),
      }));
  }, [subjDocs]);

  function toggleYear(y) { setExpandedYears(p => ({ ...p, [y]: !p[y] })); }
  function toggleSchool(key) { setExpandedSchools(p => ({ ...p, [key]: !p[key] })); }
  function isYearOpen(y) { return expandedYears[y] !== false; } // open by default
  function isSchoolOpen(key) { return expandedSchools[key] !== false; } // open by default

  const subjectName = SUBJECTS.find(s => s.id === activeSubj)?.name || activeSubj;

  return (
    <div>
      <PageHeader
        title="Practice Papers"
        subtitle="Practice and exam papers organised by year and school"
        action={isTutor ? (
          <button onClick={() => setShowUpload(s => !s)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: T.r2, border: `1px solid ${T.accent}`, background: T.accentLight, color: T.accent, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            <Plus size={14} /> Upload Paper
          </button>
        ) : null}
      />

      {isTutor && showUpload && (
        <UploadPanel activeSubj={activeSubj} state={state} dispatch={dispatch} onClose={() => setShowUpload(false)} />
      )}

      {/* Subject tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
        {SUBJECTS.map(s => {
          const theme = T[s.id] || T.eng;
          const count = allDocs.filter(d => d.subject === s.id).length;
          const active = activeSubj === s.id;
          return (
            <button key={s.id} onClick={() => { setActiveSubj(s.id); setShowUpload(false); }}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: T.r2, border: `2px solid ${active ? theme.accent : T.border}`, background: active ? theme.bg : T.bgCard, color: active ? theme.accent : T.textSec, fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.15s" }}>
              <Folder size={13} />
              {s.name}
              {count > 0 && (
                <span style={{ fontSize: 10, fontWeight: 800, background: active ? theme.accent : T.bgMuted, color: active ? "#fff" : T.textTer, borderRadius: 20, padding: "1px 6px" }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Folder contents */}
      {subjDocs.length === 0 ? (
        <div style={{ background: T.bgCard, borderRadius: T.r3, border: `1px solid ${T.border}`, padding: "56px 24px", textAlign: "center" }}>
          <Folder size={36} color={T.border} style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: T.textSec, marginBottom: 4 }}>No papers yet for {subjectName}</div>
          <div style={{ fontSize: 12, color: T.textTer }}>
            {isTutor ? "Click \"Upload Paper\" above to add documents." : "Papers will appear here once uploaded by your tutor."}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {grouped.map(({ year, schools }) => {
            const yearOpen = isYearOpen(year);
            const totalDocs = schools.reduce((n, s) => n + s.docs.length, 0);
            return (
              <div key={year} style={{ background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, overflow: "hidden" }}>
                {/* Year header */}
                <button onClick={() => toggleYear(year)}
                  style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "12px 18px", background: T.bgMuted, border: "none", cursor: "pointer", textAlign: "left", borderBottom: yearOpen ? `1px solid ${T.border}` : "none" }}>
                  <CaretRight size={13} color={T.textTer} style={{ transform: yearOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
                  {yearOpen
                    ? <FolderOpen size={17} color={activeTheme.accent} />
                    : <Folder size={17} color={activeTheme.accent} />
                  }
                  <span style={{ fontSize: 14, fontWeight: 750, color: T.text, flex: 1 }}>{year}</span>
                  <span style={{ fontSize: 11, color: T.textTer, fontWeight: 600 }}>{totalDocs} file{totalDocs !== 1 ? "s" : ""}</span>
                </button>

                {yearOpen && (
                  <div>
                    {schools.map(({ school, docs }) => {
                      const schoolKey = `${year}::${school}`;
                      const schoolOpen = isSchoolOpen(schoolKey);
                      return (
                        <div key={school} style={{ borderBottom: `1px solid ${T.border}` }}>
                          {/* School header */}
                          <button onClick={() => toggleSchool(schoolKey)}
                            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 18px 10px 36px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", borderBottom: schoolOpen ? `1px solid ${T.border}` : "none" }}>
                            <CaretRight size={11} color={T.textTer} style={{ transform: schoolOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
                            <Folder size={14} color={T.textSec} />
                            <span style={{ fontSize: 13, fontWeight: 650, color: T.text, flex: 1 }}>{school}</span>
                            <span style={{ fontSize: 11, color: T.textTer }}>{docs.length} file{docs.length !== 1 ? "s" : ""}</span>
                          </button>

                          {schoolOpen && (
                            <div>
                              {docs.map((doc, i) => (
                                <div key={doc.id}
                                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px 10px 60px", borderBottom: i < docs.length - 1 ? `1px solid ${T.border}` : "none" }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = T.bgMuted}
                                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                                  {doc.fileType === "pdf"
                                    ? <FilePdf size={18} color="#DC2626" style={{ flexShrink: 0 }} />
                                    : <FileDoc size={18} color={T.accent} style={{ flexShrink: 0 }} />
                                  }
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.name}</div>
                                    <div style={{ fontSize: 10, color: T.textTer, marginTop: 2 }}>
                                      {doc.fileType?.toUpperCase()}{doc.uploadedAt ? ` · ${doc.uploadedAt}` : ""}{doc.uploadedBy ? ` · ${doc.uploadedBy}` : ""}
                                    </div>
                                  </div>
                                  <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
                                    {/* Duration picker inline when timed practice requested */}
                                    {timerPickerDoc?.id === doc.id ? (
                                      <div style={{ display: "flex", gap: 4, alignItems: "center", background: "#1C1B19", borderRadius: T.r2, padding: "4px 8px" }}>
                                        <Timer size={12} color="#fff" />
                                        {TIMER_DURATIONS.map(min => (
                                          <button key={min} onClick={() => { setTimerPickerDoc(null); setViewingDoc({ url: doc.url, title: doc.name, timedMinutes: min, doc }); }}
                                            style={{ padding: "3px 8px", borderRadius: T.r1, border: "none", background: "rgba(255,255,255,0.12)", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                                            {min}m
                                          </button>
                                        ))}
                                        <button onClick={() => setTimerPickerDoc(null)}
                                          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", padding: "0 2px" }}>
                                          <X size={11} />
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        {doc.fileType === "pdf" && (
                                          <>
                                            <button onClick={() => setViewingDoc({ url: doc.url, title: doc.name })}
                                              style={{ padding: "4px 10px", borderRadius: T.r1, border: `1px solid ${T.border}`, background: T.bgMuted, color: T.textSec, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                                              <Eye size={11} /> View
                                            </button>
                                            <button onClick={() => setTimerPickerDoc(doc)}
                                              style={{ padding: "4px 10px", borderRadius: T.r1, border: `1px solid #1C1B19`, background: "#1C1B19", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                                              <Timer size={11} /> Timed
                                            </button>
                                          </>
                                        )}
                                        <a href={doc.url} download target="_blank" rel="noopener noreferrer"
                                          style={{ padding: "4px 10px", borderRadius: T.r1, border: `1px solid ${T.accent}`, background: T.accentLight, color: T.accent, fontSize: 11, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                                          <DownloadSimple size={11} /> Download
                                        </a>
                                        {isTutor && (
                                          <button onClick={() => handleDelete(doc.id)} aria-label="Delete document"
                                            style={{ padding: "4px 8px", borderRadius: T.r1, border: `1px solid ${T.border}`, background: "transparent", color: T.textTer, cursor: "pointer", display: "flex", alignItems: "center" }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = T.dangerBg; e.currentTarget.style.color = T.danger; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textTer; }}>
                                            <Trash size={12} />
                                          </button>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {viewingDoc && (
        <DocViewer
          url={viewingDoc.url}
          title={viewingDoc.title}
          timedMinutes={viewingDoc.timedMinutes}
          onClose={() => setViewingDoc(null)}
          onTimedComplete={viewingDoc.doc ? () => handleTimedComplete(viewingDoc.doc, viewingDoc.timedMinutes) : undefined}
        />
      )}
    </div>
  );
}

export default PastPapers;
