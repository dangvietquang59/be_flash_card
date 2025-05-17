const express = require('express');
const router = express.Router();
const { 
  getFlashcards, 
  getFlashcardById
} = require('../controllers/flashcardController');
const prisma = require('../config/prisma');

// Database health check route
router.get('/health', async (req, res) => {
  try {
    // Try to execute a simple query
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', message: 'Database connection is healthy' });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed', 
      details: error.message,
      code: error.code
    });
  }
});

// Get all flashcards
// With optional query parameters:
// - level: filter by level
// - query: search by word or meaning
router.get('/', getFlashcards);

// Get flashcard by ID
router.get('/:id', getFlashcardById);

module.exports = router; 