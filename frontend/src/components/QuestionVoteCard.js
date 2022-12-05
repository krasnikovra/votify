import React from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link'
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';

import styles from './styles';

import postVoteRequest from './api/postVote';
import Utils from './utils';

export default function VoteCard(props) {
  const [state, setState] = React.useState({
    loading: false,
    choiceid: undefined,
  })

  const question = props.question

  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (choiceid) => async () => {
    const { url, opt } = postVoteRequest(choiceid);
    try {
      setState({ loading: true, choiceid: choiceid });
      const response = await fetch(url, opt);
      
      if (response.status >= 400) {
        throw new Error(response.statusText)
      }
      else {
        props.onSuccess();
      }
    }
    catch (error) {
      console.log(error);
      Utils.redirectToLogin(navigate, location);
    }
    finally {
      setState({ loading: false, choiceid: choiceid });
    }
  }

  return (
    <Card sx={styles.voteCardSx} variant='outlined'>
      <CardHeader
        sx={styles.voteCardHeaderSx}
        title={
          <Typography sx={styles.voteCardQuestionSx}>
            {question.text}
          </Typography>
        }
        subheader={
          <Typography sx={styles.voteCardHeaderSubheaderSx}>
            Posted on {question.date_published} by&nbsp; 
            <Link component={RouterLink} to={`../profile/${question.owner.id}`}>{question.owner.username}</Link>
          </Typography>
        } />
      <CardContent sx={styles.voteCardContentSx}>
        <List>
          {question.choices.map((choice, index) => {
            return (
              <ListItem key={index}>
                <ListItemButton divider={true} onClick={handleClick(choice.id)}>
                  <ListItemText>
                    {choice.text}
                  </ListItemText>
                  {state.loading && state.choiceid === choice.id &&
                    <CircularProgress color="inherit" />
                  }
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </CardContent>
    </Card>
  )
}
