import { use } from 'react';
import styles from './page.module.css';
import axios from 'axios';
import { User } from './types';
const fetchUsers = async (page = 1, perPage = 5): Promise<User[]> => {
    const response = await axios.get('https://api.github.com/users', {
        params: {
            page,
            per_page: perPage,
        },
    });
    return response.data;
};


const UsersPage = () => {
    const users = use(fetchUsers());

    return (
        <div className={styles.container}>
            <div className={styles.searchContainer}>
                <input type="text" placeholder="Search Users..." className={styles.searchInput} />
                <button className={styles.searchButton}>Search</button>
            </div>

            <div className={styles.usersContainer}>
                {users.map((user: User) => (
                    <div key={user.id} className={styles.userIcon}>
                        <img src={user.avatar_url} alt={user.login} className={styles.userAvatar} />
                        <span className={styles.userName}>{user.login}</span>
                    </div>
                ))}
            </div>

            <div className={styles.repositoriesContainer}>
                <div className={styles.repositoryItem}>Repository 1 (143 stars / 85 watching)</div>
                <div className={styles.repositoryItem}>Repository 2 (143 stars / 85 watching)</div>
                <div className={styles.repositoryItem}>Repository 3 (143 stars / 85 watching)</div>
                <div className={styles.repositoryItem}>Repository 4 (143 stars / 85 watching)</div>
                <div className={styles.repositoryItem}>Repository 5 (143 stars / 85 watching)</div>
                <div className={styles.repositoryItem}>Repository 6 (143 stars / 85 watching)</div>
            </div>

            <div className={styles.pagination}>
                <button className={styles.paginationButton}>&lt;</button>
                <button className={styles.paginationButton}>1</button>
                <button className={styles.paginationButton}>2</button>
                <button className={styles.paginationButton}>3</button>
                <button className={styles.paginationButton}>4</button>
                <button className={styles.paginationButton}>5</button>
                <button className={styles.paginationButton}>6</button>
                <button className={styles.paginationButton}>7</button>
                <button className={styles.paginationButton}>8</button>
                <button className={styles.paginationButton}>9</button>
                <button className={styles.paginationButton}>&gt;</button>
            </div>
        </div>
    );
};

export default UsersPage;