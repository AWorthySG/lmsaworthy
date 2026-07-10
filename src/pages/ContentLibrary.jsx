import React, { useState, useMemo, useRef } from 'react';
import { T } from '../theme/theme.js';
import { Books, Folder, FolderOpen, FolderSimple, FilePdf, FileDoc, FileVideo, Upload, BookmarkSimple, MagnifyingGlass, Plus, X, CaretRight, Hash, Trash, SortAscending, CheckCircle, FolderSimpleStar, Link } from '../icons/icons.jsx';
import { Card, Btn, Badge, SubjectBadge, PageHeader, EmptyState, FileIcon, Input, Select, DocumentViewer } from '../components/ui';
import { SUBJECTS, TOPICS } from '../data/subjects.js';
import { getAllSavedIds, saveResourceOffline, removeResourceOffline } from '../utils/offlineCache.js';
import { getSubject, getSubjectTheme, formatDate } from '../utils/helpers.js';
import { firebaseStorage, storageRef, uploadBytesResumable, getDownloadURL } from '../config/firebase.js';

const DIFFICULTY_CONFIG = {
  easy:   { label: "Easy",   color: "#16a34a", bg: "#dcfce7" },
  medium: { label: "Medium", color: "#d97706", bg: "#fef3c7" },
  hard:   { label: "Hard",   color: "#dc2626", bg: "#fee2e2" },
};

function DifficultyBadge({ difficulty }) {
  const cfg = DIFFICULTY_CONFIG[difficulty];
  if (!cfg) return null;
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 999, background: cfg.bg, color: cfg.color, letterSpacing: 0.3 }}>
      {cfg.label}
    </span>
  );
}

function detectType(file) {
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) return 'pdf';
  if (file.name.toLowerCase().endsWith('.docx') || file.type.includes('wordprocessingml')) return 'docx';
  if (file.type.startsWith('video/') || /\.(mp4|mov|avi|mkv|webm)$/i.test(file.name)) return 'video';
  return 'pdf';
}

function titleFromFilename(name) {
  return name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim();
}

