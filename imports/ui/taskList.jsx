import React, {
  useState,
  useMemo,
  useEffect
} from 'react';

import {
  useTracker
} from 'meteor/react-meteor-data';
import {
  TasksCollection
} from '/imports/api/tasksCollection';
import {
  TagsCollection
} from '/imports/api/tagsCollection';
import {
  UsersCollection
} from '/imports/api/usersCollection';

import AddTaskContainer from './addTaskContainer';
import EditTaskContainer from './editTaskContainer';

export default function TaskList( props ) {
  const tasks = useTracker( () => TasksCollection.find( {} )
    .fetch() );
  const tags = useTracker( () => TagsCollection.find( {} )
    .fetch() );
  const users = useTracker( () => UsersCollection.find( {} )
    .fetch() );

  const [ search, setSearch ] = useState( "" );
  const [ chosenTask, setChosenTask ] = useState( null );

  const joinedTasks = useMemo( () =>
    tasks.map( task => ( {
      ...task,
      tag: tags.find( tag => tag._id === task.tag ),
      assigned: users.filter( user => task.assigned.includes( user._id ) )
    } ) ), [ tasks, tags, users ] );

  const filteredTasks = useMemo( () =>
    joinedTasks.filter( task => task.title.toLowerCase()
      .includes( search.toLowerCase() ) || task.status.toLowerCase()
      .includes( search.toLowerCase() ) ), [ tasks, search ] );



  return (
    <div style={{width: "70%", marginRight: "auto", marginLeft: "auto"}}>
      <section>
        <input value={search} onChange={(e) => setSearch(e.target.value)} />
      </section>
      <AddTaskContainer users={users} tags={tags} />
      <EditTaskContainer users={users} tags={tags} task={chosenTask} setChosenTask={setChosenTask}/>
      <table style={{width: "100%"}}>
        <thead>
          <tr>
            <th>Status</th>
            <th width="20%">Title</th>
            <th width="30%">Description</th>
            <th width="20%">Actions</th>
            <th>Duration</th>
            <th>Material</th>
            <th>Assigned</th>
            <th>Deadlines</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map(task =>
            <tr key={task._id} onClick={() => setChosenTask(task)}>
              <td>{task.status}</td>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>
                {task.actions?.map((action, index) =>
                  <span style={{display: "block"}} key={action._id + "" +  index}>{`[${action.checked ? "x" : ""}] ${action.title}`}</span>
                )}
              </td>
              <td>
                {task.actions?.map((action, index) =>
                  <span style={{display: "block"}} key={action._id + "" + index}>{action.duration && action.duration > 0 ? `${action.duration} hours` : ""}</span>
                )}
              </td>
              <td>materials</td>
              <td>{task.assigned.map(assigned => <span style={{display: "block"}} key={assigned._id}>{`${assigned.name} ${assigned.surname} `}</span>)}</td>
              <td>deadlines</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};