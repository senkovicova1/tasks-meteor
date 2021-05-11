import React, {
  useState,
  useMemo,
  useEffect
} from 'react';
import {
  useTracker
} from 'meteor/react-meteor-data';

import AddUserContainer from './addUserContainer';
import EditUserContainer from './editUserContainer';

export default function UserList( props ) {
  const users = useTracker( () => Meteor.users.find( {} )
    .fetch() );

  const [ search, setSearch ] = useState( "" );
  const [ searchName, setSearchName ] = useState( "" );
  const [ searchSurname, setSearchSurname ] = useState( "" );
  const [ searchEmail, setSearchEmail ] = useState( "" );

  const [ chosenUser, setChosenUser ] = useState( null );

  console.log( users );

  const filteredUsers = useMemo( () =>
    users.filter( user =>
      user.profile.name.toLowerCase()
      .includes( search.toLowerCase() ) || user.profile.surname.toLowerCase()
      .includes( search.toLowerCase() )
      /* || user.emails[ 0 ].address.toLowerCase()
            .includes( search.toLowerCase() )*/
    )
    .filter( user => user.profile.name.toLowerCase()
      .includes( searchName.toLowerCase() ) && user.profile.surname.toLowerCase()
      .includes( searchSurname.toLowerCase() )
      /*&& user.emails[ 0 ].address.toLowerCase()
           .includes( searchEmail.toLowerCase() ) */
    ), [ users, search ] );


  return (
    <div style={{width: "calc(100% - 200px)", display: 'inline-block', verticalAlign: "top"}}>
      <section>
        <input value={search} onChange={(e) => setSearch(e.target.value)} />
      </section>
      <AddUserContainer/>
      <EditUserContainer user={chosenUser} setChosenUser={setChosenUser}/>
      <table>
        <thead>
          <tr>
            <th>surname</th>
            <th>name</th>
            <th>email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>
              <input value={searchSurname} onChange={(e) => setSearchSurname(e.target.value)} />
            </th>
            <th>
              <input value={searchName} onChange={(e) => setSearchName(e.target.value)} />
            </th>
            <th>
              <input value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} />
            </th>
          </tr>
          {filteredUsers.map(user =>
            <tr key={user._id} onClick={() => setChosenUser(user)}>
              <td>{user.profile.surname}</td>
              <td>{user.profile.name}</td>
              <td>{/*user.emails[0].address*/}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  );
};