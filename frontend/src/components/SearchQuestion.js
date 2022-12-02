import React from 'react';
import { useNavigate } from 'react-router-dom';

import SearchIcon from '@mui/icons-material/Search';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';

export default function SearchQuestion(props) {
  const [questionID, setQuestionID] = React.useState(undefined);
  const navigate = useNavigate();

  return (
    <FormControl variant="outlined" sx={{
      display: "flex",
      flexDirection: "row",
    }}>
        <InputLabel htmlFor="question-id">Question ID</InputLabel>
        <OutlinedInput
          id="question-id"
          label="Question ID"
          placeholder='412'
          variant="outlined"
          onChange={(e) => setQuestionID(e.target.value)}
          sx={{
            width: "50%",
          }}
        />
        <Button endIcon={<SearchIcon fontSize='large'/>}
          variant="contained"
          color="primary"
          disabled={questionID === undefined || questionID === ''}
          onClick={() => navigate(`/question/${questionID}`)}
          sx={{
            ml: 2,
            fontSize: "large",
          }}>
          Search
        </Button>
    </FormControl>
  )
}
