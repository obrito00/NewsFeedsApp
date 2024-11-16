import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function SearchBar({ searchTerm, setSearchTerm, onSearchAll }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search News..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={() => onSearchAll(searchTerm)}><FontAwesomeIcon icon={faSearch}  /></button>
    </div>
  );
}

export default SearchBar;