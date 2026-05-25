import React from 'react';
import StudentHomework from './StudentHomework.jsx';
import TutorHomework from './TutorHomework.jsx';

function Homework({ state, dispatch }) {
  return <TutorHomework state={state} dispatch={dispatch} />;
}

/* ━━━ STUDENT HOMEWORK — view assignments, upload files, submit ━━━ */

export default Homework;
