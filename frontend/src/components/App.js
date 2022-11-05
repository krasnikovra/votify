import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateQuestion from './CreateQuestion';

import Login from './Login';
import QuestionCard from './QuestionCard';
import Register from './Register';

export default function App(props) {
  return (
    <Routes>
      <Route exact path="/login/" element={<Login defaultNext="/" />} />
      <Route exact path="/register/" element={<Register defaultNext="/" />} />
      <Route exact path="/question/create/" element={<CreateQuestion />} />
      <Route path="/question/*" element={<QuestionCard />} />
    </Routes>
  );
}
