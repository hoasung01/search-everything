'use client';

import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import styles from './page.module.css';
import { User } from './types';
import { fetchUsers } from './fetchUsers';
import axios from 'axios';

const UsersPage = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [query, setQuery] = useState('');
    const perPage = 10;

    const [users, setUsers] = useState<User[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [repositories, setRepositories] = useState<any[]>([]);
    const [reposPage, setReposPage] = useState(0);
    const [totalRepos, setTotalRepos] = useState(0);
    const reposPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { users, totalCount } = await fetchUsers(query, currentPage + 1, perPage);
                setUsers(users);
                setTotalCount(Math.min(totalCount, 1000));
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchData();
    }, [currentPage, query]);

    useEffect(() => {
        const fetchRepositories = async () => {
            if (selectedUser) {
                try {
                    // First, fetch user data to get total repository count
                    const userResponse = await axios.get(`https://api.github.com/users/${selectedUser.login}`);
                    setTotalRepos(userResponse.data.public_repos);

                    // Then fetch repositories for the current page
                    const reposResponse = await axios.get(`https://api.github.com/users/${selectedUser.login}/repos`, {
                        params: {
                            page: reposPage + 1,
                            per_page: reposPerPage,
                        },
                    });
                    setRepositories(reposResponse.data);
                } catch (error) {
                    console.error('Error fetching repositories:', error);
                }
            }
        };
        fetchRepositories();
    }, [selectedUser, reposPage]);

    const handlePageClick = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected);
    };

    const handleReposPageClick = (selectedItem: { selected: number }) => {
        setReposPage(selectedItem.selected);
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const searchQuery = formData.get('query') as string;
        setQuery(searchQuery);
        setCurrentPage(0);
    };

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
        setReposPage(0);
    };

    const pageCount = Math.ceil(totalCount / perPage);
    const reposPageCount = Math.ceil(totalRepos / reposPerPage);

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
                    <div
                        key={user.id}
                        className={`${styles.userIcon} ${selectedUser?.id === user.id ? styles.selected : ''}`}
                        onClick={() => handleUserClick(user)}
                    >
                        <img
                            src={user.avatar_url}
                            alt={user.login}
                            className={styles.userAvatar}
                        />
                        <span className={styles.userName}>{user.login}</span>
                    </div>
                ))}
            </div>

            {selectedUser && (
                <div className={styles.repositoriesContainer}>
                    <h3>Repositories for {selectedUser.login}</h3>
                    {repositories.length > 0 ? (
                        <>
                            <ul className={styles.repositoryList}>
                                {repositories.map((repo: any) => (
                                    <li key={repo.id} className={styles.repositoryItem}>
                                        <a
                                            href={repo.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.repositoryLink}
                                        >
                                            {repo.name}
                                        </a>
                                        {repo.description && (
                                            <p className={styles.repositoryDescription}>
                                                {repo.description}
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            {reposPageCount > 1 && (
                                <div className={styles.paginationWrapper}>
                                    <ReactPaginate
                                        previousLabel={'←'}
                                        nextLabel={'→'}
                                        breakLabel={'...'}
                                        pageCount={reposPageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={3}
                                        onPageChange={handleReposPageClick}
                                        forcePage={reposPage}
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
                            )}
                        </>
                    ) : (
                        <p>No repositories found</p>
                    )}
                </div>
            )}

            {pageCount > 1 && (
                <div className={styles.paginationWrapper}>
                    <ReactPaginate
                        previousLabel={'←'}
                        nextLabel={'→'}
                        breakLabel={'...'}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        forcePage={currentPage}
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
            )}
        </div>
    );
};

export default UsersPage;