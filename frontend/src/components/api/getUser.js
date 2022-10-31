import settings from "./settings"

const getUserRequest = () => {
  const url = `${settings.apiURL}${settings.auth}user/`
  const opt = {
    method: "GET",
    headers: settings.headers(),
  }

  return {
    url: url,
    opt: opt,
  }
}

export default getUserRequest;
