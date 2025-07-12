import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';




import SignUp from './Components/SignUp';

const App = () => {
  return (
    <Router>
      <Routes>
       
        <Route path="/signup" element={<SignUp/>} />

        
      </Routes>
    </Router>
  );
};

export default App;