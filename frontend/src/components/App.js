import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import AppAuthorized from './AppAuthorized';

export default function App(props) {
  return (
    <Routes>
      <Route path="/*" element={<AppAuthorized />} />
      <Route exact path="/login/" element={<Login defaultNext="/" />} />
      <Route exact path="/register/" element={<Register defaultNext="/" />} />
    </Routes>
  );
}
