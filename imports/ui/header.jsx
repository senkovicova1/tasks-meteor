import React from 'react';
import {
  Link
} from 'react-router-dom';

import {
  Icon
} from '@fluentui/react/lib/Icon';

import {
  PageHeader,
  LinkButton
} from '../other/styles/styledComponents';

export default function Header( props ) {
  const logout = () => Meteor.logout();

  return (
    <PageHeader>
      <h1>LanTask</h1>
      <LinkButton type="submit" whiteFont onClick={logout}><Icon  iconName="SignOut" /></LinkButton>
    </PageHeader>
  );
};