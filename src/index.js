require('dotenv').config();
const express = require('express');
const cors = require('cors');
const flashcardRoutes = require('./routes/flashcards');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/flashcards', flashcardRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Chinese Flashcard API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 