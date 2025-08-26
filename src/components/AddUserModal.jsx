import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../actions/AddUserActions";
import "../style/components/AddUser.css";

const AddUserModal = ({ onClose = () => { }, afterCreate = () => { } }) => {
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    phone_no: "",
    address: "", 
    company: "bookmyassignments",
    password: "",
    role: "employee",
    salary: ""
  });

  const overlayRef = useRef(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.user || {});

  // close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // close on outside click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phone10 = (userData.phone_no || '').replace(/\D/g, '');
    if (phone10.length !== 10) {
      alert('Phone must be 10 digits');
      return;
    }

    // Coerce salary -> Number (or block if invalid)
    const salaryNum = userData.salary === '' ? null : Number(userData.salary);
    if (salaryNum === null || Number.isNaN(salaryNum) || salaryNum < 0) {
      alert('Enter a valid salary');
      return;
    }

    const payload = {
      ...userData,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      address: userData.address.trim(),
      phone_no: phone10,         // send 10 digits; backend adds +91
      salary: salaryNum
    };

    const res = await dispatch(addUser(payload));

    // Close only if success
    if (res?.type?.endsWith('_SUCCESS')) {
      afterCreate?.();
    }
  };

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onMouseDown={handleOverlayClick}
    >
      <div className="modal-card" role="dialog" aria-modal="true">
        <h3 className="modal-title">Add User</h3>

        <form className="modal-form" onSubmit={handleSubmit}>
          <input name="name" value={userData.name} onChange={handleChange} placeholder="Full Name" required />
          <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" required />
          <input name="phone_no" value={userData.phone_no}
            onChange={(e) => {
              // allow digits only in UI (still controlled)
              const v = e.target.value.replace(/\D/g, '').slice(0, 10);
              setUserData(p => ({ ...p, phone_no: v }));
            }}
            placeholder="Phone Number"
            inputMode="numeric"
            maxLength={10}
            required
          />
          <input name="address" value={userData.address} onChange={handleChange} placeholder="Address" required />
          <select name="company" value={userData.company} onChange={handleChange} className="styled-select" required>
            <option value="OpenAI">OpenAI</option>
            <option value="bookmyassignments">bookmyassignments</option>
            <option value="company3">company3</option>
            <option value="company4">company4</option>
          </select>
          <input type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Password" required />
          <input type="number" name="salary" value={userData.salary}
            onChange={(e) => setUserData(p => ({ ...p, salary: e.target.value }))}
            placeholder="Salary"
            min="0"
            step="1"
            required
          />
          <select name="role" value={userData.role} onChange={handleChange} className="styled-select" required>
            <option value="employee">employee</option>
            <option value="manager">manager</option>
          </select>

          <div className="modal-actions">
            <button type="submit" className="btn btn-accent" disabled={loading}>
              {loading ? "Saving..." : "Add User"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUserModal
