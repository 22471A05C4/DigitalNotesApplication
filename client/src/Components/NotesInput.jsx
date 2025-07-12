import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaUndo, FaRedo, FaPalette, FaImage, FaFont, FaMicrophone, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import './NotesInput.css';

const NoteInput = ({ addNote }) => {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [folder, setFolder] = useState('Personal');
  const [bgColor, setBgColor] = useState('#2c2c2c');
  const [bgImage, setBgImage] = useState('');
  const [images, setImages] = useState([]);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [showColors, setShowColors] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showFonts, setShowFonts] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const fonts = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'];

  // Create axios instance with auth headers
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor to include auth token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recog = new window.webkitSpeechRecognition();
      recog.lang = 'en-US';
      recog.continuous = false;

      recog.onresult = (event) => {
        const speech = event.results[0][0].transcript;
        setNote(prev => prev + ' ' + speech);
      };

      recog.onerror = (e) => console.error('Speech error', e);
      recog.onend = () => setIsRecording(false);
      recognitionRef.current = recog;
    }
  }, []);

  // Debug: Log when folder/tag changes
  useEffect(() => {
    console.log('Current selected tag:', folder);
  }, [folder]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const prev = history.pop();
      setFuture([{ title, note }, ...future]);
      setTitle(prev.title);
      setNote(prev.note);
      setHistory([...history]);
    }
  };

  const handleRedo = () => {
    if (future.length > 0) {
      const next = future.shift();
      setHistory([...history, { title, note }]);
      setTitle(next.title);
      setNote(next.note);
      setFuture([...future]);
    }
  };

  const handleChange = (setter) => (e) => {
    setHistory([...history, { title, note }]);
    setter(e.target.value);
  };

  const handleAddImage = (file) => {
    const url = URL.createObjectURL(file);
    setImages(prev => [...prev, url]);
  };

  const handleAddCustomBg = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
      const file = e.target.files[0];
      if (file) setBgImage(URL.createObjectURL(file));
    };
    input.click();
  };

  const handleTakePicture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = e => {
      const file = e.target.files[0];
      if (file) handleAddImage(file);
    };
    input.click();
  };

  const handleChooseFromGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
      const file = e.target.files[0];
      if (file) handleAddImage(file);
    };
    input.click();
  };

  const handleTagChange = (e) => {
    const selectedTag = e.target.value;
    console.log('Tag changed to:', selectedTag);
    setFolder(selectedTag);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to save notes');
      navigate('/login');
      return;
    }

    if (!title.trim() || !note.trim()) {
      alert('Please enter both title and note content');
      return;
    }

    console.log('Selected folder/tag:', folder);

    const newNote = {
      title,
      content: note, // Backend expects 'content' not 'note'
      date: new Date().toLocaleDateString(),
      tags: [folder], // Backend expects 'tags' array, not 'folder'
      font: fontFamily,
      bgColor,
      bgImage,
      images 
    };

    console.log('Saving note with tag:', newNote);

    try {
      const res = await api.post('/notes', newNote);
      console.log('Note saved successfully with tag:', res.data);
      addNote(res.data); // Pass the response data from server
      alert(`Note saved successfully in ${folder} category!`);
      navigate('/main');
    } catch (error) {
      console.error('Error saving note:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Session expired. Please login again.');
        navigate('/login');
      } else {
        alert('Error saving note. Please try again.');
      }
    }
  };

  return (
    <div className="note-input-container">
      <div
        className="note-card"
        style={{
          background: bgImage ? `url(${bgImage}) center/cover no-repeat` : bgColor,
          fontFamily
        }}
      >
        <div className="toolbar">
          <FaCheck className="icon save" onClick={handleSave} title="Save" />
          <FaUndo className="icon" onClick={handleUndo} title="Undo" />
          <FaRedo className="icon" onClick={handleRedo} title="Redo" />
        </div>

        <input
          placeholder="Title"
          value={title}
          onChange={handleChange(setTitle)}
          className="note-title"
        />

        <textarea
          placeholder="Write your note..."
          value={note}
          onChange={handleChange(setNote)}
          className="note-text"
        />

        <div className="note-images">
          {images.map((url, idx) => (
            <img src={url} key={idx} alt="note-img" />
          ))}
        </div>

        <div className="bottom-toolbar">
          <FaPalette onClick={() => {
            setShowColors(!showColors);
            setShowGallery(false);
            setShowFonts(false);
          }} />
          <FaImage onClick={() => {
            setShowGallery(!showGallery);
            setShowColors(false);
            setShowFonts(false);
          }} />
          <FaFont onClick={() => {
            setShowFonts(!showFonts);
            setShowColors(false);
            setShowGallery(false);
          }} />
          <FaMicrophone onClick={toggleRecording} style={{ color: isRecording ? 'red' : 'white' }} />
        </div>

        <select value={folder} onChange={handleTagChange} className="folder-select">
          <option value="Personal">📁 Personal</option>
          <option value="Work">💼 Work</option>
          <option value="Important">⭐ Important</option>
        </select>

        {/* Tag indicator */}
        <div className="selected-tag-indicator">
          <span className="tag-badge">
            {folder === 'Personal' && '📁 Personal'}
            {folder === 'Work' && '💼 Work'}
            {folder === 'Important' && '⭐ Important'}
          </span>
        </div>

        {showColors && (
          <div className="color-options">
            {['#2c2c2c', '#1976d2', '#4caf50', '#ff9800'].map(c => (
              <div key={c} className="color-dot" style={{ background: c }} onClick={() => { setBgColor(c); setBgImage(''); }} />
            ))}
            <FaPlus onClick={handleAddCustomBg} className="add-bg" />
          </div>
        )}

        {showGallery && (
          <div className="gallery-options">
            
            <button onClick={handleChooseFromGallery}>🖼 Choose from Gallery</button>
          </div>
        )}

        {showFonts && (
          <div className="font-options">
            {fonts.map(f => (
              <button key={f} style={{ fontFamily: f }} onClick={() => setFontFamily(f)}>{f}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteInput;