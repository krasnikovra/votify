import settings from "./settings"

const getExternalUser = (userid) => {
  const url = `${settings.apiURL}user/${userid}/`
  const opt = {
    method: "GET",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }

  return {
    url: url,
    opt: opt,
  }
}

export default getExternalUser;
