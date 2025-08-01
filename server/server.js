const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');   
const noteRoutes = require('./routes/NotesRoutes');


const app = express();
connectDB(); 

const allowedOrigins = [
  'https://digital-notes-application.vercel.app',
  'http://localhost:5173',
  'http://localhost:5000'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('✅ NoteIt backend is running!');
});
app.use('/api/auth', authRoutes);  
app.use('/api/notes', noteRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));