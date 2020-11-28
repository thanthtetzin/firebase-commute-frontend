import React, { useState, useEffect } from 'react';
import { firebaseAuth } from "../Firebase/init";
import axios from 'axios';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import DataTable from './DataTable';

import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const useStyles = makeStyles(() => ({
  orderH3: {
    paddingTop: '10px',
    paddingLeft: '20px'
  },
}));
function Orders() {
  const classes = useStyles();
  //console.log(process.env.REACT_APP_BACKEND_API_ENDPOINT)
  const [data, setData] = React.useState({
    rows: [],
  });

  const columns = [
    { id: 'title', label: 'Title', minWidth: 170, },
    { 
      id: 'bookingDate', label: 'Booking Date', minWidth: 100,
      format: (value) => {
        if(value._seconds) {
          return value._seconds;
        } else{
          return value;
        }
      }
    },
    { 
      id: 'address', label: 'Address', minWidth: 100,
      format: (value) => value.street ? value.street : ''
    },
    { 
      id: 'customer', label: 'Customer', minWidth: 100,
      format: (value) => value.name ? value.name : '', 
    },
  ];
  const fieldNameForStartAfter = 'bookingDate._seconds';
  const searchParams = {
    collectionName: 'orders',
    filters: [],
    orderBy: {
      //fieldName: 'customer',
      fieldName: 'customer',
      direction: 'asc'
    },
    limit: 10,
  }
  const apiEndPoint = '/documents/?searchParams=';
  
  useEffect(() => {
    async function sendRequest() {
      const client = axios.create({
        baseURL: process.env.REACT_APP_BACKEND_API_ENDPOINT,
        json: true
      })
      if (firebaseAuth.currentUser) {
        try{
          const idToken = await firebaseAuth.currentUser.getIdToken(true);
          console.log('idToken ', idToken);
          const result = await client({
            method: 'get',
            url: `/doc/users/${firebaseAuth.currentUser.uid}`,
            headers: {
              'AuthToken': idToken
            }
          });
          console.log('GetUser result: ' , result);
          
          const searchParams = {
            collectionName: 'orders',
            filters: [],
            orderBy: {
              fieldName: 'customer',
              direction: 'asc'
            },
            limit: 500,
          }
          const orderRes = await client({
            method: 'get',
            url: `/documents/?searchParams=${JSON.stringify(searchParams)}`,
            headers: {
              'AuthToken': idToken
            }
          });
          console.log('GetOrders result: ' , orderRes);
          //setData({ ...data, rows: orderRes.data || null });
        }
        catch(error){
          console.log(error)
        }
      }
      //setToken(token);
    }
    sendRequest();
 }, [])
 
  
  return (
    <div>
      <h3 className={classes.orderH3}>Orders</h3>
      <DataTable columns={columns} searchParams={searchParams} apiEndPoint={apiEndPoint} fieldNameForStartAfter={fieldNameForStartAfter} />
    </div>
  )
}





export default Orders;
