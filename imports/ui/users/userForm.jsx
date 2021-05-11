import React, {
  useState,
  useEffect,
} from 'react';

import {
  isEmail
} from '../../other/helperFunctions.js';

export default function UserForm( props ) {

  const {
    _id: userId,
    name: userName,
    surname: userSurname,
    email: userEmail,
    onSubmit,
    onRemove,
    onCancel,
  } = props;

  const [ name, setName ] = useState( "" );
  const [ surname, setSurname ] = useState( "" );
  const [ email, setEmail ] = useState( "" );
  const [ showMyTasks, setShowMyTasks ] = useState( false );
  const [ password1, setPassword1 ] = useState( '' );
  const [ password2, setPassword2 ] = useState( '' );

  useEffect( () => {
    if ( userName ) {
      setName( userName );
    } else {
      setName( "" );
    }
    if ( userSurname ) {
      setSurname( userSurname );
    } else {
      setSurname( "" );
    }
    if ( userEmail ) {
      setEmail( userEmail );
    } else {
      setEmail( "" );
    }
  }, [ userName, userSurname, userEmail ] );


  return (
    <div>

      <section>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          />
      </section>

      <section>
        <label htmlFor="surname">Surname</label>
        <input
          id="surname"
          name="surname"
          value={surname}
          onChange={(e) =>  setSurname(e.target.value)}
          />
      </section>

      <section>
        <label  htmlFor="email">Email</label>
          <input
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
          />
      </section>

      <section>
        <label htmlFor="showMyTasks">Show only my tasks by default</label>
        <input
          id="showMyTasks"
          type="checkbox"
          name="showMyTasks"
          checked={showMyTasks}
          onChange={() =>  setShowMyTasks(!showMyTasks)}
          />
      </section>

<section>
      <label htmlFor="password1">Password</label>
        <input
          type="password"
          placeholder="Password"
          name="password1"
          required
          onChange={e => setPassword1(e.target.value)}
        />
    </section>

        <section>
      <label htmlFor="password2">Repeat password</label>
              <input
                type="password"
                placeholder="Repeat password"
                name="password2"
                required
                onChange={e => setPassword2(e.target.value)}
              />
          </section>

          {onCancel &&
      <button onClick={onCancel}>Cancel</button>
    }
      {onRemove &&
        <button onClick={() => {onRemove(userId); onCancel();}}>Delete</button>
      }
      <button
        disabled={name.length + surname.length + email.length === 0 || !isEmail(email) || password1 !== password2}
        onClick={(e) => {
          e.preventDefault();
          onSubmit(
          name,
          surname,
          email,
          showMyTasks,
          password1
        );
      }}
        >
        Save
      </button>

    </div>
  );
};