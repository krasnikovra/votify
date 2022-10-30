const redirectToLogin = (navigate, location) => {
  navigate(`/login/?next=${location.pathname}`);
}

const Utils = {
  redirectToLogin: redirectToLogin,
}

export default Utils;
