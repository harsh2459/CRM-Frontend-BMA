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

    const payload = {
      token: data.token,
      role: data.role || role,
      userId: data.adminId || data.user?.employeeCode && data.user?._id || data.user?._id,
      _id: data.adminId || data.employee,
      name: data.adminName || data.user?.name || '',
      email: data.user?.email || data.email || email,
    };

    console.log(payload.token);
    
    // Persist session (unified + legacy)
    sessionStorage.setItem('token', payload.token);
    sessionStorage.setItem('role', payload.role);
    sessionStorage.setItem('userId', payload.userId);
    sessionStorage.setItem('name', payload.name);
    sessionStorage.setItem('email', payload.email);
    sessionStorage.setItem('adminId', payload.userId);

    dispatch({ type: ADMIN_LOGIN_SUCCESS, payload });

    toast.success('Login successful!');
    return payload;
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message;
    toast.error(errorMsg);

    dispatch({ type: ADMIN_LOGIN_FAIL, payload: errorMsg });
  }
};
