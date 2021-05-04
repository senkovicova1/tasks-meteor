import React, {
  useState,
  useMemo,
  useEffect,
} from 'react';

export default function TaskForm( props ) {

  const {
    title: taskTitle,
    description: taskDescription,
    status: taskStatus,
    onSubmit,
    onCancel,
  } = props;


  const [ title, setTitle ] = useState( "" );
  const [ description, setDescription ] = useState( "" );
  const [ status, setStatus ] = useState( "" );

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
  }, [ taskTitle, taskDescription, taskStatus ] )


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

      <button onClick={onCancel}>Cancel</button>
      <button disabled={title.length === 0} onClick={() => onSubmit(title, description, status)}>Save</button>

    </div>
  );
};