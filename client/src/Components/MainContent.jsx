import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaUserCircle, FaBars, FaEllipsisV, FaStar, FaTrash, FaEdit, FaCopy } from 'react-icons/fa';
import './MainContent.css';

const MainContent= ({ notes, onDelete, onEdit, onFavorite }) => {
  const navigate = useNavigate();

  const handleEdit = (idx) => {
    navigate(`/edit/${idx}`);
  };

  const handleCopy = (note) => {
    navigator.clipboard.writeText(`${note.title}\n${note.note || ''}`);
    alert('Copied to clipboard!');
  };

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
        <button className="home-folder-btn">Home</button>
        <button className="home-folder-btn">Personal</button>
        <button className="home-folder-btn">Work</button>
      </div>

      <div className="home-notes-grid">
        {notes.map((note, idx) => (
          <div key={idx} className="home-note-card" style={{ background: note.bgColor }}>
            <div className="note-title-and-options">
              <div className="home-note-title">{note.title}</div>
              <div className="note-options">
                <FaEllipsisV className="options-icon" />
                <div className="options-menu">
                  <FaStar title="Favorite" onClick={() => onFavorite(idx)} />
                  <FaTrash title="Delete" onClick={() => onDelete(idx)} />
                  <FaEdit title="Edit" onClick={() => handleEdit(idx)} />
                  <FaCopy title="Copy" onClick={() => handleCopy(note)} />
                </div>
              </div>
            </div>
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