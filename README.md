# firebase-commute-frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). 
- Node version: **v12.19.0** 
- NPM version: **6.14.8**

## Preparation before running the frontend react app
- git clone this `firebase-commute-frontend` repository.
- Run `npm install` at the project directory
- Please make sure the backend app (firebase-commute-backend) is running properly.
- Based on the port the backend app is currently running, please keep the same at `.env.development`. Currently, there is env variable of `REACT_APP_BACKEND_API_ENDPOINT=http://localhost:4000` at `.env.development` file.

## Running the frontend react app
- Run `npm start`. 
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
- You will see login Page. Please login with correct credentials. After login success, you will be able see firstly **Orders List** page.

At **Orders List** page, you will see
- List of orders sorted by **bookingDate** paginated by 10 records per page with **previous** and **next** navigation through the records.
- Can click the View Icon on the right of each record to view the order details. 
- When click, it will redirect you to **Order details** page by opening the new tab.

At **Order details** page, you can edit the `title` and `bookingDate`. Other fields are only for viewing.

You can logout by going to **Nav menu** on top, click **person icon** and click `Logout`.

## Testing the frontend react app
- Run `npm test` to run the simple unit tests
