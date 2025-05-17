// Load các biến môi trường từ các file khác nhau theo thứ tự ưu tiên
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Nạp từ .env mặc định
dotenv.config();

// Nạp từ .env.local nếu tồn tại (ưu tiên cao hơn)
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envLocalPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

// Tiếp tục với các import khác
const express = require('express');
const cors = require('cors');
const flashcardRoutes = require('./routes/flashcards');

const app = express();
const PORT = process.env.PORT || 3000;

// Log environment info (sanitized)
console.log('Environment information:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL starts with:', process.env.DATABASE_URL ? 
  process.env.DATABASE_URL.substring(0, 15) + '...' : 'undefined');
console.log('DATABASE_URL format valid:', process.env.DATABASE_URL ? 
  (process.env.DATABASE_URL.startsWith('postgresql://') || 
   process.env.DATABASE_URL.startsWith('postgres://')) : false);
console.log('SUPABASE_URL set:', !!process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY set:', !!process.env.SUPABASE_ANON_KEY);

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
    databaseConnected: !!process.env.DATABASE_URL,
    databaseUrlValid: process.env.DATABASE_URL ? 
      (process.env.DATABASE_URL.startsWith('postgresql://') || 
       process.env.DATABASE_URL.startsWith('postgres://')) : false,
    supabaseConfigured: !!process.env.SUPABASE_URL && !!process.env.SUPABASE_ANON_KEY
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