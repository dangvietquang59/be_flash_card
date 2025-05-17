const express = require('express');
const router = express.Router();
const { 
  getFlashcards, 
  getFlashcardById
} = require('../controllers/flashcardController');

// Import cấu hình
let prisma;
try {
  prisma = require('../config/prisma');
} catch (error) {
  console.log('Prisma không tìm thấy trong health check route');
}
const supabase = require('../config/supabase');

// Cấu hình tên bảng đúng
const TABLE_NAME = 'chinese_language';

// Database health check route
router.get('/health', async (req, res) => {
  const status = {
    prisma: { status: 'not_used', message: 'Prisma không được cấu hình' },
    supabase: { status: 'not_checked', message: 'Chưa kiểm tra Supabase' },
    overall: { status: 'ok', message: 'Ít nhất một phương thức kết nối hoạt động' }
  };

  // Kiểm tra kết nối Prisma
  if (prisma) {
    try {
      // Try to execute a simple query
      await prisma.$queryRaw`SELECT 1`;
      status.prisma = { status: 'ok', message: 'Prisma kết nối thành công' };
    } catch (error) {
      console.error('Prisma health check failed:', error);
      status.prisma = { 
        status: 'error', 
        message: 'Prisma kết nối thất bại', 
        details: error.message,
        code: error.code
      };
    }
  }

  // Kiểm tra kết nối Supabase
  try {
    const { data, error } = await supabase.from(TABLE_NAME).select('count', { count: 'exact', head: true });
    
    if (error) throw error;
    
    status.supabase = { status: 'ok', message: 'Supabase kết nối thành công' };
  } catch (error) {
    console.error('Supabase health check failed:', error);
    status.supabase = { 
      status: 'error', 
      message: 'Supabase kết nối thất bại', 
      details: error.message
    };
  }

  // Xác định tổng trạng thái
  if (status.prisma.status === 'error' && status.supabase.status === 'error') {
    status.overall = { 
      status: 'error', 
      message: 'Tất cả phương thức kết nối đều thất bại'
    };
    return res.status(500).json(status);
  }

  res.status(200).json(status);
});

// Get all flashcards
// With optional query parameters:
// - level: filter by level
// - query: search by word or meaning
router.get('/', getFlashcards);

// Get flashcard by ID
router.get('/:id', getFlashcardById);

module.exports = router; 