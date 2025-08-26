import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaTasks,
  FaUserPlus,
  FaTrash,
  FaSignOutAlt,
} from "react-icons/fa";
import { IoSettingsSharp, IoChatboxEllipses } from "react-icons/io5";
import { logo } from "../assets/Assets";
import '../style/components/SideBar.css';


const SidebarItem = ({ to, icon: Icon, label, className }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `sidebar-link ${className || ""} ${isActive ? "active" : ""}`
      }
      aria-current={({ isActive }) => (isActive ? "page" : undefined)}
    >
      <Icon className="icons" aria-hidden />
      <span className="sidebar-text">{label}</span>
    </NavLink>
  </li>
);
const Sidebar = () => {
  return (
    <aside className="sidebar-wrapper">
      <div className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="Brand" style={{ width: 28, height: 28, borderRadius: 6 }} />
          <span className="sidebar-label">BookMy<br />Assignment</span>
        </div>
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <FaHome className="slider-icons" />
              <span className="sidebar-label">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/my-tasks" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <FaClipboardList />
              <span className="sidebar-label">MyTasks</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/all-tasks" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <FaClipboardList />
              <span className="sidebar-label">All Task</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/notes" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <FaClipboardList />
              <span className="sidebar-label">Notes</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/delegatedtasks" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <FaTasks />
              <span className="sidebar-label">Delegated Tasks</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/templates" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <FaTasks />
              <span className="sidebar-label">Manage template</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/subscribed" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <FaTasks />
              <span className="sidebar-label">Subscribed Tasks</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/add-user" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <FaUserPlus />
              <span className="sidebar-label">Add User</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/chat" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <IoChatboxEllipses />
              <span className="sidebar-label">Chat</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <IoSettingsSharp />
              <span className="sidebar-label">Setting</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/logout" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <FaSignOutAlt />
              <span className="sidebar-label">Logout</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
