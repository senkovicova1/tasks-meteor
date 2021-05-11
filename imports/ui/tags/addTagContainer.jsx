import React, {
  useState,
  useMemo
} from 'react';

import {
  TagsCollection
} from '/imports/api/tagsCollection';

import {
  Modal,
  ModalBody
} from 'reactstrap';

import TagForm from './tagForm';

export default function AddTagContainer( props ) {

  const [ addTagModalOpen, showAddTagModal ] = useState( false );

  const toggleAddTagModal = () => showAddTagModal( !addTagModalOpen );

  const addNewTag = ( title ) => {
    TagsCollection.insert( {
      title,
    } );
    showAddTagModal( false );
  }

  const closeModal = () => {
    showAddTagModal( false );
  }

  return (
      <div>
      <button onClick={toggleAddTagModal}> + Tag </button>
      <Modal isOpen={addTagModalOpen} toggle={toggleAddTagModal}>
        <ModalBody>
          <TagForm onSubmit={addNewTag} onCancel={closeModal}/>
        </ModalBody>
      </Modal>
      </ div>
  );
};