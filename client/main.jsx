import React from 'react';
import {
  Meteor
} from 'meteor/meteor';
import {
  render
} from 'react-dom';

import {
  library
} from '@fortawesome/fontawesome-svg-core';
import {
  fab
} from '@fortawesome/free-brands-svg-icons';
import {
  faCogs,
} from '@fortawesome/free-solid-svg-icons';

import {
  App
} from '/imports/ui/App';

library.add(
  fab,
  faCogs,
);

Meteor.startup( () => {
  render( <App/>, document.getElementById( 'react-target' ) );
} );