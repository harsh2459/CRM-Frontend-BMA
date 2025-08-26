// hooks/useFetchUsers.js
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const useFetchUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance.get('/employee/get_users') 
            .then(res => setUsers(res.data.users))
            .finally(() => setLoading(false));
    }, []);

    return { users, loading };
};

export default useFetchUsers;
