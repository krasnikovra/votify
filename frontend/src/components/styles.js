const styles = {
  centered: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
  },
  boldSx: {
    fontWeight: 600,
  },
  formHeaderSx: {
    fontSize: 50,
    mb: 3, 
  },
  formFieldSx: {
    m: 1,
    width: '40ch',
  },
  formButtonSx: {
    m: 1,
    width: '40ch',
    justifyContent: 'space-between',
    alignItems: 'end',
    flexDirection: 'row',
  },
  voteCardSx: {
    maxWidth: '50ch',
    minWidth: '30ch',
    flexGrow: 1,
  },
  voteCardQuestionSx: {
    fontSize: 20,
  },
  voteCardHeaderTitleSx: {
    fontSize: 20,
    color: 'text.secondary'
  },
  voteCardHeaderSubheaderSx: {
    fontSize: 12,
    color: 'text.secondary'
  },
  voteCardHeaderSx: {
    bgcolor: '#eeddd6',
  },
  voteCardContentSx: {
    bgcolor: '#d6e7ee',
  }
}

export default styles;
