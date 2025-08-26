import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin, loginByRole } from '../actions/adminLoginAction';
import { useNavigate, Link } from 'react-router-dom';
import '../style/adminLogin.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.auth || {});

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin'); // 'admin' | 'employee'

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const session = await dispatch(loginByRole(email, password, role));
      if (session.role === 'admin') navigate('/dashboard');
      else navigate('/dashboard');
    } catch { }
  };

  return (
    <div className="admin-login-container">
      <h2 className="admin-login-heading">LOGIN</h2>
      <form onSubmit={onSubmit} className="admin-login-form" >
        <select value={role} onChange={(e) => setRole(e.target.value)} className="admin-input">
          <option value="admin">Admin</option>  
          <option value="employee">Employee</option>
        </select>
        <input
          type="name"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="admin-login-input"
          required
        />
        <div className="password-input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-input"
            required
          />
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword
              ? <FaEye className='dark-icons' />
              : <FaEyeSlash className='dark-icons' />
            }
          </span>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Signing in...' : 'Login'}</button>
      </form>
      <p className="link-text">
        Add Admin? <Link to="/signup">Go to SignUp </Link>
      </p>
    </div>
  );
};

export default AdminLogin;
