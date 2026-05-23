import React, { useState } from 'react';
import { T } from '../../theme/theme.js';
import { SUBJECTS } from '../../data/subjects.js';
import { FilePdf, FileDoc, Folder, Upload, Trash, DownloadSimple, Eye } from '../../icons/icons.jsx';
import { PageHeader } from '../../components/ui';
import { firebaseStorage, storageRef, uploadBytes, getDownloadURL } from '../../config/firebase.js';

/* ━━━ PDF VIEWER MODAL ━━━ */
function DocViewer({ url, title, onClose }) {
  React.useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={`Viewing: ${title}`}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div style={{ background: T.bgCard, borderRadius: T.r3, width: "100%", maxWidth: 900, height: "85vh", display: "flex", flexDirection: "column", overflow: "hidden", border: `1px solid ${T.border}` }}
        onClick={e => e.stopPropagation()}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>{title}</div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
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
        <div style={{ flex: 1 }}>
          <iframe src={url} title={title} style={{ width: "100%", height: "100%", border: "none" }} />
        </div>
      </div>
    </div>
  );
}

/* ━━━ PAST PAPERS — DOCUMENT FOLDER ━━━ */
function PastPapers({ state, dispatch, defaultSubject }) {
  const [activeSubj, setActiveSubj] = useState(defaultSubject || SUBJECTS[0].id);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [uploading, setUploading] = useState(false);

  const isTutor = state.role === "tutor";
  const allDocs = state.pastPaperDocs || [];
  const docs = allDocs.filter(d => d.subject === activeSubj);
  const activeTheme = T[activeSubj] || T.eng;

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const isPdf = file.type === "application/pdf";
    const isDocx = file.name.toLowerCase().endsWith(".docx") ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (!isPdf && !isDocx) {
      dispatch({ type: "ADD_TOAST", payload: { message: "Only PDF and DOCX files are supported.", variant: "error" } });
      return;
    }
    setUploading(true);
    try {
      const path = `past-papers/${activeSubj}/${Date.now()}_${file.name}`;
      const sRef = storageRef(firebaseStorage, path);
      await uploadBytes(sRef, file);
      const url = await getDownloadURL(sRef);
      dispatch({
        type: "ADD_PAST_PAPER_DOC",
        payload: {
          name: file.name,
          url,
          subject: activeSubj,
          fileType: isPdf ? "pdf" : "docx",
          uploadedAt: new Date().toISOString().split("T")[0],
          uploadedBy: state.userProfile?.name || "Tutor",
        },
      });
      dispatch({ type: "ADD_TOAST", payload: { message: `"${file.name}" uploaded.`, variant: "success" } });
    } catch {
      dispatch({ type: "ADD_TOAST", payload: { message: "Upload failed. Please try again.", variant: "error" } });
    }
    setUploading(false);
    e.target.value = "";
  }

  function handleDelete(id) {
    if (!window.confirm("Remove this document from the folder?")) return;
    dispatch({ type: "DELETE_PAST_PAPER_DOC", payload: id });
  }

  const subjectName = SUBJECTS.find(s => s.id === activeSubj)?.name || activeSubj;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader
        title="Past Papers"
        subtitle="Upload and access past exam papers and study documents by subject"
        action={isTutor ? (
          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: T.r2, border: `1px solid ${T.accent}`, background: T.accentLight, color: T.accent, fontWeight: 700, fontSize: 12, cursor: uploading ? "wait" : "pointer", userSelect: "none" }}>
            <Upload size={14} />
            <span>{uploading ? "Uploading…" : "Upload Document"}</span>
            <input type="file" accept=".pdf,.docx" onChange={handleUpload} style={{ display: "none" }} disabled={uploading} />
          </label>
        ) : null}
      />

      {/* Subject folder tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {SUBJECTS.map(s => {
          const theme = T[s.id] || T.eng;
          const count = allDocs.filter(d => d.subject === s.id).length;
          const active = activeSubj === s.id;
          return (
            <button key={s.id} onClick={() => setActiveSubj(s.id)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: T.r2, border: `2px solid ${active ? theme.accent : T.border}`, background: active ? theme.bg : T.bgCard, color: active ? theme.accent : T.textSec, fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.15s" }}>
              <Folder size={14} />
              {s.name}
              {count > 0 && (
                <span style={{ fontSize: 10, fontWeight: 800, background: active ? theme.accent : T.bgMuted, color: active ? "#fff" : T.textTer, borderRadius: 20, padding: "1px 6px", minWidth: 18, textAlign: "center" }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Folder contents */}
      <div style={{ background: T.bgCard, borderRadius: T.r3, border: `1px solid ${T.border}`, overflow: "hidden" }}>
        {/* Folder header */}
        <div style={{ padding: "12px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8, background: T.bgMuted }}>
          <Folder size={16} color={activeTheme.accent} />
          <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{subjectName}</span>
          <span style={{ fontSize: 11, color: T.textTer }}>
            — {docs.length} document{docs.length !== 1 ? "s" : ""}
          </span>
          {isTutor && docs.length === 0 && (
            <span style={{ fontSize: 11, color: T.textTer, marginLeft: 4 }}>
              · Upload files using the button above
            </span>
          )}
        </div>

        {docs.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center", color: T.textTer }}>
            <Folder size={36} color={T.border} style={{ marginBottom: 10 }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: T.textSec, marginBottom: 4 }}>This folder is empty</div>
            <div style={{ fontSize: 12 }}>
              {isTutor
                ? "Upload a PDF or DOCX using the button above to add documents here."
                : "No documents have been uploaded for this subject yet."}
            </div>
          </div>
        ) : (
          <div>
            {docs.map((doc, i) => (
              <div key={doc.id}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderBottom: i < docs.length - 1 ? `1px solid ${T.border}` : "none" }}>
                {doc.fileType === "pdf"
                  ? <FilePdf size={22} color={T.accent} style={{ flexShrink: 0 }} />
                  : <FileDoc size={22} color={T.teal} style={{ flexShrink: 0 }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {doc.name}
                  </div>
                  <div style={{ fontSize: 10, color: T.textTer, marginTop: 2 }}>
                    {doc.fileType?.toUpperCase()} · {doc.uploadedAt}{doc.uploadedBy ? ` · ${doc.uploadedBy}` : ""}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  {doc.fileType === "pdf" && (
                    <button onClick={() => setViewingDoc({ url: doc.url, title: doc.name })}
                      style={{ padding: "5px 12px", borderRadius: T.r1, border: `1px solid ${T.border}`, background: T.bgMuted, color: T.textSec, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                      <Eye size={12} /> View
                    </button>
                  )}
                  <a href={doc.url} download target="_blank" rel="noopener noreferrer"
                    style={{ padding: "5px 12px", borderRadius: T.r1, border: `1px solid ${T.accent}`, background: T.accentLight, color: T.accent, fontSize: 11, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                    <DownloadSimple size={12} /> Download
                  </a>
                  {isTutor && (
                    <button onClick={() => handleDelete(doc.id)} aria-label="Delete document"
                      style={{ padding: "5px 8px", borderRadius: T.r1, border: `1px solid ${T.border}`, background: "transparent", color: T.textTer, cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <Trash size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {viewingDoc && <DocViewer url={viewingDoc.url} title={viewingDoc.title} onClose={() => setViewingDoc(null)} />}
    </div>
  );
}

export default PastPapers;
