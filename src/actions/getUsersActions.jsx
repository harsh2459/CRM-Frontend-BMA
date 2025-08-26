import axiosInstance from '../utils/axiosInstance';
import { GET_USERS_REQUEST, GET_USERS_SUCCESS, GET_USERS_FAIL, GET_ADMIN_REQUEST, GET_ADMIN_SUCCESS, GET_ADMIN_FAIL, UPDATE_EMPLOYEE_REQUEST, UPDATE_EMPLOYEE_SUCCESS, UPDATE_EMPLOYEE_FAIL, GET_SINGLE_USERS_SUCCESS } from '../actionTypes/getUserTypes';
import { toast } from "react-toastify";

export const getUsers = () => async (dispatch) => {
  try {
    dispatch({ type: GET_USERS_REQUEST });
    const { data } = await axiosInstance.get('/employee/get_users');
    dispatch({ type: GET_USERS_SUCCESS, payload: data });
  } catch (e) {
    dispatch({ type: GET_USERS_FAIL, payload: e.response?.data?.error || e.message });
  }
};

export const getSingleUser = (empid) => async (dispatch) => {
  try {
    dispatch({ type: GET_USERS_REQUEST });

    const { data } = await axiosInstance.get(`/employee/${empid}`);

    dispatch({ type: GET_SINGLE_USERS_SUCCESS, payload: data });  // Dispatch the response to store
  } catch (e) {
    dispatch({ type: GET_USERS_FAIL, payload: e.response?.data?.error || e.message });
  }
};

export const getadmin = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ADMIN_REQUEST });
    const { data } = await axiosInstance.get('/admin/get-all-admin');
    dispatch({ type: GET_ADMIN_SUCCESS, payload: data });
  } catch (e) {
    dispatch({ type: GET_ADMIN_FAIL, payload: e.response?.data?.error || e.message });
  }
};

export const deleteEmployee = (empId) => async () => {
  if (!empId) {
    toast.error("Missing empId");
    return;
  }
  try {
    // axiosInstance likely has baseURL '/api'
    await axiosInstance.delete(`/employee/${empId}`);
    toast.success("Employee deleted successfully");
  } catch (e) {
    toast.error(e?.response?.data?.error || "Delete failed");
    throw e;
  }
};

export const updateEmployee = (empId, updates) => async (dispatch) => {
  try {
    console.log("updateemplyoe",empId, updates);

    dispatch({ type: UPDATE_EMPLOYEE_REQUEST });
    const { data } = await axiosInstance.patch(`/employee/${empId}`, updates);
    dispatch({ type: UPDATE_EMPLOYEE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: UPDATE_EMPLOYEE_FAIL,
      payload: error.response?.data?.error || error.message,
    });
  }
};