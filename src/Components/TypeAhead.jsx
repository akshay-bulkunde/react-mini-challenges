import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Typeahead = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
 
  const fetchUsers = async (searchQuery) => {
    if (!searchQuery) {
      setUsers([]);
      return;
    }

    try {
      const response = await axios.get(`https://api.github.com/search/users?q=${searchQuery}`);
      console.log(response)
      setUsers(response.data.items);
    } catch (error) {
      console.error('Error fetching users:', error);
    } 
  };

  useEffect(() => {
    fetchUsers(query);
  }, [query]);

  return (
    <div>
      <input
      className='border-2 shadow-md p-2'
        type="text"
        placeholder="Search GitHub users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
     
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <a href={user.html_url} target="_blank" rel="noopener noreferrer">
              {user.login}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Typeahead;
