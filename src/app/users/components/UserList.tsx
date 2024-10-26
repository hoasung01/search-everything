import React from 'react';
import { User } from '../types';
import styles from './UserList.module.css';

interface UserListProps {
    users: User[];
    selectedUser: User | null;
    onUserClick: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, selectedUser, onUserClick }) => {
    return (
        <div className={styles.usersContainer}>
            {users.map((user) => (
                <div
                    key={user.id}
                    className={`${styles.userIcon} ${selectedUser?.id === user.id ? styles.selected : ''}`}
                    onClick={() => onUserClick(user)}
                >
                    <img src={user.avatar_url} alt={user.login} className={styles.userAvatar} />
                    <span className={styles.userName}>{user.login}</span>
                </div>
            ))}
        </div>
    );
};

export default UserList;