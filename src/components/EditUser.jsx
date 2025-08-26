import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleUser, updateEmployee } from "../actions/getUsersActions"; // Make sure getSingleUser is defined
import { useParams, useNavigate } from "react-router-dom";
import "../style/components/AddUser.css";

const EditUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { empid } = useParams();  // Get employee ID from URL

  // Fetch userDetails from the Redux store
  const { userDetails, loading } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    salary: '',
    company: '',
    address: '',
  });

  // Fetch user data based on empid when the component mounts
  useEffect(() => {
    dispatch(getSingleUser(empid));
  }, [dispatch, empid]);
  console.log(userDetails);
  
  // If userDetails is available, pre-fill the form fields
  useEffect(() => {
    if (userDetails) {
      setForm({
        employeeCode: userDetails.employeeCode,
        name: userDetails.name,
        email: userDetails.contact.email,
        phone: userDetails.contact.phone_no,
        role: userDetails.role,
        salary: userDetails.salary,
        company: userDetails.company,
        address: userDetails.contact.address,
      });
    }
  }, [userDetails]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateEmployee(empid, form));  // Update the user data
    navigate(`/add-user`);  // Redirect to the user details page after update
  };

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && navigate("/add-user")}>
      <div className="modal-card" role="dialog" aria-modal="true">
        <h3 className="modal-title">Edit User</h3>

        <form className="modal-form" onSubmit={handleSubmit}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required />
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
          <input
            name="phone"
            value={form.phone}
            onChange={(e) => {
              // allow digits only in UI (still controlled)
              const v = e.target.value.replace(/\D/g, '').slice(0, 10);
              setForm(p => ({ ...p, phone: v }));
            }}
            placeholder="Phone Number"
            inputMode="numeric"
            maxLength={10}
            required
          />
          <input name="address" value={form.address} onChange={handleChange} placeholder="Address" required />
          <select name="company" value={form.company} onChange={handleChange} className="styled-select" required>
            <option value="OpenAI">OpenAI</option>
            <option value="bookmyassignments">bookmyassignments</option>
            <option value="company3">company3</option>
            <option value="company4">company4</option>
          </select>
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required />
          <input
            type="number"
            name="salary"
            value={form.salary}
            onChange={(e) => setForm(p => ({ ...p, salary: e.target.value }))}
            placeholder="Salary"
            min="0"
            step="1"
            required
          />
          <select name="role" value={form.role} onChange={handleChange} className="styled-select" required>
            <option value="employee">employee</option>
            <option value="manager">manager</option>
          </select>

          <div className="modal-actions">
            <button type="submit" className="btn btn-accent" disabled={loading}>
              {loading ? "Saving..." : "Update User"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate("/add-user")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
