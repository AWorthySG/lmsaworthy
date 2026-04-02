import React, { useState } from 'react';
import { T } from '../../theme/theme.js';
import { Plus, MagnifyingGlass } from '../../icons/icons.jsx';
import { EmptyStateIllustration } from '../../components/ui';
import { SUBJECTS } from '../../data/subjects.js';
import { getSubject } from '../../utils/helpers.js';

function NotesPage({ state, dispatch }) {
  const [filterSubj, setFilterSubj] = useState("all");
  const [editingNote, setEditingNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteSubject, setNoteSubject] = useState("eng");
  const [searchQ, setSearchQ] = useState("");

  const notes = (state.notes || []).filter(n => {
    if (filterSubj !== "all" && n.subject !== filterSubj) return false;
    if (searchQ && !n.title.toLowerCase().includes(searchQ.toLowerCase()) && !n.content.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  function saveNote() {
    if (!noteTitle.trim() || !noteContent.trim()) return;
    if (editingNote) {
      dispatch({ type: "UPDATE_NOTE", payload: { id: editingNote.id, title: noteTitle, content: noteContent, subject: noteSubject } });
      dispatch({ type: "ADD_TOAST", payload: { message: "Note updated", variant: "success" } });
    } else {
      dispatch({ type: "ADD_NOTE", payload: { title: noteTitle, content: noteContent, subject: noteSubject } });
      dispatch({ type: "ADD_TOAST", payload: { message: "Note saved", variant: "success" } });
    }
    setEditingNote(null); setNoteTitle(""); setNoteContent(""); setNoteSubject("eng");
  }

  function startEdit(note) {
    setEditingNote(note); setNoteTitle(note.title); setNoteContent(note.content); setNoteSubject(note.subject);
  }

  function cancelEdit() { setEditingNote(null); setNoteTitle(""); setNoteContent(""); }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, background: T.gradPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>My Notes</h1>
          <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0" }}>Personal study notes organised by subject</p>
        </div>
        {!editingNote && !noteTitle && (
          <button onClick={() => setNoteTitle(" ")} style={{ padding: "8px 18px", borderRadius: T.r2, background: T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: T.shadowAccent }}>
            <Plus size={15} /> New Note
          </button>
        )}
      </div>

      {/* Search + filter */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgCard }}>
          <MagnifyingGlass size={14} color={T.textTer} />
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search notes..." style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 13, color: T.text }} />
        </div>
        {["all", ...SUBJECTS.map(s => s.id)].map(s => (
          <button key={s} onClick={() => setFilterSubj(s)} style={{ padding: "5px 12px", borderRadius: 20, border: `2px solid ${filterSubj === s ? T.accent : T.border}`, background: filterSubj === s ? T.accentLight : T.bgCard, color: filterSubj === s ? T.accent : T.textSec, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>
            {s === "all" ? "All" : getSubject(s)?.name?.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* New/Edit note form */}
      {(noteTitle || editingNote) && (
        <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "18px", border: `1px solid ${T.accent}33`, boxShadow: T.shadow2 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 10 }}>
            <input value={noteTitle === " " ? "" : noteTitle} onChange={e => setNoteTitle(e.target.value)} placeholder="Note title..." style={{ padding: "10px 12px", borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 14, fontWeight: 600, boxSizing: "border-box" }} autoFocus />
            <select value={noteSubject} onChange={e => setNoteSubject(e.target.value)} style={{ padding: "10px 12px", borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 12, boxSizing: "border-box" }}>
              {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <textarea value={noteContent} onChange={e => setNoteContent(e.target.value)} rows={6} placeholder="Type your notes here... You can write formulas, key concepts, exam tips, anything you want to remember." style={{ width: "100%", padding: "12px", borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 13, resize: "vertical", boxSizing: "border-box", lineHeight: 1.8 }} />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={saveNote} disabled={!noteTitle.trim() || noteTitle === " " || !noteContent.trim()} style={{ padding: "8px 20px", borderRadius: T.r2, background: noteTitle.trim() && noteTitle !== " " && noteContent.trim() ? T.gradPrimary : T.bgMuted, color: noteTitle.trim() && noteTitle !== " " && noteContent.trim() ? "#fff" : T.textTer, fontWeight: 700, fontSize: 13, border: "none", cursor: noteTitle.trim() && noteTitle !== " " && noteContent.trim() ? "pointer" : "not-allowed" }}>
              {editingNote ? "Update Note" : "Save Note"}
            </button>
            <button onClick={cancelEdit} style={{ padding: "8px 16px", borderRadius: T.r2, background: T.bgMuted, border: `1px solid ${T.border}`, color: T.textSec, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Notes list */}
      {notes.length === 0 && !noteTitle && (
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          <EmptyStateIllustration type="default" size={100} />
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginTop: 12, fontFamily: "'Bricolage Grotesque', sans-serif" }}>No notes yet</div>
          <div style={{ fontSize: 13, color: T.textTer, marginTop: 4 }}>Start taking notes to build your personal study resource.</div>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {notes.map(n => {
          const theme = T[n.subject] || T.eng;
          return (
            <div key={n.id} className="card-hover" style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px", border: `1px solid ${T.border}`, borderLeft: `3px solid ${theme.accent}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{n.title}</div>
                  <div style={{ fontSize: 10, color: T.textTer }}>{getSubject(n.subject)?.name} · {n.updatedAt}</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => startEdit(n)} style={{ padding: "4px 10px", borderRadius: T.r1, background: T.bgMuted, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, color: T.textSec }}>Edit</button>
                  <button onClick={() => { dispatch({ type: "DELETE_NOTE", payload: n.id }); dispatch({ type: "ADD_TOAST", payload: { message: "Note deleted", variant: "success" } }); }} style={{ padding: "4px 10px", borderRadius: T.r1, background: T.dangerBg, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, color: T.danger }}>Delete</button>
                </div>
              </div>
              <div style={{ fontSize: 13, color: T.textSec, lineHeight: 1.7, whiteSpace: "pre-wrap", maxHeight: 120, overflow: "hidden", maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)" }}>{n.content}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ━━━ MODEL ESSAY BANK PAGE ━━━ */

export default NotesPage;
