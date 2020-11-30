import { useContext, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
// import Login from "./Login";
//import Orders from "./Orders";
//import NavMenu from "./NavMenu";
import { AuthContext } from "../Firebase/context";

const Login = lazy(() => import('./Pages/Login/Login'));
const Orders = lazy(() => import('./Pages/Orders/Orders'));
const OrderDetails = lazy(() => import('./Pages/Orders/OrderDetails'));
const NavMenu = lazy(() => import('./NavMenu'));

function Routing(){
  const user = useContext(AuthContext);
  const FourZeroFour = () => <h3>404</h3>;
  
  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      user
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
  )
  const LogInRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      !user
        ? <Component {...props} />
        : <Redirect to='/orders' />
    )} />
  )

  console.log('Routing.user', user);
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <Router>
        {user ?
        <NavMenu/>: null}
        <Switch>
          <PrivateRoute exact path="/orders" component={Orders} />
          <PrivateRoute exact path="/orders/view/:id" component={OrderDetails} />
          <LogInRoute exact path="/login" component={Login} />
           
          <Route exact path="/">
            {!user ? <Redirect to="/login" /> : <Redirect to="/orders" />}
          </Route>
          <Route path='*' exact >
            {!user ? <Redirect to="/login" /> : <FourZeroFour/>}
          </Route>

        </Switch>
      </Router>
    </Suspense>
  );
}

export default Routing;
