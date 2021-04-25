import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LadingPage from './components/views/LandingPage/LandingPage';
import Loginpage from './components/views/LoginPage/LoginPage';
import Register from './components/views/Registerpage/Registerpage';
export default function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/" component={LadingPage} />
          <Route exact path="/login" component={Loginpage} />
          <Route exact path="/register" component={Register} />
        </Switch>
      </div>
    </Router>
  );
}