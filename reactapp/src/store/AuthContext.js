import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { io } from 'socket.io-client';

const AuthContext = React.createContext({
  userName: "",
  login: () => {},
  logout: () => {},
  isLoggedIn: false,
});
export default AuthContext;

export const AuthProvider = (props) => {
	const history = useHistory();
  const [userName, setuserName] = useState(localStorage.getItem("userName"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const isLoggedIn = !!token;

  const login = (token, userName) => {
    // console.log(token, userName, "in login handler authctx");
    localStorage.setItem("token", token);
    localStorage.setItem("userName", userName);
    setToken(token);
    setuserName(userName);
		history.replace('/chatbox');
  };

  const logout = () => {
    setToken(null);
    setuserName(null);
    localStorage.clear();
		history.replace('/');
  };

  const obj = {userName,login,logout,isLoggedIn};
  return (
    <AuthContext.Provider value={obj}>
        {props.children}
    </AuthContext.Provider>
  );
};
