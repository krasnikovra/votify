import React from 'react';
import { useMatch } from 'react-router-dom';
import QuestionCard from './QuestionCard';

export default function Question(props) {
  const match = useMatch('question/:questionid');
  const questionid = match.params.questionid;

  return <QuestionCard id={questionid} />
}
