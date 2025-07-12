import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [notes, setNotes] = useState([]);

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
      <div className="notes-grid">
        {notes.length === 0 ? (
          <p>No notes yet. Start by adding one!</p>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="note-card">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <p className="tags">Tags: {note.tags?.join(', ')}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
                