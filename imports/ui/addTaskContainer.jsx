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

  const [ search, setSearch ] = useState( "" );
  const [ addTaskModalOpen, showAddTaskModal ] = useState( false );

  const toggleAddTaskModal = () => showAddTaskModal( !addTaskModalOpen );

  const addNewTask = ( title, description, status ) => {
    TasksCollection.insert( {
      title,
      description,
      status
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
            <TaskForm onSubmit={addNewTask} onCancel={closeModal}/>
          </ModalBody>
        </Modal>
</ div>
  );
};