import React from 'react';
import StudentHomework from './StudentHomework.jsx';
import TutorHomework from './TutorHomework.jsx';

function Homework({ state, dispatch }) {
  const isStudent = state.role === "student";

  // ═══ STUDENT HOMEWORK VIEW ═══
  if (isStudent) return <StudentHomework state={state} dispatch={dispatch} />;

  // ═══ TUTOR HOMEWORK VIEW ═══
  return <TutorHomework state={state} dispatch={dispatch} />;
}

/* ━━━ STUDENT HOMEWORK — view assignments, upload files, submit ━━━ */

export default Homework;
