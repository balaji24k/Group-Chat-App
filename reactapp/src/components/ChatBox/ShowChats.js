import React, { useCallback, useEffect, useState } from 'react'
import classes from './ChatBox.module.css';
import { Container } from 'react-bootstrap';

const ShowChats = () => {
	const [chats,setChats] = useState([]);
	const userName = localStorage.getItem("userName");

	const fetchData = useCallback(async() => {
		try {
			const localChats = JSON.parse(localStorage.getItem("chats"));
			console.log(localChats,"local chats");
			const id = (localChats && localChats.length>0) ? localChats[0].id : 0;
			const token = localStorage.getItem('token');
			const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/messages/${id}`,{
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
			const loadedChats = []
			data.forEach(chat => {
				const dateObj = new Date(chat.createdAt);
				const dateString = dateObj.toLocaleDateString();
				const timeString = dateObj.toLocaleTimeString(); 
				const updatedChat = {id:chat.id,userName:chat.userName,message:chat.message,dateString,timeString};
				loadedChats.push(updatedChat);
			});
			console.log("loadedchats",loadedChats)
			if(loadedChats.length === 0) {
				setChats(localChats);
				return;
			}
			if (localChats && localChats.length >= 10) {
				localChats.pop();
				localChats.unshift(loadedChats[0]);
				localStorage.setItem("chats",JSON.stringify(localChats));
				setChats(localChats);
			}
			else{
				const localStorageChats = loadedChats.slice(0, 10);
				localStorage.setItem("chats",JSON.stringify(localStorageChats));
				setChats(loadedChats);
			}
		} catch (error) {
			console.log(error,"err");
		}
	},[])

	useEffect(()=> {
		setInterval(fetchData,1000*60*5)
	},[fetchData]);

	useEffect(()=> {
		fetchData();
	},[fetchData])
  return (
    <Container className={classes.container} >
			{chats.length>0 && chats.map(chat =>
				<h6 className={classes.chat} key={chat.id}>
					{chat.timeString} - {chat.dateString} - {" "}
					{userName === chat.userName ? "You" : chat.userName} - {" "}
					{chat.message}
				</h6>
			)}
		</Container>
  )
}

export default ShowChats