import React, {
  useState,
  useMemo,
  useEffect
} from 'react';

import {
  TasksCollection
} from '/imports/api/tasksCollection';

import {
  Modal,
  ModalBody
} from 'reactstrap';

import TaskForm from './taskForm';

export default function EditTaskContainer( props ) {

  const {
    task,
    setChosenTask,
  } = props;

  const [ search, setSearch ] = useState( "" );
  const [ editTaskModalOpen, showEditTaskModal ] = useState( false );

  useEffect( () => {
    if ( task ) {
      showEditTaskModal( true )
    } else {
      showEditTaskModal( false )
    }
  }, [ task ] )

  const editTask = ( title, description, status ) => {
    let data = {};
    if ( task.title !== title ) {
      data.title = title;
    }
    if ( task.description !== description ) {
      data.description = description;
    }
    if ( task.status !== status ) {
      data.status = status;
    }
    TasksCollection.update( task._id, {
      $set: {
        ...data
      }
    } )
    setChosenTask( null );
  }

  const closeModal = () => {
    setChosenTask( null );
  }

  return (
    <Modal isOpen={editTaskModalOpen} toggle={() => setChosenTask( null )}>
      <ModalBody>
        <TaskForm {...task} onSubmit={editTask} onCancel={closeModal}/>
      </ModalBody>
    </Modal>
  );
};