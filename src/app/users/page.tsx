'use client';
import styles from './page.module.css';
import IssueModal from '../../components/IssueModal';
import Pagination from '../../components/Pagination';
import UserList from './components/UserList';
import RepositoryList from './components/RepositoryList';
import SearchBar from './components/SearchBar';
import { useSearch } from '../hooks/useSearch';
import { useUsers } from '../hooks/useUsers';
import { useRepositories } from '../hooks/useRepositories';
import { useRepoIssues } from '../hooks/useRepoIssues';

const UsersPage = () => {
    const { query, handleSearchSubmit } = useSearch();
    const { users, totalCount, currentPage, setCurrentPage } = useUsers(query);
    const {
        selectedUser,
        selectedRepo,
        repositories,
        reposPage,
        reposPageCount,
        handleUserClick,
        handleRepoClick,
        handleReposPageChange
    } = useRepositories();
    const {
        issues,
        isLoadingIssues,
        issuesPage,
        totalIssues,
        issuesPageCount,
        isModalOpen,
        setIsModalOpen,
        isSubmitting,
        error,
        handleCreateIssue,
        handleIssuesPageChange
    } = useRepoIssues({
        selectedUser,
        selectedRepo,
        issuesPerPage: 5
    });

    const handlePageClick = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected);
    };
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };
    const perPage = 10;
    const pageCount = Math.ceil(totalCount / perPage);

    return (
        <div className={styles.container}>
            <SearchBar onSubmit={handleSearchSubmit} />
            <UserList users={users} selectedUser={selectedUser} onUserClick={handleUserClick} />
            {selectedUser && (
                <RepositoryList
                    repositories={repositories}
                    selectedRepo={selectedRepo}
                    onRepoClick={handleRepoClick}
                    selectedUserLogin={selectedUser.login}
                    isLoadingIssues={isLoadingIssues}
                    issues={issues}
                    issuesPageCount={issuesPageCount}
                    issuesPage={issuesPage}
                    onIssuesPageChange={handleIssuesPageChange}
                    onReposPageChange={handleReposPageChange}
                    reposPageCount={reposPageCount}
                    reposPage={reposPage}
                    openIssuesModal={() => setIsModalOpen(true)}
                    renderIssueModal={
                        <IssueModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSubmit={handleCreateIssue}
                            repoName={selectedRepo || ''}
                            isSubmitting={isSubmitting}
                            error={error}
                        />
                    }
                    noIssuesMessage="No open issues found"
                    formatDate={formatDate}
                />
            )}
            {pageCount > 1 && (
                <Pagination
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    forcePage={currentPage}
                />
            )}
        </div>
    );
};
export default UsersPage;