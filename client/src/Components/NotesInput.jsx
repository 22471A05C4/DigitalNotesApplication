import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaCheck, FaUndo, FaRedo, FaPalette, FaImage, FaFont, FaMicrophone, FaPlus
} from 'react-icons/fa';
import './NotesInput.css';

const fonts = ['Arial', 'Georgia', 'Courier New', 'Verdana', 'Comic Sans MS'];

const NotesInput = ({ addNote, updateNote, notes }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = id !== undefined;

  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [bgColor, setBgColor] = useState('#2c2c2c');
  const [bgImage, setBgImage] = useState('');
  const [images, setImages] = useState([]);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [folder, setFolder] = useState('home');
  const [showColors, setShowColors] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showFonts, setShowFonts] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  let recognition;

  useEffect(() => {
    // If editing, preload the note data
    if (isEdit && notes && notes[id]) {
      const noteData = notes[id];
      setTitle(noteData.title || '');
      setNote(noteData.note || '');
      setBgColor(noteData.bgColor || '#2c2c2c');
      setBgImage(noteData.bgImage || '');
      setImages(noteData.images || []);
      setFontFamily(noteData.font || 'Arial');
      setFolder(noteData.folder || 'home');
    }
  }, [isEdit, id, notes]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;

      recognition.onresult = (event) => {
        const speech = event.results[0][0].transcript;
        setNote(prev => prev + ' ' + speech);
      };

      recognition.onerror = (e) => console.error('Speech error', e);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) return;
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsRecording(!isRecording);
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

  const handleSave = () => {
    const newNote = {
      title,
      note,
      date: new Date().toLocaleDateString(),
      folder,
      font: fontFamily,
      bgColor,
      bgImage,
      images
    };
    if (isEdit) {
      updateNote(Number(id), newNote);
    } else {
      addNote(newNote);
    }
    navigate('/main');
  };

  return (
    <div className="note-input-container">
      <div
        className="note-card"
        style={{
          background: bgImage ? `url(${bgImage}) center/cover no-repeat` : bgColor,
          fontFamily
        }}>
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

        {/* Show added images */}
        <div className="note-images">
          {images.map((url, idx) => (
            <img src={url} key={idx} alt="note-img" />
          ))}
        </div>

        <div className="folder-buttons">
          <button
            className={folder === 'home' ? 'active' : ''}
            onClick={() => setFolder('home')}
          >Home</button>
          <button
            className={folder === 'personal' ? 'active' : ''}
            onClick={() => setFolder('personal')}
          >Personal</button>
          <button
            className={folder === 'work' ? 'active' : ''}
            onClick={() => setFolder('work')}
          >Work</button>
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
          <FaMicrophone onClick={toggleRecording} style={{ color: isRecording ? 'red' : '#fff' }} />
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
            <button onClick={handleTakePicture}>📷 Take Picture</button>
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

export default NotesInput;