import React, {
  useState,
  useMemo
} from 'react';

import {
  UsersCollection
} from '/imports/api/usersCollection';

import {
  Modal,
  ModalBody
} from 'reactstrap';

import UserForm from './userForm';

export default function AddUserContainer( props ) {

  const [ addUserModalOpen, showAddUserModal ] = useState( false );

  const toggleAddUserModal = () => showAddUserModal( !addUserModalOpen );

  const addNewUser = ( name, surname, email, showMyTasks, password ) => {
    Accounts.createUser( {
      password,
      email,
      profile: {
        name,
        surname,
        showMyTasks
      }
    } );
    showAddUserModal( false );
  };


  const closeModal = () => {
    showAddUserModal( false );
  }

  return (
      <div>
      <button onClick={toggleAddUserModal}> + User </button>
      <Modal isOpen={addUserModalOpen} toggle={toggleAddUserModal}>
        <ModalBody>
          <UserForm onSubmit={addNewUser} onCancel={closeModal}/>
        </ModalBody>
      </Modal>
      </ div>
  );
};