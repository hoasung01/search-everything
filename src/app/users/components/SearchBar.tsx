'use client';
import React from 'react';
import styles from './SearchBar.module.css';

interface SearchFormProps {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const SearchBar = ({ onSubmit }: SearchFormProps) => {
    return (
        <form
            className={styles.searchContainer}
            onSubmit={onSubmit}
        >
            <input
                type="text"
                name="query"
                placeholder="Search Users..."
                className={styles.searchInput}
            />
            <button
                type="submit"
                className={styles.searchButton}
            >
                Search
            </button>
        </form>
    );
};

export default SearchBar;