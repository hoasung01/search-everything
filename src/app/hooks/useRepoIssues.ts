import { useState, useCallback } from 'react';
import { User } from '../users/types';
import { githubApi } from '../api/githubApi';
import { Issue } from '../users/types';

interface UseRePoIssuesProps {
    selectedUser: User | null;
    selectedRepo: string | null;
    issuesPerPage?: number;
}

export const useRepoIssues = ({
                                    selectedUser,
                                    selectedRepo,
                                    issuesPerPage = 5
                                }: UseRePoIssuesProps) => {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [isLoadingIssues, setIsLoadingIssues] = useState(false);
    const [issuesPage, setIssuesPage] = useState(0);
    const [totalIssues, setTotalIssues] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const issuesPageCount = Math.ceil(totalIssues / issuesPerPage);


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
            await fetchIssues();
        } catch (error) {
            setError('Failed to create issue. Please try again.');
            console.error('Error creating issue:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleIssuesPageChange = (selectedItem: { selected: number }) => {
        setIssuesPage(selectedItem.selected);
    };

    return {
        issues,
        isLoadingIssues,
        issuesPage,
        totalIssues,
        issuesPageCount,
        isModalOpen,
        setIsModalOpen,
        isSubmitting,
        error,
        handleCreateIssue,
        handleIssuesPageChange,
        fetchIssues
    };
};