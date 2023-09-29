import React, { useEffect, useState } from "react";
import { Button, Table, Modal } from "react-bootstrap";
import classes from './ChatBox.module.css';

const ViewMembers = (props) => {
  const { groupData, isAdminMember } = props;
  // console.log(groupData,"view gropup");
  const [groupMembers, setGroupMembers] = useState([]);

  const userName = localStorage.getItem('userName');
  
  useEffect(() => {
    const fetchGroupMembers = async() => {
      try {
      const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_API}/groups/getGroupMembers/${groupData.id}`,{
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
        // console.log(data.users,"group members");
        setGroupMembers(data.users);
      } catch (error) {
        console.log(error,"fetch group members")
      }
    }
    fetchGroupMembers();
  },[groupData.id]);

  // console.log(groupData.id,);
  const makeAdminHandler = async(makeAdminId) => {
    try {
      console.log(makeAdminId,groupData.id);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API}/groups/makeAdmin`,{
          method: "POST",
          body: JSON.stringify({userId : makeAdminId, groupId: groupData.id}),
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
      alert("Successfullt made admin!");
    } catch (error) {
      console.log(error,"make admin error")
    }
  }

  const removeMemberHandler = async(makeAdminId) => {
    try {
      console.log(makeAdminId,groupData.id);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API}/groups/removeMember`,{
          method: "POST",
          body: JSON.stringify({userId : makeAdminId, groupId: groupData.id}),
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
      alert("Removed Member!");
    } catch (error) {
      console.log(error,"removed member");
    }
  }

  return (
    <Modal
      className={classes.modal}
      show={props.showMembers}
      onHide={props.hideMembers}
    >
      <Modal.Header closeButton>
        <Modal.Title>{groupData.groupName} created by {groupData.createdBy}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {groupMembers.map(member => <tr key={member.id}>
                <td>{member.name} {member.userGroup.isAdmin && "(Admin)"}
                  {isAdminMember && member.name !== userName  &&  
                    <div>
                      {!member.userGroup.isAdmin && 
                        <Button 
                          onClick={makeAdminHandler.bind(null,member.id)} 
                          className={classes.adminButtons} >
                            Make Admin
                        </Button>}{" "}
                      <Button 
                        className={classes.adminButtons} 
                        onClick={removeMemberHandler.bind(null,member.id)} 
                        variant="danger" >
                          Remove
                      </Button>
                    </div>
                  }
                </td>
                <td>{member.mobile}</td>
                <td>{member.email}</td>
              </tr>)}
            </tbody>
          </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.hideMembers}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewMembers;
