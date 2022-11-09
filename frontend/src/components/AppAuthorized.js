import React from "react";
import { Routes, Route } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import InfoIcon from '@mui/icons-material/Info';

import AppBar from './AppBar';
import CreateQuestion from './CreateQuestion';
import QuestionCard from './QuestionCard';

export default function AppAuthorized(props) {
  return (
    <AppBar menu={[
      [
        {
          text: "Home",
          link: "/",
          icon: <HomeIcon />,
        },
        {
          text: "Create question",
          link: "/question/create/",
          icon: <NoteAddIcon />,
        },
      ],
      [
        {
          text: "About project",
          link: "/about/",
          icon: <InfoIcon />
        },
      ]
    ]}>
      <Routes>
        <Route exact path="/question/create/" element={<CreateQuestion />} />
        <Route path="/question/*" element={<QuestionCard />} />
      </Routes>
    </AppBar>
  )
}
