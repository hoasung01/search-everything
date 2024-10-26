import styles from './page.module.css';

const UsersPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.searchContainer}>
                <input type="text" placeholder="Search Users..." className={styles.searchInput} />
                <button className={styles.searchButton}>Search</button>
            </div>

            <div className={styles.usersContainer}>
                <div className={styles.userIcon}>1</div>
                <div className={styles.userIcon}>2</div>
                <div className={styles.userIcon}>3</div>
                <div className={styles.userIcon}>4</div>
                <div className={styles.userIcon}>5</div>
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