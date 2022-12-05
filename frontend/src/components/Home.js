import React from 'react'
import Utils from './utils';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import getLatestQuestions from './api/getLatestQuestions';
import QuestionCard from './QuestionCard';

export default function Home(props) {
  const [latestQuestions, setLatestQuestions] = React.useState([])

  React.useEffect(() => {
    (async () => {
      const { url, opt } = getLatestQuestions(props.user.id)
      try {
        const response = await fetch(url, opt)
        const response_json = await response.json()
        if (response.status >= 400) {
          throw new Error(response.statusText)
        }
        else {
          setLatestQuestions(response_json.questions)
        }
      } catch (error) {
        console.log(error)
      }
    })();
  }, [props.user])

  return (
    <Box>
      <Typography sx={{
        mb: 3
      }} variant="h3">
        Your profile
      </Typography>
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        mb: 2,
      }}>
        <Paper variant="outlined"
          sx={{
            p: 2,
            mr: 2,
            flexGrow: 1,
          }}>
          <Box sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}>
            <Avatar {...Utils.stringAvatar(props.user.username, { width: "10vh", height: "10vh" })} />
          </Box>
          <Typography sx={{
            textAlign: "center",
          }} variant='h5'>
            {props.user.username}
          </Typography>
        </Paper>
        <Paper variant="outlined" sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 3,
        }}>
          <Typography variant='h2'>
            Some statistics coming soon...
          </Typography>
        </Paper>
      </Box>
      <Paper variant='outlined' sx={{
        p: 2,
      }}>
        <Typography variant="h6" sx={{
          mb: 1
        }}>
          Latest questions by {props.user.username}
        </Typography>
        <Divider />
        <Box sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mt: 2
        }}>
          {latestQuestions.map((question, index) => (
            <QuestionCard id={question.id} key={index} />
          ))}
        </Box>
      </Paper>
    </Box>
  )
}
