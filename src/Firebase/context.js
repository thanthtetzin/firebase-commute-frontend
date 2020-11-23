import React, { Component, createContext } from "react";
import { firebaseAuth } from "./init";

export const AuthContext = createContext({ user: null });

class AuthProvider extends Component {
  state = {
    user: null,
  };
  componentDidMount = () => {
    firebaseAuth.onAuthStateChanged( user => {
      console.log('onAuthStateChanged: ', user)
      if(user){
        localStorage.setItem('login_user_uid', user.uid);
        this.setState({user: user});
      } else {
        if(localStorage.getItem('login_user_uid')){
          localStorage.removeItem("login_user_uid");
        }
        this.setState({user: null});        
      }
    });
  };

  render() {
    const  user = this.state;
    console.log('context.user ', this.state.user)
    console.log('localStorage_uid: ', localStorage.getItem('login_user_uid'));
   if (!this.state.user && localStorage.getItem('login_user_uid')) return null;

    return (
      <AuthContext.Provider value={this.state.user}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default AuthProvider;
