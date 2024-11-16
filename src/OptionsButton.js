import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faTh, faList } from '@fortawesome/free-solid-svg-icons';

const OptionsButton = ({ isDarkMode, toggleDarkMode , layoutStyle, setLayoutStyle }) => {
const toggleLayoutStyle = () => {
    setLayoutStyle(prevStyle => (prevStyle === 'grid' ? 'list' : 'grid'));
    };

  return (
    <div className="options-button">
      <button onClick={toggleDarkMode}>
        {isDarkMode ? (
          <FontAwesomeIcon icon={faSun} className="fa-icon" />
        ) : (
          <FontAwesomeIcon icon={faMoon} className="fa-icon" />
        )}
      </button>
      <button onClick={toggleLayoutStyle}>
      <FontAwesomeIcon icon={layoutStyle === 'grid' ? faList : faTh} className="fa-icon" />
      </button>
    </div>
  );
};

export default OptionsButton;