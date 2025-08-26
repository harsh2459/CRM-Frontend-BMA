// chatActions.js
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
import axiosInstance from '../utils/axiosInstance';

export const createOrGetChatRoom = (senderEmpId, receiverEmpId) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_CHAT_ROOM_REQUEST });
    const response = await axiosInstance.post('/chat/chat_room', { senderEmpId, receiverEmpId });
    dispatch({
      type: CREATE_CHAT_ROOM_SUCCESS,
      payload: {
        chatRoomId: response.data.chatRoomId,
        senderEmpId,
        receiverEmpId
      }
    });
  } catch (error) {
    dispatch({
      type: CREATE_CHAT_ROOM_FAIL,
      payload: error.response?.data?.error || error.message,
    });
  }
};

// Add these new actions
export const socketConnected = (socket) => ({
  type: 'SOCKET_CONNECTED',
  payload: socket
});

export const receiveMessage = (message) => ({
  type: 'RECEIVE_MESSAGE',
  payload: message
});

export const deleteMessageSocket = (messageId) => ({
  type: 'DELETE_MESSAGE_SOCKET',
  payload: messageId
});

// Action to send a message in a chat room
export const sendMessage = (chatRoomId, senderEmpId, receiverEmpId, content, file) => async (dispatch) => {
  const tempId = `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  dispatch({
    type: SEND_MESSAGE_OPTIMISTIC,
    payload: {
      _id: tempId,
      chatRoomId,
      senderEmpId,
      receiverEmpId,
      content,
      // fileUrl: file ? URL.createObjectURL(file) : null, // Use blob URL for preview
      timestamp: new Date().toISOString(),
      isOptimistic: true
    }
  });
  try {
    const response = await axiosInstance.post(`/chat/send/${chatRoomId}`, {
      senderEmpId,
      receiverEmpId,
      content,
    });

    const saved = response?.data?.data || response?.data?.message || response?.data;

    // Reconcile the optimistic message immediately
    dispatch({
      type: 'SEND_MESSAGE_SUCCESS',
      payload: { saved, tempId },
    });

    // Optional: also notify others via socket
    // socket?.emit('sendMessage', saved);
  } catch (error) {
    dispatch({
      type: SEND_MESSAGE_FAIL,
      payload: error.response?.data?.error || error.message,
    });
    dispatch({
      type: DELETE_MESSAGE_SOCKET,
      payload: tempId
    });
    throw error;
  }
};


export const getMessages = (chatRoomId) => async (dispatch) => {
  try {
    dispatch({ type: GET_MESSAGES_REQUEST });

    const response = await axiosInstance.get(`/chat/messages/${chatRoomId}`);

    dispatch({
      type: GET_MESSAGES_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: GET_MESSAGES_FAIL,
      payload: error.response?.data?.error || error.message,
    });
  }
};
