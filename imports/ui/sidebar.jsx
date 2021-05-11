import React, {
  useState,
  useMemo,
  useEffect
} from 'react';
import {
  Link
} from 'react-router-dom';
import moment from 'moment';

import {
  FontAwesomeIcon
} from '@fortawesome/react-fontawesome'

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

import AddTagContainer from './tags/addTagContainer';
import AddUserContainer from './users/addUserContainer';
import EditTagContainer from './tags/editTagContainer';

export default function Sidebar( props ) {

  const {
    match
  } = props;

  const tasks = useTracker( () => TasksCollection.find( {} )
    .fetch() );
  const tags = useTracker( () => TagsCollection.find( {} )
    .fetch() );
  //  const users = useTracker( () => UsersCollection.find( {} )
  // .fetch() );
  const users = [];

  const [ search, setSearch ] = useState( "" );
  const [ chosenTask, setChosenTask ] = useState( null );
  const [ chosenTag, setChosenTag ] = useState( null );
  const [ showAddTag, setShowAddTag ] = useState( false );

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

  const tagID = match.params.tagID ? match.params.tagID : 'all';

  return (
    <div style={{width: "200px", display: 'inline-block', verticalAlign: "top"}}>
      <ul>
        <li key="whole">
          <Link to={`/tasks/${tagID}/whole`}>Whole table</Link>
        </li>
        <li key="actions">
          <Link to={`/tasks/${tagID}/actions`}>Actions</Link>
        </li>
          <li key="materials">
            <Link to={`/tasks/${tagID}/materials`}>Materials</Link>
          </li>
          <li key="all"><Link to="/tasks">All tags</Link></li>
          {tags.map(tag => <li key={tag._id}><Link to={`/tasks/${tag._id}`}>{tag.title}</Link>
    <FontAwesomeIcon icon={['fas', 'cogs']} onClick={() => setChosenTag(tag)} /></li>)}
              <li key="addTag">
                <AddTagContainer/>
              </li>
              <li key="users"><Link to="/users">Users</Link></li>
                <li key="addUser">
                  <AddUserContainer/>
                </li>
      </ul>

        <EditTagContainer tag={chosenTag} setChosenTag={setChosenTag}/>
    </div>
  );
};