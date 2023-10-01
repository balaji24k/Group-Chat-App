import { useRef, useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { Button, Form, Spinner } from "react-bootstrap";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import classes from "./Auth.module.css";

const LoginForm = (props) => {
  const emailRef = useRef();
  const passwordRef = useRef();

	const [showPassword, setShowPassword] = useState(false);
  const showPasswordHandler = () => {
    setShowPassword(!showPassword);
  };
	const submitHandler = (event) =>{
		event.preventDefault();
		const email = emailRef.current.value;
		const password = passwordRef.current.value;
    if (email === "" || password === "") {
      alert("Must fill both Email and Password");
      return;
    } 
    emailRef.current.value = "";
    passwordRef.current.value = "";
		props.submitHandler(email,password);
	}
  return (
    <Form onSubmit={submitHandler}>
      <Form.Group className="mb-3">
        <Form.Label>Email:</Form.Label>
        <Form.Control type="text" placeholder="Email" ref={emailRef} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password:</Form.Label>
        <div className="input-group">
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            ref={passwordRef}
          />
          <Button
            className="input-group-append"
            onClick={showPasswordHandler}
          >
            {showPassword ? <BsEyeSlash /> : <BsEye />}
          </Button>
        </div>
      </Form.Group>

      <div className={classes.button}>
        <Button type="submit">
        {props.isLoading ?   
          <span>
            Logging in...
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
          </span>
          : 
          'Login'
        }
        </Button>
        <NavLink to="/signup">
          Don't have an Account?
        </NavLink>
      </div>
      <NavLink to="/forgotPassword">
          Forgot Password?
      </NavLink>
    </Form>
  );
};

export default LoginForm;
