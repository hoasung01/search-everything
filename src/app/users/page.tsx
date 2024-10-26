'use client';
import React, {useState, useEffect, useCallback} from 'react';
import ReactPaginate from 'react-paginate';
import styles from './page.module.css';
import { User } from './types';
import { fetchUsers } from './fetchUsers';
import IssueModal from '../../components/IssueModal';
import axios from 'axios';
interface Issue {
    id: number;
    title: string;
    html_url: string;
    state: string;
    created_at: string;
    number: number;
}

// Create authenticated axios instance
const githubApi = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
        'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
    }
});

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
    const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [isLoadingIssues, setIsLoadingIssues] = useState(false);
    const [issuesPage, setIssuesPage] = useState(0);
    const [totalIssues, setTotalIssues] = useState(0);
    // New states for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newIssueTitle, setNewIssueTitle] = useState('');
    const [newIssueBody, setNewIssueBody] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const reposPerPage = 5;
    const issuesPerPage = 5;
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
                    const userResponse = await githubApi.get(`/users/${selectedUser.login}`);
                    setTotalRepos(userResponse.data.public_repos);
                    const reposResponse = await githubApi.get(`/users/${selectedUser.login}/repos`, {
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

    const fetchIssues = useCallback(async () => {
        if (selectedUser && selectedRepo) {
            setIsLoadingIssues(true);
            try {
                const response = await githubApi.get(
                    `/repos/${selectedUser.login}/${selectedRepo}/issues`,
                    {
                        params: {
                            state: 'open',
                            page: issuesPage + 1,
                            per_page: issuesPerPage,
                        }
                    }
                );
                const linkHeader = response.headers.link;
                const totalCount = linkHeader
                    ? parseInt(linkHeader.match(/page=(\d+)>; rel="last"/)?.[1] || '1')
                    : Math.ceil(response.data.length / issuesPerPage);

                setIssues(response.data);
                setTotalIssues(totalCount * issuesPerPage);
            } catch (error) {
                console.error('Error fetching issues:', error);
                setIssues([]);
            } finally {
                setIsLoadingIssues(false);
            }
        }
    }, [selectedUser, selectedRepo, issuesPage, issuesPerPage]);
    const handlePageClick = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected);
    };
    const handleReposPageClick = (selectedItem: { selected: number }) => {
        setReposPage(selectedItem.selected);
    };
    const handleIssuesPageClick = (selectedItem: { selected: number }) => {
        setIssuesPage(selectedItem.selected);
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
        setSelectedRepo(null);
        setIssues([]);
    };
    const handleRepoClick = (repoName: string) => {
        setSelectedRepo(selectedRepo === repoName ? null : repoName);
        setIssuesPage(0);
    };
    const handleCreateIssue = async (title: string, body: string) => {
        if (!selectedUser || !selectedRepo) return;
        setIsSubmitting(true);
        setError(null);

        try {
            await githubApi.post(
                `/repos/${selectedUser.login}/${selectedRepo}/issues`,
                { title, body }
            );
            setIsModalOpen(false);
            await fetchIssues(); // Refresh issues list
        } catch (error) {
            setError('Failed to create issue. Please try again.');
            console.error('Error creating issue:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };
    const pageCount = Math.ceil(totalCount / perPage);
    const reposPageCount = Math.ceil(totalRepos / reposPerPage);
    const issuesPageCount = Math.ceil(totalIssues / issuesPerPage);
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
                                    <li
                                        key={repo.id}
                                        className={`${styles.repositoryItem} ${selectedRepo === repo.name ? styles.selectedRepo : ''}`}
                                        onClick={() => handleRepoClick(repo.name)}
                                    >
                                        <div className={styles.repositoryHeader}>
                                            <a
                                                href={repo.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.repositoryLink}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {repo.name}
                                            </a>
                                            <span className={styles.repositoryStats}>
                                                ⭐ {repo.stargazers_count} • 🔄 {repo.forks_count} •
                                                📝 {repo.open_issues_count} issues
                                            </span>
                                        </div>
                                        {repo.description && (
                                            <p className={styles.repositoryDescription}>
                                                {repo.description}
                                            </p>
                                        )}
                                        {selectedRepo === repo.name && (
                                            <div className={styles.issuesContainer}>
                                                <h4 className={styles.openIssuesHeading}>Open Issues</h4>
                                                <button
                                                    className={styles.newIssueButton}
                                                    onClick={() => setIsModalOpen(true)}
                                                >
                                                    New Issue
                                                </button>
                                                <IssueModal
                                                    isOpen={isModalOpen}
                                                    onClose={() => setIsModalOpen(false)}
                                                    onSubmit={handleCreateIssue}
                                                    repoName={selectedRepo || ''}
                                                    isSubmitting={isSubmitting}
                                                    error={error}
                                                />
                                                {isLoadingIssues ? (
                                                    <p className={styles.loading}>Loading issues...</p>
                                                ) : issues.length > 0 ? (
                                                    <>
                                                        <ul className={styles.issuesList}>
                                                            {issues.map((issue) => (
                                                                <li key={issue.id} className={styles.issueItem}>
                                                                    <div className={styles.issueHeader}>
                                                                        <a
                                                                            href={issue.html_url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className={styles.issueLink}
                                                                        >
                                                                            #{issue.number} {issue.title}
                                                                        </a>
                                                                    </div>
                                                                    <div className={styles.issueFooter}>
                                                                        <span className={styles.issueDate}>
                                                                            Created: {formatDate(issue.created_at)}
                                                                        </span>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        {issuesPageCount > 1 && (
                                                            <div className={styles.paginationWrapper}>
                                                                <ReactPaginate
                                                                    previousLabel={'←'}
                                                                    nextLabel={'→'}
                                                                    breakLabel={'...'}
                                                                    pageCount={issuesPageCount}
                                                                    marginPagesDisplayed={2}
                                                                    pageRangeDisplayed={3}
                                                                    onPageChange={handleIssuesPageClick}
                                                                    forcePage={issuesPage}
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
                                                    <p className={styles.noIssues}>No open issues found</p>
                                                )}
                                            </div>
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