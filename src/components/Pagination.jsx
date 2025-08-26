import React from "react";
import PropTypes from "prop-types";
import '../style/components/Pagination.css'

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleClick = (page) => {
    if (page < 1 || page > totalPages) return; // Prevent going out of range
    onPageChange(page);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container">
      <button
        className="btn btn-ghost"
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Prev
      </button>
      {pageNumbers.map((page) => (
        <button
          key={page}
          className={`btn btn-ghost ${page === currentPage ? "active" : ""}`}
          onClick={() => handleClick(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="btn btn-accent"
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </button>
    </div>
  );
};

Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;