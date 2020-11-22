import React, { Component, createContext } from "react";
import { firebaseAuth } from "./init";

export const AuthContext = createContext({ user: null });

class AuthProvider extends Component {
  state = {
    user: null
  };
  componentDidMount = async () => {
    firebaseAuth.onAuthStateChanged( user => {
      this.setState({user: user});
    });
  };

  render() {
    const  user = this.state;
    if (!this.state.user) return "";

    return (
      <AuthContext.Provider value={user}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default AuthProvider;