function UploadPanel({ onClose, defaultSubject, dispatch }) {
  const [mode, setMode] = useState('files'); // 'files' | 'link'
  const [uploadSubject, setUploadSubject] = useState(defaultSubject || '');
  const [uploadTopic, setUploadTopic] = useState('');
  const [queue, setQueue] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const fileInputRef = useRef(null);

  const topicSuggestions = TOPICS[uploadSubject] || [];

  function handleAddLink() {
    const url = linkUrl.trim();
    if (!uploadSubject || !uploadTopic || !url) return;
    const finalUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    dispatch({ type: "ADD_RESOURCE", payload: { title: linkTitle.trim() || finalUrl, subject: uploadSubject, topic: uploadTopic, type: "link", fileUrl: finalUrl } });
    dispatch({ type: "ADD_TOAST", payload: { message: "Link added to library.", variant: "success" } });
    setLinkUrl(''); setLinkTitle('');
    setTimeout(onClose, 400);
  }

  function addFiles(files) {
    const items = Array.from(files).map(f => ({
      uid: Math.random().toString(36).slice(2),
      file: f,
      title: titleFromFilename(f.name),
      type: detectType(f),
      progress: 0,
      status: 'pending',
    }));
    setQueue(prev => [...prev, ...items]);
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
    if (!uploadSubject || !uploadTopic || queue.filter(q => q.status === 'pending').length === 0) return;
    setIsUploading(true);
    const pending = queue.filter(q => q.status === 'pending');
    let successCount = 0;
    for (const item of pending) {
      const path = `resources/${uploadSubject}/${uploadTopic}/${Date.now()}_${item.file.name}`;
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
            dispatch({ type: "ADD_RESOURCE", payload: { title: item.title, subject: uploadSubject, topic: uploadTopic, type: item.type, fileUrl: url } });
            updateQueueItem(item.uid, { status: 'done', progress: 100 });
            successCount++;
            resolve();
          }
        );
      });
    }
    setIsUploading(false);
    if (successCount > 0) {
      dispatch({ type: "ADD_TOAST", payload: { message: `${successCount} file${successCount > 1 ? 's' : ''} uploaded successfully.`, variant: "success" } });
      setTimeout(onClose, 700);
    }
  }

  const pendingCount = queue.filter(q => q.status === 'pending').length;
  const uploadedCount = queue.filter(q => q.status === 'done').length;

  return (
    <Card elevated style={{ marginBottom: 20, borderLeft: `3px solid ${T.accent}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: 0 }}>Add Resources</h3>
        <button onClick={onClose} aria-label="Close upload panel" style={{ background: "none", border: "none", cursor: "pointer", color: T.textTer, padding: 4 }}>
          <X size={16} weight="bold" />
        </button>
      </div>
      {/* Mode toggle — upload a file, or add a live link (Google Docs/Slides, YouTube, webpage) */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[{ v: "files", label: "Upload files" }, { v: "link", label: "Add link" }].map(m => (
          <button key={m.v} onClick={() => setMode(m.v)}
            style={{ padding: "7px 16px", borderRadius: T.r1, border: `1px solid ${mode === m.v ? T.accent : T.border}`, background: mode === m.v ? T.accentLight : T.bg, color: mode === m.v ? T.accentText : T.textSec, fontSize: 12, fontWeight: mode === m.v ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>
            {m.label}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 4 }}>Subject *</label>
          <Select value={uploadSubject} onChange={setUploadSubject} options={SUBJECTS.map(s => ({ value: s.id, label: s.name }))} placeholder="Select subject" />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 4 }}>
            Topic / Folder *
            <span style={{ fontWeight: 400, textTransform: "none", marginLeft: 4, fontSize: 10 }}>— type a new name to create a folder</span>
          </label>
          <input list="topic-suggestions" value={uploadTopic} onChange={e => setUploadTopic(e.target.value)}
            placeholder={uploadSubject ? "Choose or type a topic…" : "Select subject first"} disabled={!uploadSubject}
            style={{ width: "100%", padding: "8px 12px", borderRadius: T.r1, border: `1px solid ${T.border}`, background: uploadSubject ? T.bgCard : T.bgMuted, fontSize: 13, color: T.text, outline: "none", boxSizing: "border-box", fontFamily: T.fontBody }} />
          <datalist id="topic-suggestions">
            {topicSuggestions.map(t => <option key={t} value={t} />)}
          </datalist>
        </div>
      </div>
      {mode === 'link' && (
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 4 }}>Link URL *</label>
          <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="Google Docs/Slides, YouTube, or any web link…"
            style={{ width: "100%", padding: "8px 12px", borderRadius: T.r1, border: `1px solid ${T.border}`, background: T.bgCard, fontSize: 13, color: T.text, outline: "none", boxSizing: "border-box", fontFamily: T.fontBody, marginBottom: 10 }} />
          <label style={{ fontSize: 11, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 4 }}>Title <span style={{ fontWeight: 400, textTransform: "none" }}>— optional</span></label>
          <input value={linkTitle} onChange={e => setLinkTitle(e.target.value)} placeholder="e.g. Model essay — Science & Society"
            style={{ width: "100%", padding: "8px 12px", borderRadius: T.r1, border: `1px solid ${T.border}`, background: T.bgCard, fontSize: 13, color: T.text, outline: "none", boxSizing: "border-box", fontFamily: T.fontBody }} />
          <div style={{ fontSize: 11, color: T.textTer, marginTop: 8, lineHeight: 1.5 }}>Live links always show the latest version and don't use storage. Google Docs/Slides and YouTube preview inline; other links open in a new tab. Make sure sharing is set to "anyone with the link".</div>
        </div>
      )}
      {mode === 'files' && <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{ border: `2px dashed ${dragging ? T.accent : T.border}`, borderRadius: T.r2, background: dragging ? T.accentLight : T.bgMuted, padding: "28px 20px", textAlign: "center", cursor: "pointer", marginBottom: 14, transition: "all 0.15s" }}>
        <Upload size={24} color={dragging ? T.accent : T.textTer} style={{ display: "block", margin: "0 auto 8px" }} />
        <div style={{ fontSize: 13, fontWeight: 600, color: dragging ? T.accent : T.textSec, marginBottom: 4 }}>Drop files here or click to browse</div>
        <div style={{ fontSize: 11, color: T.textTer }}>PDF, DOCX, or video files · multiple files supported</div>
        <input ref={fileInputRef} type="file" multiple accept=".pdf,.docx,.mp4,.mov,.avi,.mkv,.webm" style={{ display: "none" }}
          onChange={e => { addFiles(e.target.files); e.target.value = ''; }} />
      </div>}
      {mode === 'files' && queue.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 8 }}>
            {queue.length} file{queue.length !== 1 ? 's' : ''} queued{uploadedCount > 0 ? ` · ${uploadedCount} uploaded` : ''}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 280, overflowY: "auto" }}>
            {queue.map(item => (
              <div key={item.uid} style={{ background: T.bgMuted, borderRadius: T.r1, padding: "10px 12px", border: `1px solid ${item.status === 'error' ? T.danger : item.status === 'done' ? T.success + '60' : T.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: item.status === 'uploading' ? 6 : 0 }}>
                  <FileIcon type={item.type} size={14} />
                  <input value={item.title} onChange={e => updateQueueItem(item.uid, { title: e.target.value })}
                    disabled={item.status !== 'pending'} aria-label="File title"
                    style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 12, fontWeight: 600, color: T.text, fontFamily: T.fontBody, minWidth: 0 }} />
                  <select value={item.type} onChange={e => updateQueueItem(item.uid, { type: e.target.value })}
                    disabled={item.status !== 'pending'} aria-label="File type"
                    style={{ fontSize: 10, border: `1px solid ${T.border}`, borderRadius: 4, padding: "2px 4px", background: T.bgCard, color: T.textSec, fontFamily: T.fontBody, flexShrink: 0 }}>
                    <option value="pdf">PDF</option>
                    <option value="docx">DOCX</option>
                    <option value="video">Video</option>
                  </select>
                  {item.status === 'done' && <CheckCircle size={14} color={T.success} weight="fill" />}
                  {item.status === 'error' && <span style={{ fontSize: 11, color: T.danger, fontWeight: 600, flexShrink: 0 }}>Error</span>}
                  {item.status === 'pending' && (
                    <button onClick={() => removeFromQueue(item.uid)} aria-label="Remove file"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: T.textTer, flexShrink: 0 }}>
                      <X size={12} weight="bold" />
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
        {mode === 'files'
          ? <Btn onClick={handleUpload} disabled={!uploadSubject || !uploadTopic || pendingCount === 0 || isUploading}>
              <Upload size={14} weight="bold" />
              {isUploading ? "Uploading…" : `Upload ${pendingCount > 0 ? pendingCount + ' file' + (pendingCount !== 1 ? 's' : '') : ''}`}
            </Btn>
          : <Btn onClick={handleAddLink} disabled={!uploadSubject || !uploadTopic || !linkUrl.trim()}>
              <Link size={14} weight="bold" /> Add link
            </Btn>
        }
        <Btn onClick={onClose} variant="secondary"><X size={14} weight="bold" /> Cancel</Btn>
        {isUploading && <span style={{ fontSize: 12, color: T.textSec }}>{uploadedCount} / {queue.length} complete</span>}
      </div>
    </Card>
  );
}

