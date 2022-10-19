import React from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CancelIcon from '@mui/icons-material/Cancel';

import styles from './styles';

import deleteVoteRequest from './api/deleteVote';
import { CircularProgress } from '@mui/material';
import Utils from './utils';

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={props.votes / props.all * 100.0} {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary" sx={props.labelsx}>
          {`${props.votes} (${Math.round(props.votes / props.all * 100.0)}%)`}
        </Typography>
      </Box>
    </Box>
  );
}

export default function QuestionResultCard(props) {
  const [loading, setLoading] = React.useState(false)

  const navigate = useNavigate();
  const location = useLocation();

  const question = props.question

  const onCancelVote = async () => {
    const { url, opt } = deleteVoteRequest(question.id)
    try {
      setLoading(true);
      const response = await fetch(url, opt);
      if (response.status >= 400) {
        throw new Error(response.statusText);
      }
      else {
        props.onCancelVote();
      }
    }
    catch (error) {
      console.log(error);
      Utils.redirectToLogin(navigate, location)
    }
    finally {
      setLoading(false);
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
            <Link component={RouterLink} to={`../user/${question.owner.id}`}>{question.owner.username}</Link>
          </Typography>
        }
        action={
          <Tooltip title="Cancel vote">
            <IconButton onClick={onCancelVote} disabled={loading}>
              {loading ? <CircularProgress /> : <CancelIcon />}
            </IconButton>
          </Tooltip>
        } />
      <CardContent sx={styles.voteCardContentSx}>
        <List>
          {question.choices.map((choice, index) => {
            const sx = props.chosenid === choice.id ? styles.boldSx : undefined;
            return (
              <ListItem key={index}>
                <ListItemText>
                  <Typography sx={sx}>
                    {choice.text}
                  </Typography>
                  <LinearProgressWithLabel
                    votes={choice.vote_count}
                    all={question.vote_count}
                    labelsx={sx} />
                </ListItemText>
              </ListItem>
            )
          })}
        </List>
        <Typography>
          Total: {question.vote_count} votes
        </Typography>
      </CardContent>
    </Card>
  )
}
