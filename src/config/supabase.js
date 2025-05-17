const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Kiểm tra biến môi trường
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Log biến môi trường (ẩn thông tin nhạy cảm)
console.log('Supabase environment check:');
console.log('SUPABASE_URL set:', !!supabaseUrl);
console.log('SUPABASE_ANON_KEY set:', !!supabaseKey);

// Cung cấp giá trị mặc định để tránh lỗi
const defaultUrl = 'https://kggqkbxjkknqfgrfagwn.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZ3FrYnhqa2tucWZncmZhZ3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MzU4OTMsImV4cCI6MjA2MTQxMTg5M30.BmVbVVLv6CzQ3g52YNtFGZujU3rpiXORuUIWqNImYlg';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables.');
  console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY.');
  console.error('Using default values for now, but you should set these in your .env file.');
}

// Khởi tạo Supabase client với options cần thiết
const supabase = createClient(
  supabaseUrl || defaultUrl, 
  supabaseKey || defaultKey,
  {
    auth: {
      persistSession: false, // Tắt lưu session vì đây là server
      autoRefreshToken: false // Tắt tự động refresh token
    }
  }
);

// Kiểm tra trạng thái auth
(async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log('Supabase auth check error:', error.message);
    } else {
      console.log('Supabase auth check:', data.session ? 'Has session' : 'No session (using anonymous auth)');
    }
  } catch (e) {
    console.log('Supabase auth check failed:', e.message);
  }
})();

module.exports = supabase; 