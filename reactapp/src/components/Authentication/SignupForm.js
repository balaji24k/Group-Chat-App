import { useState,useRef } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { Button, Form, Nav, Spinner } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const SignUpForm = (props) => {
  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const mobileInputRef = useRef();

  const [showPassword, setShowPassword] = useState(false);

  const showPasswordHandler = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredName = nameInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;
    const enteredMobile = mobileInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    nameInputRef.current.value = "";
    emailInputRef.current.value = "";
    passwordInputRef.current.value = "";
    mobileInputRef.current.value = "";
    props.submitHandler(enteredName,enteredEmail,enteredMobile,enteredPassword);
  }

  return (
    <Form onSubmit={submitHandler}>
      <Form.Group className="mb-3">
        <Form.Label>Name:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Name"
          required
          ref={nameInputRef}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email:</Form.Label>
        <Form.Control
          type="email"
          placeholder="Email"
          required
          ref={emailInputRef}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Mobile:</Form.Label>
        <Form.Control
          type="number"
          placeholder="Mobile"
          required
          ref={mobileInputRef}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Password:</Form.Label>
        <div className="input-group">
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            ref={passwordInputRef}
          />
          <Button className="input-group-append" onClick={showPasswordHandler}>
            {showPassword ? <BsEyeSlash /> : <BsEye />}
          </Button>
        </div>
      </Form.Group>
      <Button type="submit" variant="primary">
        {props.isLoading ?   
          <span>
            Creating...
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
          </span>
          : 
          'Signup'
        }
      </Button>
      <Nav>
        <NavLink to="/login">
          Have an Account?
        </NavLink>
      </Nav>
    </Form>
  );
};

export default SignUpForm;
