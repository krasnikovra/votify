import React from "react"
import { useNavigate, useSearchParams } from "react-router-dom";

import IconButton from '@mui/material/IconButton';
import OutlinedInput from "@mui/material/OutlinedInput"
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";

import styles from "./styles";

import postLoginRequest from "./api/postLogin";

export default function Login(props) {
  const [values, setValues] = React.useState({
    username: '',
    password: '',
    usernameErrors: null,
    passwordErrors: null,
    errors: null,
    showPassword: false,
    waitingForResponse: false,
  });

  const navigate = useNavigate()

  const [searchParams, ] = useSearchParams();
  const next = searchParams.get('next');

  const handleValueChange = (value) => (e) =>
    setValues({ ...values, [value]: e.target.value });

  const handleMouseDownPassword = (e) =>
    e.preventDefault();

  const handleClickShowPassword = (e) =>
    setValues({ ...values, showPassword: !values.showPassword });

  const handleButtonClick = async (e) => {
    // Sending a log in request
    const { url, opt } = postLoginRequest(values.username, values.password)

    try {
      setValues({ ...values, waitingForResponse: true });
      const response = await fetch(url, opt);
      const response_json = await response.json();

      if (response.status === 400) {
        const errors = response_json.errors;
        setValues({
          ...values,
          usernameErrors: errors.username || null,
          passwordErrors: errors.password || null,
          errors: errors.error || null,
        })
      }
      else if (response.status > 400) {
        throw new Error(response.statusText);
      }
      else {
        // saving JWT token in local storage
        localStorage.setItem('jwt_token', response_json.user.token);
        setValues({
          ...values,
          usernameErrors: null,
          passwordErrors: null,
          errors: null,
        })
        // and redirecting to the page needed authorization
        navigate(next || props.defaultNext);
      }
    }
    catch (error) {
      console.log(error)
      setValues({
        ...values,
        errors: ['Something went wrong, please try again later.'],
      })
    }
    finally {
      setValues({ ...values, waitingForResponse: false });
    }
  }

  return (
    <Box sx={styles.centered}>
      <Typography sx={styles.formHeaderSx}>
        Log in
      </Typography>
      <FormControl error={values.usernameErrors !== null || values.errors !== null} sx={styles.formFieldSx} variant="outlined">
        <InputLabel htmlFor="username">Username</InputLabel>
        <OutlinedInput
          id="username"
          label="Username"
          variant="outlined"
          onChange={handleValueChange('username')}
        />
        {values.usernameErrors !== null &&
          values.usernameErrors.map((err, idx) => <FormHelperText key={idx}> {err} </FormHelperText>)}
      </FormControl>
      <FormControl error={values.passwordErrors !== null || values.errors !== null} sx={styles.formFieldSx} variant="outlined">
        <InputLabel htmlFor="password">Password</InputLabel>
        <OutlinedInput
          id="password"
          type={values.showPassword ? 'text' : 'password'}
          value={values.password}
          onChange={handleValueChange('password')}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {values.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
        {values.passwordErrors !== null &&
          values.passwordErrors.map((err, idx) => <FormHelperText key={idx}> {err} </FormHelperText>)}
        {values.errors !== null &&
          values.errors.map((err, idx) => <FormHelperText key={idx}> {err} </FormHelperText>)}
      </FormControl>
      <FormControl sx={styles.formButtonSx} variant="outlined">
        <LoadingButton
          variant="contained"
          loading={values.waitingForResponse}
          loadingPosition='end'
          endIcon={<SendIcon />}
          onClick={handleButtonClick}>
          Log in
        </LoadingButton>
      </FormControl>
    </Box>
  );
}
