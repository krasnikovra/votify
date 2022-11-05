import settings from "./settings"

const postQuestionRequest = (question, choices) => {
  const url = `${settings.apiURL}question/`
  const body = {
    question: {
      text: question,
      choices: choices.map((choice) => {
        return {
          "text": choice
        }
      })
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

export default postQuestionRequest;
