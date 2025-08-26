import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, getMessages, receiveMessage } from '../actions/chatActions'; // Import actions
import { useSocket } from '../context/SoketContext';
import '../style/components/chattextarea.css'
import { IoIosSend } from "react-icons/io";
import { FiPaperclip } from 'react-icons/fi';

const ChatTextArea = () => {
    const dispatch = useDispatch();
    const socket = useSocket();
    const { chatRoomId, senderEmpId, receiverEmpId, messages, loading } = useSelector((state) => state.chat);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const messagesEndRef = useRef(null);


    useEffect(() => {
        if (chatRoomId) {
            dispatch(getMessages(chatRoomId));
        }
    }, [dispatch, chatRoomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView();
    }, [messages]);

    // Socket event listeners
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message) => {
            // dispatch({ type: 'RECEIVE_MESSAGE', payload: message });
            if (message.chatRoomId === chatRoomId) {
                dispatch(receiveMessage(message));
            }
        };

        const handleDeleteMessage = ({ messageId }) => {
            dispatch({ type: 'DELETE_MESSAGE_SOCKET', payload: messageId });
        };

        socket.on('receiveMessage', handleReceiveMessage);
        socket.on('messageDeleted', handleDeleteMessage);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
            socket.off('messageDeleted', handleDeleteMessage);
        };
        
        }, [socket, dispatch, chatRoomId]);

        // Join room when chatRoomId changes
        useEffect(() => {
            if (socket && chatRoomId) {
                 socket.emit('chat:join', chatRoomId, (ok) => console.log('joined?', ok));
            }
        }, [socket, chatRoomId]);

        const handleSend = (e) => {
            e.preventDefault();
            if (!message.trim() && !file) return;

            dispatch(sendMessage(chatRoomId, senderEmpId, receiverEmpId, message, file, socket));
            setMessage('');
            setFile(null);
        };

        const handleFileChange = (e) => {
            setFile(e.target.files[0]);
        };

        return (
            <div className="chat-textarea">
                <div className="messages">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg._id} className={`message ${msg.senderEmpId === senderEmpId ? 'sent' : 'received'}`}>
                                <div>{msg.content}</div>
                                {msg.fileUrl && (
                                    <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                                        {msg.fileType?.startsWith('image/') ? (
                                            <img src={msg.fileUrl} alt="Attachment" className="file-preview" />
                                        ) : (
                                            'View File'
                                        )}
                                    </a>
                                )}
                                {msg.isOptimistic && <div className="optimistic-indicator">Sending...</div>}
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSend} className="message-input-form">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message"
                        className="message-textarea"
                    ></textarea>
                    <label className="file-input-label">
                        <FiPaperclip className="attachment-icon" />
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="file-input"
                            accept="image/*,application/pdf"
                        />
                        {file && <span className="file-name">{file.name}</span>}
                    </label>
                    <button type="submit" className="send-button" disabled={loading || (!message.trim() && !file)}>
                        <IoIosSend className="icon" />
                    </button>
                </form>
            </div>
        );
    }

export default ChatTextArea
