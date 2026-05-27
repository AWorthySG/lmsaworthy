import React from 'react';
import StudentHomework from './StudentHomework.jsx';
import TutorHomework from './TutorHomework.jsx';

function Homework({ state, dispatch, userProfile, authUser }) {
  if (state.role === 'tutor') return <TutorHomework state={state} dispatch={dispatch} />;
  return <StudentHomework state={state} dispatch={dispatch} userProfile={userProfile} authUser={authUser} />;
}

export default Homework;
