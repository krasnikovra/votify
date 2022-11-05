import settings from "./settings"

const getQuestionRequest = (questionid) => {
  const url = `${settings.apiURL}question/${questionid}/`
  const opt = {
    method: "GET",
    headers: settings.headers(),
  }

  return {
    url: url,
    opt: opt,
  }
}

export default getQuestionRequest;
