import { useState, useEffect } from 'react';
import { searchUsers } from '../api/githubApi';
import {User} from "@/app/users/types";

export const useUsers = (query: string) => {
    const [users, setUsers] = useState<User[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const { users, totalCount } = await searchUsers(query, currentPage + 1, 10);
            setUsers(users);
            setTotalCount(Math.min(totalCount, 1000));
        };
        fetchData();
    }, [query, currentPage]);

    return { users, totalCount, currentPage, setCurrentPage };
};