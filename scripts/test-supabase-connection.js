// Load biến môi trường từ các file khác nhau theo thứ tự ưu tiên
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Nạp từ .env mặc định
dotenv.config();

// Nạp từ .env.local nếu tồn tại (ưu tiên cao hơn)
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log('Loading environment variables from .env.local');
  const envConfig = dotenv.parse(fs.readFileSync(envLocalPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

console.log('--------- Environment Check ---------');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set ✅' : 'Not set ❌');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Set ✅' : 'Not set ❌');

// Nếu biến môi trường không được đặt, hãy đặt chúng với giá trị mặc định
if (!process.env.SUPABASE_URL) {
  console.log('Setting default SUPABASE_URL');
  process.env.SUPABASE_URL = 'https://kggqkbxjkknqfgrfagwn.supabase.co';
}

if (!process.env.SUPABASE_ANON_KEY) {
  console.log('Setting default SUPABASE_ANON_KEY');
  process.env.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZ3FrYnhqa2tucWZncmZhZ3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MzU4OTMsImV4cCI6MjA2MTQxMTg5M30.BmVbVVLv6CzQ3g52YNtFGZujU3rpiXORuUIWqNImYlg';
}

// Tạo Supabase client
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Cấu hình tên bảng đúng
const TABLE_NAME = 'chinese_language';

async function testSupabaseConnection() {
  try {
    console.log('Attempting to connect to Supabase...');
    
    // Thử kết nối bằng cách lấy dữ liệu từ bảng
    const { data, error, count } = await supabase
      .from(TABLE_NAME)
      .select('*', { count: 'exact' });
    
    if (error) throw error;
    
    console.log('✅ Connection successful!');
    console.log(`✅ Found ${data.length} records in table ${TABLE_NAME}`);
    if (data.length > 0) {
      console.log('Sample data:');
      console.table(data.slice(0, 2).map(item => ({
        stt: item.stt,
        word: item.word,
        pinyin: item.pinyin,
        meaning: item.meaning,
        level: item.level
      })));
    } else {
      console.log('No data found in the table. You may need to add some data.');
    }
  } catch (error) {
    console.error('❌ Supabase connection failed!');
    console.error('Error details:', error);
  }
}

testSupabaseConnection(); 