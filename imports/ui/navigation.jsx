import React, {
  useState,
  useMemo,
  useEffect
} from 'react';
import {
  Route,
  BrowserRouter
} from 'react-router-dom';
import {
  useTracker
} from 'meteor/react-meteor-data';

import Header from './header';
import Login from './login';
import Sidebar from './sidebar';
import TaskList from './tasks/taskList';
import UserList from './users/userList';

export default function MainPage( props ) {
  const user = useTracker( () => Meteor.user() );

  if ( !user ) {
    return <Login />
  }
  return (
    <div style={{width: "80%", marginLeft: 'auto', marginRight: 'auto'}}>
      <Header />
        <BrowserRouter>
          <Route path="/" component={Sidebar} />
          <Route exact path={["/", "/tasks", "/tasks/:tagID", "/tasks/:tagID/:listType"]} component={TaskList} />
          <Route exact path={["/users", "/users/:userID"]} component={UserList} />
        </BrowserRouter>
    </div>
  );
};