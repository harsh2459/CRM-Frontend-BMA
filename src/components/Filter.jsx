// src/components/Filter.js
import React from "react";
import PropTypes from "prop-types";
import '../style/components/Filter.css'

const Filter = ({ onFilterChange }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ query: e.target.value });
  };

  const handleStatusChange = (e) => {
    onFilterChange({ status: e.target.value });
  };

  const handlePriorityChange = (e) => {
    onFilterChange({ priority: e.target.value });
  };

 

  return (
    <div className="filter-container">
      {/* Search input */}
      <input
        type="text"
        placeholder="Search tasks..."
        onChange={handleSearchChange}
        className="input search"
      />

      {/* Status filter */}
      <select onChange={handleStatusChange} className="styled-select">
        <option value="">All Status</option>
        <option value="Completed">Completed</option>
        <option value="In Progress">In Progress</option>
        <option value="Blocked">Blocked</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      {/* Priority filter */}
      <select onChange={handlePriorityChange} className="styled-select">
        <option value="">All Priority</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    </div>
  );
};

Filter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};



export default Filter;
