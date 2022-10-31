import settings from "./settings"

const postRegisterRequest = (username, email, password) => {
  const url = `${settings.apiURL}${settings.auth}register/`
  const body = {
    user: {
      username: username,
      email: email,
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

export default postRegisterRequest;
