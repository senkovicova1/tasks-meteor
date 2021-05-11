import {
  Meteor
} from 'meteor/meteor';
import React, {
  useState
} from 'react';

import Login from './login';
import SignIn from './signIn';

export default function LoginForm( props ) {
  const [ showLogin, setShowLogin ] = useState( true );

  return (
    <div>
          <button onClick={() => setShowLogin(!showLogin)}>{showLogin ? "Sign In" : "Log In"}</button>
          {showLogin && <Login />}
          {!showLogin && <SignIn />}
  </div>
  );
};