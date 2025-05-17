-- Create flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
  stt SERIAL PRIMARY KEY,
  word TEXT NOT NULL,
  pinyin TEXT NOT NULL,
  meaning TEXT NOT NULL,
  example_chinese TEXT,
  example_pinyin TEXT,
  example_meaning TEXT,
  level INTEGER NOT NULL
);

-- Create indexes for faster searching
CREATE INDEX IF NOT EXISTS idx_flashcards_word ON flashcards (word);
CREATE INDEX IF NOT EXISTS idx_flashcards_meaning ON flashcards (meaning);
CREATE INDEX IF NOT EXISTS idx_flashcards_level ON flashcards (level);

-- Example data for testing
INSERT INTO flashcards (word, pinyin, meaning, example_chinese, example_pinyin, example_meaning, level)
VALUES 
  ('你好', 'nǐ hǎo', 'Hello', '你好，你今天好吗？', 'nǐ hǎo, nǐ jīntiān hǎo ma?', 'Hello, how are you today?', 1),
  ('谢谢', 'xiè xiè', 'Thank you', '谢谢你的帮助', 'xiè xiè nǐ de bāngzhù', 'Thank you for your help', 1),
  ('学习', 'xué xí', 'To study', '我每天学习中文', 'wǒ měitiān xué xí zhōngwén', 'I study Chinese every day', 2); 