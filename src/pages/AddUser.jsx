import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddUserModal from "../components/AddUserModal";
import { deleteEmployee, getUsers } from "../actions/getUsersActions";
import "../style/pages/AddUser.css";
import { Link } from "react-router-dom";

const UserDetailsModal = ({ user, onClose, handleEditUser }) => (
  <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div className="modal-card">
      <h3 className="modal-title">User Details</h3>
      <div className="details-grid">
        <div><b>EmployeeCode</b><span>{user.employeeCode}</span></div>
        <div><b>Name</b><span>{user.name}</span></div>
        <div><b>Email</b><span>{user.contact.email}</span></div>
        <div><b>Phone</b><span>{user.contact.phone_no}</span></div>
        <div><b>Role</b><span>{user.role}</span></div>
        <div><b>Salary</b><span>{user.salary}</span></div>
        <div><b>Company</b><span>{user.company || "-"}</span></div>
        <div><b>Address</b><span>{user.contact.address || "-"}</span></div>
      </div>
      <div className="modal-actions">
        <Link to={`/update-user/${user.employeeCode}`}>
          <button className="btn btn-primary">Edit</button>
        </Link>
        <Link to={`/showusertask/${user.employeeCode}`}>
          <button className="btn btn-accent">ShowTask</button>
        </Link>
        <button className="btn btn-ghost" onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
);

const ConfirmDeleteModal = ({ user, loading, onCancel, onConfirm }) => (
  <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
    <div className="modal-card">
      <h3 className="modal-title">Delete User</h3>
      <p style={{ textAlign: "center", marginTop: -6 }}>
        Are you sure you want to delete <b>{user.name}</b>?
      </p>
      <div className="modal-actions">
        <button className="btn btn-primary" onClick={onConfirm} disabled={loading}>
          {loading ? "Deleting..." : "Yes, Delete"}
        </button>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  </div>
);

const AddUser = () => {
  const [showModal, setShowModal] = useState(false);  // Control visibility of modal
  const [showUser, setShowUser] = useState(null);  // Store selected user for editing
  const [toDelete, setToDelete] = useState(null);  // For managing delete modal
  const [delLoading, setDelLoading] = useState(false);
  const [editing, setediting] = useState(false);
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const initials = (name = "") => name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

  const handleConfirmDelete = async () => {
    if (!toDelete?.employeeCode) return;
    setDelLoading(true);
    await dispatch(deleteEmployee(toDelete.employeeCode));  // Call delete action
    setDelLoading(false);
    setToDelete(null);
    dispatch(getUsers());  // Reload users list
  };

  const handleEditUser = () => {
    setShowUser(null);  // Reset user data for new user
    setShowModal(true);  // Open modal to add new user
  };

  const handleAddUser = () => {
    setShowUser(null);  // Reset user data for new user
    setShowModal(true);  // Open modal to add new user
  };

  return (
    <div className="containor">
      <div className="delegated-task-wrapper">
        <div className="delegated-header">
          <h2>Employee</h2>
          <button className="btn btn-primary" onClick={handleAddUser}>  {/* Open Add User Modal */}
            Add User
          </button>
        </div>

        {showModal && (
          <AddUserModal
            onClose={() => setShowModal(false)}
            afterCreate={() => {
              setShowModal(false);
              dispatch(getUsers());  // Reload users after add
            }}
            user={showUser}  // Pass user data for editing if exists
            isEditing={showUser ? true : false}  // Check if editing or adding
          />
        )}

        {showUser && (
          <UserDetailsModal user={showUser} onClose={() => setShowUser(null)} />
        )}

        {toDelete && (
          <ConfirmDeleteModal
            user={toDelete}
            loading={delLoading}
            onCancel={() => setToDelete(null)}
            onConfirm={handleConfirmDelete}
          />
        )}

        <div className="user-list compact">
          {loading ? (
            <div className="user-loading">Loading...</div>
          ) : (
            users.map((u) => (
              <div className="user-row compact" key={u._id}>
                <div className="avatar">{initials(u.name)}</div>
                <div className="col code">{u.role === "admin" ? u._id : u.employeeCode}</div>
                <div className="col name">{u.name}</div>
                <div className="col email">{u.contact.email}</div>
                <div className="col phone">{u.contact.phone_no}</div>
                <div className="actions">
                  <button className="btn btn-accent" onClick={() => setShowUser(u)}>Show</button>
                  <button className="btn btn-ghost" onClick={() => setToDelete(u)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AddUser;
