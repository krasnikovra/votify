import getUserRequest from './getUser';

import Utils from '../utils';

const authenticate = async (navigate, location, onSuccess=undefined) => {
  const { url, opt } = getUserRequest();
  try {
    const response = await fetch(url, opt);
    const response_json = await response.json();

    if (response.status >= 400) {
      throw new Error(response.statusText);
    }
    else {
      // refresh out token
      localStorage.setItem('jwt_token', response_json.user.token);
      if (onSuccess !== undefined)
        onSuccess();
    }

    return new Promise((resolve, reject) => {
      response_json.user !== undefined ? resolve(response_json.user) : reject("Authorization failed");
    });
  }
  catch (error) {
    Utils.redirectToLogin(navigate, location);
  }
}

export default authenticate
