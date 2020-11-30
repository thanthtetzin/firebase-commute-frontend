import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Button, Input, FormControl, InputLabel} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { firebaseAuth } from "../../../Firebase/init";
import axios from 'axios';
import { AuthContext } from "../../../Firebase/context";

const client = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_ENDPOINT,
  json: true
})
const useStyles = makeStyles({
  maring_auto: {
    margin: 'auto'
  },
  maring_zero: {
    margin: 0
  },
  margin_top_20:{
    marginTop: '20px'
  },
  margin_top_30:{
    marginTop: '30px'
  }
});



function Login() {
  
  const classes = useStyles();
  const [data, setData] = React.useState({
    email: '',
    password: '',
    showPassword: false,
    loginFailed: false,
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
    } else{
      console.log(data.email, ' ', data.password);
      setData({...data, loginFailed: false});
      firebaseAuth.signInWithEmailAndPassword(data.email, data.password)
      .then((user) => {
        console.log("Login User: ", user);
        console.log(firebaseAuth.currentUser);
      })
      .catch((error) => {
        console.log("Error in Login: ", error.message);
        setData({...data, loginFailed: true});
      });
    }
  }
  return (
    
        <Grid container >
          <Grid item md={3} className={classes.maring_auto}>
              <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid item  className={`${classes.maring_auto} ${classes.margin_top_20}`}>
                  <FormControl fullWidth required>
                    <InputLabel htmlFor="txtEmail">Email</InputLabel>
                    <Input
                      id="txtEmail"
                      type='email'
                      value={data.email}
                      onChange={handleChange('email')}
                    />
                  </FormControl>
                </Grid>
                <Grid item className={`${classes.maring_auto} ${classes.margin_top_20}`}>
                  <FormControl fullWidth required>
                    <InputLabel htmlFor="txtPassword">Password</InputLabel>
                    <Input
                      id="txtPassword"
                      type={data.showPassword ? 'text' : 'password'}
                      value={data.password}
                      onChange={handleChange('password')}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                          >
                            {data.showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
                { data.loginFailed &&
                  <Grid item>
                    <p className='error-p'>Invalid Login email or password</p>
                  </Grid>
                }
                <Grid item className={`${classes.margin_top_30}`}>
                  <Button type="submit" fullWidth variant="outlined" color="primary"

                  >
                    Log in
                  </Button>
                </Grid>
                
              </form>
      
          </Grid>
        </Grid>
      
    
      
    
    
  );
}
export default Login;