import React, {useRef} from 'react';
import classes from './ChatBox.module.css';
import { Form, Button } from 'react-bootstrap';

const AddMemberForm = ({groupId, addMembers}) => {
	const mobileRef = useRef();

  const submitHandler = async(event) => {
		try {
			event.preventDefault();
			const mobile = mobileRef.current.value;
			const token = localStorage.getItem('token');
			const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/groups/addMember/${groupId}`,{
				method: "POST",
        headers: {
          "Content-Type": "application/json",
					"Authorization": token
        },
				body: JSON.stringify({mobile})
			});
			// console.log(response,"response group chats");
			if (!response.ok) {
				const errordata = await response.json();
				console.log(errordata,"err");
				throw new Error("Failed!")
			}	
			const data = await response.json();
			alert("Added Succesfully!");
			mobileRef.current.value = "";
      console.log(data,"addmember");
		} catch (error) {
			console.log(error);	
		}
	}

  return (
    <Form onSubmit={submitHandler} className={classes.addMemberForm}>
				<Form.Control
					className={classes.input}
					placeholder="Mobile"
					type="text"
					ref={mobileRef}
				/>
				<Button type="submit">Add</Button>
				<Button 
					variant='danger' 
					onClick={addMembers} 
					type="button">Close
				</Button>
		</Form>
  )
}

export default AddMemberForm;