import { useState, useEffect } from 'react';
import { githubApi } from '../api/githubApi';
import { User, Repository } from '../users/types';

interface UseRepositoryProps {
    selectedUser: User | null;
    selectedRepo: string | null;
    repositories: Repository[];
    reposPage: number;
    totalRepos: number;
    reposPageCount: number;
    isLoading: boolean;
    error: Error | null;
    handleUserClick: (user: User) => void;
    handleRepoClick: (repoName: string) => void;
    setReposPage: (page: number) => void;
    handleReposPageChange: (selectedItem: { selected: number }) => void;
}

export const useRepositories = (reposPerPage: number = 5): UseRepositoryProps => {
    // User and repo selection state
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

    // Repositories state
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [totalRepos, setTotalRepos] = useState(0);
    const [reposPage, setReposPage] = useState(0);

    // Loading and error states
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Fetch repositories when user or page changes
    useEffect(() => {
        const fetchRepositories = async () => {
            if (!selectedUser) return;

            setIsLoading(true);
            setError(null);

            try {
                // Fetch user's total repo count
                const userResponse = await githubApi.get(`/users/${selectedUser.login}`);
                setTotalRepos(userResponse.data.public_repos);

                // Fetch paginated repositories
                const reposResponse = await githubApi.get(`/users/${selectedUser.login}/repos`, {
                    params: {
                        page: reposPage + 1,
                        per_page: reposPerPage,
                        sort: 'updated',
                        direction: 'desc'
                    }
                });
                setRepositories(reposResponse.data);
            } catch (error) {
                console.error('Error fetching repositories:', error);
                setError(error as Error);
                setRepositories([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRepositories();
    }, [selectedUser, reposPage, reposPerPage]);

    // Calculate total pages
    const reposPageCount = Math.ceil(totalRepos / reposPerPage);

    // Handler for user selection
    const handleUserClick = (user: User) => {
        setSelectedUser(user);
        setReposPage(0);
        setSelectedRepo(null);
    };

    // Handler for repository selection
    const handleRepoClick = (repoName: string) => {
        setSelectedRepo(selectedRepo === repoName ? null : repoName);
    };

    // Handler for pagination
    const handleReposPageChange = (selectedItem: { selected: number }) => {
        setReposPage(selectedItem.selected);
    };

    return {
        selectedUser,
        selectedRepo,
        repositories,
        reposPage,
        totalRepos,
        reposPageCount,
        isLoading,
        error,
        handleUserClick,
        handleRepoClick,
        setReposPage,
        handleReposPageChange
    };
};