import settings from "./settings"

const getQuestionSearch = (text="", page=1) => {
  const url = `${settings.apiURL}question/search/?text=${text}&page=${page}`
  const opt = {
    method: "GET",
    headers: settings.headers(),
  }

  return {
    url: url,
    opt: opt,
  }
}

export default getQuestionSearch;
