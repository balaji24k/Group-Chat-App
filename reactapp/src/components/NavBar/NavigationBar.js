import { useContext, useEffect, useState } from "react";
import classes from "./NavigationBar.module.css";
import { Button } from "react-bootstrap";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import AuthContext from "../../store/AuthContext";

const NavigationBar = () => {
	const {userName,logout, isLoggedIn} = useContext(AuthContext);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async() => {
      try {
        // console.log("fetch groups");
        const token = localStorage.getItem('token');
        if(!isLoggedIn) {
          return;
        }
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/groups`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
        })
        if(!response.ok) {
          throw new Error("Failed")
        };
        const data = await response.json();
        setGroups(data);
        // console.log(data,"groups");
      } catch (error) {
        console.log(error,"load groups")
      }
    }
    fetchGroups();
  }, [isLoggedIn]);

  return (
    <>
      {!isLoggedIn && (
        <div className={classes.navbar}>
          <NavLink
            to="/login"
            activeClassName={classes.activeLink}
            className={classes.navlink}
          >
            Login
          </NavLink>
          <NavLink
            to="/signup"
            activeClassName={classes.activeLink}
            className={classes.navlink}
          >
            Signup
          </NavLink>
        </div>
      )}
      {isLoggedIn && (
        <div className={classes.navbar}>
          <div className={classes.profile} >
            <h4 style={{marginBottom:"10px"}} >User: {userName}</h4>
            <Button onClick={logout} variant="outline-light">
              Logout
            </Button>
          </div>
          <NavLink 
            to='/createGroup' 
            activeClassName={classes.activeLink}
            className={classes.navlink}
          >
            Create Group
          </NavLink>

          {groups.map(group =>
            <NavLink
              key={group.userGroup.groupId}
              to= {`/chatbox/${group.userGroup.groupId}`}
              activeClassName={classes.activeLink}
              className={classes.navlink}
            >
              {group.groupName}
            </NavLink>
          )}
        </div>
      )}
    </>
  );
};

export default NavigationBar;
