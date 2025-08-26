// src/redux/actions/userActions.js
import axiosInstance from '../utils/axiosInstance';
import { ADD_USER_REQUEST, ADD_USER_SUCCESS, ADD_USER_FAIL } from '../actionTypes/userAddTypes';
import { toast } from 'react-toastify';

// Add user action
export const addUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_USER_REQUEST });
    const response = await axiosInstance.post('/add_user', userData);
    toast.success('User added');
    dispatch({ type: ADD_USER_SUCCESS, payload: response.data });
    return { ok: true, payload: response.data };
  } catch (error) {
    const apiMsg = error?.response?.data?.error || error.message || 'Something went wrong';
    toast.error(apiMsg);
    dispatch({ type: ADD_USER_FAIL, payload: apiMsg });
    return { ok: false, error: apiMsg };
  }
};
