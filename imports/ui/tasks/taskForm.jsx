import React, {
  useState,
  useMemo,
  useEffect,
} from 'react';
import Select from 'react-select';
import moment from 'moment';

export default function TaskForm( props ) {

  const {
    _id: taskId,
    title: taskTitle,
    description: taskDescription,
    status: taskStatus,
    assigned: taskAssigned,
    tag: taskTag,
    actions: taskActions,
    materials: taskMaterials,
    deadlines: taskDeadlines,
    users,
    tags,
    onSubmit,
    onCancel,
    onRemove
  } = props;

  const [ title, setTitle ] = useState( "" );
  const [ description, setDescription ] = useState( "" );
  const [ status, setStatus ] = useState( "" );
  const [ assigned, setAssigned ] = useState( [] );
  const [ tag, setTag ] = useState( null );

  const [ actions, setActions ] = useState( [] );
  const [ newAction, setNewAction ] = useState( null );
  const [ addingAction, setAddingAction ] = useState( false );

  const [ materials, setMaterials ] = useState( [] );
  const [ newMaterial, setNewMaterial ] = useState( null );
  const [ addingMaterial, setAddingMaterial ] = useState( false );


  const [ deadlines, setDeadlines ] = useState( [] );
  const [ newDeadline, setNewDeadline ] = useState( null );
  const [ addingDeadline, setAddingDeadline ] = useState( false );

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
    if ( taskMaterials ) {
      setMaterials( taskMaterials );
    } else {
      setMaterials( [] );
    }
    if ( taskDeadlines ) {
      setDeadlines( taskDeadlines );
    } else {
      setDeadlines( [] );
    }
  }, [ taskTitle, taskDescription, taskStatus, taskAssigned, taskTag, taskActions, taskMaterials, taskDeadlines ] )


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
      fullName: user.profile.name + " " + user.profile.surname
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

      <table style={{width: "100%"}}>
        <thead>
          <tr>
            <th colSpan="2">Materials</th>
            <th>Amount</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {materials.map(material =>
            <tr key={material._id}>
              <td>
                <input
                  type="checkbox"
                  checked={material.checked}
                  onChange={(e) =>{
                    const newMaterials = materials.map(a => {
                      if (a._id === material._id){
                        return {
                          ...a,
                          checked: !material.checked
                        };
                      }
                      return a;
                    });
                    setMaterials(newMaterials);
                  }}
                  />
              </td>
              <td>
                <input
                  value={material.title}
                  onChange={(e) =>{
                    const newMaterials = materials.map(a => {
                      if (a._id === material._id){
                        return {
                          ...a,
                          title: e.target.value
                        };
                      }
                      return a;
                    });
                    setMaterials(newMaterials);
                  }}
                  />
              </td>
              <td>
                <input
                  style={{width: "80px"}}
                  type="number"
                  value={material.amount}
                  onChange={(e) =>{
                    const newMaterials = materials.map(a => {
                      if (a._id === materials._id){
                        return {
                          ...a,
                          amount: e.target.value
                        };
                      }
                      return a;
                    });
                    setMaterials(newMaterials);
                  }}
                  />
              </td>
              <td>
                <input
                  style={{width: "80px"}}
                  type="number"
                  value={material.price}
                  onChange={(e) =>{
                    const newMaterials = materials.map(a => {
                      if (a._id === materials._id){
                        return {
                          ...a,
                          price: e.target.value
                        };
                      }
                      return a;
                    });
                    setMaterials(newMaterials);
                  }}
                  />
              </td>
              <td>
                <button
                  onClick={() => {setMaterials(materials.filter(a => a._id !== material._id)); setAddingMaterial(false);}}
                  >
                  x
                </button>
              </td>
            </tr>
          )}
          {addingMaterial &&
            <tr key={"add"}>
              <td colSpan="2">
                <input value={newMaterial?.title} onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})} />
              </td>
              <td>
                <input style={{width: "80px"}} type="number" value={newMaterial?.amount} onChange={(e) => setNewMaterial({...newMaterial, amount: e.target.value})} />
              </td>
              <td>
                <input style={{width: "80px"}} type="number" value={newMaterial?.price} onChange={(e) => setNewMaterial({...newMaterial, price: e.target.value})} />
              </td>
              <td>
                <button onClick={() => setAddingMaterial(false)}>x</button>
                <button onClick={() => { setMaterials([...materials, {...newMaterial, checked: false, _id: Math.random().toString(36).substring(7) }]); setNewMaterial(null); setAddingMaterial(false);}}>+</button>
              </td>
            </tr>
          }
          {!addingMaterial &&
            <tr key={"addBtn"}>
              <td colSpan="4">
                <button onClick={() => setAddingMaterial(true)}>+ Material</button>
              </td>
            </tr>
          }
        </tbody>
      </table>

      <table style={{width: "100%"}}>
        <thead>
          <tr>
            <th colSpan="2">Deadlines</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {deadlines.map(deadline =>
            <tr key={deadline._id}>
              <td>
                <input
                  type="checkbox"
                  checked={deadline.checked}
                  onChange={(e) =>{
                    const newDeadline = deadlines.map(a => {
                      if (a._id === deadline._id){
                        return {
                          ...a,
                          checked: !deadline.checked
                        };
                      }
                      return a;
                    });
                    setDeadlines(newDeadline);
                  }}
                  />
              </td>
              <td>
                <input
                  type="datetime-local"
                  value={moment.unix(deadline.startDate).add((new Date).getTimezoneOffset(), 'minutes').format("yyyy-MM-DD hh:mm").replace(" ", "T")}
                  onChange={(e) =>{
                    const newDeadline = deadlines.map(a => {
                      if (a._id === deadline._id){
                        return {
                          ...a,
                          startDate: e.target.valueAsNumber/1000
                        };
                      }
                      return a;
                    });
                    setDeadlines(newDeadlines);
                  }}
                  />
              </td>
              <td>
                <input
                  type="datetime-local"
                  value={moment.unix(deadline.endDate).add((new Date).getTimezoneOffset(), 'minutes').format("yyyy-MM-DD hh:mm").replace(" ", "T")}
                  onChange={(e) =>{
                    const newDeadlines = deadlines.map(a => {
                      if (a._id === deadline._id){
                        return {
                          ...a,
                          endDate: e.target.valueAsNumber/1000
                        };
                      }
                      return a;
                    });
                    setDeadlines(newDeadlines);
                  }}
                  />
              </td>
              <td>
                <button
                  onClick={() => {setDeadlines(deadlines.filter(a => a._id !== deadline._id)); setAddingDeadline(false);}}
                  >
                  x
                </button>
              </td>
            </tr>
          )}
          {addingDeadline &&
            <tr key={"add"}>
              <td colSpan="2">
                <input
                  type="datetime-local"
                  value={moment.unix(newDeadline?.startDate).add((new Date).getTimezoneOffset(), 'minutes').format("yyyy-MM-DD hh:mm").replace(" ", "T")}
                  max={moment.unix(newDeadline?.endDate).add((new Date).getTimezoneOffset(), 'minutes').format("yyyy-MM-DD hh:mm").replace(" ", "T")}
                  onChange={(e) => setNewDeadline({...newDeadline, startDate: e.target.valueAsNumber/1000})}
                  />
              </td>
              <td>
                <input
                  type="datetime-local"
                  value={moment.unix(newDeadline?.endDate).add((new Date).getTimezoneOffset(), 'minutes').format("yyyy-MM-DD hh:mm").replace(" ", "T")}
                  min={moment.unix(newDeadline?.startDate).add((new Date).getTimezoneOffset(), 'minutes').format("yyyy-MM-DD hh:mm").replace(" ", "T")}
                  onChange={(e) => setNewDeadline({...newDeadline, endDate: e.target.valueAsNumber/1000})}
                  />
              </td>
              <td>
                <button onClick={() => {setAddingDeadline(false); setNewDeadline(null);}}>x</button>
                <button onClick={() => { setDeadlines([...deadlines, {...newDeadline, checked: false, _id: Math.random().toString(36).substring(7) }]); setNewDeadline(null); setAddingDeadline(false);}}>+</button>
              </td>
            </tr>
          }
          {!addingDeadline &&
            <tr key={"addBtn"}>
              <td colSpan="4">
                <button onClick={() => setAddingDeadline(true)}>+ Deadline</button>
              </td>
            </tr>
          }
        </tbody>
      </table>

      <button onClick={onCancel}>Cancel</button>
      {onRemove &&
        <button onClick={() => {onRemove(taskId); onCancel();}}>Delete</button>
      }
      <button
        disabled={title.length === 0}
        onClick={() => onSubmit(
          title,
          description,
          status,
          assigned.map(user => user._id),
          tag?._id,
          actions,
          materials,
          deadlines
        )}
        >
        Save
      </button>

    </div>
  );
};

// console.log(e.target.valueAsNumber, moment.unix(e.target.valueAsNumber/1000).add((new Date).getTimezoneOffset(), 'minutes').format('DD.MM.YYYY HH:mm'))