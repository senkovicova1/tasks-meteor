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

import {
  WHOLE_TABLE,
  WITH_ACTIONS,
  WITH_MATERIALS,
  columns,
  ALL_COLUMNS,
  ACTIONS_COLUMNS,
  MATERIAL_COLUMNS
} from '../../other/constants';

import {
  List,
  SearchSection,
  Input
} from "../../other/styles/styledComponents";

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

  const [ displayColumns, setDisplayColumns ] = useState( [] );
  const [ listType, setListType ] = useState( null );


  useEffect( () => {
    setShowMyTasks( showMy );
  }, [
    showMy
  ] );

  useEffect( () => {
    const newListType = match.params.listType;
    if ( !newListType || newListType === WHOLE_TABLE ) {
      setDisplayColumns( ALL_COLUMNS );
      setListType( WHOLE_TABLE );
    }
    if ( newListType === WITH_ACTIONS ) {
      setDisplayColumns( ACTIONS_COLUMNS );
      setListType( WITH_ACTIONS );
    }
    if ( newListType === WITH_MATERIALS ) {
      setDisplayColumns( MATERIAL_COLUMNS );
      setListType( WITH_MATERIALS );
    }
  }, [
    match.params.listType
  ] );

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
        .includes( search.toLowerCase() ) ) ) || ( task.assigned.some( a => ( a.profile.name + a.profile.surname )
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
        .includes( searchMaterial.toLowerCase() ) ) ) ) && ( searchAssigned.length === 0 || task.assigned.some( a => ( a.profile.name + a.profile.surname )
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



  return (
    <List>
      <h2>{(listType?.charAt(0).toUpperCase() + listType?.slice(1)).toString()}</h2>
      <SearchSection>
        <Input width="30%" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <AddTaskContainer users={users} tags={tags} />
        <section>
          <label htmlFor="showMyTasks">My tasks</label>
          <Input
            id="showMyTasks"
            type="checkbox"
            name="showMyTasks"
            checked={showMyTasks}
            onChange={() =>  setShowMyTasks(!showMyTasks)}
            />
        </section>
      </SearchSection>
      <EditTaskContainer users={users} tags={tags} task={chosenTask} setChosenTask={setChosenTask}/>
      <table>
        <thead>
          <tr>
            {displayColumns.map(col => <th  key={col.value} width={col.width[listType]}>{col.label}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            {
              displayColumns.map(col => {
                switch (col.value) {
                  case "status":
                  return (
                    <td key={col.value}>
                      <Input value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)} />
                    </td>
                  );
                  case "title":
                  return (
                    <td key={col.value}>
                      <Input value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} />
                    </td>
                  );
                  case "description":
                  return (
                    <td key={col.value}>
                      <Input value={searchDescription} onChange={(e) => setSearchDescription(e.target.value)} />
                    </td>
                  );
                  case "actions":
                  return (
                    <td key={col.value}>
                      <Input value={searchActions} onChange={(e) => setSearchActions(e.target.value)} />
                    </td>
                  );
                  case "duration":
                  return (
                    <td key={col.value}>
                      <Input value={searchDuration} onChange={(e) => setSearchDuration(e.target.value)} />
                    </td>
                  );
                  case "material":
                  return (
                    <td key={col.value}>
                      <Input value={searchMaterial} onChange={(e) => setSearchMaterial(e.target.value)} />
                    </td>
                  );
                  case "assigned":
                  return (
                    <td key={col.value}>
                      <Input value={searchAssigned} onChange={(e) => setSearchAssigned(e.target.value)} />
                    </td>
                  );
                  case "deadlines":
                  return (
                    <td key={col.value}>
                      <Input value={searchDeadlines} onChange={(e) => setSearchDeadlines(e.target.value)} />
                    </td>
                  );
                }
              })
            }
          </tr>

          {filteredTasks.map(task =>
            <tr key={task._id} onClick={() => setChosenTask(task)}>
              {displayColumns.map(col => {
                if (["status", "title", "description"].includes(col.value)){
                  return (<td key={col.value}>{task[col.value]}</td>);
                }
                if (col.value === "actions"){
                  return (<td key={col.value}>
                    {task.actions?.map((action, index) =>
                      <span style={{display: "block"}} key={action._id + "" +  index}>{`[${action.checked ? "x" : ""}] ${action.title}`}</span>
                    )}
                  </td>);
                }
                if (col.value === "duration"){
                  return (<td key={col.value}>
                    {task.actions?.map((action, index) =>
                      <span style={{display: "block"}} key={action._id + "" + index}>{action.duration && action.duration > 0 ? `${action.duration} hours` : ""}</span>
                    )}
                  </td>);
                }
                if (col.value === "material"){
                  return (<td key={col.value}>{task.materials?.map((material, index) =>
                    <span style={{display: "block"}} key={material._id + "" +  index}>{`[${material.checked ? "x" : ""}] ${material.title} ${material.amount ? material.amount + "pcs" : ""} ${material.price ? material.price + "eur" : ""}`}</span>
                  )}</td>);
                }
                if (col.value === "assigned"){
                  return (<td key={col.value}>{task.assigned.map(assigned => <span style={{display: "block"}} key={assigned._id}>{`${assigned.profile.name} ${assigned.profile.surname} `}</span>)}</td>);
                }
                if (col.value === "deadlines") {
                  return (<td key={col.value}>{task.deadlines?.map(deadline => <span style={{display: "block"}} key={deadline._id}>{`${moment.unix(deadline.startDate).add((new Date).getTimezoneOffset(), 'minutes').format("DD.MM.yyyy hh:mm")} ${deadline.endDate ? " - " + moment.unix(deadline.endDate).add((new Date).getTimezoneOffset(), 'minutes').format("DD.MM.yyyy hh:mm") : ""} `}</span>)}</td>);
                }
              })}
            </tr>
          )}
        </tbody>
      </table>
    </List>
  );
};