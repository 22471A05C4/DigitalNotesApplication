import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaUserCircle, FaBars, FaEllipsisV, FaStar, FaTrash, FaEdit, FaCopy } from 'react-icons/fa';
import './MainContent.css';

const MainContent = ({ notes, onDelete, onEdit, onFavorite }) => {
  const navigate = useNavigate();
  const [expandedNotes, setExpandedNotes] = useState([]); // Tracks which notes are expanded
  const [activeFolder, setActiveFolder] = useState('All'); // Tracks selected folder

  // Debug: Log notes to see what data we're receiving
  console.log('MainContent received notes:', notes);

  const handleEdit = (idx) => {
    navigate(`/edit/${idx}`);
  };

  const handleCopy = (note) => {
    const content = getNoteContent(note);
    navigator.clipboard.writeText(`${note.title}\n${content || ''}`);
    alert('Copied to clipboard!');
  };

  const toggleExpand = (idx) => {
    console.log('Toggling expand for note index:', idx);
    setExpandedNotes((prev) => {
      const newExpanded = prev.includes(idx) 
        ? prev.filter((i) => i !== idx) 
        : [...prev, idx];
      console.log('New expanded notes:', newExpanded);
      return newExpanded;
    });
  };

  const handleFolderClick = (folder) => {
    console.log('Folder clicked:', folder);
    setActiveFolder(folder);
  };

  // More robust filtering function
  const getNoteFolder = (note) => {
    // Handle backend response structure
    if (note.tags && note.tags.length > 0) {
      return note.tags[0]; // Get first tag from array
    }
    // Fallback to other possible field names
    return note.folder || note.category || note.tag || note.type || 'Personal';
  };

  // Get note content
  const getNoteContent = (note) => {
    return note.content || note.note || '';
  };

  // Filter notes based on active folder
  const filteredNotes = activeFolder === 'All'
    ? notes
    : notes.filter((note) => {
        const noteFolder = getNoteFolder(note);
        console.log('Checking note:', note.title, 'folder:', noteFolder, 'against active folder:', activeFolder);
        console.log('Note object:', note);
        const matches = noteFolder === activeFolder;
        console.log('Matches:', matches);
        return matches;
      });

  console.log('Active folder:', activeFolder);
  console.log('All notes:', notes);
  console.log('Filtered notes:', filteredNotes);
  console.log('Notes with folders:', notes.map(note => ({ title: note.title, folder: note.folder })));

  return (
    <div className="home">
      <div className="home-header">
        <FaBars className="home-toggle" />
        <span className="home-title">Notes</span>
        <FaUserCircle className="home-profile" />
      </div>

      <div className="home-search">
        <input type="text" placeholder="Search notes..." className="home-search-bar" />
      </div>

      <div className="home-folders">
        <button
          className={`home-folder-btn ${activeFolder === 'All' ? 'active' : ''}`}
          onClick={() => handleFolderClick('All')}
        >
          📋 All Notes
        </button>
        <button
          className={`home-folder-btn ${activeFolder === 'Personal' ? 'active' : ''}`}
          onClick={() => handleFolderClick('Personal')}
        >
          📁 Personal
        </button>
        <button
          className={`home-folder-btn ${activeFolder === 'Work' ? 'active' : ''}`}
          onClick={() => handleFolderClick('Work')}
        >
          💼 Work
        </button>
        <button
          className={`home-folder-btn ${activeFolder === 'Important' ? 'active' : ''}`}
          onClick={() => handleFolderClick('Important')}
        >
          ⭐ Important
        </button>
      </div>

      {/* Active tag indicator */}
      <div className="active-tag-display">
        <span className="active-tag-badge">
          {activeFolder === 'All' && '📋 Showing All Notes'}
          {activeFolder === 'Personal' && '📁 Personal Notes'}
          {activeFolder === 'Work' && '💼 Work Notes'}
          {activeFolder === 'Important' && '⭐ Important Notes'}
        </span>
        <span className="note-count">({filteredNotes.length} notes)</span>
      </div>

      <div className="home-notes-grid">
        {filteredNotes.length === 0 ? (
          <div style={{ textAlign: 'center', width: '100%', padding: '20px' }}>
            <p>No notes found. Create your first note!</p>
          </div>
        ) : (
          filteredNotes.map((note, idx) => {
            console.log('Rendering note:', note, 'index:', idx);
            return (
              <div key={note._id || idx} className="home-note-card" style={{ background: note.bgColor }}>
                <div className="note-title-and-options">
                  <div className="home-note-title">{note.title}</div>
                  <div className="note-options">
                    <FaEllipsisV className="options-icon" />
                    <div className="options-menu">
                      <FaStar title="Favorite" onClick={() => onFavorite(note._id || idx)} />
                      <FaTrash title="Delete" onClick={() => onDelete(note._id || idx)} />
                      <FaEdit title="Edit" onClick={() => handleEdit(note._id || idx)} />
                      <FaCopy title="Copy" onClick={() => handleCopy(note)} />
                    </div>
                  </div>
                </div>

                {/* Folder indicator */}
                <div className="note-folder-indicator">
                  📁 {getNoteFolder(note)}
                </div>

                {/* View Content button */}
                {getNoteContent(note).trim() !== '' && (
                  <button
                    className="view-content-btn"
                    onClick={() => toggleExpand(idx)}
                  >
                    {expandedNotes.includes(idx) ? 'Hide Content' : 'View Content'}
                  </button>
                )}

                {/* Show content if expanded */}
                {expandedNotes.includes(idx) && getNoteContent(note).trim() !== '' && (
                  <div className="home-note-content">
                    {getNoteContent(note)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <button className="home-add-btn" onClick={() => navigate('/new')}>
        <FaPlus />
      </button>
    </div>
  );
};

export default MainContent;
