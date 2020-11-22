import { useState, useEffect } from 'react';

import { firebaseAuth } from "../Firebase/init";
import axios from 'axios';



 function Orders() {
  console.log(process.env.REACT_APP_BACKEND_API_ENDPOINT)
  
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
            url: `/users/${firebaseAuth.currentUser.uid}`,
            headers: {
              'AuthToken': idToken
            }
          });
          console.log('GetUser result: ' , result);
          const orderRes = await client({
            method: 'get',
            url: `/orders`,
            headers: {
              'AuthToken': idToken
            }
          });
          console.log('GetOrders result: ' , orderRes);
          
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
    <h2>Orders</h2>
  )
}
export default Orders;
