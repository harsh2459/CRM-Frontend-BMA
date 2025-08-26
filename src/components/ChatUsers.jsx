import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getadmin, getUsers } from '../actions/getUsersActions';
import { useSocket } from '../context/SoketContext';
import { Link } from 'react-router-dom';
import '../style/components/chatuser.css'
import { createOrGetChatRoom, setChatRoomDetails } from '../actions/chatActions';

const ChatUsers = () => {
    const dispatch = useDispatch();
    const { users, admin } = useSelector((s) => s.user);
    const [searchQuery, setSearchQuery] = useState('');
    const socket = useSocket();
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        dispatch(getUsers());
        dispatch(getadmin());
        if (!socket) return;

        const handleOnlineUsers = (users) => {
            setOnlineUsers(users);
        };

        socket.on('onlineUsers', handleOnlineUsers);

        // Notify server when user comes online
        const currentUserId = sessionStorage.getItem('adminId');
        if (currentUserId) {
            socket.emit('userOnline', currentUserId);
        }

        return () => {
            socket.off('onlineUsers', handleOnlineUsers);
        };

    }, [dispatch, socket]);

    const handleUserSelect = (receiverEmpId) => {
        const senderEmpId = sessionStorage.getItem('adminId');
        dispatch(createOrGetChatRoom(senderEmpId, receiverEmpId));
    };

    const filteredUsers = [...admin, ...users].filter(user =>
        (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="chat-users">
            <input
                type="text"
                placeholder="Search users..."
                className="search-input"
                value={searchQuery}  // Binding the value of the input to the state
                onChange={handleSearchChange} // Updating search query state when typing
            />
             <div className="users-list">
                {filteredUsers?.map((a) => {
                    const userId = a.role === 'admin' ? a._id : a.employeeCode;
                    const isOnline = onlineUsers.includes(userId);
                    
                    return (
                        <div
                            key={a._id}
                            className={`user-card ${isOnline ? 'online' : ''}`}
                            onClick={() => handleUserSelect(userId)}
                        >
                            <div className="avatar-container">
                                <div className="avatar">{a.name[0]}</div>
                                {isOnline && <div className="online-indicator"></div>}
                            </div>
                            <div className="user-info">
                                <p>{a.name}</p>
                                <p>{a.role}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ChatUsers
