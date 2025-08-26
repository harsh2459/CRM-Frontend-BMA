import axios from '../axiosConfig';
import { toast } from 'react-toastify';
import {
  ADMIN_LOGIN_REQUEST,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGIN_FAIL,
} from '../actionTypes/adminLoginTypes';
import axiosInstance from '../utils/axiosInstance';

// LOGIN
export const loginByRole = (email, password, role) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_LOGIN_REQUEST });

    const ENDPOINT = {
      admin: '/admin/login',
      employee: '/sign_in',      // change to '/employee/login' if you have that
    };
    const url = ENDPOINT[role] || ENDPOINT.employee;

    const { data } = await axiosInstance.post(url, { email, password });
    console.log(data);

    // Normalize payload from either endpoint
    const payload = {
      token: data.token,
      role: role || data.role || 'employee',
      userId: data.userId || data.adminId || data.employeeCode || data._id,
      name: data.name || data.admin?.name || data.user?.name || '',
      email: data.email || email,
    };


    // Persist session (unified + legacy)
    sessionStorage.setItem('token', payload.token);
    sessionStorage.setItem('role', payload.role);
    sessionStorage.setItem('userId', payload.userId);
    sessionStorage.setItem('name', payload.name);
    sessionStorage.setItem('email', payload.email);
    sessionStorage.setItem('adminId', payload.userId); // keep old code working

    dispatch({ type: ADMIN_LOGIN_SUCCESS, payload });

    toast.success('Login successful!');
    return payload;
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message;
    toast.error(errorMsg);

    dispatch({ type: ADMIN_LOGIN_FAIL, payload: errorMsg });
  }
};
