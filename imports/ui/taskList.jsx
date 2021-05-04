import React, {
  useState,
  useMemo
} from 'react';

import {
  useTracker
} from 'meteor/react-meteor-data';

import {
  TasksCollection
} from '/imports/api/tasksCollection';

import AddTaskContainer from './addTaskContainer';
import EditTaskContainer from './editTaskContainer';

export default function TaskList( props ) {

  const tasks = useTracker( () => {
    console.log( "AAA" );
    return TasksCollection.find( {} )
      .fetch()
  } );

  const [ search, setSearch ] = useState( "" );
  const [ chosenTask, setChosenTask ] = useState( null );

  const filteredTasks = useMemo( () =>
    tasks.filter( task => task.title.toLowerCase()
      .includes( search.toLowerCase() ) || task.status.toLowerCase()
      .includes( search.toLowerCase() ) ), [ tasks, search ] );

  console.log( tasks );

  return (
    <div>
      <section>
        <input value={search} onChange={(e) => setSearch(e.target.value)} />
      </section>
      <AddTaskContainer />
      <EditTaskContainer  task={chosenTask} setChosenTask={setChosenTask}/>
      <table>
        <thead>
          <tr>
            <th width="50%">Title</th>
            <th width="30%">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map(task =>
            <tr key={task._id} onClick={() => setChosenTask(task)}>
              <td>{task.title}</td>
              <td>{task.status}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};