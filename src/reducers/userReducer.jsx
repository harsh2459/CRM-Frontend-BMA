// src/redux/reducers/userReducer.js

import { ADD_USER_REQUEST, ADD_USER_SUCCESS, ADD_USER_FAIL } from '../actionTypes/userAddTypes'
import {
  GET_USERS_REQUEST, GET_USERS_SUCCESS, GET_USERS_FAIL, GET_ADMIN_SUCCESS, GET_ADMIN_FAIL, GET_ADMIN_REQUEST, UPDATE_EMPLOYEE_REQUEST, UPDATE_EMPLOYEE_SUCCESS, UPDATE_EMPLOYEE_FAIL,
  GET_SINGLE_USERS_SUCCESS
} from '../actionTypes/getUserTypes' 

const initialState = {
  userDetails: null,
  users: [],
  admin: [],
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ADD_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,  // The response data after successful user addition
      };
    case ADD_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,  // Error message if request fails
      };
    case GET_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,  // Error message if request fails
      };
    case GET_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload  // Error message if request fails
      };
    case GET_SINGLE_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        userDetails: action.payload  
      };
    case GET_USERS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,  // Error message if request fails
      };
    case UPDATE_EMPLOYEE_REQUEST:
      return { ...state, loading: true };
    case UPDATE_EMPLOYEE_SUCCESS:
      return { ...state, loading: false, employee: action.payload };
    case UPDATE_EMPLOYEE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case GET_ADMIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,  // Error message if request fails
      };
    case GET_ADMIN_SUCCESS:
      return {
        ...state,
        loading: false,
        admin: action.payload  // Error message if request fails
      };
    case GET_ADMIN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,  // Error message if request fails
      };
    default:
      return state;
  }
};
export default userReducer;
