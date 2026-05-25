import React, { useState, useMemo } from 'react';
import { T } from '../../theme/theme.js';
import { SUBJECTS } from '../../data/subjects.js';
import { FilePdf, FileDoc, Folder, FolderOpen, Upload, Trash, DownloadSimple, Eye, X, Plus, CaretRight } from '../../icons/icons.jsx';
import { PageHeader, Input, Select } from '../../components/ui';
import { firebaseStorage, storageRef, uploadBytes, getDownloadURL } from '../../config/firebase.js';

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

/* ── PDF Viewer Modal ── */
function DocViewer({ url, title, onClose }) {
  React.useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label={`Viewing: ${title}`}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div style={{ background: T.bgCard, borderRadius: T.r3, width: "100%", maxWidth: 920, height: "87vh", display: "flex", flexDirection: "column", overflow: "hidden", border: `1px solid ${T.border}` }}
        onClick={e => e.stopPropagation()}>
        <div style={{ padding: "12px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>{title}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <a href={url} target="_blank" rel="noopener noreferrer"
              style={{ padding: "5px 14px", borderRadius: T.r1, background: T.accent, color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
              Open in new tab
            </a>
            <button onClick={onClose} style={{ padding: "5px 12px", borderRadius: T.r1, border: `1px solid ${T.border}`, background: "transparent", color: T.textSec, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Close
            </button>
          </div>
        </div>
        <div style={{ flex: 1 }}><iframe src={url} title={title} style={{ width: "100%", height: "100%", border: "none" }} /></div>
      </div>
    </div>
  );
}

/* ── Upload Panel ── */
function UploadPanel({ activeSubj, state, dispatch, onClose }) {
  const [file, setFile] = useState(null);
  const [year, setYear] = useState(String(CURRENT_YEAR));
  const [school, setSchool] = useState("");
  const [paperLabel, setPaperLabel] = useState("");
  const [uploading, setUploading] = useState(false);
  const [schoolInput, setSchoolInput] = useState("");

  async function handleUpload() {
    if (!file || !year || !school) return;
    const isPdf = file.type === "application/pdf";
    const isDocx = file.name.toLowerCase().endsWith(".docx") || file.type.includes("wordprocessingml");
    if (!isPdf && !isDocx) {
      dispatch({ type: "ADD_TOAST", payload: { message: "Only PDF and DOCX files are supported.", variant: "error" } });
      return;
    }
    setUploading(true);
    try {
      const path = `past-papers/${activeSubj}/${year}/${school}/${Date.now()}_${file.name}`;
      const sRef = storageRef(firebaseStorage, path);
      await uploadBytes(sRef, file);
      const url = await getDownloadURL(sRef);
      const displayName = paperLabel || file.name;
      dispatch({
        type: "ADD_PAST_PAPER_DOC",
        payload: { name: displayName, fileName: file.name, url, subject: activeSubj, fileType: isPdf ? "pdf" : "docx", year: Number(year), school, uploadedAt: new Date().toISOString().split("T")[0], uploadedBy: state.userProfile?.name || "Tutor" },
      });
      dispatch({ type: "ADD_TOAST", payload: { message: `"${displayName}" uploaded.`, variant: "success" } });
      onClose();
    } catch {
      dispatch({ type: "ADD_TOAST", payload: { message: "Upload failed. Please try again.", variant: "error" } });
    }
    setUploading(false);
  }

  return (
    <div style={{ background: T.bgCard, borderRadius: T.r2, border: `1.5px solid ${T.accent}`, padding: 20, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Upload Past Paper</span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.textTer, padding: 4 }}><X size={16} /></button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        {/* Year */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 4 }}>Year *</label>
          <Select value={year} onChange={setYear} options={YEARS.map(y => ({ value: String(y), label: String(y) }))} />
        </div>
        {/* School */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 4 }}>School *</label>
          <input
            list="school-list"
            value={school}
            onChange={e => setSchool(e.target.value)}
            placeholder="e.g. Raffles Institution"
            style={{ width: "100%", padding: "8px 12px", borderRadius: T.r1, border: `1px solid ${T.border}`, background: T.bgCard, fontSize: 13, color: T.text, outline: "none", boxSizing: "border-box" }}
          />
          <datalist id="school-list">
            {SG_SCHOOLS.map(s => <option key={s} value={s} />)}
          </datalist>
        </div>
        {/* Paper label */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 4 }}>Paper Label <span style={{ fontWeight: 400, textTransform: "none" }}>(optional — defaults to filename)</span></label>
          <Input value={paperLabel} onChange={setPaperLabel} placeholder="e.g. 2024 RI Paper 1 + Answers" />
        </div>
        {/* File */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 4 }}>File (PDF or DOCX) *</label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: T.r1, border: `1px dashed ${file ? T.success : T.border}`, background: file ? T.successBg : T.bgMuted, color: file ? T.success : T.textSec, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
            <Upload size={15} color={file ? T.success : T.textTer} />
            {file ? file.name : "Choose file…"}
            <input type="file" accept=".pdf,.docx" style={{ display: "none" }} onChange={e => setFile(e.target.files?.[0] || null)} />
          </label>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={handleUpload} disabled={!file || !year || !school || uploading}
          style={{ padding: "8px 20px", borderRadius: T.r5, background: (!file || !year || !school || uploading) ? T.bgMuted : T.accent, color: (!file || !year || !school || uploading) ? T.textTer : "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: (!file || !year || !school || uploading) ? "default" : "pointer" }}>
          {uploading ? "Uploading…" : "Upload"}
        </button>
        <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: T.r5, background: T.bgMuted, color: T.textSec, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ── Past Papers ── */
function PastPapers({ state, dispatch, defaultSubject }) {
  const [activeSubj, setActiveSubj] = useState(defaultSubject || SUBJECTS[0].id);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [expandedYears, setExpandedYears] = useState({});
  const [expandedSchools, setExpandedSchools] = useState({});

  const isTutor = true;
  const allDocs = state.pastPaperDocs || [];
  const subjDocs = allDocs.filter(d => d.subject === activeSubj);
  const activeTheme = T[activeSubj] || T.eng;

  function handleDelete(id) {
    if (!window.confirm("Remove this document from the folder?")) return;
    dispatch({ type: "DELETE_PAST_PAPER_DOC", payload: id });
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
        title="Past Papers"
        subtitle="Exam papers organised by year and school"
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
                                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                                    {doc.fileType === "pdf" && (
                                      <button onClick={() => setViewingDoc({ url: doc.url, title: doc.name })}
                                        style={{ padding: "4px 10px", borderRadius: T.r1, border: `1px solid ${T.border}`, background: T.bgMuted, color: T.textSec, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                                        <Eye size={11} /> View
                                      </button>
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

      {viewingDoc && <DocViewer url={viewingDoc.url} title={viewingDoc.title} onClose={() => setViewingDoc(null)} />}
    </div>
  );
}

export default PastPapers;
