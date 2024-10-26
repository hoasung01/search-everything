const UsersPage = () => {
    return (
        <div>
            <div className="search-container">
                <input type="text" placeholder="Search Users..." />
                <button>Search</button>
            </div>

            <div className="users-container">
                <div className="user-icon">1</div>
                <div className="user-icon">2</div>
                <div className="user-icon">3</div>
                <div className="user-icon">4</div>
                <div className="user-icon">5</div>
            </div>

            <div className="repositories-container">
                <div className="repository-item">Repository 1 (143 stars / 85 watching)</div>
                <div className="repository-item">Repository 2 (143 stars / 85 watching)</div>
                <div className="repository-item">Repository 3 (143 stars / 85 watching)</div>
                <div className="repository-item">Repository 4 (143 stars / 85 watching)</div>
                <div className="repository-item">Repository 5 (143 stars / 85 watching)</div>
                <div className="repository-item">Repository 6 (143 stars / 85 watching)</div>
            </div>

            <div className="pagination">
                <button>&lt;</button>
                <button>1</button>
                <button>2</button>
                <button>3</button>
                <button>4</button>
                <button>5</button>
                <button>6</button>
                <button>7</button>
                <button>8</button>
                <button>9</button>
                <button>&gt;</button>
            </div>
        </div>
    );
};

export default UsersPage;