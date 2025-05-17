require('dotenv').config();
const express = require('express');
const cors = require('cors');
const flashcardRoutes = require('./routes/flashcards');

const app = express();
const PORT = process.env.PORT || 3000;

// Log environment info (sanitized)
console.log('Environment information:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL set:', !!process.env.DATABASE_URL);
console.log('DIRECT_URL set:', !!process.env.DIRECT_URL);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/flashcards', flashcardRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Chinese Flashcard API',
    status: 'running',
    databaseConnected: !!process.env.DATABASE_URL
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    details: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 