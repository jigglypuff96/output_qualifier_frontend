// Pagination.js
import React from "react";
import "./Pagination.css"; // Import the CSS for styling

function paginate(totalPages, currentPage, pageNeighbours = 1) {
  const range = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const totalBlocks = pageNeighbours * 2 + 3;
  if (totalPages <= totalBlocks) {
    return range(1, totalPages);
  }

  let pages = [];

  const leftBound = Math.max(2, currentPage - pageNeighbours);
  const rightBound = Math.min(totalPages - 1, currentPage + pageNeighbours);

  pages = range(leftBound, rightBound);

  const pagesWithDots = [1];
  if (leftBound > 2) {
    pagesWithDots.push("...");
  }
  pagesWithDots.push(...pages);
  if (rightBound < totalPages - 1) {
    pagesWithDots.push("...");
  }
  pagesWithDots.push(totalPages);

  return pagesWithDots;
}

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const paginationPages = paginate(totalPages, currentPage, 1); // 1 can be adjusted based on your design

  return (
    <div className="pagination">
      {paginationPages.map((page) => {
        if (page === "...") {
          return (
            <span key={page} className="pagination-ellipsis">
              {page}
            </span>
          );
        }
        return (
          <button
            key={page}
            className={`pagination-item ${
              currentPage === page ? "active" : ""
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
};

export default Pagination;
