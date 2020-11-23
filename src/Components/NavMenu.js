import React, { useState } from "react";
import {
  Redirect,
  useHistory
} from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { firebaseAuth } from "../Firebase/init";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles({
  float_right: {
    float: 'right'
  },
});
export default function NavMenu() {
  const classes = useStyles();
  const [data, setData] = React.useState({
    anchorEl: null,
    showError: false,
    errorMsg: null,
  });
  let history = useHistory();

  const handleProfileIconClick = (event) => {
    setData({ ...data, anchorEl: event.currentTarget });
  };
  const handleMenuClose = () => {
    setData({ ...data, anchorEl: null });
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setData({ ...data, showError: false });
  };
  const logout = () => {
    firebaseAuth.signOut().then(function(result) {
      // Sign-out successful.
      return <Redirect to="/" />
    }).catch(function(error) {
      // An error happened.
      console.log(error.message);
      setData({ ...data, showError: true });
      setData({ ...data, errorMsg: error.message });
    });
  }

  return (
    <div className={classes.float_right}>
      <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleProfileIconClick} size="small">
        <AccountCircleIcon color="primary" />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={data.anchorEl}
        keepMounted
        open={Boolean(data.anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem to="/orders">My orders</MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>

      <Snackbar open={data.showError} autoHideDuration={3000} onClose={handleCloseSnackBar}>
        <Alert onClose={handleCloseSnackBar} severity="error">
          This is a success message!
        </Alert>
      </Snackbar>
    </div>
  );
}
