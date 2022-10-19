const postVoteRequest = (choiceid) => {
  const url = "http://127.0.0.1:8000/api/v1/vote/"
  const body = {
    choice: {
      id: choiceid
    }
  }
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Token ${localStorage.getItem('jwt_token') || ''}`,
  }
  const opt = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  }

  return {
    url: url,
    opt: opt,
  }
}

export default postVoteRequest;
