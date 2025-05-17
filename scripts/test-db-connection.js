require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Hiển thị thông tin biến môi trường (che một phần thông tin nhạy cảm)
console.log('DATABASE_URL starts with:', process.env.DATABASE_URL ? 
  process.env.DATABASE_URL.substring(0, 30) + '...' : 'undefined');
console.log('DATABASE_URL valid format:', process.env.DATABASE_URL ? 
  (process.env.DATABASE_URL.startsWith('postgresql://') || 
   process.env.DATABASE_URL.startsWith('postgres://')) : false);
   
console.log('DIRECT_URL starts with:', process.env.DIRECT_URL ? 
  process.env.DIRECT_URL.substring(0, 30) + '...' : 'undefined');
console.log('DIRECT_URL valid format:', process.env.DIRECT_URL ? 
  (process.env.DIRECT_URL.startsWith('postgresql://') || 
   process.env.DIRECT_URL.startsWith('postgres://')) : false);

async function testConnection() {
  console.log('Khởi tạo Prisma Client với cả DATABASE_URL và DIRECT_URL...');
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('Attempting to connect to database...');
    // Thử kết nối bằng cách chạy một truy vấn đơn giản
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Connection successful!', result);
    
    // Thử đếm số lượng bản ghi trong bảng flashcards
    console.log('Đang đếm số lượng flashcards...');
    const count = await prisma.flashcards.count();
    console.log(`Found ${count} flashcards in database`);
  } catch (error) {
    console.error('Connection failed!');
    console.error('Error details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 