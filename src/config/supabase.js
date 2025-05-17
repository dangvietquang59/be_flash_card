const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Kiểm tra biến môi trường
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Cung cấp giá trị mặc định để tránh lỗi
const defaultUrl = 'https://kggqkbxjkknqfgrfagwn.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZ3FrYnhqa2tucWZncmZhZ3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MzU4OTMsImV4cCI6MjA2MTQxMTg5M30.BmVbVVLv6CzQ3g52YNtFGZujU3rpiXORuUIWqNImYlg';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables.');
  console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY.');
  console.error('Using default values for now, but you should set these in your .env file.');
}

// Khởi tạo Supabase client với giá trị từ môi trường hoặc giá trị mặc định
const supabase = createClient(supabaseUrl || defaultUrl, supabaseKey || defaultKey);

module.exports = supabase; 