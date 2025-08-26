import {
  ADMIN_LOGIN_REQUEST,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGIN_FAIL,
  ADMIN_LOGOUT
} from '../actionTypes/adminLoginTypes';

const initialState = {
  loading: false,
  isAuthenticated: false,
  token: null,
  error: null,
};

const adminLoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADMIN_LOGIN_REQUEST:
      return { ...state, loading: true, error: null };

    case ADMIN_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: {
          userId: action.payload.userId,
          role: action.payload.role,
          name: action.payload.name,
          email: action.payload.email,
        },
        token: action.payload.token,
      };

    case ADMIN_LOGIN_FAIL:
      return { ...state, loading: false, isAuthenticated: false, error: action.payload };

    case ADMIN_LOGOUT:
      localStorage.removeItem('adminToken');
      return { ...state, adminInfo: null };

    default:
      return state;
  }
};

export default adminLoginReducer;
