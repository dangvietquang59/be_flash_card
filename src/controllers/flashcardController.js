// Cố gắng sử dụng Prisma nếu có thể, nếu không thì dùng Supabase
let prisma;
try {
  prisma = require('../config/prisma');
} catch (error) {
  console.log('Prisma không thể khởi tạo, chuyển sang sử dụng Supabase');
}

const supabase = require('../config/supabase');

// Cấu hình tên bảng đúng
const TABLE_NAME = 'chinese_language';

// Hàm trợ giúp để quyết định sử dụng Prisma hay Supabase
async function testPrismaConnection() {
  if (!prisma) return false;
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('Prisma kết nối thành công, sử dụng Prisma');
    return true;
  } catch (e) {
    console.log('Prisma kết nối thất bại, chuyển sang Supabase');
    return false;
  }
}

let usePrisma;
// Kiểm tra kết nối Prisma khi khởi tạo
(async () => {
  usePrisma = await testPrismaConnection();
})();

// Get all flashcards with optional filtering by level or search by word/meaning
exports.getFlashcards = async (req, res) => {
  try {
    const { level, query } = req.query;
    
    // Log the query conditions for debugging
    console.log('Query conditions:', JSON.stringify({ level, query }));
    
    // Nếu kết nối Prisma hoạt động, sử dụng Prisma
    if (usePrisma) {
      // Build query conditions for Prisma
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
      
      // Execute query with conditions using Prisma
      const flashcards = await prisma.flashcards.findMany({ where });
      return res.status(200).json(flashcards);
    } 
    // Nếu không, sử dụng Supabase
    else {
      // Khởi tạo truy vấn cơ bản
      let queryBuilder = supabase.from(TABLE_NAME).select('*');
      
      // Filter by level if provided
      if (level && !isNaN(level)) {
        queryBuilder = queryBuilder.eq('level', parseInt(level));
      }
      
      // Search by word or meaning if provided
      if (query) {
        // Sử dụng cú pháp .or() đúng theo tài liệu Supabase
        queryBuilder = queryBuilder.or(`word.ilike.%${query}%,meaning.ilike.%${query}%`);
      }
      
      // Thực hiện truy vấn và lấy kết quả
      const { data, error } = await queryBuilder;
      
      // Log chi tiết truy vấn và kết quả để debug
      console.log('Supabase query details:', {
        url: supabase.supabaseUrl,
        hasAnonKey: !!supabase.supabaseKey,
        table: TABLE_NAME,
        filters: { level, query },
        error: error ? { code: error.code, message: error.message } : null,
        resultCount: data ? data.length : 0
      });
      
      if (error) throw error;
      
      return res.status(200).json(data || []);
    }
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
    
    // Nếu kết nối Prisma hoạt động, sử dụng Prisma
    if (usePrisma) {
      const flashcard = await prisma.flashcards.findUnique({
        where: {
          stt: parseInt(id)
        }
      });
      
      if (!flashcard) {
        return res.status(404).json({ error: 'Flashcard not found' });
      }
      
      return res.status(200).json(flashcard);
    } 
    // Nếu không, sử dụng Supabase
    else {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('stt', parseInt(id))
        .single();
      
      if (error) throw error;
      
      if (!data) {
        return res.status(404).json({ error: 'Flashcard not found' });
      }
      
      return res.status(200).json(data);
    }
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ 
      error: 'Error fetching flashcard', 
      details: error.message, 
      code: error.code 
    });
  }
}; 