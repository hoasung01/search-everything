'use client';

import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import styles from './page.module.css';
import { User } from './types';
import { fetchUsers } from './fetchUsers';

const UsersPage = () => {
    const [currentPage, setCurrentPage] = useState(0); // `react-paginate` uses zero-based indexing
    const [query, setQuery] = useState(''); // State for search query
    const perPage = 10;

    const [users, setUsers] = useState<User[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { users, totalCount } = await fetchUsers(query, currentPage + 1, perPage); // Adjust page for backend
                setUsers(users);
                setTotalCount(Math.min(totalCount, 1000)); // Limit total count to 1000 due to GitHub API limitation
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchData();
    }, [currentPage, query]);

    const handlePageClick = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected);
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent form from refreshing the page
        const formData = new FormData(event.currentTarget);
        const searchQuery = formData.get('query') as string;
        setQuery(searchQuery);
        setCurrentPage(0); // Reset to first page when performing a new search
    };

    const pageCount = Math.ceil(totalCount / perPage);

    return (
        <div className={styles.container}>
            <form className={styles.searchContainer} onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    name="query"
                    placeholder="Search Users..."
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchButton}>
                    Search
                </button>
            </form>

            <div className={styles.usersContainer}>
                {users.map((user: User) => (
                    <div key={user.id} className={styles.userIcon}>
                        <img
                            src={user.avatar_url}
                            alt={user.login}
                            className={styles.userAvatar}
                        />
                        <span className={styles.userName}>{user.login}</span>
                    </div>
                ))}
            </div>

            {/* Pagination using react-paginate */}
            {pageCount > 1 && (
                <ReactPaginate
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    breakLabel={'...'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={styles.pagination}
                    pageClassName={styles.paginationButton}
                    activeClassName={styles.active}
                    previousClassName={styles.paginationButton}
                    nextClassName={styles.paginationButton}
                    disabledClassName={styles.disabled}
                />
            )}
        </div>
    );
};

export default UsersPage;