import { useState } from "react";
import classes from "./Auth.module.css";
import SignUpForm from "./SignupForm";

const SignUpPage = () => {

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async(name,email,mobile,password) => {
    try {
      setIsLoading(true);
			console.log("backend url",process.env.REACT_APP_BACKEND_API)
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/user/signup`,{
        method: "POST",
        body: JSON.stringify({name,email,mobile,password}),
        headers: {
          "Content-Type": "application/json",
        },
      })
      console.log("response",response)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong!');
      }
      setIsLoading(false);
      alert("Accouct Created Succesfully!")
    } 
    catch (error) {
      setIsLoading(false);
      alert(error);
    }
  };
  return (
    <section className={classes.box}>
      <h1>SignUp</h1>
      <SignUpForm submitHandler={submitHandler} isLoading={isLoading} />
    </section>
  );
};
export default SignUpPage;