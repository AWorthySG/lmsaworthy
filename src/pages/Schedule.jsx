import React from 'react';
import { T } from '../theme/theme.js';
import { CalendarBlank, Table } from '../icons/icons.jsx';
import CalendarContent from './Calendar.jsx';
import TimetableContent from './study/RevisionTimetable.jsx';

const TABS = [
  { id: 'calendar', label: 'Calendar', icon: CalendarBlank, page: 'calendar' },
  { id: 'timetable', label: 'Revision Timetable', icon: Table, page: 'revisiontimetable' },
];

export default function Schedule({ state, dispatch, enrolledSubjects }) {
  const activeTab = state.page === 'revisiontimetable' ? 'timetable' : 'calendar';

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

      {activeTab === 'calendar'
        ? <CalendarContent state={state} />
        : <TimetableContent state={state} enrolledSubjects={enrolledSubjects} />
      }
    </div>
  );
}
