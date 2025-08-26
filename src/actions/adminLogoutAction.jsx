import { ADMIN_LOGOUT } from '../actionTypes/adminLoginTypes';

export const logoutAdmin = () => (dispatch) => {
  // Remove token from sessionStorage
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('adminId');

  // Dispatch logout action
  dispatch({ type: ADMIN_LOGOUT });
};