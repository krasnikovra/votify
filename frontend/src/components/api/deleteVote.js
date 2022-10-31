import settings from "./settings"

const deleteVoteRequest = (questionid) => {
  const url = `${settings.apiURL}vote/`
  const body = {
    question: {
      id: questionid
    }
  }
  const opt = {
    method: "DELETE",
    headers: settings.headers(),
    body: JSON.stringify(body),
  }

  return {
    url: url,
    opt: opt,
  }
}

export default deleteVoteRequest;
