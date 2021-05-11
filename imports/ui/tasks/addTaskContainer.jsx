import React, {
  useState,
  useMemo
} from 'react';

import {
  TasksCollection
} from '/imports/api/tasksCollection';

import {
  Modal,
  ModalBody
} from 'reactstrap';

import TaskForm from './taskForm';

export default function AddTaskContainer( props ) {

  const {
    users,
    tags
  } = props;

  const [ search, setSearch ] = useState( "" );
  const [ addTaskModalOpen, showAddTaskModal ] = useState( false );

  const toggleAddTaskModal = () => showAddTaskModal( !addTaskModalOpen );

  const addNewTask = ( title, description, status, assigned, tag, actions, materials, deadlines ) => {
    TasksCollection.insert( {
      title,
      description,
      status,
      assigned,
      tag,
      actions,
      materials,
      deadlines
    } );
    showAddTaskModal( false );
  }

  const closeModal = () => {
    showAddTaskModal( false );
  }

  return (
      <div>
      <button onClick={toggleAddTaskModal}> + Task </button>
      <Modal isOpen={addTaskModalOpen} toggle={toggleAddTaskModal}>
        <ModalBody>
          <TaskForm users={users} tags={tags} onSubmit={addNewTask} onCancel={closeModal}/>
        </ModalBody>
      </Modal>
      </ div>
  );
};