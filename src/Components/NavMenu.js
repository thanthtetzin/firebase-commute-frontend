import React, { useState } from "react";
import {
  Redirect,
  useHistory
} from "react-router-dom";
import {
  makeStyles, IconButton, Button, Menu, MenuItem, Snackbar
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { firebaseAuth } from "../Firebase/init";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles({
  float_right: {
    float: 'right'
  },
  padding_13: {
    padding: '13px'
  },
  margin_right_5px: {
    "margin-right": "5px"
  },
  nav_menu: {
    height: '50px',
    "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 13px 0 rgba(0, 0, 0, 0.19)"
  }
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
    <div className={classes.nav_menu}>
      <IconButton className={`${classes.padding_13} ${classes.float_right}`} aria-controls="simple-menu" aria-haspopup="true" onClick={handleProfileIconClick} size="small">
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
      
      <Button 
        color="primary" 
        className={`${classes.padding_13} ${classes.float_right}`}
        onClick={() => {history.push('/orders')}}
      >
        <ListAltIcon color="primary" className={`${classes.margin_right_5px}`} />
        Orders
      </Button>
      
    </div>
  );
}
