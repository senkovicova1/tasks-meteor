import React, {
  useState,
  useMemo
} from 'react';

import {
  Icon
} from '@fluentui/react/lib/Icon';

import {
  TasksCollection
} from '/imports/api/tasksCollection';

import {
  Modal,
  ModalBody
} from 'reactstrap';

import TaskForm from './taskForm';

import {
  LinkButton
} from '../../other/styles/styledComponents';

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
      <LinkButton onClick={toggleAddTaskModal}> <Icon iconName="Add"/> Task </LinkButton>
      <Modal isOpen={addTaskModalOpen} toggle={toggleAddTaskModal}>
        <ModalBody>
          <TaskForm users={users} tags={tags} onSubmit={addNewTask} onCancel={closeModal}/>
        </ModalBody>
      </Modal>
      </ div>
  );
};