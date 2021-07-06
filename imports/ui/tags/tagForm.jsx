import React, {
  useState,
  useEffect,
} from 'react';

import {
  Form,
  Input,
  ButtonRow,
  FullButton,
} from "../../other/styles/styledComponents";

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
    <Form>

      <section>
        <label htmlFor="title2">Title</label>
        <Input
          id="title2"
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          />
      </section>

      <section>
        <label htmlFor="description">Description</label>
        <Input
          id="description"
          name="description"
          type="text"
          value={description}
          onChange={(e) =>  setDescription(e.target.value)}
          />
      </section>

      <section>
        <label  htmlFor="color">Color</label>
          <Input
              type="color"
              name="color"
              placeholder="Choose colour"
              value={color}
              onChange={(e) => setColor(e.target.value)}
          />
      </section>

<ButtonRow>

      <FullButton colour="grey" onClick={(e) => {e.preventDefault(); onCancel();}}>Cancel</FullButton>
      {onRemove &&
        <FullButton colour="red" onClick={(e) => {e.preventDefault(); onRemove(tagId); onCancel();}}>Delete</FullButton>
      }
      <FullButton
        colour=""
        disabled={title.length === 0}
        onClick={(e) => {e.preventDefault(); onSubmit(
          title,
          description,
          color,
        );}}
        >
        Save
      </FullButton>
    </ButtonRow>

    </Form>
  );
};
