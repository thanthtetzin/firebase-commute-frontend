import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Button,
  Input,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import { firebaseAuth } from "../../../Firebase/init";

const useStyles = makeStyles({
  maring_auto: {
    margin: "auto",
  },
  maring_zero: {
    margin: 0,
  },
  margin_top_20: {
    marginTop: "20px",
  },
  margin_top_30: {
    marginTop: "30px",
  },
});

function Login() {
  const classes = useStyles();
  const [data, setData] = useState({
    email: "",
    password: "",
    showPassword: false,
    loginState: {
      loggingIn: false,
      loginFailed: false,
    },
  });
  const handleChange = (prop) => (event) => {
    setData({ ...data, [prop]: event.target.value });
  };
  const handleClickShowPassword = () => {
    setData({ ...data, showPassword: !data.showPassword });
  };
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    console.log(form.checkValidity());
    if (form.checkValidity() === false) {
      event.stopPropagation();
      form.reportValidity();
    } else {
      console.log(data.email, " ", data.password);
      const newLoginState = setData({
        ...data,
        loginState: {
          loggingIn: true,
          loginFailed: false,
        },
      });
      firebaseAuth
        .signInWithEmailAndPassword(data.email, data.password)
        .then((user) => {
          console.log("Login User: ", user);
          console.log(firebaseAuth.currentUser);
        })
        .catch((error) => {
          console.log("Error in Login: ", error.message);
          setData({
            ...data,
            loginState: {
              loggingIn: false,
              loginFailed: true,
            },
          });
        });
    }
  };
  return (
    <Grid container>
      <Grid item md={3} className={classes.maring_auto}>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid
            item
            className={`${classes.maring_auto} ${classes.margin_top_20}`}
          >
            <FormControl fullWidth required>
              <InputLabel htmlFor="txtEmail">Email</InputLabel>
              <Input
                id="txtEmail"
                type="email"
                required
                disabled={data.loginState.loggingIn}
                value={data.email}
                onChange={handleChange("email")}
              />
            </FormControl>
          </Grid>
          <Grid
            item
            className={`${classes.maring_auto} ${classes.margin_top_20}`}
          >
            <FormControl fullWidth required>
              <InputLabel htmlFor="txtPassword">Password</InputLabel>
              <Input
                id="txtPassword"
                type={data.showPassword ? "text" : "password"}
                required
                disabled={data.loginState.loggingIn}
                value={data.password}
                onChange={handleChange("password")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      disabled={data.loginState.loggingIn}
                    >
                      {data.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          {data.loginState.loginFailed && (
            <Grid item>
              <p className="error-p">Invalid Login email or password</p>
            </Grid>
          )}
          <Grid item className={`${classes.margin_top_30}`}>
            <Button
              id="btnLogin"
              type="submit"
              disabled={data.loginState.loggingIn}
              fullWidth
              variant="outlined"
              color="primary"
            >
              {data.loginState.loggingIn ? "Logging in..." : "Log in"}
            </Button>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}
export default Login;
