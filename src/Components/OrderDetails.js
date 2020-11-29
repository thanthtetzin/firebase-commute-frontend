import { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Button, Input, FormControl, InputLabel, TextField} from '@material-ui/core';
import { firebaseAuth } from "../Firebase/init";
import {
  useParams
} from "react-router-dom";
import axios from 'axios';
import moment from 'moment';
import 'moment-timezone';

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

function OrderDetails() {
  const classes = useStyles();
  const [data, setData] = useState({
    orderInfo: null,
    orderFieldsForUpdate: {
      title: '',
      bookingDate: 0,
    },
    isLoading: true,
  });
  useEffect(() => {
    loadData();
  }, [])
  const { id } = useParams();

  console.log('data: ', data);
  
  const loadData = async () => {
    const client = axios.create({
      baseURL: process.env.REACT_APP_BACKEND_API_ENDPOINT,
      json: true
    })
    if (id && firebaseAuth.currentUser) {
      try{
        const idToken = await firebaseAuth.currentUser.getIdToken(true);
        console.log('idToken ', idToken);
        const result = await client({
          method: 'get',
          url: `/doc/orders/${id}`,
          headers: {
            'AuthToken': idToken
          }
        });
        if(result.data && Object.keys(result.data).length) {
          let bookingDateTimeStampVal = result.data.bookingDate._seconds ? result.data.bookingDate._seconds : result.data.bookingDate;
          if(!bookingDateTimeStampVal){
            bookingDateTimeStampVal = 0;
          }
          if((new Date(bookingDateTimeStampVal)).getTime() >= 0){
            result.data.bookingDate = moment(moment.unix(bookingDateTimeStampVal)).tz(moment.tz.guess()).format('YYYY-MM-DD');
          }
          data.orderFieldsForUpdate = {
            title: result.data.title,
            bookingDate: result.data.bookingDate,
          };
          data.isLoading = false;
          
          setData({ ...data, orderInfo: result.data || null });
        }
        console.log('Order Detail: ' , result);
      }
      catch(error){
        console.log(error);
      }
    }
  }

  const handleBookingDateChange = () =>  (event) => {
    setData({ ...data, orderFieldsForUpdate: {
      title: data.orderFieldsForUpdate.title,
      bookingDate: event.target.value,
    } });
  };
  const handleTitleChange = () => (event) => {
    setData({ ...data, orderFieldsForUpdate: {
      title: event.target.value,
      bookingDate: data.orderFieldsForUpdate.bookingDate,
    } });
  };
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    console.log(form.checkValidity());
    if (form.checkValidity() === false || !data.orderFieldsForUpdate) {
      event.stopPropagation();
      form.reportValidity();
    } else{

      console.log(data);
      const clonedOrderFieldsForUpdate = JSON.parse(JSON.stringify(data.orderFieldsForUpdate));
      clonedOrderFieldsForUpdate.bookingDate = moment(clonedOrderFieldsForUpdate.bookingDate, "YYYY-MM-DD").valueOf();
      console.log('clonedOrderFieldsForUpdate: ', clonedOrderFieldsForUpdate)
      // console.log(data.email, ' ', data.password);
      // setData({...data, loginFailed: false});
      // firebaseAuth.signInWithEmailAndPassword(data.email, data.password)
      // .then((user) => {
      //   console.log("Login User: ", user);
      //   console.log(firebaseAuth.currentUser);
      // })
      // .catch((error) => {
      //   console.log("Error in Login: ", error.message);
      //   setData({...data, loginFailed: true});
      // });
    }
  }
  return (
        !data.orderInfo
        ? null
        : <Grid container >
          <Grid item md={3} className={classes.maring_auto}>
              <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid item  className={`${classes.maring_auto} ${classes.margin_top_20}`}>
                  <FormControl fullWidth required>
                    <InputLabel htmlFor="txtTitle" shrink>Title</InputLabel>
                    <Input
                      id="txtTitle"
                      type='text'
                      value={data.orderFieldsForUpdate.title}
                      onChange={handleTitleChange()}
                    />
                  </FormControl>
                </Grid>
                <Grid item className={`${classes.maring_auto} ${classes.margin_top_20}`}>
                  <FormControl fullWidth required>
                    <InputLabel htmlFor="dtpBookingDate" shrink>Booking Date</InputLabel>
                    <Input
                      id="dtpBookingDate"
                      type='date'
                      value={data.orderFieldsForUpdate.bookingDate}
                      onChange={handleBookingDateChange()}
                    />
                  </FormControl>
                </Grid>
                { data.loginFailed &&
                  <Grid item>
                    <p className='error-p'>Error in Updating</p>
                  </Grid>
                }
                <Grid item className={`${classes.margin_top_30}`}>
                  <Button type="submit" fullWidth variant="outlined" color="primary"

                  >
                    Update
                  </Button>
                </Grid>
                
              </form>
      
          </Grid>
        </Grid>
      
    
      
    
    
  );
}
export default OrderDetails;