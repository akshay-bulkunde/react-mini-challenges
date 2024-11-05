import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GitHubUserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isUserSelected, setIsUserSelected] = useState(false);

  const githubToken = import.meta.env.VITE_GITHUB_TOKEN;

  useEffect(() => {
    if (searchTerm.length < 3 || isUserSelected) {
      setUserResults([]);
      return;
    }
    fetchGitHubUsers(searchTerm);

  }, [searchTerm]);


  const fetchGitHubUsers = async (query) => {
    try {
      const response = await axios.get(
        `https://api.github.com/search/users?q=${query}`,
        {
          headers: {
            Authorization: `token ${githubToken}`,
          },
        }
      );
      setUserResults(response.data.items);
      setActiveIndex(-1);
    } catch (error) {
      console.error('Error fetching GitHub users:', error);
      setUserResults([]);
    }
  };


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setActiveIndex(-1);
    setIsUserSelected(false);
  };


  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      setActiveIndex((prevIndex) =>
        prevIndex < userResults.length - 1 ? prevIndex + 1 : 0
      );
    } else if (event.key === 'ArrowUp') {
      setActiveIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : userResults.length - 1
      );
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      selectUser(userResults[activeIndex]);
    }
  };


  const selectUser = (user) => {
    setSearchTerm(user.login);
    setUserResults([]);
    setIsUserSelected(true);
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
      <h1>GitHub User Search</h1>
      <input
        type="text"
        placeholder="Search GitHub users"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        style={{ padding: '8px', width: '50%' }}
      />
      <ul style={{ listStyleType: 'none', paddingLeft: 0, width: '50%', textAlign: 'left', margin: '0' }}>
        {userResults.map((user, index) => (
          <li
            key={user.id}
            onClick={() => selectUser(user)}
            style={{
              padding: '5px 0',
              backgroundColor: index === activeIndex ? 'gray' : 'transparent',
            }}
          >
            {user.login}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GitHubUserSearch;
