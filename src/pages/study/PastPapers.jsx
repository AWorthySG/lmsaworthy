import React, { useState } from 'react';
import { T } from '../../theme/theme.js';
import { SUBJECTS } from '../../data/subjects.js';
import { PAST_PAPERS } from '../../data/pastPapersData.js';
import { ESSAY_RUBRICS } from '../../data/essayData.js';
import { getSubject, getExamCountdowns } from '../../utils/helpers.js';
import { firebaseStorage, storageRef, uploadBytes, getDownloadURL } from '../../config/firebase.js';

/* ━━━ PDF VIEWER MODAL ━━━ */
function PdfViewer({ url, title, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div style={{ background: T.bgCard, borderRadius: T.r3, width: "100%", maxWidth: 900, height: "85vh", display: "flex", flexDirection: "column", overflow: "hidden", border: `1px solid ${T.border}` }}
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{title}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <a href={url} target="_blank" rel="noopener noreferrer"
              style={{ padding: "6px 14px", borderRadius: T.r1, background: T.accent, color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
              Open in New Tab
            </a>
            <button onClick={onClose}
              style={{ padding: "6px 14px", borderRadius: T.r1, border: `1px solid ${T.border}`, background: "transparent", color: T.textSec, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Close
            </button>
          </div>
        </div>
        {/* PDF iframe */}
        <div style={{ flex: 1, position: "relative" }}>
          <iframe
            src={url}
            title={title}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ━━━ UPLOAD BUTTON ━━━ */
function PdfUpload({ onUploaded, label }) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") return;
    setUploading(true);
    try {
      const path = `past-papers/${Date.now()}_${file.name}`;
      const sRef = storageRef(firebaseStorage, path);
      await uploadBytes(sRef, file);
      const url = await getDownloadURL(sRef);
      onUploaded({ name: file.name, url });
    } catch (err) {
      console.warn("PDF upload failed:", err);
    }
    setUploading(false);
    e.target.value = "";
  }

  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: T.r2, border: `1px solid ${T.accent}`, background: T.accentLight, color: T.accent, fontWeight: 700, fontSize: 12, cursor: uploading ? "wait" : "pointer" }}>
      <span>{uploading ? "Uploading..." : label || "Upload PDF"}</span>
      <input type="file" accept="application/pdf" onChange={handleUpload} style={{ display: "none" }} disabled={uploading} />
    </label>
  );
}

/* ━━━ PAST PAPERS PAGE ━━━ */
function PastPapers({ state, dispatch, defaultSubject }) {
  const [filterSubj, setFilterSubj] = useState(defaultSubject || "all");
  const [viewingPdf, setViewingPdf] = useState(null); // { url, title }
  const [uploadedPdfs, setUploadedPdfs] = useState([]); // user-uploaded PDFs
  const filtered = filterSubj === "all" ? PAST_PAPERS : PAST_PAPERS.filter(p => p.subject === filterSubj);

  function handlePdfUploaded(pdf) {
    setUploadedPdfs(prev => [...prev, { ...pdf, id: Date.now(), uploadedAt: new Date().toISOString().split("T")[0] }]);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: T.text, margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Past-Year Papers</h1>
          <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0" }}>Practice with real Cambridge exam papers and model answers</p>
        </div>
        {state.role === "tutor" && (
          <PdfUpload onUploaded={handlePdfUploaded} label="Upload Past Paper PDF" />
        )}
      </div>

      {/* Exam countdown banner */}
      {(() => {
        const next = getExamCountdowns()[0];
        return next && (
          <div style={{ background: "linear-gradient(135deg, #1A1816, #2E2218)", borderRadius: T.r3, padding: "16px 20px", color: "#fff", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#D4A254", fontFamily: "'JetBrains Mono', monospace" }}>{next.daysLeft}</div>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>Days to next exam</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{next.name}</div>
            </div>
          </div>
        );
      })()}

      {/* Subject filters */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button onClick={() => setFilterSubj("all")} style={{ padding: "5px 12px", borderRadius: 20, border: `2px solid ${filterSubj === "all" ? T.accent : T.border}`, background: filterSubj === "all" ? T.accentLight : T.bgCard, color: filterSubj === "all" ? T.accent : T.textSec, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>All</button>
        {SUBJECTS.map(s => (
          <button key={s.id} onClick={() => setFilterSubj(s.id)} style={{ padding: "5px 12px", borderRadius: 20, border: `2px solid ${filterSubj === s.id ? (T[s.id]?.accent || T.accent) : T.border}`, background: filterSubj === s.id ? (T[s.id]?.bg || T.accentLight) : T.bgCard, color: filterSubj === s.id ? (T[s.id]?.accent || T.accent) : T.textSec, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>{s.name}</button>
        ))}
      </div>

      {/* Uploaded PDFs section */}
      {uploadedPdfs.length > 0 && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: T.text, margin: "0 0 8px", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Uploaded Papers</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {uploadedPdfs.map(pdf => (
              <div key={pdf.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 20 }}>📄</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{pdf.name}</div>
                  <div style={{ fontSize: 10, color: T.textTer }}>Uploaded {pdf.uploadedAt}</div>
                </div>
                <button onClick={() => setViewingPdf({ url: pdf.url, title: pdf.name })}
                  style={{ padding: "6px 14px", borderRadius: T.r1, border: `1px solid ${T.accent}`, background: T.accentLight, color: T.accent, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                  View PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paper cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(p => {
          const theme = T[p.subject] || T.eng;
          return (
            <div key={p.id} className="card-hover" style={{ display: "flex", gap: 14, padding: "16px 18px", background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, borderLeft: `3px solid ${theme.accent}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: theme.accent, background: theme.bg, padding: "2px 8px", borderRadius: 20 }}>{p.paper}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: T.textTer }}>{p.year}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{p.title}</div>
                <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                  {p.topics.map(t => <span key={t} style={{ fontSize: 9, color: T.textTer, background: T.bgMuted, padding: "2px 6px", borderRadius: 10 }}>{t}</span>)}
                </div>
                {/* Model answer hints */}
                {p.modelHints && p.modelHints.length > 0 && (
                  <div style={{ marginTop: 10, padding: "10px 12px", background: T.goldLight, borderRadius: T.r1, border: `1px solid ${T.gold}22` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: T.goldDark, marginBottom: 4 }}>Model Answer Hints</div>
                    {p.modelHints.map((h, i) => (
                      <div key={i} style={{ fontSize: 11, color: T.text, lineHeight: 1.6, marginBottom: i < p.modelHints.length - 1 ? 6 : 0 }}>• {h}</div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", justifyContent: "center" }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: T.textTer, background: T.bgMuted, padding: "2px 8px", borderRadius: 10 }}>{p.difficulty}</span>
                {p.modelHints && <span style={{ fontSize: 9, fontWeight: 700, color: T.gold, background: T.goldLight, padding: "2px 8px", borderRadius: 10 }}>Hints</span>}
                {p.pdfUrl && (
                  <button onClick={() => setViewingPdf({ url: p.pdfUrl, title: `${p.paper} ${p.year} - ${p.title}` })}
                    style={{ marginTop: 4, padding: "5px 12px", borderRadius: T.r1, border: `1px solid ${theme.accent}`, background: theme.bg, color: theme.accent, fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
                    View PDF
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rubrics section */}
      <div style={{ marginTop: 8 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: "0 0 12px", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Cambridge Marking Rubrics</h2>
        {Object.entries(ESSAY_RUBRICS).map(([subj, rubric]) => {
          const theme = T[subj] || T.eng;
          return (
            <div key={subj} style={{ marginBottom: 16, background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, overflow: "hidden" }}>
              <div style={{ padding: "12px 18px", background: theme.bg, borderBottom: `1px solid ${theme.accent}22` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.accent }}>{rubric.name}</div>
              </div>
              {rubric.criteria.map((c, ci) => (
                <div key={ci} style={{ padding: "12px 18px", borderBottom: ci < rubric.criteria.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{c.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: theme.accent }}>{c.weight}%</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {c.levels.map((l, li) => (
                      <div key={li} style={{ display: "flex", gap: 8, fontSize: 11, lineHeight: 1.5 }}>
                        <span style={{ fontWeight: 700, color: li === 0 ? T.success : li === 1 ? "#3D7DD6" : li === 2 ? T.warning : T.danger, minWidth: 70, flexShrink: 0 }}>{l.level}</span>
                        <span style={{ color: T.textSec }}>{l.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* PDF Viewer Modal */}
      {viewingPdf && <PdfViewer url={viewingPdf.url} title={viewingPdf.title} onClose={() => setViewingPdf(null)} />}
    </div>
  );
}

export default PastPapers;
