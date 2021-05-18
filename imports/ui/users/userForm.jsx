import React, {
  useState,
  useEffect,
} from 'react';

import {
  isEmail
} from '../../other/helperFunctions.js';

import {
  Form,
  Input,
  ButtonRow,
  FullButton,
} from "../../other/styles/styledComponents";

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
    <Form>

      <section>
        <label htmlFor="name">Name</label>
        <Input
          id="name"
          name="name"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          />
      </section>

      <section>
        <label htmlFor="surname">Surname</label>
        <Input
          id="surname"
          name="surname"
          placeholder="Enter surname"
          value={surname}
          onChange={(e) =>  setSurname(e.target.value)}
          />
      </section>

      <section>
        <label  htmlFor="email">Email</label>
          <Input
              name="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
          />
      </section>

      <section>
        <Input
          id="showMyTasks"
          type="checkbox"
          name="showMyTasks"
          checked={showMyTasks}
          onChange={() =>  setShowMyTasks(!showMyTasks)}
          />
        <label htmlFor="showMyTasks">Show only my tasks by default</label>
      </section>

<section>
      <label htmlFor="password1">Password</label>
        <Input
          type="password"
          placeholder="Password"
          name="password1"
          required
          onChange={e => setPassword1(e.target.value)}
        />
    </section>

        <section>
      <label htmlFor="password2">Repeat password</label>
              <Input
                type="password"
                placeholder="Repeat password"
                name="password2"
                required
                onChange={e => setPassword2(e.target.value)}
              />
          </section>

<ButtonRow>
          {onCancel &&
      <FullButton colour="grey" onClick={(e) => {e.preventDefault(); onCancel()}}>Cancel</FullButton>
    }
      {onRemove &&
        <FullButton colour="red" onClick={(e) => {e.preventDefault(); onRemove(userId); onCancel();}}>Delete</FullButton>
      }
      <FullButton
        colour=""
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
      </FullButton>
    </ButtonRow>

    </Form>
  );
};