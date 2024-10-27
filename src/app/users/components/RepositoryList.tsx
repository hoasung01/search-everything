import React from 'react';
import styles from './RepositoryList.module.css';
import Pagination from '../../../components/Pagination';
import {Repository} from "@/app/users/types";

interface RepositoryListProps {
    repositories: Repository[];
    selectedRepo: string | null;
    onRepoClick: (repoName: string) => void;
    selectedUserLogin: string;
    isLoadingIssues: boolean;
    issues: any[];
    issuesPageCount: number;
    issuesPage: number;
    onIssuesPageChange: (selectedItem: { selected: number }) => void;
    onReposPageChange: (selectedItem: { selected: number }) => void;
    reposPageCount: number;
    reposPage: number;
    openIssuesModal: () => void;
    renderIssueModal: JSX.Element;
    noIssuesMessage: string;
    formatDate: (dateString: string) => string;
}

const RepositoryList: React.FC<RepositoryListProps> = ({
                                                           repositories,
                                                           selectedRepo,
                                                           onRepoClick,
                                                           selectedUserLogin,
                                                           isLoadingIssues,
                                                           issues,
                                                           issuesPageCount,
                                                           issuesPage,
                                                           onIssuesPageChange,
                                                           onReposPageChange,
                                                           reposPageCount,
                                                           reposPage,
                                                           openIssuesModal,
                                                           renderIssueModal,
                                                           noIssuesMessage,
                                                           formatDate,
                                                       }) => {
    return (
        <div className={styles.repositoriesContainer}>
            <h3>Repositories for {selectedUserLogin}</h3>
            {repositories.length > 0 ? (
                <>
                    <ul className={styles.repositoryList}>
                        {repositories.map((repo) => (
                            <li
                                key={repo.id}
                                className={`${styles.repositoryItem} ${selectedRepo === repo.name ? styles.selectedRepo : ''}`}
                                onClick={() => onRepoClick(repo.name)}
                            >
                                <div className={styles.repositoryHeader}>
                                    <a
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.repositoryLink}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {repo.name}
                                    </a>
                                    <span className={styles.repositoryStats}>
                                        ⭐ {repo.stargazers_count} • 🔄 {repo.forks_count} • 📝 {repo.open_issues_count} issues
                                    </span>
                                </div>
                                {repo.description && (
                                    <p className={styles.repositoryDescription}>{repo.description}</p>
                                )}
                                {selectedRepo === repo.name && (
                                    <div className={styles.issuesContainer}>
                                        <h4 className={styles.openIssuesHeading}>Open Issues</h4>
                                        <button className={styles.newIssueButton} onClick={openIssuesModal}>
                                            New Issue
                                        </button>
                                        {renderIssueModal}
                                        {isLoadingIssues ? (
                                            <p className={styles.loading}>Loading issues...</p>
                                        ) : issues.length > 0 ? (
                                            <>
                                                <ul className={styles.issuesList}>
                                                    {issues.map((issue) => (
                                                        <li key={issue.id} className={styles.issueItem}>
                                                            <div className={styles.issueHeader}>
                                                                <a
                                                                    href={issue.html_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={styles.issueLink}
                                                                >
                                                                    #{issue.number} {issue.title}
                                                                </a>
                                                            </div>
                                                            <div className={styles.issueFooter}>
                                                                <span className={styles.issueDate}>
                                                                    Created: {formatDate(issue.created_at)}
                                                                </span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                                {issuesPageCount > 1 && (
                                                    <Pagination
                                                        pageCount={issuesPageCount}
                                                        onPageChange={onIssuesPageChange}
                                                        forcePage={issuesPage}
                                                    />
                                                )}
                                            </>
                                        ) : (
                                            <p className={styles.noIssues}>{noIssuesMessage}</p>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    {reposPageCount > 1 && (
                        <Pagination
                            pageCount={reposPageCount}
                            onPageChange={onReposPageChange}
                            forcePage={reposPage}
                        />
                    )}
                </>
            ) : (
                <p>No repositories found</p>
            )}
        </div>
    );
};

export default RepositoryList;