const express = require('express');
const router = express.Router();
const { 
  getFlashcards, 
  getFlashcardById, 

} = require('../controllers/flashcardController');


// Get all flashcards
// With optional query parameters:
// - level: filter by level
// - query: search by word or meaning
router.get('/', getFlashcards);

// Get flashcard by ID
router.get('/:id', getFlashcardById);

module.exports = router; 