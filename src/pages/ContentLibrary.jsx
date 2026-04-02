import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { T } from '../theme/theme.js';
import { Books, BookOpen, Folder, FolderOpen, FilePdf, FileDoc, FileVideo, Upload, DownloadSimple, Tag, BookmarkSimple, MagnifyingGlass, Plus, X, ArrowLeft, CaretRight, CheckCircle } from '../icons/icons.jsx';
import { Card, Btn, Badge, SubjectBadge, Progress, PageHeader, BackBtn, EmptyState, FileIcon, Input, Select, Textarea, DocumentViewer } from '../components/ui';
import { SUBJECTS, TOPICS } from '../data/subjects.js';
import { getSubject, formatDate } from '../utils/helpers.js';

function ContentLibrary({ state, dispatch }) {
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [viewingResource, setViewingResource] = useState(null);
  const [nT, snT] = useState(""); const [nS, snS] = useState(""); const [nTo, snTo] = useState(""); const [nTy, snTy] = useState("pdf");
  // Navigation: null = all subjects view, "eng" = subject view, { subject: "eng", topic: "Comprehension" } = topic view
  const [nav, setNav] = useState(null);
  // Track which subject folders are expanded in the sidebar
  const [expandedSubjects, setExpandedSubjects] = useState({});

  function toggleSubject(id) { setExpandedSubjects((prev) => ({ ...prev, [id]: !prev[id] })); }

  // Compute resource counts
  function countBySubject(subjectId) { return state.resources.filter((r) => r.subject === subjectId).length; }
  function countByTopic(subjectId, topic) { return state.resources.filter((r) => r.subject === subjectId && r.topic === topic).length; }

  // Filtered resources based on current navigation + search
  const filtered = state.resources.filter((r) => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (nav && typeof nav === "string") { if (r.subject !== nav) return false; }
    if (nav && typeof nav === "object") { if (r.subject !== nav.subject || r.topic !== nav.topic) return false; }
    return true;
  });

  function handleUpload() {
    if (!nT || !nS || !nTo) return;
    dispatch({ type: "ADD_RESOURCE", payload: { title: nT, subject: nS, topic: nTo, type: nTy } });
    dispatch({ type: "ADD_TOAST", payload: { message: `"${nT}" uploaded`, variant: "success" } });
    snT(""); snS(""); snTo(""); snTy("pdf"); setShowUpload(false);
  }
  const isBookmarked = (id) => state.bookmarks.includes(id);

  // Breadcrumb
  const breadcrumbs = [];
  breadcrumbs.push({ label: "All Subjects", onClick: () => setNav(null) });
  if (nav) {
    const subjId = typeof nav === "string" ? nav : nav.subject;
    const subj = getSubject(subjId);
    breadcrumbs.push({ label: subj?.name || subjId, onClick: () => setNav(subjId) });
    if (typeof nav === "object" && nav.topic) {
      breadcrumbs.push({ label: nav.topic, onClick: null });
    }
  }

  // Current title/subtitle
  let pageTitle = "Content Library";
  let pageSubtitle = `${state.resources.length} resources across ${SUBJECTS.length} subjects`;
  if (nav && typeof nav === "string") {
    const subj = getSubject(nav);
    pageTitle = subj?.name || nav;
    const count = countBySubject(nav);
    pageSubtitle = `${count} resource${count !== 1 ? "s" : ""} · ${(TOPICS[nav] || []).length} topics`;
  }
  if (nav && typeof nav === "object") {
    pageTitle = nav.topic;
    const count = countByTopic(nav.subject, nav.topic);
    const subj = getSubject(nav.subject);
    pageSubtitle = `${count} resource${count !== 1 ? "s" : ""} in ${subj?.name || nav.subject}`;
  }

  return (
    <div>
      {viewingResource && <DocumentViewer resource={viewingResource} onClose={() => setViewingResource(null)} />}

      <PageHeader title={pageTitle} subtitle={pageSubtitle} action={<Btn onClick={() => setShowUpload(!showUpload)}><Plus size={15} weight="bold" /> Upload Resource</Btn>} />

      {/* Breadcrumb */}
      {nav && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
          {breadcrumbs.map((bc, i) => (
            <React.Fragment key={i}>
              {i > 0 && <CaretRight size={12} weight="bold" color={T.textTer} />}
              {bc.onClick ? (
                <button onClick={bc.onClick} style={{ background: "none", border: "none", cursor: "pointer", color: i === breadcrumbs.length - 1 ? T.text : T.accent, fontSize: 13, fontWeight: 600, padding: "2px 4px", borderRadius: T.r1 }}
                  onMouseEnter={(e) => { if (bc.onClick) e.currentTarget.style.background = T.bgHover; }}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}>
                  {bc.label}
                </button>
              ) : (
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text, padding: "2px 4px" }}>{bc.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {showUpload && (
        <Card elevated style={{ marginBottom: 20, borderLeft: `3px solid ${T.accent}` }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: "0 0 14px" }}>Upload New Resource</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <Input value={nT} onChange={snT} placeholder="Resource title" />
            <Select value={nTy} onChange={snTy} options={[{ value: "pdf", label: "PDF" }, { value: "docx", label: "DOCX" }, { value: "video", label: "Video" }]} />
            <Select value={nS} onChange={snS} options={SUBJECTS.map((s) => ({ value: s.id, label: s.name }))} placeholder="Select subject" />
            <Select value={nTo} onChange={snTo} options={(TOPICS[nS] || []).map((t) => ({ value: t, label: t }))} placeholder="Select topic" />
          </div>
          <div style={{ display: "flex", gap: 8 }}><Btn onClick={handleUpload}><Upload size={14} weight="bold" /> Upload</Btn><Btn onClick={() => setShowUpload(false)} variant="secondary"><X size={14} weight="bold" /> Cancel</Btn></div>
        </Card>
      )}

      <div style={{ display: "flex", gap: 20 }}>
        {/* Sidebar folder tree */}
        <div style={{ width: 240, flexShrink: 0 }}>
          <Card elevated style={{ padding: 0, overflow: "hidden" }}>
            {/* Sidebar header */}
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
              <FolderSimple size={16} weight="duotone" color={T.accent} />
              <span style={{ fontSize: 12, fontWeight: 700, color: T.text, letterSpacing: 0.2, textTransform: "uppercase" }}>Folders</span>
            </div>

            {/* All Subjects root */}
            <button onClick={() => setNav(null)}
              onMouseEnter={(e) => { if (nav !== null) e.currentTarget.style.background = T.bgHover; }}
              onMouseLeave={(e) => { if (nav !== null) e.currentTarget.style.background = "transparent"; }}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 16px", border: "none", cursor: "pointer", background: nav === null ? T.accentLight : "transparent", color: nav === null ? T.accentText : T.text, fontSize: 13, fontWeight: nav === null ? 650 : 500, transition: "all 0.15s", boxShadow: nav === null ? `inset 3px 0 0 ${T.accent}` : "none" }}>
              <Books size={16} weight={nav === null ? "duotone" : "regular"} />
              All Subjects
              <span style={{ marginLeft: "auto", fontSize: 11, color: T.textTer, fontWeight: 600 }}>{state.resources.length}</span>
            </button>

            <div style={{ height: 1, background: T.border, margin: "4px 12px" }} />

            {/* Subject folders */}
            {SUBJECTS.map((subj) => {
              const theme = getSubjectTheme(subj.id);
              const isExpanded = expandedSubjects[subj.id];
              const isActiveSubject = nav === subj.id || (typeof nav === "object" && nav?.subject === subj.id);
              const topics = TOPICS[subj.id] || [];
              const subjCount = countBySubject(subj.id);
              return (
                <div key={subj.id}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {/* Expand/collapse toggle */}
                    <button onClick={() => toggleSubject(subj.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: "0 4px 0 12px", display: "flex", alignItems: "center" }}>
                      <CaretRight size={12} weight="bold" color={T.textTer}
                        style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
                    </button>
                    {/* Subject folder button */}
                    <button onClick={() => { setNav(subj.id); if (!expandedSubjects[subj.id]) toggleSubject(subj.id); }}
                      onMouseEnter={(e) => { if (!isActiveSubject || typeof nav === "object") e.currentTarget.style.background = T.bgHover; }}
                      onMouseLeave={(e) => { if (nav !== subj.id) e.currentTarget.style.background = "transparent"; }}
                      style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, padding: "9px 12px 9px 4px", border: "none", cursor: "pointer", background: nav === subj.id ? T.accentLight : "transparent", color: nav === subj.id ? T.accentText : T.text, fontSize: 13, fontWeight: isActiveSubject ? 650 : 500, transition: "all 0.15s", borderRadius: 0, boxShadow: nav === subj.id ? `inset 3px 0 0 ${T.accent}` : "none" }}>
                      {isExpanded
                        ? <FolderOpen size={16} weight="duotone" color={theme.accent} />
                        : <Folder size={16} weight="duotone" color={theme.accent} />
                      }
                      <span style={{ flex: 1, textAlign: "left" }}>{subj.name}</span>
                      <span style={{ fontSize: 10, color: theme.text, background: theme.bg, padding: "2px 7px", borderRadius: 10, fontWeight: 700 }}>{subjCount}</span>
                    </button>
                  </div>

                  {/* Topic sub-folders (expandable) */}
                  {isExpanded && (
                    <div style={{ background: T.bgMuted }}>
                      {topics.map((topic) => {
                        const isActiveTopic = typeof nav === "object" && nav?.subject === subj.id && nav?.topic === topic;
                        const topicCount = countByTopic(subj.id, topic);
                        return (
                          <button key={topic} onClick={() => setNav({ subject: subj.id, topic })}
                            onMouseEnter={(e) => { if (!isActiveTopic) e.currentTarget.style.background = T.bgHover; }}
                            onMouseLeave={(e) => { if (!isActiveTopic) e.currentTarget.style.background = "transparent"; }}
                            style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px 8px 44px", border: "none", cursor: "pointer", background: isActiveTopic ? T.accentLight : "transparent", color: isActiveTopic ? T.accentText : T.textSec, fontSize: 12, fontWeight: isActiveTopic ? 650 : 500, transition: "all 0.15s", boxShadow: isActiveTopic ? `inset 3px 0 0 ${T.accent}` : "none" }}>
                            <Hash size={13} weight="bold" color={isActiveTopic ? T.accent : T.textTer} />
                            <span style={{ flex: 1, textAlign: "left" }}>{topic}</span>
                            {topicCount > 0 && <span style={{ fontSize: 10, color: T.textTer, fontWeight: 600 }}>{topicCount}</span>}
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

        {/* Main content area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Search bar */}
          <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <MagnifyingGlass size={16} weight="bold" color={T.textTer} style={{ position: "absolute", left: 12, top: 11 }} />
              <Input value={search} onChange={setSearch} placeholder={nav ? `Search in ${typeof nav === "string" ? getSubject(nav)?.name : nav.topic}...` : "Search all resources..."} style={{ paddingLeft: 36 }} />
            </div>
            {search && <Btn variant="ghost" onClick={() => setSearch("")}><X size={14} weight="bold" /> Clear</Btn>}
          </div>

          {/* Subject folder cards (shown when nav is null and no search) */}
          {nav === null && !search && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, marginBottom: 24 }}>
                {SUBJECTS.map((subj) => {
                  const theme = getSubjectTheme(subj.id);
                  const subjResources = state.resources.filter((r) => r.subject === subj.id);
                  const topics = TOPICS[subj.id] || [];
                  const pdfCount = subjResources.filter((r) => r.type === "pdf").length;
                  const videoCount = subjResources.filter((r) => r.type === "video").length;
                  const docxCount = subjResources.filter((r) => r.type === "docx").length;
                  return (
                    <Card key={subj.id} onClick={() => { setNav(subj.id); if (!expandedSubjects[subj.id]) toggleSubject(subj.id); }} elevated>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: T.r2, background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <FolderOpen size={22} weight="duotone" color={theme.accent} />
                        </div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{subj.name}</div>
                          <div style={{ fontSize: 12, color: T.textTer, marginTop: 2 }}>{topics.length} topics · {subjResources.length} resources</div>
                        </div>
                      </div>
                      {/* File type breakdown */}
                      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                        {pdfCount > 0 && <Badge color="#DC2626" bg={T.dangerBg} style={{ fontSize: 10 }}><FilePdf size={12} weight="bold" /> {pdfCount} PDF</Badge>}
                        {videoCount > 0 && <Badge color="#2563EB" bg="#DBEAFE" style={{ fontSize: 10 }}><FileVideo size={12} weight="bold" /> {videoCount} Video</Badge>}
                        {docxCount > 0 && <Badge color={T.accentText} bg={T.accentLight} style={{ fontSize: 10 }}><FileDoc size={12} weight="bold" /> {docxCount} DOCX</Badge>}
                      </div>
                      {/* Topic preview */}
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
            </div>
          )}

          {/* Topic section cards (shown when a subject is selected, no specific topic, no search) */}
          {nav && typeof nav === "string" && !search && (
            <div>
              {(TOPICS[nav] || []).map((topic) => {
                const topicResources = state.resources.filter((r) => r.subject === nav && r.topic === topic);
                const theme = getSubjectTheme(nav);
                if (topicResources.length === 0) return (
                  <div key={topic} style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, padding: "8px 0" }}>
                      <Hash size={15} weight="bold" color={T.textTer} />
                      <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{topic}</span>
                      <span style={{ fontSize: 11, color: T.textTer, marginLeft: 4 }}>0 resources</span>
                    </div>
                    <div style={{ padding: "20px 0", textAlign: "center", color: T.textTer, fontSize: 13, background: T.bgMuted, borderRadius: T.r2, border: `1px dashed ${T.border}` }}>No resources yet</div>
                  </div>
                );
                return (
                  <div key={topic} style={{ marginBottom: 24 }}>
                    {/* Topic header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, padding: "4px 0" }}>
                      <button onClick={() => setNav({ subject: nav, topic })}
                        onMouseEnter={(e) => e.currentTarget.style.color = T.accent}
                        onMouseLeave={(e) => e.currentTarget.style.color = T.text}
                        style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0, color: T.text, transition: "color 0.15s" }}>
                        <div style={{ width: 28, height: 28, borderRadius: T.r1, background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Hash size={14} weight="bold" color={theme.accent} />
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 700 }}>{topic}</span>
                        <span style={{ fontSize: 12, color: T.textTer, fontWeight: 500 }}>{topicResources.length} resource{topicResources.length !== 1 ? "s" : ""}</span>
                        <CaretRight size={14} weight="bold" color={T.textTer} />
                      </button>
                    </div>
                    {/* Resources row */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                      {topicResources.map((r) => (
                        <Card key={r.id} onClick={() => setViewingResource(r)} elevated style={{ padding: 16 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: T.r1, background: r.type === "pdf" ? T.dangerBg : r.type === "video" ? "#DBEAFE" : T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <FileIcon type={r.type} size={16} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, lineHeight: 1.4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</div>
                              <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
                                <Badge color={T.textSec} bg={T.bgMuted} style={{ fontSize: 9 }}>{r.type.toUpperCase()}</Badge>
                                <span style={{ fontSize: 11, color: T.textTer }}>{formatDate(r.date)}</span>
                              </div>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); dispatch({ type: "TOGGLE_BOOKMARK", payload: r.id }); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}>
                              <BookmarkSimple size={16} weight={isBookmarked(r.id) ? "fill" : "regular"} color={isBookmarked(r.id) ? T.accent : T.textTer} />
                            </button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Individual topic view or search results — show resource cards */}
          {((nav && typeof nav === "object") || search) && (
            <div>
              {filtered.length === 0 ? <EmptyState icon={Books} message="No resources found" /> : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                  {filtered.map((r) => (
                    <Card key={r.id} onClick={() => setViewingResource(r)} elevated>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                        <div style={{ width: 42, height: 42, borderRadius: T.r2, background: r.type === "pdf" ? T.dangerBg : r.type === "video" ? "#DBEAFE" : T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <FileIcon type={r.type} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 650, color: T.text, marginBottom: 8, lineHeight: 1.4 }}>{r.title}</div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                            <SubjectBadge subjectId={r.subject} small />
                            <Badge color={T.textSec} bg={T.bgMuted} style={{ fontSize: 10 }}>{r.type.toUpperCase()}</Badge>
                          </div>
                          <div style={{ fontSize: 11, color: T.textTer, marginTop: 8 }}>{formatDate(r.date)}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* All resources flat view when at root with search */}
          {nav === null && search && (
            <div>
              {filtered.length === 0 ? <EmptyState icon={Books} message="No resources found" /> : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                  {filtered.map((r) => (
                    <Card key={r.id} onClick={() => setViewingResource(r)} elevated>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                        <div style={{ width: 42, height: 42, borderRadius: T.r2, background: r.type === "pdf" ? T.dangerBg : r.type === "video" ? "#DBEAFE" : T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <FileIcon type={r.type} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 650, color: T.text, marginBottom: 8, lineHeight: 1.4 }}>{r.title}</div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                            <SubjectBadge subjectId={r.subject} small />
                            <Badge color={T.textSec} bg={T.bgMuted} style={{ fontSize: 10 }}>{r.type.toUpperCase()}</Badge>
                          </div>
                          <div style={{ fontSize: 11, color: T.textTer, marginTop: 8 }}>{formatDate(r.date)}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default ContentLibrary;
