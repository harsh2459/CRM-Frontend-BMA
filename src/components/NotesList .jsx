import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes, deleteNote } from '../actions/NotesActions';
import Pagination from './Pagination'; // Pagination component
import '../style/components/NotesList.css';
import EditNoteModal from './EditNoteModal';


const ViewNotes = ({ note, onClose }) => {
    return (
        <div className="modal-overlay-note">
            <div className="modal-card-note full-note">
                <h3>{note.title}</h3>
                <div className="note-description" dangerouslySetInnerHTML={{ __html: note.description }}></div>
                <div className="modal-actions-note">
                    <button className="btn btn-accent" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

const NotesList = () => {
    const dispatch = useDispatch();
    const { notes, loading, total } = useSelector(state => state.notes);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNote, setSelectedNote] = useState(null); // Selected note for editing
    const [showFullNoteModal, setShowFullNoteModal] = useState(false); // Control modal visibility
    const [showEditNoteModal, setShowEditNoteModal] = useState(false); // Control edit modal visibility
    const itemsPerPage = 10;

    useEffect(() => {
        dispatch(fetchNotes(currentPage, itemsPerPage));
    }, [dispatch, currentPage]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleDelete = (id) => {
        dispatch(deleteNote(id));
    };

    const handleEdit = (note) => {
        setSelectedNote(note);
        setShowEditNoteModal(true); // Open edit modal
    };

    const handleFullNoteClick = (note) => {
        setSelectedNote(note);
        setShowFullNoteModal(true); // Open view modal
    };

    const handleCloseFullNoteModal = () => {
        setShowFullNoteModal(false); // Close view modal
        setSelectedNote(null); // Clear the selected note
    };

    const handleCloseEditNoteModal = () => {
        setShowEditNoteModal(false); // Close edit modal
        setSelectedNote(null); // Clear the selected note
    };

    const reversedNotes = notes.slice().reverse();

    return (
        <div>
            <input
                type="text"
                placeholder="Search Notes"
                value={searchQuery}
                onChange={handleSearch}
                className='note-search'
            />

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="notes-list">
                    {reversedNotes.filter(note =>
                        note.title.includes(searchQuery) || note.description.includes(searchQuery)
                    ).map(note => (
                        <div key={note._id} className="note-item">
                            <h4>{note.title}</h4>
                            <p dangerouslySetInnerHTML={{ __html: note.description }}></p>
                            <div className="note-actions">
                                <button onClick={() => handleEdit(note)} className='btn btn-accent'>Edit</button>
                                <button onClick={() => handleDelete(note._id)} className='btn btn-ghost'>Delete</button>
                                <button onClick={() => handleFullNoteClick(note)} className='btn btn-primary'>View</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Pagination
                totalItems={total}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />

            {/* Show modal for full note details */}
            {showFullNoteModal && selectedNote && (
                <ViewNotes note={selectedNote} onClose={handleCloseFullNoteModal} />
            )}

            {/* Show modal for editing the selected note */}
            {showEditNoteModal && selectedNote && (
                <EditNoteModal
                    note={selectedNote}
                    onClose={handleCloseEditNoteModal}
                />
            )}
        </div>
    );
};

export default NotesList;
