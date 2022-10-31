import settings from "./settings"

const postLoginRequest = (username, password) => {
  const url = `${settings.apiURL}${settings.auth}login/`
  const body = {
    user: {
      username: username,
      password: password,
    }
  }
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
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
