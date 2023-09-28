import React, { useCallback, useEffect, useState } from 'react'
import classes from './ChatBox.module.css';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

const ShowChats = () => {
	const [chats,setChats] = useState([]);
	const { groupId } = useParams();
	const userName = localStorage.getItem("userName");

	const fetchData = useCallback(async() => {
		try {
			const localChats = JSON.parse(localStorage.getItem(`group${groupId}`));
			console.log(groupId," groupId chatbox")
			console.log(localChats,"local chats");
			const latestChatId = (localChats && localChats.length>0) ? localChats[0].id : 0;
			const token = localStorage.getItem('token');
			const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/messages/?latestChatId=${latestChatId}&groupId=${groupId}`,{
        headers: {
          "Content-Type": "application/json",
					"Authorization": token
        },
			});
			// console.log(response,"response group chats");
			if (!response.ok) {
				const errordata = response.json();
				console.log(errordata,"err");
				throw new Error("Failed!")
			}	
			const data = await response.json();
			// console.log(data,"data group chats");
			const loadedChats = []
			data.messages.forEach(chat => {
				const dateObj = new Date(chat.createdAt);
				const dateString = dateObj.toLocaleDateString();
				const timeString = dateObj.toLocaleTimeString(); 
				const updatedChat = {id:chat.id,userName:chat.userName,message:chat.message,dateString,timeString};
				loadedChats.push(updatedChat);
			});
			// console.log("loadedchats",loadedChats)
			if(loadedChats.length === 0) {
				setChats(localChats);
			}
			else if (localChats) {
				localChats.pop();
				localChats.unshift(loadedChats[0]);
				localStorage.setItem(`group${groupId}`,JSON.stringify(localChats));
				setChats(localChats);
			}
			else{
				console.log("else")
				const localStorageChats = loadedChats.slice(0, 10);
				localStorage.setItem(`group${groupId}`,JSON.stringify(localStorageChats));
				setChats(loadedChats);
			}
		} catch (error) {
			console.log(error,"err");
		}
	},[groupId])

	useEffect(()=> {
		const intervalId = setInterval(fetchData, 1000 * 5);
    return () => {
      clearInterval(intervalId);
    };
	},[fetchData]);

	useEffect(()=> {
		fetchData();
	},[fetchData])

	// console.log(chats,"chatbox")
  return (
    <Container className={classes.container} >
			{chats && chats.length>0 && chats.map(chat =>
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