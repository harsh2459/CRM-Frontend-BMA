// src/reducers/taskReducer.js
import {
  TASK_REQUEST,
  TASK_SUCCESS,
  TASK_UPDATE_STATUS_SUCCESS,
  TASK_FAIL,
  TASK_LIST_SUCCESS,
  TASK_DELETE_REQUEST,
  TASK_DELETE_SUCCESS,
  TASK_DELETE_FAIL
} from "../actions/taskActions";

const initial = {
  tasks: [],
  loading: false,
  items: [],
  error: null
};

export default function taskReducer(state = initial, action) {
  switch (action.type) {
    case TASK_REQUEST: return { ...state, loading: true, error: null };
    case TASK_SUCCESS: return { ...state, loading: false };
    case TASK_LIST_SUCCESS:
      console.log("fected data", action.payload);
      return { ...state, loading: false, items: action.payload };
    case TASK_FAIL: return { ...state, loading: false, error: action.payload };
    case TASK_UPDATE_STATUS_SUCCESS: {
      const u = action.payload; // updated task
      return {
        ...state,
        loading: false,
        items: state.items.map(t =>
          t._id === u._id
            ? {
              ...t,
              // keep whatever your API returned authoritative
              ...u,
              // if your API only returns top-level status, keep assignees
              assignees: u.assignees ?? t.assignees,
            }
            : t
        ),
      }
    }
    case TASK_DELETE_REQUEST:
      return { ...state, loading: true, error: null };
    case TASK_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        items: state.items.filter(t => t._id !== action.payload),
        total: Math.max(0, state.total - 1),
      };
    case TASK_DELETE_FAIL:
      return { ...state, loading: false, error: action.payload };
    default: return state;
  }
}
