import React, { useCallback, useEffect, useState } from "react";
import classes from "./ChatBox.module.css";
import { Button, Container } from "react-bootstrap";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import AddMemberForm from "./AddMemberForm";
import ViewMembers from "./ViewMembers";

const ShowChats = (props) => {
  const [chats, setChats] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isAdminMember, setIsAdminMember] = useState(false);

	const userData = groupData.users && groupData.users[0].userGroup;
	// console.log(userData,"before if")

	useEffect(() => {
		if(userData && userData.isAdmin) {
			// console.log("admin");
			setIsAdminMember(true);
		}
		if(userData && !userData.isAdmin) {
			// console.log("not admin");
			setIsAdminMember(false);
		}
	},[setIsAdminMember,userData])

	const userName = localStorage.getItem('userName');
	
	
	const [showMembers, setShowMembers] = useState(false);

	const viewMembers = (groupData) => {
    // console.log(groupData,showMembers,"in view handler");
    setShowMembers(true);
  };

  const hideMembers = () => {
    setShowMembers(false);
  };

  const { groupId } = useParams();

  const fetchData = useCallback(async () => {
    try {
      const localChats = JSON.parse(localStorage.getItem(`group${groupId}`));
      // console.log(groupId," groupId chatbox")
      // console.log(localChats,"local chats");
      const latestChatId =
        localChats && localChats.length > 0 ? localChats[0].id : 0;
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API}/messages/?latestChatId=${latestChatId}&groupId=${groupId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      // console.log(response,"response group chats");
      if (!response.ok) {
        const errordata = await response.json();
        console.log(errordata, "err");
        throw new Error("Failed!");
      }
      const data = await response.json();
      // console.log(data,"data group chats");
      setGroupData(data);
      const loadedChats = [];
      data.messages.forEach((chat) => {
        const dateObj = new Date(chat.createdAt);
        const dateString = dateObj.toLocaleDateString();
        const timeString = dateObj.toLocaleTimeString();
        const updatedChat = {
          id: chat.id,
          userName: chat.userName,
          message: chat.message,
          dateString,
          timeString,
        };
        loadedChats.push(updatedChat);
      });
      // console.log("loadedchats",loadedChats)
      if (loadedChats.length === 0) {
        setChats(localChats);
      } else if (localChats) {
        localChats.length === 10 && localChats.pop();
        localChats.unshift(loadedChats[0]);
        localStorage.setItem(`group${groupId}`, JSON.stringify(localChats));
        setChats(localChats);
      } else {
        const localStorageChats = loadedChats.slice(0, 10);
        localStorage.setItem(
          `group${groupId}`,
          JSON.stringify(localStorageChats)
        );
        setChats(loadedChats);
      }
    } catch (error) {
      console.log(error, "err");
    }
  }, [groupId]);

  useEffect(() => {
    const intervalId = setInterval(fetchData, 1000 * 60 * 5);
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addMembers = () => {
    setShowForm(!showForm);
  };

  // console.log(showMembers," showMember chatbox");
  return (
    <>
		  {showMembers && (
        <ViewMembers
          showMembers={showMembers}
          hideMembers={hideMembers}
          groupData={groupData}
					isAdminMember={isAdminMember}
        />
      )}
      <Container className={classes.container}>
        <div className={classes.heading}>
          <span>
            <h2>{groupData.groupName}</h2> Created By{" "}
            <strong>{groupData.createdBy}</strong> on {groupData.createdAt}
          </span>
          {isAdminMember && <Button onClick={addMembers} className={classes.membersButton}>
            Add Member
          </Button>}
          <Button onClick={viewMembers} className={classes.membersButton}>
            View Members
          </Button>
        </div>
        {showForm && (
          <AddMemberForm addMembers={addMembers} groupId={groupId} />
        )}
        <>
          {chats &&
            chats.length > 0 &&
            chats.map((chat) => (
              <h6 className={classes.chat} key={chat.id}>
                {chat.timeString} - {chat.dateString} -{" "}
                {userName === chat.userName ? "You" : chat.userName} -{" "}
                {chat.message}
              </h6>
            ))}
        </>
      </Container>
    </>
  );
};

export default ShowChats;
