import React, {
  useState,
  useMemo,
  useEffect
} from 'react';

import moment from 'moment';
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

const WHOLE_TABLE = "whole";
const WITH_ACTIONS = 'actions';
const WITH_MATERIALS = 'materials';

export default function TaskList( props ) {

  const {
    match
  } = props;

  const findTag = match.params.tagID === 'all' ? null : match.params.tagID;
  const tasks = useTracker( () => TasksCollection.find( findTag ? {
      tag: findTag
    } : {} )
    .fetch() );
  const tags = useTracker( () => TagsCollection.find( {} )
    .fetch() );
  const users = useTracker( () => Meteor.users.find( {} )
    .fetch() );

  const userId = Meteor.userId();

  const showMy = useTracker( () => Meteor.user( {
      fields: {
        'profile.showMyTasks': 1
      }
    } )
    .profile.showMyTasks );

  const [ showMyTasks, setShowMyTasks ] = useState( false );

  const [ search, setSearch ] = useState( "" );
  const [ searchStatus, setSearchStatus ] = useState( "" );
  const [ searchTitle, setSearchTitle ] = useState( "" );
  const [ searchDescription, setSearchDescription ] = useState( "" );
  const [ searchActions, setSearchActions ] = useState( "" );
  const [ searchDuration, setSearchDuration ] = useState( "" );
  const [ searchMaterial, setSearchMaterial ] = useState( "" );
  const [ searchAssigned, setSearchAssigned ] = useState( "" );
  const [ searchDeadlines, setSearchDeadlines ] = useState( "" );
  const [ chosenTask, setChosenTask ] = useState( null );

  const listType = match.params.listType;

  useEffect( () => {
    setShowMyTasks( showMy );
  }, [
    showMy
  ] )

  const joinedTasks = useMemo( () =>
    tasks.map( task => ( {
      ...task,
      tag: tags.find( tag => tag._id === task.tag ),
      assigned: users.filter( user => task.assigned.includes( user._id ) )
    } ) ), [ tasks, tags, users ] );

  const filteredByListTypeTasks = useMemo( () => {
    if ( !listType || listType === WHOLE_TABLE ) {
      return joinedTasks;
    }
    if ( listType === WITH_ACTIONS ) {
      return joinedTasks.filter( task => task.actions && task.actions.length > 0 );
    }
    if ( listType === WITH_MATERIALS ) {
      return joinedTasks.filter( task => task.materials && task.materials.length > 0 );
    }
  }, [ tasks, listType ] );

  const filteredTasks = useMemo( () =>
    filteredByListTypeTasks.filter( task => task.title.toLowerCase()
      .includes( search.toLowerCase() ) || task.status.toLowerCase()
      .includes( search.toLowerCase() ) || task.description.toLowerCase()
      .includes( search.toLowerCase() ) || ( task.actions && task.actions.some( a => ( a.title + a.duration + " hours" )
        .toLowerCase()
        .includes( search.toLowerCase() ) ) ) || ( task.materials && task.materials.some( m => ( m.title + m.amount + ( m.amount ? "pcs" : "" ) + m.price + ( m.price ? "eur" : "" ) )
        .toLowerCase()
        .includes( search.toLowerCase() ) ) ) || ( task.assigned.some( a => ( a.name + a.surname )
        .toLowerCase()
        .includes( search.toLowerCase() ) ) ) || ( task.deadlines && task.deadlines.some( d => ( moment.unix( d.startDate )
          .add( ( new Date )
            .getTimezoneOffset(), 'minutes' )
          .format( "DD.MM.yyyy hh:mm" ) + ( d.endDate ? " - " + moment.unix( d.endDate )
            .add( ( new Date )
              .getTimezoneOffset(), 'minutes' )
            .format( "DD.MM.yyyy hh:mm" ) : "" ) )
        .toLowerCase()
        .includes( search.toLowerCase() ) ) ) )
    .filter( task => task.title.toLowerCase()
      .includes( searchTitle.toLowerCase() ) && task.status.toLowerCase()
      .includes( searchStatus.toLowerCase() ) && task.description.toLowerCase()
      .includes( searchDescription.toLowerCase() ) && ( searchActions.length === 0 || ( task.actions && task.actions.some( a => a.title.toLowerCase()
        .includes( searchActions.toLowerCase() ) ) ) ) && ( searchDuration.length === 0 || ( task.actions && task.actions.some( a => ( a.duration + " hours" )
        .includes( searchDuration.toLowerCase() ) ) ) ) && ( searchMaterial.length === 0 || ( task.materials && task.materials.some( m => ( m.title + m.amount + ( m.amount ? "pcs" : "" ) + m.price + ( m.price ? "eur" : "" ) )
        .toLowerCase()
        .includes( searchMaterial.toLowerCase() ) ) ) ) && ( searchAssigned.length === 0 || task.assigned.some( a => ( a.name + a.surname )
        .toLowerCase()
        .includes( searchAssigned.toLowerCase() ) ) ) && ( searchDeadlines.length === 0 || ( task.deadlines && task.deadlines.some( d => ( moment.unix( d.startDate )
          .add( ( new Date )
            .getTimezoneOffset(), 'minutes' )
          .format( "DD.MM.yyyy hh:mm" ) + ( d.endDate ? " - " + moment.unix( d.endDate )
            .add( ( new Date )
              .getTimezoneOffset(), 'minutes' )
            .format( "DD.MM.yyyy hh:mm" ) : "" ) )
        .toLowerCase()
        .includes( searchDeadlines.toLowerCase() ) ) ) ) )
    .filter( task => !showMyTasks || task.assigned.some( a => a._id === userId ) ), [ tasks, search ] );

  console.log( userId );

  return (
    <div style={{width: "calc(100% - 200px)", display: 'inline-block', verticalAlign: "top"}}>
      <section>
        <input value={search} onChange={(e) => setSearch(e.target.value)} />
      </section>
      <AddTaskContainer users={users} tags={tags} />
      <EditTaskContainer users={users} tags={tags} task={chosenTask} setChosenTask={setChosenTask}/>
        <section>
          <label htmlFor="showMyTasks">Show only my tasks by default</label>
          <input
            id="showMyTasks"
            type="checkbox"
            name="showMyTasks"
            checked={showMyTasks}
            onChange={() =>  setShowMyTasks(!showMyTasks)}
            />
        </section>
      <table style={{width: "100%"}}>
        <thead>
          <tr>
            <th>Status</th>
            <th width="10%">Title</th>
            <th width="20%">Description</th>
            <th width="15%">Actions</th>
            <th>Duration</th>
            <th width="15%">Material</th>
            <th width="10%">Assigned</th>
            <th width="20%">Deadlines</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>
              <input value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)} />
            </th>
            <th>
              <input value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} />
            </th>
            <th>
              <input value={searchDescription} onChange={(e) => setSearchDescription(e.target.value)} />
            </th>
            <th>
              <input value={searchActions} onChange={(e) => setSearchActions(e.target.value)} />
            </th>
            <th>
              <input value={searchDuration} onChange={(e) => setSearchDuration(e.target.value)} />
            </th>
            <th>
              <input value={searchMaterial} onChange={(e) => setSearchMaterial(e.target.value)} />
            </th>
            <th>
              <input value={searchAssigned} onChange={(e) => setSearchAssigned(e.target.value)} />
            </th>
            <th>
              <input value={searchDeadlines} onChange={(e) => setSearchDeadlines(e.target.value)} />
            </th>
          </tr>
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
              <td>{task.materials?.map((material, index) =>
                  <span style={{display: "block"}} key={material._id + "" +  index}>{`[${material.checked ? "x" : ""}] ${material.title} ${material.amount ? material.amount + "pcs" : ""} ${material.price ? material.price + "eur" : ""}`}</span>
                )}</td>
              <td>{task.assigned.map(assigned => <span style={{display: "block"}} key={assigned._id}>{`${assigned.profile.name} ${assigned.profile.surname} `}</span>)}</td>
                <td>{task.deadlines?.map(deadline => <span style={{display: "block"}} key={deadline._id}>{`${moment.unix(deadline.startDate).add((new Date).getTimezoneOffset(), 'minutes').format("DD.MM.yyyy hh:mm")} ${deadline.endDate ? " - " + moment.unix(deadline.endDate).add((new Date).getTimezoneOffset(), 'minutes').format("DD.MM.yyyy hh:mm") : ""} `}</span>)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  );
};