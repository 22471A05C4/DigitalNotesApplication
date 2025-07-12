
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (email.trim() === '' || password.trim() === '') {
      alert('Please fill in all fields.');
      return;
    }
  
    try {
      // POST request to backend login API
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
  
      const { token, user } = response.data;
  
      // Save token and user info in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
  
      alert('Login successful!');
      navigate('/main'); // 👈 Redirect to Dashboard
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed. Please try again.';
      alert(errorMessage);
    }
  };
  
  return (
    <div className="auth-container" style={{
      background: 'linear-gradient(135deg, #a8edea, #fed6e3)',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input   
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

          <div className="switch-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
