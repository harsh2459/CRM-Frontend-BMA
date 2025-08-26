// src/context/SoketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { socketConnected } from '../actions/chatActions';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    // Add token to connection for authentication
    const s = io('https://crm-backend-bma.onrender.com', {
      withCredentials: true,
      transports: ['websocket'],
       path: '/socket.io'
    });

    s.on('connect', () => {
      console.log('Socket connected:', s.id);
    });

    s.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    setSocket(s);
    dispatch(socketConnected(s));
    return () => { dispatch(socketConnected(null)); s.close(); };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);