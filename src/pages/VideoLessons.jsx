import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { T } from '../theme/theme.js';
import { VideoCamera, PlayCircle, Play, CheckCircle, CaretRight, ArrowLeft } from '../icons/icons.jsx';
import { Card, Btn, Badge, SubjectBadge, Progress, PageHeader, BackBtn } from '../components/ui';
import { SUBJECTS } from '../data/subjects.js';

function VideoLessons({ state, dispatch }) {
  const [sel, setSel] = useState(null);
  const [aCh, setACh] = useState(null);

  if (sel) {
    const lesson = state.videoLessons.find((l) => l.id === sel);
    if (!lesson) return null;
    const cc = lesson.chapters.filter((c) => c.completed).length;
    const embedUrl = lesson.videoUrl;
    const isYT = embedUrl && embedUrl.includes("youtube.com/embed");
    return (
      <div>
        <BackBtn onClick={() => { setSel(null); setACh(null); }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
          <div>
            <div style={{ borderRadius: T.r3, aspectRatio: "16/9", marginBottom: 18, overflow: "hidden", background: "#000", border: `1px solid ${T.border}` }}>
              {isYT ? <iframe src={embedUrl + "?rel=0"} style={{ width: "100%", height: "100%", border: "none" }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={lesson.title} /> : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", background: T.bgMuted }}><Play size={48} weight="fill" color={T.textTer} /></div>
              )}
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: "0 0 10px", letterSpacing: -0.4 }}>{lesson.title}</h2>
            <SubjectBadge subjectId={lesson.subject} />
            <p style={{ fontSize: 14, color: T.textSec, lineHeight: 1.7, marginTop: 12 }}>{lesson.description}</p>
          </div>
          <Card elevated style={{ padding: 0, height: "fit-content" }}>
            <div style={{ padding: "16px 18px", borderBottom: `1px solid ${T.border}` }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: 0 }}>Chapters</h3>
              <div style={{ fontSize: 12, color: T.textTer, marginTop: 4 }}>{cc}/{lesson.chapters.length} completed</div>
              <div style={{ marginTop: 8 }}><Progress value={(cc / lesson.chapters.length) * 100} /></div>
            </div>
            {lesson.chapters.map((ch) => (
              <div key={ch.id} onClick={() => setACh(ch.id)} style={{ padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: (aCh || lesson.chapters[0]?.id) === ch.id ? T.accentLight : "transparent", borderLeft: (aCh || lesson.chapters[0].id) === ch.id ? `3px solid ${T.accent}` : "3px solid transparent", transition: "all 0.15s" }}>
                <button onClick={(e) => { e.stopPropagation(); dispatch({ type: "TOGGLE_CHAPTER_COMPLETE", payload: { lessonId: lesson.id, chapterId: ch.id } }); }}
                  style={{ width: 22, height: 22, borderRadius: "50%", border: ch.completed ? "none" : `2px solid ${T.border}`, background: ch.completed ? T.success : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                  {ch.completed && <CheckCircle size={14} weight="fill" color="#fff" />}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 550, color: T.text }}>{ch.title}</div>
                  <div style={{ fontSize: 11, color: T.textTer }}>{ch.duration}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Video Lessons" subtitle="Watch and learn at your own pace" />
      {state.videoLessons.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          <EmptyStateIllustration type="default" size={100} />
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginTop: 12, fontFamily: "'Bricolage Grotesque', sans-serif" }}>No video lessons yet</div>
          <div style={{ fontSize: 13, color: T.textTer, marginTop: 4 }}>Video lessons will appear here once they're added.</div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {state.videoLessons.map((lesson) => {
          const cc = lesson.chapters.filter((c) => c.completed).length;
          const pct = Math.round((cc / lesson.chapters.length) * 100);
          const theme = getSubjectTheme(lesson.subject);
          return (
            <Card key={lesson.id} onClick={() => setSel(lesson.id)} elevated>
              <div style={{ background: `linear-gradient(135deg, ${theme.bg}, ${T.bgMuted})`, borderRadius: T.r2, aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at center, ${theme.accent}18 0%, transparent 70%)` }} />
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", zIndex: 1 }}>
                  <Play size={22} weight="fill" color={theme.accent} />
                </div>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 650, color: T.text, margin: "0 0 8px" }}>{lesson.title}</h3>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                <SubjectBadge subjectId={lesson.subject} small />
                <span style={{ fontSize: 12, color: T.textTer }}>{lesson.chapters.length} chapters</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.textSec, marginBottom: 6 }}>
                <span>{cc}/{lesson.chapters.length} completed</span><span style={{ color: T.accent, fontWeight: 700 }}>{pct}%</span>
              </div>
              <Progress value={pct} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}


export default VideoLessons;
