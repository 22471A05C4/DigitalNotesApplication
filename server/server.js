const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');   
const noteRoutes = require('./routes/NotesRoutes');


const app = express();
connectDB(); 

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);  
app.use('/api/notes', noteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));