import settings from "./settings"

const postVoteRequest = (choiceid) => {
  const url = `${settings.apiURL}vote/`
  const body = {
    choice: {
      id: choiceid
    }
  }
  const opt = {
    method: "POST",
    headers: settings.headers(),
    body: JSON.stringify(body),
  }

  return {
    url: url,
    opt: opt,
  }
}

export default postVoteRequest;
