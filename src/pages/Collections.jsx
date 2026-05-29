import React, { useState, useMemo } from 'react';
import { T } from '../theme/theme.js';
import { Plus, Trash, BookmarkSimple, FolderSimpleStar, MagnifyingGlass, ArrowLeft, X, FilePdf, FileDoc, FileVideo, CaretUp, CaretDown } from '../icons/icons.jsx';
import { SubjectBadge } from '../components/ui/Badge.jsx';
import { DocumentViewer, PageHeader } from '../components/ui';
import { getSubject, getSubjectTheme } from '../utils/helpers.js';
import { SUBJECTS } from '../data/subjects.js';

function fileIcon(type) {
  if (type === 'pdf') return <FilePdf size={13} color="#dc2626" />;
  if (type === 'docx') return <FileDoc size={13} color={T.accent} />;
  return <FileVideo size={13} color="#2563EB" />;
}

export default function Collections({ state, dispatch }) {
  const [sel, setSel] = useState(null);           // selected collection id
  const [showCreate, setShowCreate] = useState(false);
  const [cName, setCName] = useState("");
  const [cDesc, setCDesc] = useState("");
  const [cSubject, setCSubject] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [viewing, setViewing] = useState(null);   // resource being previewed

  const collections = useMemo(() => Array.isArray(state.collections) ? state.collections : [], [state.collections]);
  const resources = useMemo(() => Array.isArray(state.resources) ? state.resources : [], [state.resources]);
  const bookmarkIds = useMemo(() => new Set(Array.isArray(state.bookmarks) ? state.bookmarks : []), [state.bookmarks]);
  const bookmarkedResources = useMemo(() => resources.filter(r => bookmarkIds.has(r.id)), [resources, bookmarkIds]);

  const selected = sel != null ? collections.find(c => c.id === sel) : null;

  function createCollection() {
    if (!cName.trim()) return;
    dispatch({ type: "ADD_COLLECTION", payload: { name: cName.trim(), description: cDesc.trim(), subject: cSubject } });
    dispatch({ type: "ADD_TOAST", payload: { message: `Collection "${cName.trim()}" created`, variant: "success" } });
    setCName(""); setCDesc(""); setCSubject(""); setShowCreate(false);
  }

  function deleteCollection(col) {
    if (!window.confirm(`Delete collection "${col.name}"? This cannot be undone.`)) return;
    dispatch({ type: "DELETE_COLLECTION", payload: col.id });
    if (sel === col.id) setSel(null);
    dispatch({ type: "ADD_TOAST", payload: { message: "Collection deleted", variant: "info" } });
  }

  function addResource(resourceId) {
    if (!selected) return;
    const ids = selected.resourceIds || [];
    if (ids.includes(resourceId)) return;
    dispatch({ type: "UPDATE_COLLECTION", payload: { id: selected.id, resourceIds: [...ids, resourceId] } });
  }

  function removeResource(resourceId) {
    if (!selected) return;
    dispatch({ type: "UPDATE_COLLECTION", payload: { id: selected.id, resourceIds: (selected.resourceIds || []).filter(id => id !== resourceId) } });
  }

  function moveResource(resourceId, dir) {
    if (!selected) return;
    const ids = [...(selected.resourceIds || [])];
    const idx = ids.indexOf(resourceId);
    if (idx < 0) return;
    const next = idx + dir;
    if (next < 0 || next >= ids.length) return;
    [ids[idx], ids[next]] = [ids[next], ids[idx]];
    dispatch({ type: "UPDATE_COLLECTION", payload: { id: selected.id, resourceIds: ids } });
  }

  // Resources not yet in the selected collection
  const addableResources = useMemo(() => {
    const col = sel != null ? collections.find(c => c.id === sel) : null;
    if (!col) return [];
    const inCol = new Set(col.resourceIds || []);
    const q = addSearch.toLowerCase();
    return resources.filter(r => !inCol.has(r.id) && (
      !q || r.title.toLowerCase().includes(q) || (r.subject || "").toLowerCase().includes(q) || (r.topic || "").toLowerCase().includes(q)
    ));
  }, [resources, collections, sel, addSearch]);

  /* ━━━ COLLECTION DETAIL ━━━ */
  if (selected) {
    const colResources = (selected.resourceIds || [])
      .map(id => resources.find(r => r.id === id))
      .filter(Boolean);

    return (
      <div>
        {viewing && <DocumentViewer resource={viewing} onClose={() => setViewing(null)} />}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <button onClick={() => { setSel(null); setShowAdd(false); setAddSearch(""); }}
            style={{ width: 32, height: 32, borderRadius: T.r2, background: T.bgMuted, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <ArrowLeft size={16} color={T.textSec} />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: T.text, letterSpacing: -0.4 }}>{selected.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              {selected.subject && <SubjectBadge subjectId={selected.subject} small />}
              <span style={{ fontSize: 12, color: T.textTer }}>{colResources.length} resource{colResources.length !== 1 ? "s" : ""}</span>
              {selected.description && <><span style={{ width: 3, height: 3, borderRadius: "50%", background: T.textTer }} /><span style={{ fontSize: 12, color: T.textSec }}>{selected.description}</span></>}
            </div>
          </div>
          <button
            onClick={() => setShowAdd(v => !v)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: T.r2, background: T.accent, color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
            <Plus size={14} /> Add Resources
          </button>
        </div>

        {/* Add resources panel */}
        {showAdd && (
          <div style={{ background: T.bgCard, borderRadius: T.r3, border: `1px solid ${T.border}`, padding: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: T.bgMuted, border: `1px solid ${T.border}`, borderRadius: T.r2, padding: "7px 12px" }}>
                <MagnifyingGlass size={14} color={T.textTer} />
                <input value={addSearch} onChange={e => setAddSearch(e.target.value)} placeholder="Search resources to add…"
                  style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 13, color: T.text, fontFamily: T.fontBody }} />
              </div>
              <button onClick={() => { setShowAdd(false); setAddSearch(""); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: T.textTer }}><X size={16} /></button>
            </div>
            {addableResources.length === 0 ? (
              <div style={{ fontSize: 13, color: T.textTer, textAlign: "center", padding: "20px 0" }}>
                {resources.length === 0 ? "No resources uploaded yet." : "All resources already in this collection."}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 280, overflowY: "auto" }}>
                {addableResources.slice(0, 30).map(r => {
                  const theme = getSubjectTheme(r.subject) || T.eng;
                  return (
                    <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: T.r2, background: T.bgMuted, border: `1px solid ${T.border}` }}>
                      <div style={{ width: 28, height: 28, borderRadius: T.r1, background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {fileIcon(r.type)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</div>
                        <div style={{ fontSize: 10, color: T.textTer }}>{getSubject(r.subject)?.name}{r.topic ? ` · ${r.topic}` : ""}</div>
                      </div>
                      <button onClick={() => addResource(r.id)}
                        style={{ padding: "4px 12px", borderRadius: T.r1, background: T.accent, color: "#fff", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                        Add
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Resource list */}
        {colResources.length === 0 ? (
          <div style={{ textAlign: "center", padding: "56px 20px", background: T.bgCard, borderRadius: T.r3, border: `1px solid ${T.border}` }}>
            <div style={{ width: 48, height: 48, borderRadius: T.r3, background: T.accentLight, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <FolderSimpleStar size={22} color={T.accent} />
            </div>
            <div style={{ fontSize: 14, color: T.textSec, marginBottom: 8 }}>No resources yet</div>
            <button onClick={() => setShowAdd(true)}
              style={{ padding: "8px 16px", borderRadius: T.r2, background: T.accent, color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
              Add first resource
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {colResources.map((r, i) => {
              const theme = getSubjectTheme(r.subject) || T.eng;
              return (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, boxShadow: "0 1px 3px rgba(28,27,25,0.04)" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.textTer, minWidth: 20, textAlign: "center", fontFamily: T.fontMono }}>{i + 1}</div>
                  <div style={{ width: 32, height: 32, borderRadius: T.r1, background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {fileIcon(r.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</div>
                    <div style={{ fontSize: 11, color: T.textTer, marginTop: 2 }}>{getSubject(r.subject)?.name}{r.topic ? ` · ${r.topic}` : ""}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                    <button onClick={() => moveResource(r.id, -1)} disabled={i === 0} aria-label="Move up"
                      style={{ width: 26, height: 26, borderRadius: T.r1, background: T.bgMuted, border: "none", cursor: i === 0 ? "not-allowed" : "pointer", opacity: i === 0 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CaretUp size={13} color={T.textSec} />
                    </button>
                    <button onClick={() => moveResource(r.id, 1)} disabled={i === colResources.length - 1} aria-label="Move down"
                      style={{ width: 26, height: 26, borderRadius: T.r1, background: T.bgMuted, border: "none", cursor: i === colResources.length - 1 ? "not-allowed" : "pointer", opacity: i === colResources.length - 1 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CaretDown size={13} color={T.textSec} />
                    </button>
                    <button onClick={() => setViewing(r)}
                      style={{ padding: "5px 12px", borderRadius: T.r1, background: T.bgMuted, border: `1px solid ${T.border}`, fontSize: 11, fontWeight: 600, color: T.textSec, cursor: "pointer" }}>
                      View
                    </button>
                    <button onClick={() => removeResource(r.id)} aria-label="Remove from collection"
                      style={{ width: 28, height: 28, borderRadius: T.r1, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.danger }}>
                      <X size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  /* ━━━ BROWSE VIEW ━━━ */
  return (
    <div>
      {viewing && <DocumentViewer resource={viewing} onClose={() => setViewing(null)} />}
      <PageHeader
        title="Collections"
        subtitle="Bookmarked resources and curated study sets"
        action={
          <button onClick={() => setShowCreate(v => !v)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: T.r2, background: T.accent, color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
            <Plus size={15} /> New Collection
          </button>
        }
      />

      {/* Bookmarked resources — quick-access row */}
      {bookmarkedResources.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <BookmarkSimple size={15} color={T.accent} weight="fill" />
            <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Bookmarked</span>
            <span style={{ fontSize: 11, color: T.textTer }}>{bookmarkedResources.length} saved</span>
          </div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
            {bookmarkedResources.map(r => {
              const theme = getSubjectTheme(r.subject) || T.eng;
              return (
                <div key={r.id} style={{ flexShrink: 0, width: 200, background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: T.r1, background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {fileIcon(r.type)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</div>
                      <div style={{ fontSize: 10, color: T.textTer, marginTop: 1 }}>{getSubject(r.subject)?.name}</div>
                    </div>
                  </div>
                  <button onClick={() => setViewing(r)}
                    style={{ padding: "5px 0", borderRadius: T.r1, background: theme.bg, border: `1px solid ${theme.accent}33`, fontSize: 11, fontWeight: 600, color: theme.accent, cursor: "pointer", width: "100%", textAlign: "center" }}>
                    View
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <div style={{ background: T.bgCard, borderRadius: T.r3, border: `1px solid ${T.border}`, padding: 20, marginBottom: 20, borderLeft: `3px solid ${T.accent}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 14 }}>New Collection</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: T.textTer, marginBottom: 4 }}>Name *</div>
              <input value={cName} onChange={e => setCName(e.target.value)} placeholder="e.g. GP Essay Prep Pack"
                style={{ width: "100%", padding: "8px 12px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgMuted, fontSize: 13, color: T.text, fontFamily: T.fontBody, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: T.textTer, marginBottom: 4 }}>Subject (optional)</div>
              <select value={cSubject} onChange={e => setCSubject(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgMuted, fontSize: 13, color: T.text, fontFamily: T.fontBody, outline: "none", boxSizing: "border-box" }}>
                <option value="">All subjects</option>
                {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: T.textTer, marginBottom: 4 }}>Description (optional)</div>
            <input value={cDesc} onChange={e => setCDesc(e.target.value)} placeholder="What is this collection for?"
              style={{ width: "100%", padding: "8px 12px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgMuted, fontSize: 13, color: T.text, fontFamily: T.fontBody, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={createCollection} disabled={!cName.trim()}
              style={{ padding: "8px 18px", borderRadius: T.r2, background: !cName.trim() ? T.bgMuted : T.accent, color: !cName.trim() ? T.textTer : "#fff", border: "none", cursor: !cName.trim() ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 700 }}>
              Create Collection
            </button>
            <button onClick={() => { setShowCreate(false); setCName(""); setCDesc(""); setCSubject(""); }}
              style={{ padding: "8px 16px", borderRadius: T.r2, background: T.bgMuted, color: T.textSec, border: `1px solid ${T.border}`, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Collection grid */}
      {collections.length === 0 ? (
        <div style={{ textAlign: "center", padding: "72px 20px", background: T.bgCard, borderRadius: T.r3, border: `1px solid ${T.border}` }}>
          <div style={{ width: 56, height: 56, borderRadius: T.r3, background: T.accentLight, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <BookmarkSimple size={26} color={T.accent} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 8 }}>No collections yet</div>
          <div style={{ fontSize: 14, color: T.textSec, marginBottom: 20 }}>Create curated playlists to organise resources by topic, exam, or goal.</div>
          <button onClick={() => setShowCreate(true)}
            style={{ padding: "10px 20px", borderRadius: T.r2, background: T.accent, color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
            Create your first collection
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
          {collections.map(col => {
            const count = (col.resourceIds || []).length;
            const theme = col.subject ? (getSubjectTheme(col.subject) || T.eng) : { accent: T.accent, bg: T.accentLight };
            return (
              <div key={col.id}
                style={{ background: T.bgCard, borderRadius: T.r3, border: `1px solid ${T.border}`, overflow: "hidden", cursor: "pointer", transition: "all 0.15s", boxShadow: "0 1px 3px rgba(28,27,25,0.04)" }}
                onClick={() => setSel(col.id)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent + "80"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(28,27,25,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "0 1px 3px rgba(28,27,25,0.04)"; }}>
                <div style={{ height: 6, background: theme.accent, opacity: 0.7 }} />
                <div style={{ padding: "16px 18px 14px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{col.name}</div>
                      {col.description && <div style={{ fontSize: 12, color: T.textSec, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{col.description}</div>}
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); deleteCollection(col); }}
                      aria-label={`Delete ${col.name}`}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: T.textTer, flexShrink: 0 }}>
                      <Trash size={14} />
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {col.subject && <SubjectBadge subjectId={col.subject} small />}
                    <span style={{ fontSize: 11, color: T.textTer, fontFamily: T.fontMono }}>
                      {count} resource{count !== 1 ? "s" : ""}
                    </span>
                    <div style={{ flex: 1 }} />
                    <span style={{ fontSize: 11, color: T.accent, fontWeight: 600 }}>Open →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
