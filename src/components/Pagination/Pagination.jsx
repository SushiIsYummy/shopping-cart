import { useState } from 'react';
import styles from './Pagination.module.css';

function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  customStyles,
}) {
  const paginationButtons = setPaginationButtons(currentPage, totalPages);

  const handlePaginationButtonClick = (e) => {
    if (!isNaN(Number(e.target.value))) {
      onPageChange(Number(e.target.value));
      window.scrollTo({ top: 0 });
    }
  }
  let i = 0;
  return (
    <div className={`${styles.paginationButtons} ${customStyles?.paginationButtons ?? ''}`}>
      {paginationButtons.map((pageNumber) => {
        let pageNumberKey;
        let buttonClass;
        if (pageNumber === '...') {
          pageNumberKey = `...-${i++}`;
          buttonClass = styles.ellipsis;
        } else {
          pageNumberKey = pageNumber;
          if (currentPage === pageNumber) {
            buttonClass = styles.currentPageButton;
          } else {
            buttonClass = styles.pageButton;
          }
        }
        return (
          <button 
            className={buttonClass} 
            key={pageNumberKey} 
            value={pageNumber} 
            onClick={handlePaginationButtonClick}
          >
            {pageNumber}
          </button>
        )
      }
      )}
    </div>
  )
}

function setPaginationButtons(currentPage, totalPages) {
  const paginationButtons = [];
  const buttonsEachSide = 2;
  
  if (currentPage - buttonsEachSide - 1 <= 1) {
    for (let i = 0; i < currentPage; i++) {
      paginationButtons.push(i+1);
    }
  } else {
    paginationButtons.push(1);
    paginationButtons.push('...')
    for (let i = currentPage - buttonsEachSide - 1; i < currentPage; i++) {
      paginationButtons.push(i+1);
    }
  }

  if (currentPage + buttonsEachSide + 1 >= totalPages) {
    for (let i = currentPage; i < totalPages; i++) {
      paginationButtons.push(i+1);
    }
  } else {
    for (let i = currentPage; i < currentPage + buttonsEachSide; i++) {
      paginationButtons.push(i+1);
    }
    paginationButtons.push('...');
    paginationButtons.push(totalPages);
  }

  return paginationButtons;
}

export default Pagination;
