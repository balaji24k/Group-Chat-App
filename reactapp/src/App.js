import { Redirect, Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import SignupPage from './components/Authentication/SignupPage';
import LoginPage from './components/Authentication/LoginPage';
import ChatBox from './components/ChatBox/ChatBox';
import { useContext } from 'react';
import AuthContext from './store/AuthContext';

const App = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <Switch>
      <Route path="/" exact>
        {!isLoggedIn && <Redirect to="/login"/>}
        {isLoggedIn && <Redirect to="/chatbox"/>}
      </Route>
      <Route path="/signup" exact>
        {!isLoggedIn && <SignupPage/>}
        {isLoggedIn && <Redirect to="/chatbox"/>}
      </Route>
      <Route path="/login" exact>
        {!isLoggedIn && <LoginPage/>}
        {isLoggedIn && <Redirect to="/chatbox"/>}
      </Route>
      <Route path="/chatbox" exact>
        {!isLoggedIn && <Redirect to="/login"/>}
        {isLoggedIn && <ChatBox/>}
      </Route>
    </Switch>
  );
}

export default App;
