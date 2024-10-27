export interface User {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
}

export interface Issue {
    id: number;
    title: string;
    html_url: string;
    state: string;
    created_at: string;
    number: number;
}

export interface Repository {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    language: string | null;
    open_issues_count: number;
    forks_count: number;
}