import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { T } from '../theme/theme.js';
import { ChatCircle, ChatText, Handshake, Megaphone, ThumbsUp, PushPin, Plus, X, Star } from '../icons/icons.jsx';
import { Card, Btn, Badge, SubjectBadge, PageHeader, Input, Textarea, Select } from '../components/ui';
import { StudentAvatar } from '../components/gamification';
import { formatDate, getSubjectTheme } from '../utils/helpers.js';
import { SUBJECTS } from '../data/subjects.js';
import { COMMUNITY_REACTIONS } from '../data/gamification.js';

function Community({ state, dispatch }) {
  const [filter, setFilter] = useState("all");
  const [showNewPost, setShowNewPost] = useState(false);
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [newComment, setNewComment] = useState({});
  const [newPost, setNewPost] = useState({ title: "", content: "", subject: "", isAnnouncement: false });

  const filterTabs = [
    { id: "all", label: "All Posts" },
    { id: "announcements", label: "📢 Announcements" },
    ...SUBJECTS.map(s => ({ id: s.id, label: s.name })),
  ];

  const filteredPosts = [...(state.posts || [])]
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .filter(p => {
      if (filter === "all") return true;
      if (filter === "announcements") return p.isAnnouncement;
      return p.subject === filter;
    });

  const toggleComments = (postId) => {
    const next = new Set(expandedComments);
    if (next.has(postId)) next.delete(postId); else next.add(postId);
    setExpandedComments(next);
  };

  const handleAddComment = (postId) => {
    const text = (newComment[postId] || "").trim();
    if (!text) return;
    dispatch({ type: "ADD_COMMENT", payload: { postId, comment: { author: "Jeremy", content: text } } });
    setNewComment(prev => ({ ...prev, [postId]: "" }));
  };

  const handleAddPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    dispatch({ type: "ADD_POST", payload: { ...newPost, author: "Jeremy", authorType: "tutor" } });
    setNewPost({ title: "", content: "", subject: "", isAnnouncement: false });
    setShowNewPost(false);
    dispatch({ type: "ADD_TOAST", payload: { message: "Post published to the community!", variant: "success" } });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, background: "linear-gradient(135deg, #0F172A, #2D3A8C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0, letterSpacing: -0.3, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Community</h1>
          <p style={{ color: T.textSec, margin: "4px 0 0", fontSize: 14 }}>Announcements, discussions, and study tips from the class</p>
        </div>
        <Btn onClick={() => setShowNewPost(!showNewPost)}><Plus size={15} weight="bold" /> New Post</Btn>
      </div>

      {/* New post form */}
      {showNewPost && (
        <Card elevated style={{ marginBottom: 20, padding: 22 }}>
          <h3 style={{ margin: "0 0 16px", fontWeight: 700, fontSize: 15 }}>Create Post</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Input value={newPost.title} onChange={v => setNewPost(p => ({ ...p, title: v }))} placeholder="Post title..." />
            <Textarea value={newPost.content} onChange={v => setNewPost(p => ({ ...p, content: v }))} placeholder="What would you like to share with the class?" rows={4} />
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <Select value={newPost.subject} onChange={v => setNewPost(p => ({ ...p, subject: v }))} placeholder="Tag a subject (optional)" options={SUBJECTS.map(s => ({ value: s.id, label: s.name }))} style={{ flex: 1, minWidth: 180 }} />
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: T.textSec, flexShrink: 0 }}>
                <input type="checkbox" checked={newPost.isAnnouncement} onChange={e => setNewPost(p => ({ ...p, isAnnouncement: e.target.checked }))} />
                Mark as Announcement
              </label>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Btn variant="secondary" onClick={() => setShowNewPost(false)}>Cancel</Btn>
              <Btn onClick={handleAddPost} disabled={!newPost.title.trim() || !newPost.content.trim()}><Megaphone size={14} weight="bold" /> Publish</Btn>
            </div>
          </div>
        </Card>
      )}

      {/* Stats strip */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        {[
          { label: "Total Posts", value: (state.posts || []).length },
          { label: "Announcements", value: (state.posts || []).filter(p => p.isAnnouncement).length },
          { label: "Total Comments", value: (state.posts || []).reduce((sum, p) => sum + p.comments.length, 0) },
        ].map(s => (
          <div key={s.label} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r2, padding: "10px 18px", display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 20, color: T.accent }}>{s.value}</div>
            <div style={{ fontSize: 12, color: T.textSec }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {filterTabs.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{ padding: "6px 14px", borderRadius: T.r2, border: `1.5px solid ${filter === f.id ? T.accent : T.border}`, background: filter === f.id ? T.accentLight : T.bgCard, color: filter === f.id ? T.accentText : T.textSec, fontSize: 12, fontWeight: filter === f.id ? 700 : 500, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Post list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filteredPosts.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: T.textTer }}>
            <EmptyStateIllustration type="learning" size={100} />
            <ChatCircle size={40} weight="duotone" color={T.textTer} style={{ marginTop: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 12 }}>No posts here yet</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Be the first to start a discussion!</div>
          </div>
        )}
        {filteredPosts.map(post => {
          const commentsOpen = expandedComments.has(post.id);
          const subjectTheme = post.subject ? getSubjectTheme(post.subject) : null;
          return (
            <Card key={post.id} elevated style={{ padding: 0, overflow: "hidden", borderLeft: post.pinned ? `3px solid ${T.accent}` : post.isAnnouncement ? `3px solid #E07800` : "none" }}>
              {/* Post header + body */}
              <div style={{ padding: "18px 20px 14px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {post.authorType === "tutor"
                      ? <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, #3F51EC)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>J</div>
                      : <StudentAvatar student={state.students.find(s => s.id === post.studentId)} size={38} radius="50%" />
                    }
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{post.author}</span>
                        {post.authorType === "tutor" && <span style={{ fontSize: 10, fontWeight: 700, color: T.accentText, background: T.accentLight, padding: "2px 6px", borderRadius: 20 }}>Tutor</span>}
                        {post.isAnnouncement && <span style={{ fontSize: 10, fontWeight: 700, color: "#92400E", background: "#FEF3C7", padding: "2px 6px", borderRadius: 20 }}>📢 Announcement</span>}
                        {post.pinned && <span style={{ fontSize: 10, color: T.accent, fontWeight: 600 }}>📌 Pinned</span>}
                      </div>
                      <div style={{ fontSize: 11, color: T.textTer }}>{formatDate(post.createdAt)}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                    {post.subject && subjectTheme && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: subjectTheme.text, background: subjectTheme.bg, padding: "3px 8px", borderRadius: 20 }}>{getSubject(post.subject)?.name}</span>
                    )}
                    <button onClick={() => dispatch({ type: "PIN_POST", payload: post.id })} title={post.pinned ? "Unpin" : "Pin post"} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: post.pinned ? T.accent : T.textTer, fontSize: 15, lineHeight: 1 }}>📌</button>
                  </div>
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700, color: T.text, lineHeight: 1.4 }}>{post.title}</h3>
                <p style={{ margin: 0, fontSize: 13, color: T.textSec, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{post.content}</p>
              </div>

              {/* Reactions bar */}
              <div style={{ padding: "10px 20px", borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {COMMUNITY_REACTIONS.map(emoji => {
                  const count = (post.reactions?.[emoji] || []).length;
                  const reacted = (post.reactions?.[emoji] || []).includes(0);
                  return (
                    <button key={emoji} onClick={() => dispatch({ type: "TOGGLE_REACTION", payload: { postId: post.id, emoji } })} style={{ padding: "4px 10px", borderRadius: 20, border: `1.5px solid ${reacted ? T.accent : T.border}`, background: reacted ? T.accentLight : T.bgCard, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 4, color: reacted ? T.accentText : T.textSec, fontWeight: reacted ? 700 : 400, transition: "all 0.15s" }}>
                      {emoji}{count > 0 && <span style={{ fontSize: 11 }}>{count}</span>}
                    </button>
                  );
                })}
                <button onClick={() => toggleComments(post.id)} style={{ marginLeft: "auto", background: "none", border: `1px solid ${T.border}`, borderRadius: 20, cursor: "pointer", fontSize: 12, color: T.textSec, display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", transition: "all 0.15s" }}>
                  <ChatCircle size={14} weight="duotone" /> {post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}
                </button>
              </div>

              {/* Comments section */}
              {commentsOpen && (
                <div style={{ background: T.bgMuted, borderTop: `1px solid ${T.border}`, padding: "14px 20px 16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {post.comments.map(comment => (
                      <div key={comment.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        {comment.studentId
                          ? <StudentAvatar student={state.students.find(s => s.id === comment.studentId)} size={30} radius="50%" />
                          : <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, #3F51EC)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 11, flexShrink: 0 }}>J</div>
                        }
                        <div style={{ flex: 1, background: T.bgCard, borderRadius: T.r2, padding: "10px 14px", border: `1px solid ${T.border}` }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                            <span style={{ fontWeight: 700, fontSize: 12 }}>{comment.author}</span>
                            {comment.author === "Jeremy" && <span style={{ fontSize: 9, fontWeight: 700, color: T.accentText, background: T.accentLight, padding: "1px 5px", borderRadius: 20 }}>Tutor</span>}
                            <span style={{ fontSize: 10, color: T.textTer }}>{formatDate(comment.createdAt)}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: 13, color: T.text, lineHeight: 1.6 }}>{comment.content}</p>
                        </div>
                      </div>
                    ))}
                    {/* Add comment */}
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, #3F51EC)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 11, flexShrink: 0 }}>J</div>
                      <Input value={newComment[post.id] || ""} onChange={v => setNewComment(prev => ({ ...prev, [post.id]: v }))} placeholder="Reply as Jeremy..." style={{ flex: 1 }} />
                      <Btn size="sm" onClick={() => handleAddComment(post.id)} disabled={!(newComment[post.id] || "").trim()}>Post</Btn>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ━━━ LIVE INFOGRAPHICS ━━━ */

const GP2_OVERVIEW = [
  { code: "SAQ", label: "Short-Answer Questions", marks: "9–11", time: "25 min", color: "#216ef4", pct: 22 },
  { code: "NIT", label: "New Item Type / Connections", marks: "4–6", time: "10 min", color: "#6660B9", pct: 10 },
  { code: "SUM", label: "Summary Question", marks: "8", time: "25 min", color: "#17a2b8", pct: 16 },
  { code: "AQ",  label: "Application Question", marks: "12", time: "25 min", color: "#E07800", pct: 24 },
  { code: "READ",label: "Reading Passages",  marks: "—",   time: "10 min", color: "#8A96B0", pct: 14 },
  { code: "CHK", label: "Checking",          marks: "—",   time: "5 min",  color: "#8A96B0", pct: 14 },
];


export default Community;
