import React, { useMemo } from 'react';
import { T } from '../theme/theme.js';
import { Books, Notebook, Scroll, GraduationCap, Lightbulb, ArrowRight, FilePdf } from '../icons/icons.jsx';
import { PageHeader, SubjectIllustration } from '../components/ui';
import { SUBJECTS } from '../data/subjects.js';
import { getSubjectTheme } from '../utils/helpers.js';

// Per-subject quick links — mirror the actual sidebar nav items for each subject
// so the hub is a faithful, single visual entry point (no duplicated routes).
const SUBJECT_TOOLS = {
  eng: [
    { label: 'Resources', icon: Books, page: 'library-eng' },
    { label: 'Vocabulary', icon: Scroll, page: 'vocab' },
    { label: 'Practice Papers', icon: Notebook, page: 'pastpapers-eng' },
  ],
  gp: [
    { label: 'Example Finder', icon: Lightbulb, page: 'example-finder' },
    { label: 'Model Essays', icon: GraduationCap, page: 'modelessays' },
    { label: 'Practice Papers', icon: Notebook, page: 'pastpapers-gp' },
  ],
};

function toolsFor(id) {
  return SUBJECT_TOOLS[id] || [
    { label: 'Resources', icon: Books, page: `library-${id}` },
    { label: 'Practice Papers', icon: Notebook, page: `pastpapers-${id}` },
  ];
}

function SubjectCard({ subj, resourceCount, paperCount, dispatch }) {
  const theme = getSubjectTheme(subj.id) || T.eng;
  const tools = toolsFor(subj.id);
  const primary = tools[0];

  return (
    <div
      style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r3, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(28,27,25,0.04)', transition: 'border-color 0.15s, box-shadow 0.15s' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent + '55'; e.currentTarget.style.boxShadow = `0 6px 18px ${theme.accent}14`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = '0 1px 3px rgba(28,27,25,0.04)'; }}
    >
      {/* Themed illustration band — clicking opens the subject's resources */}
      <button
        onClick={() => dispatch({ type: 'SET_PAGE', payload: primary.page })}
        aria-label={`Open ${subj.name}`}
        style={{ background: theme.bg, border: 'none', borderBottom: `1px solid ${T.border}`, padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
      >
        <SubjectIllustration subject={subj.id} size={240} />
      </button>

      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.2, color: T.text }}>{subj.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 5, fontSize: 12, color: T.textSec }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Books size={12} color={theme.accent} />
              <span style={{ fontWeight: 700, color: theme.accent }}>{resourceCount}</span> resource{resourceCount !== 1 ? 's' : ''}
            </span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: T.textTer }} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <FilePdf size={12} color={theme.accent} />
              <span style={{ fontWeight: 700, color: theme.accent }}>{paperCount}</span> paper{paperCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto' }}>
          {tools.map((tool) => (
            <button
              key={tool.page}
              onClick={() => dispatch({ type: 'SET_PAGE', payload: tool.page })}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 11px', borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bg, color: T.text, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: T.fontBody, transition: 'all 0.12s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = theme.bg; e.currentTarget.style.borderColor = theme.accent + '55'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = T.bg; e.currentTarget.style.borderColor = T.border; }}
            >
              <tool.icon size={13} color={theme.accent} />
              {tool.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Subjects({ state, dispatch, enrolledSubjects }) {
  const resources = useMemo(() => (Array.isArray(state.resources) ? state.resources : []), [state.resources]);
  const papers = useMemo(() => (Array.isArray(state.pastPaperDocs) ? state.pastPaperDocs : []), [state.pastPaperDocs]);

  // Students see only their enrolled subjects; tutors (enrolledSubjects null) see all.
  const visibleSubjects = useMemo(
    () => (Array.isArray(enrolledSubjects) ? SUBJECTS.filter((s) => enrolledSubjects.includes(s.id)) : SUBJECTS),
    [enrolledSubjects]
  );

  const counts = useMemo(() => {
    const bySubjRes = {}; const bySubjPaper = {};
    resources.forEach((r) => { bySubjRes[r.subject] = (bySubjRes[r.subject] || 0) + 1; });
    papers.forEach((p) => { bySubjPaper[p.subject] = (bySubjPaper[p.subject] || 0) + 1; });
    return { bySubjRes, bySubjPaper };
  }, [resources, papers]);

  const subtitle = visibleSubjects.length === 1
    ? 'Everything for your subject in one place.'
    : `Pick a subject to jump into its resources, practice papers and tools.`;

  return (
    <div>
      <PageHeader title="My Subjects" subtitle={subtitle} />
      {visibleSubjects.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: T.textTer, fontSize: 14 }}>
          No subjects assigned yet — your tutor will set these up for you.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {visibleSubjects.map((subj) => (
            <SubjectCard
              key={subj.id}
              subj={subj}
              resourceCount={counts.bySubjRes[subj.id] || 0}
              paperCount={counts.bySubjPaper[subj.id] || 0}
              dispatch={dispatch}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Subjects;
