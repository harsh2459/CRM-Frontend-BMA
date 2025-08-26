import React, { useState } from 'react';
import NotesList from '../components/NotesList ';
import NoteModal from '../components/NoteModal';
import '../style/components/Notespage.css';

const NotesPage = () => {
  const [showModal, setShowModal] = useState(false);

  const handleAddNote = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAfterCreate = () => {
    console.log('Note created successfully');
  };

  return (
    <div className="notes-page-container">
      <div className="notes-header">
        <h2>Notes</h2>
        <button className='btn btn-primary' onClick={handleAddNote}>Add Note</button>
      </div>

      {showModal && <NoteModal onClose={handleCloseModal} afterCreate={handleAfterCreate}/>}

      <NotesList />
    </div>
  );
};

export default NotesPage;
