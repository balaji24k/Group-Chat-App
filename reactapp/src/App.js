import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import SignUpPage from './components/Authentication/SignupPage';

function App() {
  return (
    <Switch>
      <Route path="/">
        <SignUpPage/>
      </Route>
    </Switch>
  );
}

export default App;
