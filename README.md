# 🎬 YouTube Clone - Backend

This is the **backend API** for the YouTube Clone application.

It provides endpoints for **user authentication, video management, comments, likes/dislikes, channels, and playlists**.

---

## 🚀 Features

- 👤 **User Authentication** – register, login, JWT-based authentication
- 🎥 **Video Management** – upload, update, delete, and fetch videos
- 🎞 **Channel Management** – create, edit, delete channels
- 💬 **Comment System** – add and fetch comments for videos
- 🔔 **Subscribe to Channels**
- 🔍 **Search** videos by title or description
- 🗄 **MongoDB Integration** using Mongoose
- ⚡ **CORS enabled** for frontend-backend communication

---

## 🛠 Tech Stack

- **Node.js & Express.js** – Backend server
- **MongoDB & Mongoose** – Database & ODM
- **JWT** – Authentication
- **bcryptjs** – Password hashing
- **Multer** – File uploads (video thumbnails & videos)
- **dotenv** – Environment variables
- **cors** – Cross-Origin requests support
- **nodemon** – Development server auto-restart

---

## 📂 Folder Structure (Recommended)

```
youtube_clone_backend/
├── controllers/          # Route handlers (auth, videos, comments, etc.)
├── models/               # Mongoose schemas (User, Video, Comment, Channel)
├── routes/               # Express routes
├── middlewares/          # Auth & error handling middlewares
├── config/              # For Database configurations
├── server.js             # Entry point of the server
├── package.json
├── .env                  # Environment variables
└── README.md

```

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/rahulagarawal7/youtube_clone_backend_node
cd youtube_clone_backend

```

### 2️⃣ Install dependencies

```bash
npm install

```

### 3️⃣ Configure environment variables

Create a `.env`  file in the root of the project:
`.env` - for Uat 
`.env.production` - for production
```
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key

```

4️⃣ Start the Server
-- Development

Runs with nodemon (auto-restarts on file changes) using .env.

```
npm run dev

```

-- UAT (User Acceptance Testing)
Runs with node using .env.

```
npm run start:uat

```

-- Production
Runs with node using .env.production.

```
npm run start:prod

```


> Server runs at: http://localhost:5000 (or your specified PORT)
> 

## 📡 API Endpoints

### Auth

- **POST /api/auth/register** → Register a new user
- **POST /api/auth/login** → Login and receive JWT token
- **POST /api/auth/logout** → Logout user
- **GET /api/auth/** → Get current logged-in user (protected)

---

### Videos

- **GET /api/videos** → Fetch all videos
- **POST /api/videos** → Upload new video (protected)
- **GET /api/videos/channel** → Get videos of logged-in user’s channel (protected)
- **PUT /api/videos/:id** → Update video (protected)
- **DELETE /api/videos/:id** → Delete video (protected)
- **GET /api/videos/:id** → Get video by ID
- **GET /api/videos/category/:category** → Get videos by category
- **GET /api/videos/search/:query** → Search videos by query
- **GET /api/videos/like/:id** → Like a video
- **GET /api/videos/dislike/:id** → Dislike a video

---

### Comments

- **GET /api/comments/:videoId** → Get all comments for a video
- **POST /api/comments/:videoId** → Add a comment to a video (protected)
- **PUT /api/comments/:commentId** → Edit a comment (protected)
- **DELETE /api/comments/:commentId** → Delete a comment (protected)

---

### Channels

- **GET /api/channels** → Get all channels
- **POST /api/channels** → Create a new channel (protected)
- **GET /api/channels/:id** → Get channel by ID (protected)
- **PUT /api/channels/:id** → Update channel (protected)
- **POST /api/channels/:channelId/subscribe** → Subscribe/Unsubscribe to channel (protected)



