import React, { useState, useMemo } from 'react';
import { T } from '../theme/theme.js';
import { Books, Folder, FolderOpen, FolderSimple, FilePdf, FileDoc, FileVideo, Upload, Tag, BookmarkSimple, MagnifyingGlass, Plus, X, CaretRight, Hash, Trash, SortAscending } from '../icons/icons.jsx';
import { Card, Btn, Badge, SubjectBadge, PageHeader, EmptyState, FileIcon, Input, Select, DocumentViewer } from '../components/ui';
import { SUBJECTS, TOPICS } from '../data/subjects.js';
import { getSubject, getSubjectTheme, formatDate } from '../utils/helpers.js';

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

function ResourceCard({ r, meta, isTutor, isBookmarked, onView, onBookmark, onDelete, onSetDifficulty }) {
  const bgByType = { pdf: T.dangerBg, video: "#DBEAFE", docx: T.accentLight };
  const difficulty = meta?.difficulty;
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
        <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
          <button onClick={(e) => { e.stopPropagation(); onBookmark(r.id); }}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: T.r1 }}>
            <BookmarkSimple size={15} weight={isBookmarked ? "fill" : "regular"} color={isBookmarked ? T.accent : T.textTer} />
          </button>
          {isTutor && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(r); }}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: T.r1 }}
              onMouseEnter={(e) => e.currentTarget.style.background = T.dangerBg}
              onMouseLeave={(e) => e.currentTarget.style.background = "none"}>
              <Trash size={14} weight="bold" color={T.textTer} />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}

