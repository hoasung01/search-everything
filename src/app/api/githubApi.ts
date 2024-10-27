import axios from 'axios';

export const githubApi = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
        'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
    }
});

export const fetchGithubIssues = async (
    username: string,
    repo: string,
    page: number,
    perPage: number
) => {
    return githubApi.get(`/repos/${username}/${repo}/issues`, {
        params: {
            state: 'open',
            page,
            per_page: perPage,
        }
    });
};

export const createGithubIssue = async (
    username: string,
    repo: string,
    title: string,
    body: string
) => {
    return githubApi.post(`/repos/${username}/${repo}/issues`, {
        title,
        body
    });
};