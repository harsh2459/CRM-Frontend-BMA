import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, allowedRoles, ...rest }) => {
    const token = sessionStorage.getItem('token');

    // If no token is found, redirect to login page
    if (!token) {
        return <Navigate to="/" />;
    }

    // If everything is valid, render the element
    return element;
};
export default PrivateRoute;
