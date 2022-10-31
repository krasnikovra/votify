const apiURL = "http://127.0.0.1:8000/api/v1/"
const auth = "auth/"
const headers = () => {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Token ${localStorage.getItem('jwt_token') || ''}`,
  }
}

const settings = {
  apiURL: apiURL,
  auth: auth,
  headers: headers
}

export default settings;
