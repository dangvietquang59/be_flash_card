const prisma = require('../config/prisma');

// Get all flashcards with optional filtering by level or search by word/meaning
exports.getFlashcards = async (req, res) => {
  try {
    const { level, query } = req.query;
    
    // Build query conditions
    const where = {};
    
    // Filter by level if provided
    if (level && !isNaN(level)) {
      where.level = parseInt(level);
    }
    
    // Search by word or meaning if provided
    if (query) {
      where.OR = [
        { word: { contains: query, mode: 'insensitive' } },
        { meaning: { contains: query, mode: 'insensitive' } }
      ];
    }
    
    // Log the query conditions for debugging
    console.log('Query conditions:', JSON.stringify(where));
    
    // Execute query with conditions
    const flashcards = await prisma.flashcards.findMany({
      where
    });
    
    res.status(200).json(flashcards);
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ 
      error: 'Error fetching flashcards', 
      details: error.message, 
      code: error.code 
    });
  }
};

// Get flashcard by ID
exports.getFlashcardById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const flashcard = await prisma.flashcards.findUnique({
      where: {
        stt: parseInt(id)
      }
    });
    
    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    
    res.status(200).json(flashcard);
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ 
      error: 'Error fetching flashcard', 
      details: error.message, 
      code: error.code 
    });
  }
}; 