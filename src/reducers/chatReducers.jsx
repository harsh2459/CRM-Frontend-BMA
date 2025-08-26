// chatReducers.js
import {
  CREATE_CHAT_ROOM_REQUEST,
  CREATE_CHAT_ROOM_SUCCESS,
  CREATE_CHAT_ROOM_FAIL,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAIL,
  GET_MESSAGES_REQUEST,
  GET_MESSAGES_SUCCESS,
  GET_MESSAGES_FAIL,
  SEND_MESSAGE_OPTIMISTIC,
  RECEIVE_MESSAGE,
  DELETE_MESSAGE_SOCKET,
  SOCKET_CONNECTED
} from '../actionTypes/ChatActionTypes';

const initialState = {
  chatRoomId: null,
  senderEmpId: null,
  receiverEmpId: null,
  messages: [],
  loading: false,
  socket: null,
  error: null,
};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CHAT_ROOM_REQUEST:
    case SEND_MESSAGE_REQUEST:
    case GET_MESSAGES_REQUEST:
      return { ...state, loading: true, error: null };
    case SEND_MESSAGE_OPTIMISTIC:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        loading: true
      };
    case CREATE_CHAT_ROOM_SUCCESS:
      return {
        ...state, loading: false,
        chatRoomId: action.payload.chatRoomId,
        senderEmpId: action.payload.senderEmpId,
        receiverEmpId: action.payload.receiverEmpId,
      };
    case CREATE_CHAT_ROOM_FAIL:
    case SEND_MESSAGE_FAIL:
    case GET_MESSAGES_FAIL:
      return { ...state, loading: false, error: action.payload };
    case SOCKET_CONNECTED:
      return { ...state, socket: action.payload };
    case RECEIVE_MESSAGE: {
      const m = action.payload;
      const withoutTemp = m.tempId
        ? state.messages.filter(x => x._id !== m.tempId)
        : state.messages;
      const exists = withoutTemp.some(x => x._id === m._id);
      return {
        ...state,
        loading: false,
        messages: exists
          ? withoutTemp.map(x => (x._id === m._id ? { ...m, isOptimistic: false } : x))
          : [...withoutTemp, { ...m, isOptimistic: false }],
      };
    }

    case DELETE_MESSAGE_SOCKET:
      return {
        ...state,
        messages: state.messages.filter(msg => msg._id !== action.payload),
        loading: false
      };
    case SEND_MESSAGE_SUCCESS: {
      const { saved, tempId } = action.payload;
      const withoutTemp = state.messages.filter(m => m._id !== tempId);

      // avoid dup if server echoes the same id later
      const already = withoutTemp.some(m => m._id === saved._id);

      return {
        ...state,
        loading: false,
        messages: already
          ? withoutTemp.map(m => (m._id === saved._id ? { ...saved, isOptimistic: false } : m))
          : [...withoutTemp, { ...saved, isOptimistic: false }],
      };
    }

    case GET_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: [...action.payload].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      };
    default:
      return state;
  }
};
