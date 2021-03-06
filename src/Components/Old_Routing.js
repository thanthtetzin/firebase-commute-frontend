OldRounting.js

import { useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Login from "./Login";
import Orders from "./Orders";
import NavMenu from "./NavMenu";
import { AuthContext } from "../Firebase/context";


function Routing(){
 const user = useContext(AuthContext);
  const FourZeroFour = () => <h3>404</h3>;
  console.log('Routing.user', user);
  return (
    <Router>
      {user ?
      <NavMenu/>: null}
      <Switch>
        <Route exact path="/orders">
          {!user ? <Redirect to="/login" /> : 
          <Orders/>}
        </Route>
      
        <Route exact path="/login">
          {!user ? <Login/> : <Redirect to="/orders" />}
        </Route>
        <Route exact path="/">
          {!user ? <Redirect to="/login" /> : <Redirect to="/orders" />}
        </Route>
        <Route path='*' exact={true}  >
          {!user ? <Redirect to="/login" /> : <FourZeroFour/>}
        </Route>
      </Switch>
    </Router>

  );
}

export default Routing;
