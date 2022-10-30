const getQuestionRequest = (questionid) => {
  const url = `http://127.0.0.1:8000/api/v1/questions/${questionid}/`
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Token ${localStorage.getItem('jwt_token') || ''}`,
  }
  const opt = {
    method: "GET",
    headers: headers,
  }

  return {
    url: url,
    opt: opt,
  }
}

export default getQuestionRequest;
