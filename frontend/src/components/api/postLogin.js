const postLoginRequest = (username, password) => {
  const url = "http://127.0.0.1:8000/api/v1/auth/login/"
  const body = {
    user: {
      username: username,
      password: password,
    }
  }
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
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

export default postLoginRequest;