function ResourceCard({ r, meta, isTutor, isBookmarked, isSaved, onView, onBookmark, onDelete, onSetDifficulty, onToggleOffline, collections, onToggleCollection }) {
  const bgByType = { pdf: T.dangerBg, video: "#DBEAFE", docx: T.accentLight, link: "#0EA5A015" };
  const difficulty = meta?.difficulty;
  const [showCollPicker, setShowCollPicker] = useState(false);
  const allCols = Array.isArray(collections) ? collections : [];
  const inCollections = allCols.filter(c => (Array.isArray(c.resourceIds) ? c.resourceIds : []).includes(r.id));
  return (
    <Card onClick={() => onView(r)} elevated style={{ padding: 16, cursor: "pointer" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: T.r1, background: bgByType[r.type] || T.bgMuted, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <FileIcon type={r.type} size={16} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 650, color: T.text, lineHeight: 1.4, marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <Badge color={T.textSec} bg={T.bgMuted} style={{ fontSize: 10 }}>{r.type.toUpperCase()}</Badge>
            {difficulty && <DifficultyBadge difficulty={difficulty} />}
            {isSaved && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 999, background: T.success + "18", color: T.success, display: "inline-flex", alignItems: "center", gap: 3 }}>
                <CheckCircle size={9} color={T.success} /> Offline
              </span>
            )}
            {inCollections.length > 0 && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 999, background: "#D4940A18", color: "#8B5C00", display: "inline-flex", alignItems: "center", gap: 3 }}>
                <FolderSimpleStar size={9} color="#8B5C00" /> {inCollections.length === 1 ? inCollections[0].name : `${inCollections.length} collections`}
              </span>
            )}
            <span style={{ fontSize: 11, color: T.textTer }}>{formatDate(r.date)}</span>
          </div>
          {isTutor && (
            <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
              {["easy", "medium", "hard"].map(d => {
                const cfg = DIFFICULTY_CONFIG[d];
                const active = difficulty === d;
                return (
                  <button key={d} onClick={() => onSetDifficulty(r.id, active ? null : d)}
                    style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, cursor: "pointer", border: `1px solid ${active ? cfg.color : T.border}`, background: active ? cfg.bg : "transparent", color: active ? cfg.color : T.textTer, transition: "all 0.12s" }}>
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 2, flexShrink: 0, position: "relative" }}>
          {onToggleOffline && r.fileUrl && r.type !== "link" && (
            <button onClick={(e) => { e.stopPropagation(); onToggleOffline(r); }} aria-label={isSaved ? "Remove from offline" : "Save for offline"}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: T.r1 }}>
              <CheckCircle size={14} weight={isSaved ? "fill" : "regular"} color={isSaved ? T.success : T.textTer} />
            </button>
          )}
          {allCols.length > 0 && onToggleCollection && (
            <button onClick={(e) => { e.stopPropagation(); setShowCollPicker(v => !v); }} aria-label="Save to collection"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: T.r1 }}>
              <FolderSimpleStar size={15} weight={inCollections.length > 0 ? "fill" : "regular"} color={inCollections.length > 0 ? "#D4940A" : T.textTer} />
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); onBookmark(r.id); }} aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: T.r1 }}>
            <BookmarkSimple size={15} weight={isBookmarked ? "fill" : "regular"} color={isBookmarked ? T.accent : T.textTer} />
          </button>
          {isTutor && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(r); }} aria-label="Delete resource"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: T.r1 }}
              onMouseEnter={(e) => e.currentTarget.style.background = T.dangerBg}
              onMouseLeave={(e) => e.currentTarget.style.background = "none"}>
              <Trash size={14} weight="bold" color={T.textTer} />
            </button>
          )}
          {showCollPicker && allCols.length > 0 && (
            <div onClick={e => e.stopPropagation()} style={{ position: "absolute", right: 0, top: "100%", zIndex: 30, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r2, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: "8px 0", minWidth: 180 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.textTer, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 12px 6px" }}>Save to Collection</div>
              {allCols.map(c => {
                const inCol = (Array.isArray(c.resourceIds) ? c.resourceIds : []).includes(r.id);
                return (
                  <button key={c.id} onClick={() => { onToggleCollection(c.id, r.id); setShowCollPicker(false); }}
                    style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "7px 12px", background: inCol ? "#D4940A12" : "transparent", border: "none", cursor: "pointer", fontSize: 12, fontWeight: inCol ? 700 : 500, color: inCol ? "#8B5C00" : T.text, textAlign: "left" }}>
                    <FolderSimpleStar size={13} weight={inCol ? "fill" : "regular"} color={inCol ? "#D4940A" : T.textTer} />
                    {c.name}
                    {inCol && <span style={{ marginLeft: "auto", fontSize: 10, color: "#D4940A" }}>Added</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function ContentLibrary({ state, dispatch, defaultSubject, enrolledSubjects }) {
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [viewingResource, setViewingResource] = useState(null);
  const [nav, setNav] = useState(defaultSubject || null);
  const [expandedSubjects, setExpandedSubjects] = useState(defaultSubject ? { [defaultSubject]: true } : {});
  const [sortBy, setSortBy] = useState("newest");
  const [typeFilter, setTypeFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [savedOfflineIds, setSavedOfflineIds] = useState(() => getAllSavedIds());
  const [offlineFilter, setOfflineFilter] = useState(false);

  const isTutor = state.role === "tutor";
  // Students only browse their enrolled subjects; tutors (enrolledSubjects null) see all.
  const visibleSubjects = useMemo(
    () => (Array.isArray(enrolledSubjects) ? SUBJECTS.filter(s => enrolledSubjects.includes(s.id)) : SUBJECTS),
    [enrolledSubjects]
  );
  const resources = useMemo(() => Array.isArray(state.resources) ? state.resources : [], [state.resources]);

  function toggleSubject(id) { setExpandedSubjects((prev) => ({ ...prev, [id]: !prev[id] })); }

  const allTopics = useMemo(() => {
    const bySubject = {};
    resources.forEach(r => {
      if (!bySubject[r.subject]) bySubject[r.subject] = new Set();
      if (r.topic) bySubject[r.subject].add(r.topic);
    });
    return bySubject;
  }, [resources]);

  const resourceCounts = useMemo(() => {
    const bySubject = {}; const byTopic = {};
    resources.forEach(r => {
      bySubject[r.subject] = (bySubject[r.subject] || 0) + 1;
      const key = `${r.subject}:${r.topic}`;
      byTopic[key] = (byTopic[key] || 0) + 1;
    });
    return { bySubject, byTopic };
  }, [resources]);

  function countBySubject(id) { return resourceCounts.bySubject[id] || 0; }
  function countByTopic(subjectId, topic) { return resourceCounts.byTopic[`${subjectId}:${topic}`] || 0; }

  const filtered = useMemo(() => {
    const meta = state.resourceMeta || {};
    let list = resources.filter((r) => {
      if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (difficultyFilter !== "all") {
        const d = meta[r.id]?.difficulty;
        if (difficultyFilter === "untagged" && d) return false;
        if (difficultyFilter !== "untagged" && d !== difficultyFilter) return false;
      }
      if (offlineFilter && !savedOfflineIds.has(r.id)) return false;
      if (nav && typeof nav === "string" && r.subject !== nav) return false;
      if (nav && typeof nav === "object" && (r.subject !== nav.subject || r.topic !== nav.topic)) return false;
      return true;
    });
    if (sortBy === "newest") list = [...list].sort((a, b) => b.date.localeCompare(a.date));
    else list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [resources, state.resourceMeta, search, nav, sortBy, typeFilter, difficultyFilter, offlineFilter, savedOfflineIds]);

  function handleDelete(r) {
    if (!window.confirm(`Delete "${r.title}"? This cannot be undone.`)) return;
    dispatch({ type: "DELETE_RESOURCE", payload: r.id });
    dispatch({ type: "ADD_TOAST", payload: { message: `"${r.title}" deleted`, variant: "error" } });
  }

  function handleSetDifficulty(id, difficulty) { dispatch({ type: "SET_RESOURCE_DIFFICULTY", payload: { id, difficulty } }); }

  async function handleToggleOffline(r) {
    if (!r.fileUrl) return;
    if (savedOfflineIds.has(r.id)) {
      removeResourceOffline(r.id, r.fileUrl);
      setSavedOfflineIds(prev => { const next = new Set(prev); next.delete(r.id); return next; });
    } else {
      await saveResourceOffline(r.id, r.fileUrl);
      setSavedOfflineIds(prev => new Set([...prev, r.id]));
    }
  }

  const isBookmarked = (id) => (state.bookmarks || []).includes(id);

  const breadcrumbs = [{ label: "All Subjects", onClick: () => setNav(null) }];
  if (nav) {
    const subjId = typeof nav === "string" ? nav : nav.subject;
    const subj = getSubject(subjId);
    breadcrumbs.push({ label: subj?.name || subjId, onClick: () => setNav(subjId) });
    if (typeof nav === "object" && nav.topic) breadcrumbs.push({ label: nav.topic, onClick: null });
  }

  let pageTitle = "Content Library";
  let pageSubtitle = `${resources.length} resources across ${visibleSubjects.length} subject${visibleSubjects.length !== 1 ? "s" : ""}`;
  if (nav && typeof nav === "string") {
    const subj = getSubject(nav);
    const count = countBySubject(nav);
    const topicCount = allTopics[nav]?.size || 0;
    pageTitle = subj?.name || nav;
    pageSubtitle = `${count} resource${count !== 1 ? "s" : ""} · ${topicCount} topic${topicCount !== 1 ? "s" : ""}`;
  }
  if (nav && typeof nav === "object") {
    const count = countByTopic(nav.subject, nav.topic);
    const subj = getSubject(nav.subject);
    pageTitle = nav.topic;
    pageSubtitle = `${count} resource${count !== 1 ? "s" : ""} in ${subj?.name || nav.subject}`;
  }

  const TYPE_FILTERS = [
    { value: "all", label: "All" }, { value: "pdf", label: "PDF" },
    { value: "video", label: "Video" }, { value: "docx", label: "DOCX" }, { value: "link", label: "Link" },
  ];
  const DIFFICULTY_FILTERS = [
    { value: "all", label: "All levels" }, { value: "easy", label: "Easy", color: "#16a34a" },
    { value: "medium", label: "Medium", color: "#d97706" }, { value: "hard", label: "Hard", color: "#dc2626" },
    { value: "untagged", label: "Untagged", color: T.textSec },
  ];
  const uploadDefaultSubject = nav && typeof nav === "string" ? nav : (nav?.subject || '');

  return (
    <div>
      {viewingResource && <DocumentViewer resource={viewingResource} onClose={() => setViewingResource(null)} />}
      <PageHeader title={pageTitle} subtitle={pageSubtitle}
        action={isTutor && <Btn onClick={() => setShowUpload(v => !v)}><Plus size={15} weight="bold" /> Upload Resource</Btn>} />
      {isTutor && showUpload && (
        <UploadPanel defaultSubject={uploadDefaultSubject} dispatch={dispatch} onClose={() => setShowUpload(false)} />
      )}
      {nav && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
          {breadcrumbs.map((bc, i) => (
            <React.Fragment key={i}>
              {i > 0 && <CaretRight size={12} weight="bold" color={T.textTer} />}
              {bc.onClick ? (
                <button onClick={bc.onClick}
                  onMouseEnter={(e) => e.currentTarget.style.background = T.bgHover}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                  style={{ background: "none", border: "none", cursor: "pointer", color: T.accent, fontSize: 13, fontWeight: 600, padding: "2px 4px", borderRadius: T.r1 }}>
                  {bc.label}
                </button>
              ) : (
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text, padding: "2px 4px" }}>{bc.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ width: 230, flexShrink: 0 }}>
          <Card elevated style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "12px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
              <FolderSimple size={15} weight="duotone" color={T.accent} />
              <span style={{ fontSize: 11, fontWeight: 700, color: T.text, letterSpacing: 0.3, textTransform: "uppercase" }}>Folders</span>
            </div>
            <button onClick={() => setNav(null)}
              onMouseEnter={(e) => { if (nav !== null) e.currentTarget.style.background = T.bgHover; }}
              onMouseLeave={(e) => { if (nav !== null) e.currentTarget.style.background = "transparent"; }}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px", border: "none", cursor: "pointer", background: nav === null ? T.accentLight : "transparent", color: nav === null ? T.accentText : T.text, fontSize: 13, fontWeight: nav === null ? 650 : 500, transition: "background 0.15s", boxShadow: nav === null ? `inset 3px 0 0 ${T.accent}` : "none" }}>
              <Books size={15} weight={nav === null ? "duotone" : "regular"} />
              All Subjects
              <span style={{ marginLeft: "auto", fontSize: 11, color: T.textTer, fontWeight: 600 }}>{resources.length}</span>
            </button>
            <div style={{ height: 1, background: T.border, margin: "4px 10px" }} />
            {visibleSubjects.map((subj) => {
              const theme = getSubjectTheme(subj.id);
              const isExpanded = expandedSubjects[subj.id];
              const isActiveSubject = nav === subj.id || (typeof nav === "object" && nav?.subject === subj.id);
              const topics = [...(allTopics[subj.id] || new Set())].filter(t => countByTopic(subj.id, t) > 0);
              const subjCount = countBySubject(subj.id);
              return (
                <div key={subj.id}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button onClick={() => toggleSubject(subj.id)} aria-label={isExpanded ? `Collapse ${subj.name}` : `Expand ${subj.name}`}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: "0 4px 0 10px", display: "flex", alignItems: "center" }}>
                      <CaretRight size={11} weight="bold" color={T.textTer}
                        style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
                    </button>
                    <button onClick={() => { setNav(subj.id); if (!expandedSubjects[subj.id]) toggleSubject(subj.id); }}
                      onMouseEnter={(e) => { if (!isActiveSubject || typeof nav === "object") e.currentTarget.style.background = T.bgHover; }}
                      onMouseLeave={(e) => { if (nav !== subj.id) e.currentTarget.style.background = "transparent"; }}
                      style={{ display: "flex", alignItems: "center", gap: 7, flex: 1, padding: "8px 10px 8px 4px", border: "none", cursor: "pointer", background: nav === subj.id ? T.accentLight : "transparent", color: nav === subj.id ? T.accentText : T.text, fontSize: 12, fontWeight: isActiveSubject ? 650 : 500, transition: "background 0.15s", borderRadius: 0, boxShadow: nav === subj.id ? `inset 3px 0 0 ${T.accent}` : "none" }}>
                      {isExpanded ? <FolderOpen size={14} weight="duotone" color={theme.accent} /> : <Folder size={14} weight="duotone" color={theme.accent} />}
                      <span style={{ flex: 1, textAlign: "left" }}>{subj.name}</span>
                      <span style={{ fontSize: 10, color: theme.text, background: theme.bg, padding: "1px 6px", borderRadius: 8, fontWeight: 700 }}>{subjCount}</span>
                    </button>
                  </div>
                  {isExpanded && topics.length > 0 && (
                    <div style={{ background: T.bgMuted }}>
                      {topics.map((topic) => {
                        const isActiveTopic = typeof nav === "object" && nav?.subject === subj.id && nav?.topic === topic;
                        const topicCount = countByTopic(subj.id, topic);
                        return (
                          <button key={topic} onClick={() => setNav({ subject: subj.id, topic })}
                            onMouseEnter={(e) => { if (!isActiveTopic) e.currentTarget.style.background = T.bgHover; }}
                            onMouseLeave={(e) => { if (!isActiveTopic) e.currentTarget.style.background = "transparent"; }}
                            style={{ display: "flex", alignItems: "center", gap: 7, width: "100%", padding: "7px 10px 7px 40px", border: "none", cursor: "pointer", background: isActiveTopic ? T.accentLight : "transparent", color: isActiveTopic ? T.accentText : T.textSec, fontSize: 12, fontWeight: isActiveTopic ? 650 : 500, transition: "background 0.15s", boxShadow: isActiveTopic ? `inset 3px 0 0 ${T.accent}` : "none" }}>
                            <Hash size={12} weight="bold" color={isActiveTopic ? T.accent : T.textTer} />
                            <span style={{ flex: 1, textAlign: "left" }}>{topic}</span>
                            <span style={{ fontSize: 10, color: T.textTer, fontWeight: 600 }}>{topicCount}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </Card>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
              <MagnifyingGlass size={15} weight="bold" color={T.textTer} style={{ position: "absolute", left: 11, top: 11 }} />
              <Input value={search} onChange={setSearch}
                placeholder={nav ? `Search in ${typeof nav === "string" ? getSubject(nav)?.name : nav.topic}...` : "Search all resources..."}
                style={{ paddingLeft: 34 }} />
            </div>
            {search && <Btn variant="ghost" onClick={() => setSearch("")}><X size={13} weight="bold" /> Clear</Btn>}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {TYPE_FILTERS.map(f => (
                <button key={f.value} onClick={() => setTypeFilter(f.value)}
                  style={{ padding: "6px 12px", borderRadius: 20, border: `1px solid ${typeFilter === f.value ? T.accent : T.border}`, background: typeFilter === f.value ? T.accentLight : T.bg, color: typeFilter === f.value ? T.accentText : T.textSec, fontSize: 12, fontWeight: typeFilter === f.value ? 650 : 500, cursor: "pointer", transition: "all 0.15s" }}>
                  {f.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {DIFFICULTY_FILTERS.map(f => {
                const active = difficultyFilter === f.value;
                const col = f.color || T.accent;
                return (
                  <button key={f.value} onClick={() => setDifficultyFilter(f.value)}
                    style={{ padding: "6px 12px", borderRadius: 20, border: `1px solid ${active ? col : T.border}`, background: active ? col + "20" : T.bg, color: active ? col : T.textSec, fontSize: 12, fontWeight: active ? 650 : 500, cursor: "pointer", transition: "all 0.15s" }}>
                    {f.label}
                  </button>
                );
              })}
            </div>
            <button onClick={() => setOfflineFilter(f => !f)}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 20, border: `1px solid ${offlineFilter ? T.success : T.border}`, background: offlineFilter ? T.success + "15" : T.bg, color: offlineFilter ? T.success : T.textSec, fontSize: 12, fontWeight: offlineFilter ? 650 : 500, cursor: "pointer", transition: "all 0.15s" }}>
              <CheckCircle size={12} weight={offlineFilter ? "fill" : "regular"} color={offlineFilter ? T.success : T.textSec} />
              Saved offline
            </button>
            <button onClick={() => setSortBy(s => s === "newest" ? "alpha" : "newest")}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 20, border: `1px solid ${T.border}`, background: T.bg, color: T.textSec, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
              <SortAscending size={13} weight="bold" />
              {sortBy === "newest" ? "Newest" : "A–Z"}
            </button>
          </div>

          {nav === null && !search && typeFilter === "all" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
              {visibleSubjects.map((subj) => {
                const theme = getSubjectTheme(subj.id);
                const subjResources = resources.filter((r) => r.subject === subj.id);
                const topics = [...(allTopics[subj.id] || new Set())];
                const pdfCount = subjResources.filter((r) => r.type === "pdf").length;
                const videoCount = subjResources.filter((r) => r.type === "video").length;
                const docxCount = subjResources.filter((r) => r.type === "docx").length;
                return (
                  <Card key={subj.id} onClick={() => { setNav(subj.id); if (!expandedSubjects[subj.id]) toggleSubject(subj.id); }} elevated style={{ cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 42, height: 42, borderRadius: T.r2, background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FolderOpen size={20} weight="duotone" color={theme.accent} />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{subj.name}</div>
                        <div style={{ fontSize: 12, color: T.textTer, marginTop: 2 }}>{topics.length} topic{topics.length !== 1 ? "s" : ""} · {subjResources.length} resource{subjResources.length !== 1 ? "s" : ""}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                      {pdfCount > 0 && <Badge color="#DC2626" bg={T.dangerBg} style={{ fontSize: 10 }}><FilePdf size={11} weight="bold" /> {pdfCount} PDF</Badge>}
                      {videoCount > 0 && <Badge color="#2563EB" bg="#DBEAFE" style={{ fontSize: 10 }}><FileVideo size={11} weight="bold" /> {videoCount} Video</Badge>}
                      {docxCount > 0 && <Badge color={T.accentText} bg={T.accentLight} style={{ fontSize: 10 }}><FileDoc size={11} weight="bold" /> {docxCount} DOCX</Badge>}
                      {subjResources.length === 0 && <span style={{ fontSize: 11, color: T.textTer }}>No resources yet</span>}
                    </div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {topics.slice(0, 4).map((t) => (<span key={t} style={{ fontSize: 10, color: T.textSec, background: T.bgMuted, padding: "3px 8px", borderRadius: 8, fontWeight: 500 }}>{t}</span>))}
                      {topics.length > 4 && <span style={{ fontSize: 10, color: T.textTer, padding: "3px 4px" }}>+{topics.length - 4} more</span>}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {nav && typeof nav === "string" && !search && typeFilter === "all" && (() => {
            const allSubjResources = resources.filter(r => r.subject === nav);
            if (allSubjResources.length === 0) return (
              <EmptyState icon={Books}
                message={`No resources yet for ${getSubject(nav)?.name || nav}`}
                action={isTutor ? <Btn onClick={() => setShowUpload(true)}><Plus size={14} weight="bold" /> Upload First Resource</Btn> : null} />
            );
            const populatedTopics = [...(allTopics[nav] || new Set())].filter(t => countByTopic(nav, t) > 0);
            return (
              <div>
                {populatedTopics.map((topic) => {
                  const topicResources = resources.filter((r) => r.subject === nav && r.topic === topic);
                  const theme = getSubjectTheme(nav);
                  return (
                    <div key={topic} style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                        <button onClick={() => setNav({ subject: nav, topic })}
                          onMouseEnter={(e) => e.currentTarget.style.color = T.accent}
                          onMouseLeave={(e) => e.currentTarget.style.color = T.text}
                          style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0, color: T.text, transition: "color 0.15s" }}>
                          <div style={{ width: 26, height: 26, borderRadius: T.r1, background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Hash size={13} weight="bold" color={theme.accent} />
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 700 }}>{topic}</span>
                          <span style={{ fontSize: 12, color: T.textTer, fontWeight: 500 }}>{topicResources.length} resource{topicResources.length !== 1 ? "s" : ""}</span>
                          <CaretRight size={13} weight="bold" color={T.textTer} />
                        </button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
                        {topicResources.map((r) => (
                          <ResourceCard key={r.id} r={r} meta={(state.resourceMeta || {})[r.id]} isTutor={isTutor}
                            isBookmarked={isBookmarked(r.id)} isSaved={savedOfflineIds.has(r.id)}
                            onView={setViewingResource}
                            onBookmark={(id) => dispatch({ type: "TOGGLE_BOOKMARK", payload: id })}
                            onDelete={handleDelete} onSetDifficulty={handleSetDifficulty} onToggleOffline={handleToggleOffline}
                            collections={state.collections} onToggleCollection={(cId, rId) => dispatch({ type: "TOGGLE_COLLECTION_RESOURCE", payload: { collectionId: cId, resourceId: rId } })} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {(nav && typeof nav === "object") || search || typeFilter !== "all" || difficultyFilter !== "all" || offlineFilter ? (
            <div>
              {filtered.length === 0
                ? <EmptyState icon={Books} message="No resources match your filters" />
                : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                    {filtered.map((r) => (
                      <div key={r.id}>
                        {search && <div style={{ marginBottom: 4 }}><SubjectBadge subjectId={r.subject} small /></div>}
                        <ResourceCard r={r} meta={(state.resourceMeta || {})[r.id]} isTutor={isTutor}
                          isBookmarked={isBookmarked(r.id)} isSaved={savedOfflineIds.has(r.id)}
                          onView={setViewingResource}
                          onBookmark={(id) => dispatch({ type: "TOGGLE_BOOKMARK", payload: id })}
                          onDelete={handleDelete} onSetDifficulty={handleSetDifficulty} onToggleOffline={handleToggleOffline}
                          collections={state.collections} onToggleCollection={(cId, rId) => dispatch({ type: "TOGGLE_COLLECTION_RESOURCE", payload: { collectionId: cId, resourceId: rId } })} />
                      </div>
                    ))}
                  </div>
                )
              }
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ContentLibrary;
