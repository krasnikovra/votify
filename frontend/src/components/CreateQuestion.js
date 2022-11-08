import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import LoadingButton from "@mui/lab/LoadingButton";
import Button from '@mui/material/Button';

import styles from './styles';
import postQuestionRequest from './api/postQuestion';
import Utils from './utils';


export default function CreateQuestion(props) {
  const [loading, setLoading] = React.useState(false)
  const [question, setQuestion] = React.useState("")
  const [choices, setChoices] = React.useState(["", ""])

  const navigate = useNavigate()
  const location = useLocation()

  const onButtonClick = async () => {
    const { url, opt } = postQuestionRequest(question, choices)
    try {
      setLoading(true)
      const response = await fetch(url, opt)
      const response_json = await response.json()
      if (response.status === 403) {
        Utils.redirectToLogin(navigate, location)
      }
      else if (response.status >= 400) {
        throw new Error(response.statusText)
      } else {
        navigate(`/question/${response_json.question.id}`)
      }
    } catch(error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const card = (
    <Box sx={styles.voteCardSx}>
      <Card variant='outlined'>
        <CardHeader
          sx={styles.voteCardHeaderSx}
          title={
            <TextField variant="outlined"
              label="Question"
              value={question}
              onInput={(e) => setQuestion(e.target.value)}
              sx={{
                width: "100%",
              }} />
          } />
        <CardContent sx={styles.voteCardContentSx}>
          <List>
            {choices.map((choice, index) => {
              return (
                <ListItem key={index}>
                  <ListItemText>
                    <Box sx={{
                      display: "flex",
                      width: "100%",
                    }}>
                      <TextField variant="outlined"
                        label={`Choice #${index + 1}`}
                        value={choice}
                        sx={{
                          width: "100%",
                        }}
                        onInput={(e) =>
                          setChoices(choices.map((choice_, index_) => index === index_ ? e.target.value : choice_))
                        }
                      />
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{
                          ml: 2,
                        }}
                        onClick={() =>
                          setChoices(choices.filter((choice_, index_) => index !== index_))
                        }>
                        <ClearIcon fontSize="medium" />
                      </Button>
                    </Box>
                  </ListItemText>
                </ListItem>
              )
            })}
          </List>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              display: "flex",
              mx: "auto",
              width: "100%"
            }}
            onClick={() => setChoices([...choices, ""])}>
            <AddIcon fontSize='large' />
          </Button>
        </CardContent>
      </Card>
      <LoadingButton variant="contained"
        endIcon={<SaveAsIcon fontSize='large' />}
        loading={loading}
        loadingPosition='end'
        sx={{
          display: "flex",
          mt: 2,
          ml: "auto",
          mr: 0,
          py: 1,
        }}
        onClick={onButtonClick}>
        Create question
      </LoadingButton>
    </Box>
  )

  return (
    <Box>
      {card}
    </Box>
  )
}
