import React from 'react';
import '../styles/searchTasks.css';

const SearchTasks = ({ onSearch }) => {
    const handleInputChange = (event) => {
        onSearch(event.target.value);
    };

    return (
        <input
            className="search-bar"
            type="text"
            placeholder="Rechercher..."
            onChange={handleInputChange}
        />
    );
};

export default SearchTasks;