import { useState, useEffect } from 'react';
import { githubApi } from '../api/githubApi';
import {User} from "@/app/users/types";

export const useRepositories = (selectedUser: User | null, reposPerPage: number = 5) => {
    const [repositories, setRepositories] = useState<any[]>([]);
    const [totalRepos, setTotalRepos] = useState(0);
    const [reposPage, setReposPage] = useState(0);

    useEffect(() => {
        if (selectedUser) {
            const fetchRepositories = async () => {
                try {
                    const userResponse = await githubApi.get(`/users/${selectedUser.login}`);
                    setTotalRepos(userResponse.data.public_repos);

                    const reposResponse = await githubApi.get(`/users/${selectedUser.login}/repos`, {
                        params: { page: reposPage + 1, per_page: reposPerPage }
                    });
                    setRepositories(reposResponse.data);
                } catch (error) {
                    console.error('Error fetching repositories:', error);
                    setRepositories([]);
                }
            };
            fetchRepositories();
        }
    }, [selectedUser, reposPage, reposPerPage]);

    const reposPageCount = Math.ceil(totalRepos / reposPerPage);

    return { repositories, reposPage, setReposPage, reposPageCount };
};