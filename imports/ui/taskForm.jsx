import React, {
  useState,
  useMemo,
  useEffect,
} from 'react';
import Select from 'react-select';

export default function TaskForm( props ) {

  const {
    title: taskTitle,
    description: taskDescription,
    status: taskStatus,
    assigned: taskAssigned,
    tag: taskTag,
    actions: taskActions,
    users,
    tags,
    onSubmit,
    onCancel,
  } = props;

  const [ title, setTitle ] = useState( "" );
  const [ description, setDescription ] = useState( "" );
  const [ status, setStatus ] = useState( "" );
  const [ assigned, setAssigned ] = useState( [] );
  const [ tag, setTag ] = useState( null );
  const [ actions, setActions ] = useState( [] );
  const [ newAction, setNewAction ] = useState( null );
  const [ addingAction, setAddingAction ] = useState( false );


  useEffect( () => {
    if ( taskTitle ) {
      setTitle( taskTitle );
    } else {
      setTitle( "" );
    }
    if ( taskDescription ) {
      setDescription( taskDescription );
    } else {
      setDescription( "" );
    }
    if ( taskStatus ) {
      setStatus( taskStatus );
    } else {
      setStatus( "Open" );
    }
    if ( taskAssigned ) {
      setAssigned( createReactSelectValue( taskAssigned.map( user => ( {
        ...user,
        fullName: user.name + " " + user.surname
      } ) ), "fullName" ) );
    } else {
      setAssigned( [] );
    }
    if ( taskTag ) {
      setTag( {
        ...taskTag,
        label: taskTag.title,
        value: taskTag._id
      } );
    } else {
      setTag( null );
    }
    if ( taskActions ) {
      setActions( taskActions );
    } else {
      setActions( [] );
    }
  }, [ taskTitle, taskDescription, taskStatus, taskAssigned, taskTag, taskActions ] )


  const createReactSelectValue = ( array, label = "title", value = "_id" ) => {
    return array.map( item => ( {
      ...item,
      label: item[ label ],
      value: item[ value ]
    } ) );
  }

  const allUsers = useMemo( () =>
    createReactSelectValue( users.map( user => ( {
      ...user,
      fullName: user.name + " " + user.surname
    } ) ), "fullName" ),
    [ users ] );

  const allTags = useMemo( () => createReactSelectValue( tags ), [ tags ] );

  return (
    <div>

      <section>
        <label htmlFor="title">Title</label>
        <input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </section>

      <section>
        <label  htmlFor="status">Status</label>
        <select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Open">Open</option>
          <option value="Pending">Pending</option>
          <option value="Closed">Closed</option>
        </select>
      </section>

      <section>
        <label htmlFor="description">Description</label>
        <input id="description" name="description"  value={description} onChange={(e) => {e.preventDefault(); setDescription(e.target.value)}} />
      </section>

      <section>
        <label htmlFor="assigned">Assigned</label>
        <Select
          value={assigned}
          onChange={(e) => setAssigned(e)}
          isMulti
          options={allUsers}
          />
      </section>

      <section>
        <label htmlFor="tag">Tag</label>
        <Select
          value={tag}
          onChange={(e) => setTag(e)}
          options={allTags}
          />
      </section>

      <table style={{width: "100%"}}>
        <thead>
          <tr>
            <th colSpan="2">Action</th>
            <th>Duration (h)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {actions.map(action =>
            <tr key={action._id}>
              <td>
                <input
                  type="checkbox"
                  checked={action.checked}
                  onChange={(e) =>{
                    const newActions = actions.map(a => {
                      if (a._id === action._id){
                        return {
                          ...a,
                          checked: !action.checked
                        };
                      }
                      return a;
                    });
                    setActions(newActions);
                  }}
                  />
              </td>
              <td>
                <input
                  value={action.title}
                  onChange={(e) =>{
                    const newActions = actions.map(a => {
                      if (a._id === action._id){
                        return {
                          ...a,
                          title: e.target.value
                        };
                      }
                      return a;
                    });
                    setActions(newActions);
                  }}
                  />
              </td>
              <td>
                <input
                  type="number"
                  value={action.duration}
                  onChange={(e) =>{
                    const newActions = actions.map(a => {
                      if (a._id === action._id){
                        return {
                          ...a,
                          duration: e.target.value
                        };
                      }
                      return a;
                    });
                    setActions(newActions);
                  }}
                  />
              </td>
              <td>
                <button
                  onClick={() => {setActions(actions.filter(a => a._id !== action._id)); setAddingAction(false);}}
                  >
                  x
                </button>
              </td>
            </tr>
          )}
          {addingAction &&
            <tr key={"add"}>
              <td colSpan="2">
                <input value={newAction?.title} onChange={(e) => setNewAction({...newAction, title: e.target.value})} />
              </td>
              <td>
                <input type="number" value={newAction?.duration} onChange={(e) => setNewAction({...newAction, duration: e.target.value})} />
              </td>
              <td>
                <button onClick={() => setAddingAction(false)}>x</button>
                <button onClick={() => { setActions([...actions, {...newAction, checked: false, _id: Math.random().toString(36).substring(7) }]); setNewAction(null); setAddingAction(false);}}>+</button>
              </td>
            </tr>
          }
          {!addingAction &&
            <tr key={"addBtn"}>
              <td colSpan="4">
                <button onClick={() => setAddingAction(true)}>+ Action</button>
              </td>
            </tr>
          }
        </tbody>
      </table>

      <button onClick={onCancel}>Cancel</button>
      <button
        disabled={title.length === 0}
        onClick={() => onSubmit(
          title,
          description,
          status,
          assigned.map(user => user._id),
          tag?._id,
          actions,
        )}
        >
        Save
      </button>

    </div>
  );
};