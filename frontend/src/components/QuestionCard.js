import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import QuestionVoteCard from './QuestionVoteCard';
import QuestionResultCard from './QuestionResultCard';

import Utils from './utils';
import getQuestionRequest from './api/getQuestion'

export default function QuestionCard(props) {
  const [question, setQuestion] = React.useState(undefined)
  const questionid = props.id

  const navigate = useNavigate();
  const location = useLocation();

  const refreshQuestion = React.useCallback(async () => {
    const { url, opt } = getQuestionRequest(questionid);
    try {
      const response = await fetch(url, opt);
      const response_json = await response.json();
      
      if (response.status === 404) {
        console.log("404 not found");
      }
      else if (response.status >= 400) {
        throw new Error(response.statusText);
      }
      else {
        setQuestion(response_json.question);
      }
    }
    catch (error) {
      console.log(error);
      Utils.redirectToLogin(navigate, location);
    }
  }, [location, navigate, questionid])

  React.useEffect(() => {
    refreshQuestion();
  }, [refreshQuestion]);

  return question === undefined ? <></> : <>{
    question.voted_for !== null ? <QuestionResultCard question={question} onCancelVote={refreshQuestion} chosenid={question.voted_for.id} /> :
      <QuestionVoteCard question={question} onSuccess={refreshQuestion} />
  }</>
}