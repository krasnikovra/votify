import settings from "./settings"

const getLatestQuestions = (userid) => {
  const url = `${settings.apiURL}user/${userid}/question/latest/`
  const opt = {
    method: "GET",
    headers: settings.headers(),
  }

  return {
    url: url,
    opt: opt,
  }
}

export default getLatestQuestions;
