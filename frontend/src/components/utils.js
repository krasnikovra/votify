const redirectToLogin = (navigate, location) => {
  navigate(`/login/?next=${location.pathname}`);
}

// see: https://github.com/mui/material-ui/blob/v5.10.13/docs/data/material/components/avatars/BackgroundLetterAvatars.js
const stringToColor = (string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

const stringAvatar = (name, sx) => {
  return {
    sx: {
      ...sx,
      bgcolor: stringToColor(name),
    },
    children: name[0],
  };
}

const Utils = {
  redirectToLogin: redirectToLogin,
  stringAvatar: stringAvatar,
}

export default Utils;
