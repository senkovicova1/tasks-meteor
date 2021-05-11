import React, {
  useState,
  useMemo,
  useEffect
} from 'react';

import {
  UsersCollection
} from '/imports/api/usersCollection';

import {
  Modal,
  ModalBody
} from 'reactstrap';

import UserForm from './userForm';

export default function EditUserContainer( props ) {

  const {
    user,
    setChosenUser,
  } = props;

  const [ search, setSearch ] = useState( "" );
  const [ editUserModalOpen, showEditUserModal ] = useState( false );

  useEffect( () => {
    if ( user ) {
      showEditUserModal( true )
    } else {
      showEditUserModal( false )
    }
  }, [ user ] )

  const editUser = ( name, surname, email, showMyTasks, password = "" ) => {
    let data = {};
    if ( user.name !== name ) {
      data.name = name;
    }
    if ( user.surname !== surname ) {
      data.surname = surname;
    }
    if ( user.email !== email ) {
      data.email = email;
    }
    if ( user.showMyTasks !== showMyTasks ) {
      data.showMyTasks = showMyTasks;
    }
    UsersCollection.update( user._id, {
      $set: {
        ...data
      }
    } )
    setChosenUser( null );
  };

  const removeUser = ( userId ) => {
    if ( window.confirm( "Are you sure you want to permanently remove this user?" ) ) {
      UsersCollection.remove( {
        _id: userId
      } );
    }
  }

  const closeModal = () => {
    setChosenUser( null );
  }

  return (
    <Modal isOpen={editUserModalOpen} toggle={() => setChosenUser( null )}>
      <ModalBody>
        <UserForm {...user} onSubmit={editUser} onCancel={closeModal} onRemove={removeUser}/>
      </ModalBody>
    </Modal>
  );
};