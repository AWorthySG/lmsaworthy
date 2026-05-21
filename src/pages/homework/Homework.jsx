import React from 'react';
import StudentHomework from './StudentHomework.jsx';
import TutorHomework from './TutorHomework.jsx';

function Homework({ state, dispatch, userProfile }) {
  const isStudent = state.role === "student";

  if (isStudent) return <StudentHomework state={state} dispatch={dispatch} userProfile={userProfile} />;
  return <TutorHomework state={state} dispatch={dispatch} />;
}

/* ━━━ STUDENT HOMEWORK — view assignments, upload files, submit ━━━ */

export default Homework;
