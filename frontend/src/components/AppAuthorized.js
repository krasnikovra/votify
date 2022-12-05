import React from "react";

import HomeIcon from '@mui/icons-material/Home';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';

import AppBar from './AppBar';
import CreateQuestion from './CreateQuestion';
import SearchQuestion from "./SearchQuestion";
import Home from "./Home";
import Question from "./Question";
import Profile from "./Profile";
import About from "./About";

export default function AppAuthorized(props) {
  return (
    <AppBar menu={[
      [
        {
          text: "Home",
          link: "/home/",
          icon: <HomeIcon />,
          component: Home,
        },
        {
          text: "Create question",
          link: "/question/create/",
          icon: <NoteAddIcon />,
          component: CreateQuestion,
        },
        {
          text: "Search",
          link: "/question/search/",
          icon: <SearchIcon />,
          component: SearchQuestion,
        },
        {
          link: "/question/*",
          component: Question,
        },
        {
          link: "/profile/*",
          component: Profile,
        }
      ],
      [
        {
          text: "About project",
          link: "/about/",
          icon: <InfoIcon />,
          component: About, // change this
        },
      ]
    ]} />
  )
}
