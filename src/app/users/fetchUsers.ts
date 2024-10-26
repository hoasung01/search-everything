import axios from 'axios';
import { User } from './types';

export const fetchUsers = async (query: string, page = 1, perPage = 10): Promise<{ users: User[]; totalCount: number }> => {
    if (query.trim() !== '') {
        const response = await axios.get('https://api.github.com/search/users', {
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