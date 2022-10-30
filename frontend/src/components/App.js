import React from 'react';
import { Routes, Route} from 'react-router-dom';

import Login from './Login';
import QuestionCard from './QuestionCard';

export default function App(props) {
  return (
    <Routes>
      <Route exact path="/login/" element={<Login defaultNext="/" />} />
      <Route path="/question/*" element={<QuestionCard />} />
    </Routes>
  );
}
