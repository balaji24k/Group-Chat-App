import { Redirect, Route, Switch } from "react-router-dom/cjs/react-router-dom.min";
import SignupPage from "./components/Authentication/SignupPage";
import LoginPage from "./components/Authentication/LoginPage";
import ChatBox from "./components/ChatBox/ChatBox";
import { useContext } from "react";
import AuthContext from "./store/AuthContext";
import ShowChats from "./components/ChatBox/ShowChats";
import classes from "./App.module.css";
import NavigationBar from "./components/NavBar/NavigationBar";
import CreateGroup from "./components/NavBar/CreateGroup";

const App = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className={classes.box} >
      <NavigationBar/>
      <div  style={{width:"1400px"}}>
        <Switch>
          <Route path="/" exact>
            {!isLoggedIn && <Redirect to="/login" />}
            {isLoggedIn && <Redirect to="/chatbox" />}
          </Route>
          <Route path="/signup" exact>
            {!isLoggedIn && <SignupPage />}
            {isLoggedIn && <Redirect to="/chatbox" />}
          </Route>
          <Route path="/login" exact>
            {!isLoggedIn && <LoginPage />}
            {isLoggedIn && <Redirect to="/chatbox" />}
          </Route>
          <Route path="/createGroup" exact>
            {!isLoggedIn && <Redirect to="/login" />}
            {isLoggedIn && <CreateGroup/>}
          </Route>
          <Route path="/chatbox/:groupId" exact>
            {!isLoggedIn && <Redirect to="/login" />}
            {isLoggedIn && (
              <>
                <ChatBox />
                <ShowChats />
              </>
            )}
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default App;
