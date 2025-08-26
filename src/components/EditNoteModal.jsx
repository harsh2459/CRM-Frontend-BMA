import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateNote } from '../actions/NotesActions';
import '../style/components/NoteModal.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const EditNoteModal = ({ note, onClose }) => {
    const dispatch = useDispatch();

    const [form, setForm] = useState({
        title: note.title,
        description: note.description,
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleDescriptionChange = (value) => {
        setForm({ ...form, description: value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateNote(note._id, form));  // Update the note using the action
        onClose();  // Close the modal
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
                    <button className="btn btn-accent mr-10" type="submit">Edit Note</button>
                    <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default EditNoteModal;
