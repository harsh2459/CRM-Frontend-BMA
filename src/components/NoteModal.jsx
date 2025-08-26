import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import ReactQuill from 'react-quill';
import { addNote } from '../actions/NotesActions';
import 'react-quill/dist/quill.snow.css'; // Ensure this is included
import '../style/components/NoteModal.css';

const NoteModal = ({ onClose, note, afterCreate }) => {
  const dispatch = useDispatch();

  // Initialize state with the note data (if available)
  const [form, setForm] = useState({
    title: note ? note.title : '',
    description: note ? note.description : '',
  });

  const id = sessionStorage.getItem('adminId');

  // Handle input change for the title and description
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleDescriptionChange = (value) => {
    setForm({ ...form, description: value });
  };

  // Handle submit (either create or update note)
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addNote({
      ...form,
      createdBy: id,
    }));
    afterCreate();
    onClose();
  };

  return (
    <div className="modal-overlay-note">
      <div className="modal-card-note">
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Note Title"
            required
          />

          {/* Quill Editor for note description */}
          <ReactQuill
            value={form.description}
            onChange={handleDescriptionChange}
            placeholder="Write your note here"
            theme="snow"
            modules={{
              toolbar: [
                [{ 'header': '1' }, { 'header': '2' }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['bold', 'italic', 'underline'],
                ['link'],
                [{ 'align': [] }],
                ['image', 'video'],
              ],
            }}
          />

            <button className="btn btn-accent mr-10" type="submit">Create Note</button>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
