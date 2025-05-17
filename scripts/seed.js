// Load biến môi trường
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Tạo Supabase client
console.log('Khởi tạo Supabase client...');
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://kggqkbxjkknqfgrfagwn.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZ3FrYnhqa2tucWZncmZhZ3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MzU4OTMsImV4cCI6MjA2MTQxMTg5M30.BmVbVVLv6CzQ3g52YNtFGZujU3rpiXORuUIWqNImYlg'
);

// Cấu hình tên bảng đúng
const TABLE_NAME = 'chinese_language';

// Dữ liệu mẫu để thêm vào bảng
const sampleData = [
  {
    word: '你好',
    pinyin: 'nǐ hǎo',
    meaning: 'Hello',
    example_chinese: '你好，你今天好吗？',
    example_pinyin: 'nǐ hǎo, nǐ jīntiān hǎo ma?',
    example_meaning: 'Hello, how are you today?',
    level: 1
  },
  {
    word: '谢谢',
    pinyin: 'xiè xiè',
    meaning: 'Thank you',
    example_chinese: '谢谢你的帮助',
    example_pinyin: 'xiè xiè nǐ de bāngzhù',
    example_meaning: 'Thank you for your help',
    level: 1
  },
  {
    word: '学习',
    pinyin: 'xué xí',
    meaning: 'To study',
    example_chinese: '我每天学习中文',
    example_pinyin: 'wǒ měitiān xué xí zhōngwén',
    example_meaning: 'I study Chinese every day',
    level: 2
  }
];

async function seedDatabase() {
  try {
    console.log(`Bắt đầu thêm dữ liệu mẫu vào bảng ${TABLE_NAME}...`);
    
    // Kiểm tra xem bảng có tồn tại chưa
    const { data: existingTable, error: tableError } = await supabase
      .from(TABLE_NAME)
      .select('count')
      .limit(1);
    
    if (tableError) {
      if (tableError.code === 'PGRST116') {
        console.log(`Bảng ${TABLE_NAME} chưa tồn tại. Đang kiểm tra...`);
        
        // Trong trường hợp bảng không tồn tại, bạn không thể tạo bảng bằng RPC
        // Hiển thị hướng dẫn cho người dùng tạo bảng qua Supabase Dashboard
        console.error('Bảng không tồn tại. Vui lòng tạo bảng qua Supabase Dashboard:');
        console.error('1. Đăng nhập vào Supabase: https://app.supabase.com');
        console.error('2. Chọn dự án của bạn');
        console.error('3. Vào mục "Table Editor"');
        console.error('4. Nhấn "New Table" và tạo bảng chinese_language với các cột:');
        console.error('   - stt: integer, primary key, identity');
        console.error('   - word: text, not null');
        console.error('   - pinyin: text, not null');
        console.error('   - meaning: text, not null');
        console.error('   - example_chinese: text');
        console.error('   - example_pinyin: text');
        console.error('   - example_meaning: text');
        console.error('   - level: integer, not null');
        return;
      } else {
        console.error('Lỗi khi kiểm tra bảng:', tableError);
        return;
      }
    }
    
    // Kiểm tra dữ liệu hiện có
    const { data: existingData, error: checkError } = await supabase
      .from(TABLE_NAME)
      .select('word');
    
    if (checkError) {
      console.error('Lỗi khi kiểm tra dữ liệu hiện có:', checkError);
      return;
    }
    
    // Nếu bảng đã có dữ liệu, không thêm nữa
    if (existingData && existingData.length > 0) {
      console.log(`Bảng đã có ${existingData.length} bản ghi. Không cần thêm dữ liệu mẫu.`);
    } else {
      // Thêm dữ liệu mẫu vì bảng đang trống
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert(sampleData);
      
      if (error) {
        console.error('Lỗi khi thêm dữ liệu:', error);
        return;
      }
      
      console.log('✅ Đã thêm dữ liệu mẫu thành công!');
    }
    
    // Kiểm tra dữ liệu đã thêm
    const { data: records, error: selectError } = await supabase
      .from(TABLE_NAME)
      .select('*');
    
    if (selectError) {
      console.error('Lỗi khi lấy dữ liệu:', selectError);
      return;
    }
    
    console.log(`Bảng ${TABLE_NAME} hiện có ${records.length} bản ghi:`);
    console.table(records.map(item => ({
      stt: item.stt,
      word: item.word,
      pinyin: item.pinyin,
      meaning: item.meaning,
      level: item.level
    })));
    
  } catch (error) {
    console.error('Lỗi không xác định:', error);
  }
}

seedDatabase(); 