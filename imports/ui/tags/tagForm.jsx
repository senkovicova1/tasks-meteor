import React, {
  useState,
  useEffect,
} from 'react';

export default function TagForm( props ) {

  const {
    _id: tagId,
    title: tagTitle,
    description: tagDescription,
    color: tagColor,
    onSubmit,
    onRemove,
    onCancel,
  } = props;

  const [ title, setTitle ] = useState( "" );
  const [ description, setDescription ] = useState( "" );
  const [ color, setColor ] = useState( "" );

  useEffect( () => {
    if ( tagTitle ) {
      setTitle( tagTitle );
    } else {
      setTitle( "" );
    }
    if ( tagDescription ) {
      setDescription( tagDescription );
    } else {
      setDescription( "" );
    }
    if ( tagColor ) {
      setColor( tagColor );
    } else {
      setColor( "" );
    }
  }, [ tagTitle, tagDescription, tagColor ] );


  return (
    <div>

      <section>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          />
      </section>

      <section>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          name="description"
          value={description}
          onChange={(e) =>  setDescription(e.target.value)}
          />
      </section>

      <section>
        <label  htmlFor="color">Color</label>
          <input
              type="color"
              name="color"
              placeholder="Choose colour"
              value={color}
              onChange={(e) => setColor(e.target.value)}
          />
      </section>

      <button onClick={onCancel}>Cancel</button>
      {onRemove &&
        <button onClick={() => {onRemove(tagId); onCancel();}}>Delete</button>
      }
      <button
        disabled={title.length === 0}
        onClick={() => onSubmit(
          title,
          description,
          color,
        )}
        >
        Save
      </button>

    </div>
  );
};