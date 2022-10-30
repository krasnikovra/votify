const deleteVoteRequest = (questionid) => {
  const url = "http://127.0.0.1:8000/api/v1/vote/"
  const body = {
    question: {
      id: questionid
    }
  }
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Token ${localStorage.getItem('jwt_token') || ''}`,
  }
  const opt = {
    method: "DELETE",
    headers: headers,
    body: JSON.stringify(body),
  }

  return {
    url: url,
    opt: opt,
  }
}

export default deleteVoteRequest;