function ContentLibrary({ state, dispatch, defaultSubject }) {
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [viewingResource, setViewingResource] = useState(null);
  const [newTitle, setNewTitle] = useState(""); const [newSubject, setNewSubject] = useState(""); const [newTopic, setNewTopic] = useState(""); const [newType, setNewType] = useState("pdf");
  const [nav, setNav] = useState(defaultSubject || null);
  const [expandedSubjects, setExpandedSubjects] = useState(defaultSubject ? { [defaultSubject]: true } : {});
  const [sortBy, setSortBy] = useState("newest");
  const [typeFilter, setTypeFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const isTutor = true;

  function toggleSubject(id) { setExpandedSubjects((prev) => ({ ...prev, [id]: !prev[id] })); }

  const resourceCounts = useMemo(() => {
    const bySubject = {}; const byTopic = {};
    state.resources.forEach(r => {
      bySubject[r.subject] = (bySubject[r.subject] || 0) + 1;
      const key = `${r.subject}:${r.topic}`;
      byTopic[key] = (byTopic[key] || 0) + 1;
    });
    return { bySubject, byTopic };
  }, [state.resources]);

  function countBySubject(id) { return resourceCounts.bySubject[id] || 0; }
  function countByTopic(subjectId, topic) { return resourceCounts.byTopic[`${subjectId}:${topic}`] || 0; }

  const filtered = useMemo(() => {
    const meta = state.resourceMeta || {};
    let list = state.resources.filter((r) => {
      if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (difficultyFilter !== "all") {
        const d = meta[r.id]?.difficulty;
        if (difficultyFilter === "untagged" && d) return false;
        if (difficultyFilter !== "untagged" && d !== difficultyFilter) return false;
      }
      if (nav && typeof nav === "string" && r.subject !== nav) return false;
      if (nav && typeof nav === "object" && (r.subject !== nav.subject || r.topic !== nav.topic)) return false;
      return true;
    });
    if (sortBy === "newest") list = [...list].sort((a, b) => b.date.localeCompare(a.date));
    else list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [state.resources, state.resourceMeta, search, nav, sortBy, typeFilter, difficultyFilter]);

  function handleUpload() {
    if (!newTitle || !newSubject || !newTopic) return;
    dispatch({ type: "ADD_RESOURCE", payload: { title: newTitle, subject: newSubject, topic: newTopic, type: newType } });
    dispatch({ type: "ADD_TOAST", payload: { message: `"${newTitle}" added`, variant: "success" } });
    setNewTitle(""); setNewSubject(""); setNewTopic(""); setNewType("pdf"); setShowUpload(false);
  }

  function handleDelete(r) {
    if (!window.confirm(`Delete "${r.title}"? This cannot be undone.`)) return;
    dispatch({ type: "DELETE_RESOURCE", payload: r.id });
    dispatch({ type: "ADD_TOAST", payload: { message: `"${r.title}" deleted`, variant: "error" } });
  }

  function handleSetDifficulty(id, difficulty) {
    dispatch({ type: "SET_RESOURCE_DIFFICULTY", payload: { id, difficulty } });
  }

  const isBookmarked = (id) => state.bookmarks.includes(id);

  // Breadcrumb
  const breadcrumbs = [{ label: "All Subjects", onClick: () => setNav(null) }];
  if (nav) {
    const subjId = typeof nav === "string" ? nav : nav.subject;
    const subj = getSubject(subjId);
    breadcrumbs.push({ label: subj?.name || subjId, onClick: () => setNav(subjId) });
    if (typeof nav === "object" && nav.topic) breadcrumbs.push({ label: nav.topic, onClick: null });
  }

  let pageTitle = "Content Library";
  let pageSubtitle = `${state.resources.length} resources across ${SUBJECTS.length} subjects`;
  if (nav && typeof nav === "string") {
    const subj = getSubject(nav);
    const count = countBySubject(nav);
    pageTitle = subj?.name || nav;
    pageSubtitle = `${count} resource${count !== 1 ? "s" : ""} · ${(TOPICS[nav] || []).length} topics`;
  }
  if (nav && typeof nav === "object") {
    const count = countByTopic(nav.subject, nav.topic);
    const subj = getSubject(nav.subject);
    pageTitle = nav.topic;
    pageSubtitle = `${count} resource${count !== 1 ? "s" : ""} in ${subj?.name || nav.subject}`;
  }

  const TYPE_FILTERS = [
    { value: "all", label: "All" },
    { value: "pdf", label: "PDF" },
    { value: "video", label: "Video" },
    { value: "docx", label: "DOCX" },
  ];

  const DIFFICULTY_FILTERS = [
    { value: "all",      label: "All levels" },
    { value: "easy",     label: "Easy",     color: "#16a34a" },
    { value: "medium",   label: "Medium",   color: "#d97706" },
    { value: "hard",     label: "Hard",     color: "#dc2626" },
    { value: "untagged", label: "Untagged", color: T.textSec },
  ];

  return (
    <div>
      {viewingResource && <DocumentViewer resource={viewingResource} onClose={() => setViewingResource(null)} />}

      <PageHeader title={pageTitle} subtitle={pageSubtitle}
        action={isTutor && <Btn onClick={() => setShowUpload(!showUpload)}><Plus size={15} weight="bold" /> Add Resource</Btn>} />

      {/* Breadcrumb */}
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

      {isTutor && showUpload && (
        <Card elevated style={{ marginBottom: 20, borderLeft: `3px solid ${T.accent}` }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: "0 0 14px" }}>Add New Resource</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <Input value={newTitle} onChange={setNewTitle} placeholder="Resource title" />
            <Select value={newType} onChange={setNewType} options={[{ value: "pdf", label: "PDF" }, { value: "docx", label: "DOCX" }, { value: "video", label: "Video" }]} />
            <Select value={newSubject} onChange={setNewSubject} options={SUBJECTS.map((s) => ({ value: s.id, label: s.name }))} placeholder="Select subject" />
            <Select value={newTopic} onChange={setNewTopic} options={(TOPICS[newSubject] || []).map((t) => ({ value: t, label: t }))} placeholder="Select topic" />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={handleUpload}><Upload size={14} weight="bold" /> Add</Btn>
            <Btn onClick={() => setShowUpload(false)} variant="secondary"><X size={14} weight="bold" /> Cancel</Btn>
          </div>
        </Card>
      )}

      <div style={{ display: "flex", gap: 20 }}>
        {/* Sidebar */}
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
              <span style={{ marginLeft: "auto", fontSize: 11, color: T.textTer, fontWeight: 600 }}>{state.resources.length}</span>
            </button>

            <div style={{ height: 1, background: T.border, margin: "4px 10px" }} />

            {SUBJECTS.map((subj) => {
              const theme = getSubjectTheme(subj.id);
              const isExpanded = expandedSubjects[subj.id];
              const isActiveSubject = nav === subj.id || (typeof nav === "object" && nav?.subject === subj.id);
              const topics = (TOPICS[subj.id] || []).filter(t => countByTopic(subj.id, t) > 0);
              const subjCount = countBySubject(subj.id);
              return (
                <div key={subj.id}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button onClick={() => toggleSubject(subj.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: "0 4px 0 10px", display: "flex", alignItems: "center" }}>
                      <CaretRight size={11} weight="bold" color={T.textTer}
                        style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
                    </button>
                    <button onClick={() => { setNav(subj.id); if (!expandedSubjects[subj.id]) toggleSubject(subj.id); }}
                      onMouseEnter={(e) => { if (!isActiveSubject || typeof nav === "object") e.currentTarget.style.background = T.bgHover; }}
                      onMouseLeave={(e) => { if (nav !== subj.id) e.currentTarget.style.background = "transparent"; }}
                      style={{ display: "flex", alignItems: "center", gap: 7, flex: 1, padding: "8px 10px 8px 4px", border: "none", cursor: "pointer", background: nav === subj.id ? T.accentLight : "transparent", color: nav === subj.id ? T.accentText : T.text, fontSize: 12, fontWeight: isActiveSubject ? 650 : 500, transition: "background 0.15s", borderRadius: 0, boxShadow: nav === subj.id ? `inset 3px 0 0 ${T.accent}` : "none" }}>
                      {isExpanded
                        ? <FolderOpen size={14} weight="duotone" color={theme.accent} />
                        : <Folder size={14} weight="duotone" color={theme.accent} />
                      }
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

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Search + filter bar */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
              <MagnifyingGlass size={15} weight="bold" color={T.textTer} style={{ position: "absolute", left: 11, top: 11 }} />
              <Input value={search} onChange={setSearch}
                placeholder={nav ? `Search in ${typeof nav === "string" ? getSubject(nav)?.name : nav.topic}...` : "Search all resources..."}
                style={{ paddingLeft: 34 }} />
            </div>
            {search && <Btn variant="ghost" onClick={() => setSearch("")}><X size={13} weight="bold" /> Clear</Btn>}
            {/* Type filter pills */}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {TYPE_FILTERS.map(f => (
                <button key={f.value} onClick={() => setTypeFilter(f.value)}
                  style={{ padding: "6px 12px", borderRadius: 20, border: `1px solid ${typeFilter === f.value ? T.accent : T.border}`, background: typeFilter === f.value ? T.accentLight : T.bg, color: typeFilter === f.value ? T.accentText : T.textSec, fontSize: 12, fontWeight: typeFilter === f.value ? 650 : 500, cursor: "pointer", transition: "all 0.15s" }}>
                  {f.label}
                </button>
              ))}
            </div>
            {/* Difficulty filter pills */}
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
            {/* Sort toggle */}
            <button onClick={() => setSortBy(s => s === "newest" ? "alpha" : "newest")}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 20, border: `1px solid ${T.border}`, background: T.bg, color: T.textSec, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
              <SortAscending size={13} weight="bold" />
              {sortBy === "newest" ? "Newest" : "A–Z"}
            </button>
          </div>

          {/* Root: subject folder cards */}
          {nav === null && !search && typeFilter === "all" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
              {SUBJECTS.map((subj) => {
                const theme = getSubjectTheme(subj.id);
                const subjResources = state.resources.filter((r) => r.subject === subj.id);
                const topics = TOPICS[subj.id] || [];
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
                        <div style={{ fontSize: 12, color: T.textTer, marginTop: 2 }}>
                          {topics.length} topics · {subjResources.length} resources
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                      {pdfCount > 0 && <Badge color="#DC2626" bg={T.dangerBg} style={{ fontSize: 10 }}><FilePdf size={11} weight="bold" /> {pdfCount} PDF</Badge>}
                      {videoCount > 0 && <Badge color="#2563EB" bg="#DBEAFE" style={{ fontSize: 10 }}><FileVideo size={11} weight="bold" /> {videoCount} Video</Badge>}
                      {docxCount > 0 && <Badge color={T.accentText} bg={T.accentLight} style={{ fontSize: 10 }}><FileDoc size={11} weight="bold" /> {docxCount} DOCX</Badge>}
                      {subjResources.length === 0 && <span style={{ fontSize: 11, color: T.textTer }}>No resources yet</span>}
                    </div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {topics.slice(0, 4).map((t) => (
                        <span key={t} style={{ fontSize: 10, color: T.textSec, background: T.bgMuted, padding: "3px 8px", borderRadius: 8, fontWeight: 500 }}>{t}</span>
                      ))}
                      {topics.length > 4 && <span style={{ fontSize: 10, color: T.textTer, padding: "3px 4px" }}>+{topics.length - 4} more</span>}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Subject view: grouped by topic, only topics with resources */}
          {nav && typeof nav === "string" && !search && typeFilter === "all" && (() => {
            const allSubjResources = state.resources.filter(r => r.subject === nav);
            if (allSubjResources.length === 0) return (
              <EmptyState icon={Books}
                message={`No resources yet for ${getSubject(nav)?.name || nav}`}
                action={isTutor ? <Btn onClick={() => { setNewSubject(nav); setShowUpload(true); }}><Plus size={14} weight="bold" /> Add First Resource</Btn> : null} />
            );
            const populatedTopics = (TOPICS[nav] || []).filter(t => countByTopic(nav, t) > 0);
            return (
              <div>
                {populatedTopics.map((topic) => {
                  const topicResources = state.resources.filter((r) => r.subject === nav && r.topic === topic);
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
                            isBookmarked={isBookmarked(r.id)}
                            onView={setViewingResource}
                            onBookmark={(id) => dispatch({ type: "TOGGLE_BOOKMARK", payload: id })}
                            onDelete={handleDelete} onSetDifficulty={handleSetDifficulty} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* Topic view or filtered/searched results */}
          {(nav && typeof nav === "object") || search || typeFilter !== "all" || difficultyFilter !== "all" ? (
            <div>
              {filtered.length === 0
                ? <EmptyState icon={Books} message="No resources match your filters" />
                : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                    {filtered.map((r) => (
                      <div key={r.id}>
                        {search && <div style={{ marginBottom: 4 }}><SubjectBadge subjectId={r.subject} small /></div>}
                        <ResourceCard r={r} meta={(state.resourceMeta || {})[r.id]} isTutor={isTutor}
                          isBookmarked={isBookmarked(r.id)}
                          onView={setViewingResource}
                          onBookmark={(id) => dispatch({ type: "TOGGLE_BOOKMARK", payload: id })}
                          onDelete={handleDelete} onSetDifficulty={handleSetDifficulty} />
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
