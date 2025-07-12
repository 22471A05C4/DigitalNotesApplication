import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaUserCircle, FaBars, FaEllipsisV, FaStar, FaTrash, FaEdit, FaCopy } from 'react-icons/fa';
import './MainContent.css';

const MainContent = ({ notes, onDelete, onEdit, onFavorite }) => {
  const navigate = useNavigate();
  const [expandedNotes, setExpandedNotes] = useState([]); // Tracks which notes are expanded
  const [activeFolder, setActiveFolder] = useState('All'); // Tracks selected folder

  const handleEdit = (idx) => {
    navigate(`/edit/${idx}`);
  };

  const handleCopy = (note) => {
    navigator.clipboard.writeText(`${note.title}\n${note.note || ''}`);
    alert('Copied to clipboard!');
  };

  const toggleExpand = (idx) => {
    setExpandedNotes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleFolderClick = (folder) => {
    setActiveFolder(folder);
  };

  // Filter notes based on active folder
  const filteredNotes = activeFolder === 'All'
    ? notes
    : notes.filter((note) => note.folder === activeFolder);

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
          All
        </button>
        <button
          className={`home-folder-btn ${activeFolder === 'Personal' ? 'active' : ''}`}
          onClick={() => handleFolderClick('Personal')}
        >
          Personal
        </button>
        <button
          className={`home-folder-btn ${activeFolder === 'Work' ? 'active' : ''}`}
          onClick={() => handleFolderClick('Work')}
        >
          Work
        </button>
        <button
          className={`home-folder-btn ${activeFolder === 'Important' ? 'active' : ''}`}
          onClick={() => handleFolderClick('Important')}
        >
          Important
        </button>
      </div>

      <div className="home-notes-grid">
        {filteredNotes.map((note, idx) => (
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

            {/* Show content if expanded */}
            {expandedNotes.includes(idx) && (
              <div className="home-note-content">{note.note}</div>
            )}

            {/* View More / View Less button */}
            <button
              className="view-more-btn"
              onClick={() => toggleExpand(idx)}
            >
              {expandedNotes.includes(idx) ? 'View Less' : 'View More'}
            </button>
          </div>
        ))}
      </div>

      <button className="home-add-btn" onClick={() => navigate('/new')}>
        <FaPlus />
      </button>
    </div>
  );
};

export default MainContent;
