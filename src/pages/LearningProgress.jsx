import React from 'react';
import { T } from '../theme/theme.js';
import { BookOpen, ClipboardText } from '../icons/icons.jsx';
import ChecklistContent from './study/RevisionChecklist.jsx';
import MistakesContent from './study/MistakeJournal.jsx';

const TABS = [
  { id: 'checklist', label: 'Topics', icon: ClipboardText, page: 'checklist' },
  { id: 'mistakes', label: 'Mistake Journal', icon: BookOpen, page: 'mistakes' },
];

export default function LearningProgress({ state, dispatch, enrolledSubjects }) {
  const activeTab = state.page === 'mistakes' ? 'mistakes' : 'checklist';

  function switchTab(tabPage) {
    dispatch({ type: 'SET_PAGE', payload: tabPage });
  }

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 24, borderBottom: `1px solid ${T.border}` }}>
        {TABS.map(t => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => switchTab(t.page)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 18px',
                border: 'none',
                borderBottom: `2px solid ${active ? T.accent : 'transparent'}`,
                background: 'transparent',
                color: active ? T.accent : T.textSec,
                fontSize: 13, fontWeight: active ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: T.fontBody,
                marginBottom: -1,
              }}>
              <t.icon size={14} color={active ? T.accent : T.textSec} />
              {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'checklist'
        ? <ChecklistContent state={state} dispatch={dispatch} enrolledSubjects={enrolledSubjects} />
        : <MistakesContent state={state} dispatch={dispatch} />
      }
    </div>
  );
}
