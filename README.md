# Mini Social Media — Backend

A RESTful API for a social media application built with **Node.js**, **Express**, and **MongoDB**.

## Features

- User authentication (Signup & Login) with JWT
- Create posts with text, images, or both
- Public feed with sorting (newest, most liked, most commented)
- Like/unlike posts
- Comment on posts
- Image upload via Multer
- Self-ping keep-alive (every 5 minutes)

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Express.js | Web framework |
| MongoDB + Mongoose | Database & ODM |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password hashing |
| Multer | Image uploads |

## Setup

### Prerequisites
- Node.js v18+
- MongoDB running locally or a MongoDB Atlas URI

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/minisocialmedia
JWT_SECRET=your_secret_key
SERVER_URL=http://localhost:5000
```

### Run

```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register a new user | No |
| POST | `/api/auth/login` | Login & get token | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Posts
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/posts` | Get all posts | No |
| POST | `/api/posts` | Create a post | Yes |
| PUT | `/api/posts/:id/like` | Toggle like on a post | Yes |
| POST | `/api/posts/:id/comment` | Add a comment | Yes |

**Query Params for GET /api/posts:**
- `?sort=mostLiked` — Sort by most likes
- `?sort=mostCommented` — Sort by most comments

## Project Structure

```
server/
├── index.js            # App entry point
├── .env                # Environment variables
├── models/
│   ├── User.js         # User schema
│   └── Post.js         # Post schema (with comments)
├── routes/
│   ├── auth.js         # Auth routes
│   └── posts.js        # Post routes
├── middleware/
│   └── auth.js         # JWT middleware
└── uploads/            # Uploaded images
```

## MongoDB Collections

- **users** — username, email, password (hashed), avatar
- **posts** — user (ref), text, image, likes[], comments[]
