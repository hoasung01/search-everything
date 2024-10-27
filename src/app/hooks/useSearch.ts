import React, { useState } from 'react';

export const useSearch = () => {
    const [query, setQuery] = useState('');

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const searchQuery = formData.get('query') as string;
        setQuery(searchQuery);
    };

    return {
        query,
        handleSearchSubmit
    };
};