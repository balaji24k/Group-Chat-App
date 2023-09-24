import React, { useState } from "react";
import classes from "./Auth.module.css";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async(email,password) => {
    try {
      console.log("login data",email,password);
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/user/login`,{
        method: "POST",
        body: JSON.stringify({email,password}),
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong!');
      }
      const data = await response.json();
      console.log(data,"login");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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
