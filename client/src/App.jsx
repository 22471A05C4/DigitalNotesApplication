import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Home from './Components/Home';
import MainContent from './Components/MainContent';
import NotesInput from './Components/NotesInput';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [noteToEdit, setNoteToEdit] = useState(null);

  const addNote = (newNote) => {
    setNotes([...notes, { ...newNote, id: Date.now() }]);
  };

  const updateNote = (updatedNote) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
  };

  const deleteNote = (idx) => {
    setNotes(notes.filter((_, index) => index !== idx));
  };

  const toggleFavorite = (idx) => {
    setNotes(notes.map((note, index) => 
      index === idx ? { ...note, favorite: !note.favorite } : note
    ));
  };

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/main" element={
          <MainContent
            notes={notes}
            onDelete={deleteNote}
            onEdit={(idx) => setNoteToEdit(notes[idx])}
            onUpdate={updateNote}
            onFavorite={toggleFavorite}
          />
        } />
        <Route path="/new" element={<NotesInput addNote={addNote} />} />
        <Route path="/edit/:id" element={<NotesInput addNote={addNote} updateNote={updateNote} notes={notes} />} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
  );
};

export default App;