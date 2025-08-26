import axiosInstance from '../utils/axiosInstance';
import axios from '../utils/axiosInstance';
import { toast } from 'react-toastify';

export const FETCH_NOTES_REQUEST = 'FETCH_NOTES_REQUEST';
export const FETCH_NOTES_SUCCESS = 'FETCH_NOTES_SUCCESS';
export const FETCH_NOTES_FAIL = 'FETCH_NOTES_FAIL';
export const ADD_NOTE_REQUEST = 'ADD_NOTE_REQUEST';
export const ADD_NOTE_SUCCESS = 'ADD_NOTE_SUCCESS';
export const ADD_NOTE_FAIL = 'ADD_NOTE_FAIL';
export const DELETE_NOTE_REQUEST = 'DELETE_NOTE_REQUEST';
export const DELETE_NOTE_SUCCESS = 'DELETE_NOTE_SUCCESS';
export const DELETE_NOTE_FAIL = 'DELETE_NOTE_FAIL';

export const fetchNotes = (page = 1, limit = 10) => async (dispatch) => {
  try {
    const createdBy = sessionStorage.getItem('adminId');  // Get createdBy (adminId) from sessionStorage
    dispatch({ type: FETCH_NOTES_REQUEST });

    // Pass createdBy in the query parameters
    const { data } = await axiosInstance.get(`/notes/get-notes?page=${page}&limit=${limit}&createdBy=${createdBy}`);
    
    dispatch({ type: FETCH_NOTES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_NOTES_FAIL, payload: error.response?.data?.error || error.message });
  }
};

export const addNote = (noteData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_NOTE_REQUEST });
    const { data } = await axiosInstance.post('/notes/add-note', noteData);
    dispatch({ type: ADD_NOTE_SUCCESS, payload: data.note });
    toast.success('Note added successfully');
  } catch (error) {
    dispatch({ type: ADD_NOTE_FAIL, payload: error.response?.data?.error || error.message });
    toast.error('Error adding note');
  }
};

export const deleteNote = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_NOTE_REQUEST });
    await axiosInstance.delete(`/notes/delete-note/${id}`);
    dispatch({ type: DELETE_NOTE_SUCCESS, payload: id });
    toast.success('Note deleted successfully');
  } catch (error) {
    dispatch({ type: DELETE_NOTE_FAIL, payload: error.response?.data?.error || error.message });
    toast.error('Error deleting note');
  }
};

export const updateNote = (id, data) => async (dispatch) => {
  try {
    const response = await axios.put(`/notes/edit-note/${id}`, data);
    dispatch({
      type: 'EDIT_NOTE',
      payload: response.data.note,
    });
    toast.success('Note updated successfully!');
  } catch (error) {
    toast.error('Failed to update note');
  }
};
