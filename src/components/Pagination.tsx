import React from 'react';
import ReactPaginate from 'react-paginate';
import styles from './Pagination.module.css';

interface PaginationProps {
    pageCount: number;
    onPageChange: (selectedItem: { selected: number }) => void;
    forcePage?: number;
}

const Pagination: React.FC<PaginationProps> = ({ pageCount, onPageChange, forcePage = 0 }) => {
    return (
        <div className={styles.paginationWrapper}>
            <ReactPaginate
                previousLabel={'←'}
                nextLabel={'→'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={onPageChange}
                forcePage={forcePage}
                containerClassName={styles.paginationContainer}
                pageClassName={styles.paginationItem}
                pageLinkClassName={styles.paginationLink}
                previousClassName={styles.paginationItem}
                previousLinkClassName={styles.paginationLink}
                nextClassName={styles.paginationItem}
                nextLinkClassName={styles.paginationLink}
                breakClassName={styles.paginationItem}
                breakLinkClassName={styles.paginationLink}
                activeClassName={styles.paginationActive}
                disabledClassName={styles.paginationDisabled}
            />
        </div>
    );
};

export default Pagination;