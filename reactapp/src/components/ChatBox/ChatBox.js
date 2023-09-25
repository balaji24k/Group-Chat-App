import React, { useRef } from "react";
import { Form, Button } from "react-bootstrap";
import classes from "./ChatBox.module.css";

const ChatBox = () => {
  const messageRef = useRef();

  const submitHandler = async (event) => {
    try {
      event.preventDefault();
      const message = messageRef.current.value;
      console.log(message, "message");
      const token = localStorage.getItem("token");
      const userName = localStorage.getItem("userName");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ userName, message }),
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (!response.ok) {
        const errordata = response.json();
        console.log(errordata, "err");
        throw new Error("Failed!");
      }
			messageRef.current.value = "";
      const data = await response.json();
      console.log(data, "posted data");
    } 
		catch (error) {
      console.log(error, "errr catch");
    }
  };

  return (
    <Form className={classes.form} onSubmit={submitHandler}>
      <Form.Control
        className={classes.input}
        placeholder="Type a Message"
        type="text"
        ref={messageRef}
      />
      <Button type="submit">Send</Button>
    </Form>
  );
};

export default ChatBox;
