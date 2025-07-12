import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [notes, setNotes] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!savedUser || !token) {
      navigate('/login'); // 🔒 Redirect if not logged in
      return;
    }

    setUser(savedUser);

    // Fetch notes for logged-in user
    axios
      .get('http://localhost:5000/api/notes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setNotes(res.data))
      .catch((err) => {
        console.error('Fetch notes error:', err);
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate('/login');
        }
      });
  }, []);

  // Filter notes by category and search query
  const filteredNotes = notes.filter(note => {
    const matchesCategory = activeCategory === 'All' || note.folder === activeCategory;
    const matchesSearch = searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get unique categories from notes
  const categories = ['All', ...new Set(notes.map(note => note.folder).filter(Boolean))];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="dashboard-container">
      <header>
        <h1>Welcome, {user.username} 👋</h1>
        <button
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
        >
          Logout
        </button>
      </header>

      <h2>Your Notes</h2>
      
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search notes by title..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchQuery && (
            <button onClick={clearSearch} className="clear-search-btn">
              ✕
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="search-results-info">
            Found {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </div>
        )}
      </div>
      
      {/* Category Filter Buttons */}
      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
            data-category={category}
          >
            {category === 'All' && '📋 All Notes'}
            {category === 'Personal' && '📁 Personal'}
            {category === 'Work' && '💼 Work'}
            {category === 'Important' && '⭐ Important'}
            {!['All', 'Personal', 'Work', 'Important'].includes(category) && `📂 ${category}`}
          </button>
        ))}
      </div>

      {/* Active Category Display */}
      <div className="active-category-display">
        <span className="category-badge">
          {activeCategory === 'All' && '📋 Showing All Notes'}
          {activeCategory === 'Personal' && '📁 Personal Notes'}
          {activeCategory === 'Work' && '💼 Work Notes'}
          {activeCategory === 'Important' && '⭐ Important Notes'}
          {!['All', 'Personal', 'Work', 'Important'].includes(activeCategory) && `📂 ${activeCategory} Notes`}
        </span>
        <span className="note-count">({filteredNotes.length} notes)</span>
      </div>

      <div className="notes-grid">
        {filteredNotes.length === 0 ? (
          <div className="no-notes">
            <p>
              {searchQuery 
                ? `No notes found matching "${searchQuery}" in ${activeCategory === 'All' ? 'any category' : activeCategory}.`
                : `No notes found in ${activeCategory === 'All' ? 'any category' : activeCategory}.`
              }
            </p>
            <button onClick={() => navigate('/new')} className="add-note-btn">
              Create Your First Note
            </button>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const isImportant = note.folder === 'Important';
            return (
              <div 
                key={note._id} 
                className={`note-card ${isImportant ? 'important-note' : ''}`}
                style={{ 
                  backgroundColor: note.bgColor || '#f5f5f5',
                  border: isImportant ? '3px solid #ff6b6b' : '1px solid #e0e0e0'
                }}
              >
                {isImportant && (
                  <div className="important-indicator">
                    <span className="important-star">⭐</span>
                    <span className="important-text">IMPORTANT</span>
                  </div>
                )}
                
                <div className="note-header">
                  <h3 className={isImportant ? 'important-title' : ''}>
                    {isImportant && <span className="priority-indicator">🔴</span>}
                    {note.title}
                  </h3>
                  <span className={`note-category ${isImportant ? 'important-category' : ''}`}>
                    {note.folder === 'Personal' && '📁 Personal'}
                    {note.folder === 'Work' && '💼 Work'}
                    {note.folder === 'Important' && '⭐ Important'}
                    {!['Personal', 'Work', 'Important'].includes(note.folder) && `📂 ${note.folder}`}
                  </span>
                </div>
                <p className={`note-content ${isImportant ? 'important-content' : ''}`}>{note.note}</p>
                <div className="note-footer">
                  <span className="note-date">{note.date}</span>
                  <div className="note-actions">
                    <button onClick={() => navigate(`/edit/${note._id}`)}>Edit</button>
                    <button onClick={() => {
                      // Handle delete
                      if (window.confirm('Are you sure you want to delete this note?')) {
                        // Add delete functionality here
                      }
                    }}>Delete</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <button className="add-note-fab" onClick={() => navigate('/new')}>
        +
      </button>
    </div>
  );
};

export default Dashboard;
                