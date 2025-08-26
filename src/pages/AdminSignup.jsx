import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendAdminOtp, verifyAdminOtp, signupAdmin, resendAdminOtp } from '../actions/adminAuthAction';
import '../style/adminSignup.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: '',
    otp: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    dispatch(sendAdminOtp(form.email))
      .then(() => setStep(2));
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    dispatch(verifyAdminOtp(form.email, form.otp))
      .then(() => setStep(3));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await dispatch(signupAdmin(form));
      navigate('/'); 
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="admin-signup-container">
      <h2 className="admin-signup-heading">Admin Signup</h2>

      {step === 1 && (
        <form onSubmit={handleSendOtp} className="admin-signup-form">
          <input type="email" name="email" placeholder="Enter Email" value={form.email} onChange={handleChange} className="admin-signup-input" required />
          <button type="submit" className="btn btn-primary">Send OTP</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="admin-signup-form">
          <input type="text" name="otp" placeholder="Enter OTP" value={form.otp} onChange={handleChange} className="admin-signup-input" required />
          <button type="submit" className="btn btn-primary mb-10">Verify OTP</button>
          <button
            type="button"
            className="btn btn-accent"
            onClick={() => dispatch(resendAdminOtp(form.email))}
          >
            Resend OTP
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSignup} className="admin-signup-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="admin-signup-input"
            required
          />

          {/* 🔒 Password field with toggle */}
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="admin-input"
              required
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword
                ?  <FaEye className='dark-icons' />
                : <FaEyeSlash className='dark-icons' />}
            </span>
          </div>
          {/* 🔁 Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="admin-signup-input"
            required
          />

          {/* ❗ Show error if passwords don’t match */}
          {form.password !== form.confirmPassword && (
            <p className="error-text">Passwords do not match</p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={form.password !== form.confirmPassword}
          >
            Complete Signup
          </button>
        </form>
      )}

      {/* 🔗 Link to login */}
      <p className="link-text">
        Already verified? <Link to="/">Go to Login</Link>
      </p>
    </div>
  );
};

export default AdminSignup;
