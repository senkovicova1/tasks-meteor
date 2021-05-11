import React from 'react';
import {
  Link
} from 'react-router-dom';

export default function Header( props ) {
  const logout = () => Meteor.logout();

  return (
    <div style={{display: 'block'}}>
          <button type="submit" onClick={logout}>Log Out</button>
    </div>
  );
};