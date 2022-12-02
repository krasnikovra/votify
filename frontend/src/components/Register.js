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
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

import styles from "./styles";

import postRegisterRequest from "./api/postRegister";

export default function Register(props) {
  const isFirstRenderOf = React.useRef({
    username: true,
    email: true,
    password: true,
    passwordRepeat: true,
  })

  const [values, setValues] = React.useState({
    username: '',
    email: '',
    password: '',
    passwordRepeat: '',
  });

  const [errors, setErrors] = React.useState({
    usernameErrors: [],
    emailErrors: [],
    passwordErrors: [],
    passwordRepeatErrors: [],
  })

  const [networkErrors, setNetworkErrors] = React.useState({
    usernameErrors: [],
    emailErrors: [],
    passwordErrors: [],
    errors: [],
  })

  const [loading, setLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [showPasswordRepeat, setShowPasswordRepeat] = React.useState(false)
  const [validated, setValidated] = React.useState(false)

  const navigate = useNavigate()

  const [searchParams,] = useSearchParams();
  const next = searchParams.get('next');

  const handleValueChange = (value) => (e) => {
    setValues({ ...values, [value]: e.target.value });
  }

  const handleMouseDownPassword = (e) =>
    e.preventDefault();

  const handleButtonClick = async (e) => {
    if (validated) {
      // Sending a log in request
      const { url, opt } = postRegisterRequest(values.username, values.email, values.password)

      try {
        setLoading(true)
        const response = await fetch(url, opt);
        const response_json = await response.json();

        if (response.status === 400) {
          const response_errors = response_json.errors;
          setNetworkErrors({
            usernameErrors: response_errors.username || [],
            passwordErrors: response_errors.password || [],
            emailErrors: response_errors.email || [],
            errors: response_errors.error || [],
          })
        }
        else if (response.status > 400) {
          throw new Error(response.statusText);
        }
        else {
          // saving JWT token in local storage
          localStorage.setItem('jwt_token', response_json.user.token);
          setNetworkErrors({
            usernameErrors: [],
            emailErrors: [],
            passwordErrors: [],
            errors: [],
          })
          // and redirecting to the page needed authorization
          navigate(next || props.defaultNext);
        }
      }
      catch (error) {
        console.log(error)
        setErrors({
          ...errors,
          errors: ['Something went wrong, please try again later.'],
        })
      }
      finally {
        setLoading(false)
      }
    }
  }

  const validate = (validator) => {
    if (isFirstRenderOf.current[validator.value]) {
      isFirstRenderOf.current[validator.value] = false
    }
    else {
      let errorsContainer = []

      if (values[validator.value] === "") {
        errorsContainer = [...errorsContainer, "This field should not be empty"]
      }

      for (const rule of validator.rules) {
        if (rule.regExp?.test(values[validator.value]) === false ||
          rule.callback?.test(values[validator.value]) === false) {
          errorsContainer = [...errorsContainer, rule.error]
        }
      }

      setErrors((errors) => {
        return {
          ...errors,
          [`${validator.value}Errors`]: errorsContainer,
        }
      })
    }
  }

  const validators = {
    username: {
      value: 'username',
      rules: []
    },
    email: {
      value: 'email',
      rules: [
        {
          regExp: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          error: "Current email is not the valid email",
        },
      ],
    },
    password: {
      value: 'password',
      rules: [
        {
          regExp: /^(?=.*[0-9])/,
          error: "A password should contain at least one number of 0-9",
        },
        {
          regExp: /^(?=.*[a-z])/,
          error: "A password should contain at least one small letter of a-z",
        },
        {
          regExp: /^(?=.*[A-Z])/,
          error: "A password should contain at least one capital letter of A-Z",
        },
        {
          regExp: /^(?=.*[@#$%^&+=])/,
          error: "A password should contain at least one special character of @#$%^&+=",
        },
        {
          regExp: /^.{8,}$/,
          error: "A password should consist of at least 8 characters",
        },
        {
          regExp: /^(?!.*[^a-zA-Z0-9@#$%^&+=]+)/,
          error: "A password should consist of 0-9, a-z, A-Z, @#$%^&+= and no other characters",
        },
      ],
    },
    passwordRepeat: {
      value: 'passwordRepeat',
      rules: [
        {
          callback: {
            test: (passwordRepeat) => passwordRepeat === values.password,
          },
          error: "Passwords are not the same",
        },
      ],
    },
  }

  // The next code is kinda messy because React doesn't
  // allow us to use React.useEffect in a callback param
  // for validators.forEach

  React.useEffect(() => {
    validate(validators.username)
    // validators and validate are constants so this should be fine
    // eslint-disable-next-line
  }, [values.username])

  React.useEffect(() => {
    validate(validators.email)
    // validators and validate are constants so this should be fine
    // eslint-disable-next-line
  }, [values.email])

  React.useEffect(() => {
    validate(validators.password)
    validate(validators.passwordRepeat)
    // validators and validate are constants so this should be fine
    // eslint-disable-next-line
  }, [values.password, values.passwordRepeat])

  React.useEffect(() => {
    const noErrors = Object.values(errors).every(list => list.length === 0)
    const noEmptyValues = Object.values(values).every(value => value !== "")
    setValidated(noErrors && noEmptyValues)
  }, [errors, values])

  return (
    <Box sx={styles.centered}>
      <Typography sx={styles.formHeaderSx}>
        Register
      </Typography>
      <FormControl error={errors.usernameErrors.length + 
       networkErrors.usernameErrors.length + networkErrors.errors.length > 0}
        sx={styles.formFieldSx} variant="outlined">
        <InputLabel htmlFor="username">Username</InputLabel>
        <OutlinedInput
          id="username"
          label="Username"
          variant="outlined"
          value={values.username}
          onInput={handleValueChange('username')}
        />
        {errors.usernameErrors.map((err, idx) => <FormHelperText key={idx}> {err} </FormHelperText>)}
        {networkErrors.usernameErrors.map((err, idx) => <FormHelperText key={idx}> {err} </FormHelperText>)}
      </FormControl>
      <FormControl error={errors.emailErrors.length + 
       networkErrors.emailErrors.length + networkErrors.errors.length > 0}
        sx={styles.formFieldSx} variant="outlined">
        <InputLabel htmlFor="email">Email</InputLabel>
        <OutlinedInput
          id="email"
          label="Email"
          variant="outlined"
          value={values.email}
          onInput={handleValueChange('email')}
        />
        {errors.emailErrors.map((err, idx) => <FormHelperText key={idx}> {err} </FormHelperText>)}
        {networkErrors.emailErrors.map((err, idx) => <FormHelperText key={idx}> {err} </FormHelperText>)}
      </FormControl>
      <FormControl error={errors.passwordErrors.length + 
       networkErrors.passwordErrors.length + networkErrors.errors.length > 0}
        sx={styles.formFieldSx} variant="outlined">
        <InputLabel htmlFor="password">Password</InputLabel>
        <OutlinedInput
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={values.password}
          onInput={handleValueChange('password')}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
        {errors.passwordErrors.map((err, idx) => <FormHelperText key={idx}> {err} </FormHelperText>)}
        {networkErrors.passwordErrors.map((err, idx) => <FormHelperText key={idx}> {err} </FormHelperText>)}
      </FormControl>
      <FormControl error={errors.passwordRepeatErrors.length + networkErrors.errors.length > 0}
        sx={styles.formFieldSx} variant="outlined">
        <InputLabel htmlFor="password-repeat">Repeat password</InputLabel>
        <OutlinedInput
          id="password-repeat"
          type={showPasswordRepeat ? 'text' : 'password'}
          value={values.passwordRepeat}
          onChange={handleValueChange('passwordRepeat')}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPasswordRepeat(!showPasswordRepeat)}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPasswordRepeat ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Repeat password"
        />
        {errors.passwordRepeatErrors.map((err, idx) => <FormHelperText key={idx}> {err} </FormHelperText>)}
      </FormControl>
      <FormControl sx={styles.formButtonSx} variant="outlined">
        <LoadingButton
          variant="outlined"
          color="secondary"
          loading={loading}
          loadingPosition='end'
          endIcon={<ChangeCircleIcon />}
          onClick={() => navigate(`/login/${next !== null ? `?next=${next}` : ""}`)}>
          Log in
        </LoadingButton>
        <LoadingButton
          variant="contained"
          disabled={!validated}
          loading={loading}
          loadingPosition='end'
          endIcon={<SendIcon />}
          onClick={handleButtonClick}>
          Register
        </LoadingButton>
      </FormControl>
      <FormControl sx={styles.formFieldSx} variant="outlined" error={networkErrors.errors.length > 0}>
        {networkErrors.errors.map((err, idx) => <FormHelperText key={idx}> {err} </FormHelperText>)}
      </FormControl>
    </Box>
  );
}
