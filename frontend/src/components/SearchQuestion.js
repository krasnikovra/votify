import React from 'react';

import SearchIcon from '@mui/icons-material/Search';

import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import QuestionCard from './QuestionCard';
import getQuestionSearch from './api/getQuestionSearch';
import Pagination from '@mui/material/Pagination';

export default function SearchQuestion(props) {
  const [questionText, setQuestionText] = React.useState("");
  const [questions, setQuestions] = React.useState([])
  const [pagesCount, setPagesCount] = React.useState(0)

  const getQuestions = async (questionText, page=1) => {
    const { url, opt } = getQuestionSearch(questionText, page)
    try {
      const response = await fetch(url, opt)
      const response_json = await response.json()
      if (response.status >= 400) {
        setQuestions([])
        setPagesCount(0)
      } else {
        console.log(response_json)
        setQuestions(response_json.questions)
        setPagesCount(response_json.pages)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Box variant="outlined" sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
      }}>
        <FormControl sx={{
          width: "30%"
        }}>
          <InputLabel htmlFor="question-id">Question text</InputLabel>
          <OutlinedInput
            id="question-id"
            label="Question text"
            placeholder='412'
            variant="outlined"
            onChange={(e) => setQuestionText(e.target.value)}
            sx={{
              width: "100%",
            }}
          />
        </FormControl>
        <Button endIcon={<SearchIcon fontSize='large' />}
          variant="contained"
          color="primary"
          disabled={questionText === ""}
          onClick={() => {
            getQuestions(questionText)
          }}
          sx={{
            ml: 2,
            fontSize: "large",
          }}>
          Search
        </Button>
      </Box>
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-start",
        mt: 2
      }}>
        {questions.map((question, index) => (
          <QuestionCard id={question.id} key={index} />
        ))}
      </Box>
      {pagesCount > 0 && (
        <Box sx={{
          display: "flex",
          justifyContent: "center",
        }}>
          <Pagination sx={{
            position: "absolute",
            top: "80vh",
          }}
            count={pagesCount}
            color="primary"
            size="large"
            onChange={(e, value) => getQuestions(questionText, value)}
          />
        </Box>
      )}
    </>
  )
}
