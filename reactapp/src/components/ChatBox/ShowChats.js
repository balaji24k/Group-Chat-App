import React, { useCallback, useEffect, useState } from 'react'
import classes from './ChatBox.module.css';
import { Container } from 'react-bootstrap';

const ShowChats = () => {
	const [chats,setChats] = useState([]);
	const userName = localStorage.getItem("userName");
	const fetchData = useCallback(async() => {
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/messages`,{
				method: "GET",
        headers: {
          "Content-Type": "application/json",
					"Authorization": token
        },
			});
			if (!response.ok) {
				const errordata = response.json();
				console.log(errordata,"err");
				throw new Error("Failed!")
			}
			const data = await response.json();
			console.log(data[0].userName,"refresh data");
			setChats([...data]);
		} catch (error) {
			
		}
	},[])

	useEffect(()=> {
		fetchData();
	},[fetchData])
  return (
    <Container className={classes.container} >
			{chats.length>0 && chats.map(chat =>
				<h6 className={classes.chat} key={chat.id}>
					{userName === chat.userName ? "You" : chat.userName} - {" "}
					{chat.message}
				</h6>
			)}
		</Container>
  )
}

export default ShowChats