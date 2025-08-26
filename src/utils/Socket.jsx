import { io } from 'socket.io-client';

// URL for your socket server
const SOCKET_SERVER_URL = 'http://localhost:5000'; // Update this URL
const socket = io(SOCKET_SERVER_URL);

export default socket;