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
  Icon
} from '@fluentui/react/lib/Icon';

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

import {
  WHOLE_TABLE,
  WITH_ACTIONS,
  WITH_MATERIALS
} from '../other/constants';

import {
  Sidebar as StyledSidebar,
  SidebarLink
} from '../other/styles/styledComponents';

export default function Sidebar( props ) {

  const {
    match
  } = props;

  const tasks = useTracker( () => TasksCollection.find( {} )
    .fetch() );
  const tags = useTracker( () => TagsCollection.find( {} )
    .fetch() );
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
  const listType = match.params.listType ? match.params.listType : 'all';

  return (
    <StyledSidebar>
      <ul>
        <SidebarLink key="whole" active={listType === WHOLE_TABLE}>
          <Link to={`/tasks/${tagID}/all`}><Icon iconName="TriangleSolidRight12"/> Whole table</Link>
        </SidebarLink>
        <SidebarLink key="actions" active={listType === WITH_ACTIONS}>
          <Link to={`/tasks/${tagID}/actions`}><Icon iconName="TriangleSolidRight12"/> Actions</Link>
        </SidebarLink>
        <SidebarLink key="materials" active={listType === WITH_MATERIALS}>
          <Link to={`/tasks/${tagID}/materials`}><Icon iconName="ShoppingCartSolid"/> Materials</Link>
        </SidebarLink>
        <SidebarLink key="all" active={tagID === "all"}>
          <Link to="/tasks"><Icon iconName="FabricFolderFill"/> All tags</Link>
        </SidebarLink>
        {tags.map(tag => (
          <SidebarLink key={tag._id} active={tagID === tag._id}>
            <Link to={`/tasks/${tag._id}${listType ? "/" + listType : ""}`}><Icon iconName="FabricFolderFill"/> {tag.title}</Link>
            <Icon iconName="Settings" onClick={() => setChosenTag(tag)} />
          </SidebarLink>
        ))}
        <hr />
        <SidebarLink key="users"  active={match.url.includes("users")}>
          <Link to="/users"><Icon iconName="Settings"/> Users</Link>
        </SidebarLink>
        <SidebarLink key="addTag">
          <AddTagContainer/>
        </SidebarLink>
        <SidebarLink key="addUser">
          <AddUserContainer/>
        </SidebarLink>
      </ul>

      <EditTagContainer tag={chosenTag} setChosenTag={setChosenTag}/>
    </StyledSidebar>
  );
};