# Chinese Flashcard Backend

Backend service for a Chinese flashcard application using Express.js and Prisma ORM with Supabase PostgreSQL.

## Features

- Get all flashcards
- Get flashcard by ID
- Search flashcards by word or meaning
- Filter flashcards by level

## Database Schema

The database has a single table `flashcards` with the following structure:

| Column          | Type    | Description                 |
|-----------------|---------|----------------------------|
| stt             | SERIAL  | Primary key                |
| word            | TEXT    | Chinese word               |
| pinyin          | TEXT    | Pinyin pronunciation       |
| meaning         | TEXT    | Word meaning               |
| example_chinese | TEXT    | Example sentence in Chinese|
| example_pinyin  | TEXT    | Pinyin for example sentence|
| example_meaning | TEXT    | Meaning of example sentence|
| level           | INTEGER | Difficulty level           |

## Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd be_chinese_flashcard
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure Environment Variables**

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.kggqkbxjkknqfgrfagwn.supabase.co:5432/postgres"
```

Lưu ý quan trọng: Đảm bảo mã hóa URL bất kỳ ký tự đặc biệt nào trong mật khẩu (ví dụ, @ thành %40).

4. **Setup Database and Prisma**

```bash
# Generate Prisma client
npx prisma generate

# If you need to make changes to the schema
npx prisma migrate dev

# Explore your database with Prisma Studio
npx prisma studio
```

5. **Database Structure**

The Prisma schema is defined in `prisma/schema.prisma`. You can use the SQL in `database/schema.sql` to seed your database with initial data.

## Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## Docker Deployment

1. **Build and run with Docker Compose**

```bash
docker-compose up -d
```

2. **Stop Docker services**

```bash
docker-compose down
```

## API Endpoints

- `GET /api/flashcards` - Get all flashcards
  - `GET /api/flashcards?level=1` - Filter flashcards by level
  - `GET /api/flashcards?query=hello` - Search flashcards by word or meaning
  - `GET /api/flashcards?level=1&query=hello` - Combined filtering and searching
- `GET /api/flashcards/:id` - Get flashcard by ID 