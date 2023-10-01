import React, { useRef, useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import classes from "./ChatBox.module.css";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { io } from 'socket.io-client';

const ChatBox = () => {
  const messageRef = useRef();
  const fileRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  const {groupId} = useParams();
  // console.log(groupId,"groupid in chatbox");
  const token = localStorage.getItem("token");

  const socket = io(process.env.REACT_APP_BACKEND_API, {
    query: { token }
  });

  const submitHandler = async (event) => {
    try {
      event.preventDefault();
      setIsLoading(true)
      const message = messageRef.current.value;
      const file = fileRef.current.files[0];
      console.log(file, "file");
      // console.log(message, "message");
      const userName = localStorage.getItem("userName");
      if(!file) {
        console.log(message,"no file")
        socket.emit('sendMessage', { groupId, message, userName });
			  messageRef.current.value = "";
        setIsLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('userName',userName);
      formData.append('file',file);

      const response = await fetch(
				`${process.env.REACT_APP_BACKEND_API}/messages/${groupId}`,{
          method: "POST", 
          body: formData,
          headers: {
            // "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      setIsLoading(false);
      socket.emit('sendFile', { groupId });
      if (!response.ok) {
        const errordata = response.json();
        console.log(errordata, "err");
        throw new Error("Failed!");
      }
      const data = await response.json();
      // alert("file shared");
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
      <Form.Control
        type="file"
        ref={fileRef}
      />
      <Button type="submit">
        {isLoading ?   
          <span>
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
          </span>
          : 
          'Send'
        }
      </Button>
    </Form>
  );
};

export default ChatBox;
