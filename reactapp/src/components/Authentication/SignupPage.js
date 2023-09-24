import { useState } from "react";
import classes from "./Auth.module.css";
import SignUpForm from "./SignupForm";

const SignUpPage = () => {

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async(name,email,mobile,password) => {
    console.log(name,email,mobile,password)
  };
  return (
    <section className={classes.box}>
      <h1>SignUp</h1>
      <SignUpForm submitHandler={submitHandler} isLoading={isLoading} />
    </section>
  );
};
export default SignUpPage;