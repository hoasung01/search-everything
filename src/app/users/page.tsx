'use client';
import React, {useState, useCallback} from 'react';
import styles from './page.module.css';
import { User } from './types';
import IssueModal from '../../components/IssueModal';
import Pagination from '../../components/Pagination';
import UserList from './components/UserList';
import RepositoryList from './components/RepositoryList';
import { useUsers } from '../hooks/useUsers';
import { useRepositories } from '../hooks/useRepositories';

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
    const [query, setQuery] = useState('');
    const perPage = 10;
    const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [isLoadingIssues, setIsLoadingIssues] = useState(false);
    const [issuesPage, setIssuesPage] = useState(0);
    const [totalIssues, setTotalIssues] = useState(0);
    // New states for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const issuesPerPage = 5;
    const { users, totalCount, currentPage, setCurrentPage } = useUsers(query);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const { repositories, reposPage, setReposPage, reposPageCount } = useRepositories(selectedUser);
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
        setError(undefined);

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
            <UserList users={users} selectedUser={selectedUser} onUserClick={handleUserClick} />
            {selectedUser && (
                <RepositoryList
                    repositories={repositories}
                    selectedRepo={selectedRepo}
                    onRepoClick={handleRepoClick}
                    selectedUserLogin={selectedUser.login}
                    isLoadingIssues={isLoadingIssues}
                    issues={issues}
                    issuesPageCount={issuesPageCount}
                    issuesPage={issuesPage}
                    onIssuesPageChange={handleIssuesPageClick}
                    onReposPageChange={handleReposPageClick}
                    reposPageCount={reposPageCount}
                    reposPage={reposPage}
                    openIssuesModal={() => setIsModalOpen(true)}
                    renderIssueModal={
                        <IssueModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSubmit={handleCreateIssue}
                            repoName={selectedRepo || ''}
                            isSubmitting={isSubmitting}
                            error={error}
                        />
                    }
                    noIssuesMessage="No open issues found"
                    formatDate={formatDate}
                />
            )}
            {pageCount > 1 && (
                <Pagination
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    forcePage={currentPage}
                />
            )}
        </div>
    );
};
export default UsersPage;