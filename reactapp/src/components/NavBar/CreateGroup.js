import { useRef, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
// import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import classes from "./CreateGroup.module.css";

const CreateGroup = (props) => {
  const groupNameRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (event) => {
    try {
      event.preventDefault();
		  const groupName = groupNameRef.current.value;
      const token = localStorage.getItem('token');
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/groups`,{
        method : "POST",
        body: JSON.stringify({groupName}),
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
      });
      setIsLoading(false);
      if (!response.ok) {
        const errordata = await response.json();
        console.log(errordata,"err");
        throw new Error("Failed!")
      }	
      const data = await response.json();
      console.log(data,"after group created");
      groupNameRef.current.value = "";

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form className={classes.box} onSubmit={submitHandler}>
      <Form.Group className="mb-3">
        <Form.Label>Group Name:</Form.Label>
        <Form.Control type="text" placeholder="Group Name" ref={groupNameRef} />
      </Form.Group>

      <div className={classes.button}>
        <Button type="submit" variant="primary">
        {isLoading ?   
          <span>
            Creating...
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
          </span>
          : 
          'Create Group'
        }
        </Button>
      </div>
    </Form>
  );
};

export default CreateGroup;
