import React, {
  useState,
  useMemo,
  useEffect,
} from 'react';
import Select from 'react-select';
import moment from 'moment';

import {
  Icon
} from '@fluentui/react/lib/Icon';

import {
  statuses
} from '../../other/constants';

import {
  selectStyle
} from '../../other/styles/selectStyles';

import {
  Form,
  FormTable,
  Input,
  Textarea,
  TitleInput,
  ButtonRow,
  FullButton,
  GroupButton,
  LinkButton
} from "../../other/styles/styledComponents";

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
  const [ status, setStatus ] = useState( {} );
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
      setStatus( statuses.find( s => s.value === taskStatus ) );
    } else {
      setStatus( statuses[ 0 ] );
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
    <Form>

      <section>
        <TitleInput id="title" placeholder="NEW TASK" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </section>

      <hr/>

      <section>
        <label  htmlFor="status">Status</label>
        {statuses.map(s => <GroupButton colour={s.value === status.value ? s.colour : null} onClick={(e) => {e.preventDefault(); setStatus(s);}}>{s.label}</GroupButton>)}
      </section>

      <section>
        <label htmlFor="assigned">Assigned</label>
        <Select
          styles={selectStyle}
          value={assigned}
          onChange={(e) => setAssigned(e)}
          isMulti
          options={allUsers}
          />
      </section>

      <section>
        <label htmlFor="tag">Tag</label>
        <Select
          styles={selectStyle}
          value={tag}
          onChange={(e) => setTag(e)}
          options={allTags}
          />
      </section>

      <section>
        <label htmlFor="description">Description</label>
      </section>
      <Textarea width="100%" id="description" placeholder="Description" name="description"  value={description} onChange={(e) => {e.preventDefault(); setDescription(e.target.value)}} />

      <FormTable>
        <thead>
          <tr>
            <th colSpan="2">Action</th>
            <th>Duration (h)</th>
            <th width="10%"></th>
          </tr>
        </thead>
        <tbody>
          {actions.map(action =>
            <tr key={action._id}>
              <td>
                <Input
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
                <Input
                  type="text"
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
                <Input
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
                <LinkButton
                  onClick={() => {setActions(actions.filter(a => a._id !== action._id)); setAddingAction(false);}}
                  >
                  <Icon  iconName="Cancel" />
                </LinkButton>
              </td>
            </tr>
          )}
          {addingAction &&
            <tr key={"add"}>
              <td colSpan="2">
                <Input
                  placeholder="New action"
                  type="text"
                  value={newAction?.title}
                  onChange={(e) => setNewAction({...newAction, title: e.target.value})}
                   />
              </td>
              <td>
                <Input placeholder="Add duration" type="number" value={newAction?.duration} onChange={(e) => setNewAction({...newAction, duration: e.target.value})} />
              </td>
              <td>
                <LinkButton onClick={() => setAddingAction(false)}><Icon  iconName="Cancel" /></LinkButton>
                <LinkButton onClick={() => { setActions([...actions, {...newAction, checked: false, _id: Math.random().toString(36).substring(7) }]); setNewAction(null); setAddingAction(false);}}><Icon  iconName="Add" /></LinkButton>
              </td>
            </tr>
          }
          {!addingAction &&
            <tr key={"addBtn"}>
              <td colSpan="4">
                <LinkButton onClick={() => setAddingAction(true)}><Icon  iconName="Add" /> Action</LinkButton>
              </td>
            </tr>
          }
        </tbody>
      </FormTable>

      <FormTable>
        <thead>
          <tr>
            <th colSpan="2">Materials</th>
            <th>Amount</th>
            <th>Price</th>
            <th width="10%"></th>
          </tr>
        </thead>
        <tbody>
          {materials.map(material =>
            <tr key={material._id}>
              <td>
                <Input
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
                <Input
                  type="text"
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
                <Input
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
                <Input
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
                <LinkButton
                  onClick={() => {setMaterials(materials.filter(a => a._id !== material._id)); setAddingMaterial(false);}}
                  >
                  <Icon  iconName="Cancel" />
                </LinkButton>
              </td>
            </tr>
          )}
          {addingMaterial &&
            <tr key={"add"}>
              <td colSpan="2">
                <Input type="text" placeholder="New material" value={newMaterial?.title} onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})} />
              </td>
              <td>
                <Input type="number" placeholder="Add amount" value={newMaterial?.amount} onChange={(e) => setNewMaterial({...newMaterial, amount: e.target.value})} />
              </td>
              <td>
                <Input type="number" placeholder="Add price" value={newMaterial?.price} onChange={(e) => setNewMaterial({...newMaterial, price: e.target.value})} />
              </td>
              <td>
                <LinkButton onClick={() => setAddingMaterial(false)}>
                <Icon  iconName="Cancel" />
              </LinkButton>
                <LinkButton onClick={() => { setMaterials([...materials, {...newMaterial, checked: false, _id: Math.random().toString(36).substring(7) }]); setNewMaterial(null); setAddingMaterial(false);}}>
                <Icon  iconName="Add" />
              </LinkButton>
              </td>
            </tr>
          }
          {!addingMaterial &&
            <tr key={"addBtn"}>
              <td colSpan="4">
                <LinkButton onClick={() => setAddingMaterial(true)}><Icon  iconName="Add" /> Material</LinkButton>
              </td>
            </tr>
          }
        </tbody>
      </FormTable>

      <FormTable>
        <thead>
          <tr>
            <th colSpan="2">Deadlines</th>
            <th></th>
            <th width="10%"></th>
          </tr>
        </thead>
        <tbody>
          {deadlines.map(deadline =>
            <tr key={deadline._id}>
              <td width="30px">
                <Input
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
                <Input
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
                <Input
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
                <LinkButton
                  onClick={() => {setDeadlines(deadlines.filter(a => a._id !== deadline._id)); setAddingDeadline(false);}}
                  >
                  <Icon  iconName="Cancel" />
                </LinkButton>
              </td>
            </tr>
          )}
          {addingDeadline &&
            <tr key={"add"}>
              <td colSpan="2">
                <Input
                  type="datetime-local"
                  placeholder="Start deadline"
                  value={moment.unix(newDeadline?.startDate).add((new Date).getTimezoneOffset(), 'minutes').format("yyyy-MM-DD hh:mm").replace(" ", "T")}
                  max={moment.unix(newDeadline?.endDate).add((new Date).getTimezoneOffset(), 'minutes').format("yyyy-MM-DD hh:mm").replace(" ", "T")}
                  onChange={(e) => setNewDeadline({...newDeadline, startDate: e.target.valueAsNumber/1000})}
                  />
              </td>
              <td>
                <Input
                  type="datetime-local"
                  placeholder="End deadline"
                  value={moment.unix(newDeadline?.endDate).add((new Date).getTimezoneOffset(), 'minutes').format("yyyy-MM-DD hh:mm").replace(" ", "T")}
                  min={moment.unix(newDeadline?.startDate).add((new Date).getTimezoneOffset(), 'minutes').format("yyyy-MM-DD hh:mm").replace(" ", "T")}
                  onChange={(e) => setNewDeadline({...newDeadline, endDate: e.target.valueAsNumber/1000})}
                  />
              </td>
              <td>
                <LinkButton onClick={() => {setAddingDeadline(false); setNewDeadline(null);}}>
                  <Icon  iconName="Cancel" />
                </LinkButton>
                <LinkButton onClick={() => { setDeadlines([...deadlines, {...newDeadline, checked: false, _id: Math.random().toString(36).substring(7) }]); setNewDeadline(null); setAddingDeadline(false);}}>
                <Icon  iconName="Add" />
              </LinkButton>
              </td>
            </tr>
          }
          {!addingDeadline &&
            <tr key={"addBtn"}>
              <td colSpan="4">
                <LinkButton onClick={() => setAddingDeadline(true)}><Icon  iconName="Add" /> Deadline</LinkButton>
              </td>
            </tr>
          }
        </tbody>
      </FormTable>

      <ButtonRow>
        <FullButton colour="grey" onClick={(e) => {e.preventDefault(); onCancel()}}>Cancel</FullButton>
        {onRemove &&
          <FullButton colour="red" onClick={(e) => {e.preventDefault(); onRemove(taskId); onCancel();}}>Delete</FullButton>
        }
        <FullButton
          colour=""
          disabled={title.length === 0}
          onClick={(e) => {e.preventDefault(); onSubmit(
            title,
            description,
            status.value,
            assigned.map(user => user._id),
            tag?._id,
            actions,
            materials,
            deadlines
          );}}
          >
          Save
        </FullButton>
      </ButtonRow>

    </Form>
  );
};

// console.log(e.target.valueAsNumber, moment.unix(e.target.valueAsNumber/1000).add((new Date).getTimezoneOffset(), 'minutes').format('DD.MM.YYYY HH:mm'))