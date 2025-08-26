import {
    FETCH_NOTES_REQUEST,
    FETCH_NOTES_SUCCESS,
    FETCH_NOTES_FAIL,
    ADD_NOTE_REQUEST,
    ADD_NOTE_SUCCESS,
    ADD_NOTE_FAIL,
    DELETE_NOTE_REQUEST,
    DELETE_NOTE_SUCCESS,
    DELETE_NOTE_FAIL,
} from '../actions/NotesActions';

const initialState = {
    notes: [],
    loading: false,
    total: 0,
    error: null,
};

export const notesReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_NOTES_REQUEST:
        case ADD_NOTE_REQUEST:
        case DELETE_NOTE_REQUEST:
            return { ...state, loading: true, error: null };

        case FETCH_NOTES_SUCCESS:
            return { ...state, loading: false, notes: action.payload.notes, total: action.payload.total };

        case ADD_NOTE_SUCCESS:
            return { ...state, loading: false, notes: [action.payload, ...state.notes] };

        case DELETE_NOTE_SUCCESS:
            return { ...state, loading: false, notes: state.notes.filter(note => note._id !== action.payload) };

        case FETCH_NOTES_FAIL:
        case ADD_NOTE_FAIL:
        case DELETE_NOTE_FAIL:
            return { ...state, loading: false, error: action.payload };
        case 'EDIT_NOTE':
            return {
                ...state,
                notes: state.notes.map(note =>
                    note._id === action.payload._id ? action.payload : note
                ),
            };
        default:
            return state;
    }
};
