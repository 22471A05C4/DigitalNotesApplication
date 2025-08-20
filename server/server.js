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



// const express = require('express');
// const connectDB = require('./config/db');
// const cors = require('cors');
// require('dotenv').config();

// const authRoutes = require('./routes/authRoutes');   
// const noteRoutes = require('./routes/NotesRoutes');

// const app = express();
// connectDB();

// // explicit allowed origins you trust
// const allowedOrigins = [
//   'http://localhost:5173',
//   'http://localhost:5000',
//   // add your custom production domain here if you have one:
//   'https://digital-notes-application.vercel.app'
// ];

// // helper to check vercel subdomains
// function isVercelOrigin(origin) {
//   if (!origin) return false;
//   try {
//     const hostname = new URL(origin).hostname; // e.g. my-app.vercel.app
//     return hostname === 'vercel.app' || hostname.endsWith('.vercel.app');
//   } catch (err) {
//     return false;
//   }
// }

// app.use(cors({
//   origin: (origin, callback) => {
//     // 1) Non-browser requests (curl/Postman) often have no origin — allow for convenience
//     if (!origin) return callback(null, true);

//     // 2) Exact match in allowedOrigins
//     if (allowedOrigins.includes(origin)) return callback(null, true);

//     // 3) Any Vercel subdomain
//     if (isVercelOrigin(origin)) return callback(null, true);

//     // 4) Otherwise block
//     return callback(new Error('CORS policy: This origin is not allowed'), false);
//   },
//   credentials: true
// }));

// app.use(express.json());

// // Routes
// app.get('/', (req, res) => res.send('✅ NoteIt backend is running!'));
// app.use('/api/auth', authRoutes);
// app.use('/api/notes', noteRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
