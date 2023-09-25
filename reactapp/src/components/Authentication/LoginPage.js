import React, { useContext, useState } from "react";
import classes from "./Auth.module.css";
import LoginForm from "./LoginForm";
import AuthContext from "../../store/AuthContext";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {login} = useContext(AuthContext);

  const submitHandler = async(email,password) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/user/login`,{
        method: "POST",
        body: JSON.stringify({email,password}),
        headers: {
          "Content-Type": "application/json",
        },
      })
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong!');
      }
      const data = await response.json();
      console.log(data,"login");
      login(data.token,data.name);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <section className={classes.box}>
      <h1>Login</h1>
      <LoginForm isLoading={isLoading} submitHandler={submitHandler} />
    </section>
  );
};

export default LoginPage;
