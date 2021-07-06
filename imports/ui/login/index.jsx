import {
  Meteor
} from 'meteor/meteor';
import React, {
  useState
} from 'react';

import Login from './login';
import SignIn from './signIn';

import {
  GroupButton,
  LoginContainer
} from "../../other/styles/styledComponents";

export default function LoginForm( props ) {
  const [ showLogin, setShowLogin ] = useState( true );

  return (
    <LoginContainer>
      <div>
        <GroupButton colour={showLogin ? "#0078d4" : null} onClick={() => setShowLogin(!showLogin)}>Log In</GroupButton>
        <GroupButton colour={!showLogin ? "#0078d4" : null} onClick={() => setShowLogin(!showLogin)}>Sign In</GroupButton>
      </div>
      {showLogin && <Login {...props} />}
      {!showLogin && <SignIn {...props}/>}
    </LoginContainer>
  );
};
