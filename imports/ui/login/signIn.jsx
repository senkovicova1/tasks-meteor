import React, {
  useState
} from 'react';
import {
  Meteor
} from 'meteor/meteor';
import {
  Accounts
} from 'meteor/accounts-base';

import AddUser from '../users/userForm';

export default function SignInForm( props ) {

  const createUser = ( name, surname, showMyTasks, email, password ) => {
    Accounts.createUser( {
      password,
      email,
      profile: {
        name,
        surname,
        showMyTasks
      }
    } );
  };

  return (
    <AddUser onSubmit={createUser} isSignIn/>
  );
};
