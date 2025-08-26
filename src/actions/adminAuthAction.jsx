import axios from '../axiosConfig';
import { toast } from 'react-toastify';
import {
  ADMIN_SEND_OTP_REQUEST,
  ADMIN_SEND_OTP_SUCCESS,
  ADMIN_SEND_OTP_FAIL,
  ADMIN_VERIFY_OTP_REQUEST,
  ADMIN_VERIFY_OTP_SUCCESS,
  ADMIN_VERIFY_OTP_FAIL,
  ADMIN_SIGNUP_REQUEST,
  ADMIN_SIGNUP_SUCCESS,
  ADMIN_SIGNUP_FAIL,
} from "../actionTypes/actionSignup";
import axiosInstance from '../utils/axiosInstance';

// ✅ Send OTP
const sendAdminOtp = (email) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_SEND_OTP_REQUEST });

    const { data } = await axiosInstance.post('/admin/sendotp', { email });

    dispatch({ type: ADMIN_SEND_OTP_SUCCESS, payload: data.message });
    toast.success(data.message); // ✅ show success popup
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message;
    toast.error(errorMsg); // ❌ show error popup

    dispatch({
      type: ADMIN_SEND_OTP_FAIL,
      payload: errorMsg,
    });
  }
};

// ✅ Resend OTP
const resendAdminOtp = (email) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_SEND_OTP_REQUEST });

    const { data } = await axiosInstance.post('/admin/resend_otp', { email });

    dispatch({ type: ADMIN_SEND_OTP_SUCCESS, payload: data.message });
    toast.success(data.message); // ✅ show success popup
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message;
    toast.error(errorMsg); // ❌ show error popup

    dispatch({
      type: ADMIN_SEND_OTP_FAIL,
      payload: errorMsg,
    });
  }
};

// ✅ Verify OTP
const verifyAdminOtp = (email, otp) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_VERIFY_OTP_REQUEST });

    const { data } = await axiosInstance.post('/admin/verify_otp', { email, otp });

    dispatch({ type: ADMIN_VERIFY_OTP_SUCCESS, payload: data.message });
    toast.success(data.message); // ✅ show success popup
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message;
    toast.error(errorMsg); // ❌ show error popup

    dispatch({
      type: ADMIN_VERIFY_OTP_FAIL,
      payload: errorMsg,
    });
  }
};

// ✅ Final Signup
const signupAdmin = (form) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_SIGNUP_REQUEST });

    const { data } = await axiosInstance.post('/admin/signup', {
      name: form.name,
      email: form.email,
      password: form.password
    });

    dispatch({ type: ADMIN_SIGNUP_SUCCESS, payload: data.message });
    toast.success(data.message); // ✅ show success popup
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message;
    toast.error(errorMsg); // ❌ show error popup

    dispatch({
      type: ADMIN_SIGNUP_FAIL,
      payload: errorMsg,
    });
  }
};

export { sendAdminOtp, verifyAdminOtp, signupAdmin, resendAdminOtp };