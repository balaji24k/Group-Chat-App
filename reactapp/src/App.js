import { Redirect, Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import SignupPage from './components/Authentication/SignupPage';
import LoginPage from './components/Authentication/LoginPage';

function App() {
  return (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/login"/>
      </Route>
      <Route path="/signup" exact>
        <SignupPage/>
      </Route>
      <Route path="/login" exact>
        <LoginPage/>
      </Route>
    </Switch>
  );
}

export default App;
