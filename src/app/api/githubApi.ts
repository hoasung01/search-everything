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

export const searchUsers = async (
    query: string,
    page = 1,
    perPage = 10
) => {
    if (query.trim() !== '') {
        const response = await githubApi.get('/search/users', {
            params: {
                q: query,
                page,
                per_page: perPage,
            },
        });
        return { users: response.data.items, totalCount: response.data.total_count };
    } else {
        return { users: [], totalCount: 0 };
    }
};