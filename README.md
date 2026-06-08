<div align="center">

# ⚡ SwiftChat

**A real-time language exchange chat & video calling platform**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Stream](https://img.shields.io/badge/Stream-Chat%20%26%20Video-005FFF?logo=stream&logoColor=white)](https://getstream.io/)

SwiftChat is a full-stack social platform that connects language learners worldwide. Users can find partners who speak their target language natively, send friend requests, chat in real time, and jump into video calls — all in one seamless experience.

</div>

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Data Models](#-data-models)
- [API Reference](#-api-reference)
- [Frontend Routing](#-frontend-routing)
- [State & Data Flow](#-state--data-flow)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Contributing](#-contributing)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Secure JWT-based signup / login with HttpOnly cookies |
| 🧭 **Onboarding** | Profile setup with native language, learning language, bio & location |
| 🤝 **Friend System** | Discover users, send / accept / view friend requests |
| 💬 **Real-time Chat** | Powered by Stream Chat — persistent, fully-featured messaging |
| 📹 **Video Calls** | One-on-one video calling via Stream Video SDK |
| 🔔 **Notifications** | Incoming call modal and friend request notifications |
| 🌐 **Language Discovery** | Browse onboarded users filtered by language match |

---

## 🛠 Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express 5 |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs + HttpOnly Cookies |
| Real-time | Stream Chat (server SDK) |
| Dev Server | Nodemon |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Routing | React Router DOM v7 |
| Server State | TanStack React Query v5 |
| Client State | Zustand v5 |
| HTTP Client | Axios |
| Chat UI | stream-chat-react |
| Video UI | @stream-io/video-react-sdk |
| Notifications | react-hot-toast |

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                            │
│                                                                     │
│  ┌────────────────────┐          ┌──────────────────────────────┐  │
│  │   React 19 + Vite  │          │     Stream Chat React SDK    │  │
│  │   React Router v7  │◄────────►│   (real-time messaging UI)   │  │
│  │   TanStack Query   │          └──────────────────────────────┘  │
│  │   Zustand          │                                             │
│  └────────┬───────────┘          ┌──────────────────────────────┐  │
│           │  REST (Axios)         │  Stream Video React SDK      │  │
│           │  + HttpOnly Cookie    │  (video call UI & controls)  │  │
│           │                      └──────────────────────────────┘  │
└───────────┼──────────────────────────────────────────────────────── ┘
            │
            ▼ HTTP/REST
┌───────────────────────────────────────────────────────────────────┐
│                     BACKEND  (Express 5 / Node.js)                │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                        Middleware                         │    │
│  │     cors · morgan · express.json · cookie-parser         │    │
│  │              protectRoute (JWT verify)                    │    │
│  └──────────────────────┬───────────────────────────────────┘    │
│                         │                                         │
│         ┌───────────────┼───────────────┐                        │
│         ▼               ▼               ▼                        │
│  /api/auth        /api/users       /api/chat                     │
│  auth.route       user.route       chat.route                    │
│         │               │               │                        │
│         ▼               ▼               ▼                        │
│  auth.controller  user.controller  chat.controller               │
│         │               │               │                        │
│         └───────────────┼───────────────┘                        │
│                         │                                         │
│              ┌──────────┼──────────┐                             │
│              ▼          ▼          ▼                             │
│           User.js  FriendRequest  stream.js (Stream Server SDK)  │
│           (Mongoose)  (Mongoose)                                  │
└───────────────────────────────────────────────────────────────────┘
            │                               │
            ▼                               ▼
┌─────────────────────┐          ┌──────────────────────┐
│   MongoDB Atlas     │          │  Stream.io Platform   │
│  (Users, Friend     │          │  (Chat channels,      │
│   Requests)         │          │   Video calls,        │
└─────────────────────┘          │   User tokens)        │
                                 └──────────────────────┘
```

### How it works end-to-end

1. **Auth flow** — The client calls `/api/auth/signup` or `/api/auth/login`. The server validates credentials, hashes passwords with bcrypt, signs a JWT, and stores it in an HttpOnly cookie. The same user record is upserted into Stream so the user can participate in chat and video.

2. **Session persistence** — On every page load, React Query calls `/api/auth/me` using the stored cookie. The response drives all auth-gated rendering via the `useAuth` hook.

3. **Chat connection** — Once authenticated, `useStreamChat` fetches a short-lived Stream token from `/api/chat/token` and calls `streamClient.connectUser()`. The connection persists for the session lifetime (it is not disconnected on navigation, only on logout).

4. **Video calling** — `useStreamVideo` initialises a `StreamVideoClient` in parallel. The client is shared application-wide via `VideoClientContext`. `IncomingCallModal` subscribes to incoming call events and renders a modal anywhere in the app.

5. **Friend system** — All social graph endpoints (`/api/users/*`) are protected by `protectRoute`. The frontend uses TanStack Query for caching & automatic refetch, and react-hot-toast for success/error feedback.

---

## 📁 Project Structure

```
SwiftChat/
├── backend/                  # Express API server
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js   # signup, login, logout, onboarding
│   │   │   ├── user.controller.js   # friends & friend-request logic
│   │   │   └── chat.controller.js   # Stream token generation
│   │   ├── lib/
│   │   │   ├── db.js                # MongoDB connection (Mongoose)
│   │   │   └── stream.js            # StreamChat server client & helpers
│   │   ├── middleware/
│   │   │   └── auth.middleware.js   # JWT verification (protectRoute)
│   │   ├── models/
│   │   │   ├── User.js              # User schema + bcrypt hooks
│   │   │   └── FriendRequest.js     # FriendRequest schema
│   │   ├── routes/
│   │   │   ├── auth.route.js        # /api/auth/*
│   │   │   ├── user.route.js        # /api/users/*
│   │   │   └── chat.route.js        # /api/chat/*
│   │   ├── migrate.js               # One-off DB migration helper
│   │   └── server.js                # App entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/                 # React + TypeScript SPA
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   │   └── ProtectedRoute.tsx   # Route guard (auth + onboarding)
    │   │   ├── call/
    │   │   │   └── IncomingCallModal.tsx # Global incoming-call overlay
    │   │   ├── layout/
    │   │   │   ├── Layout.tsx           # Shell wrapper
    │   │   │   ├── Navbar.tsx           # Top navigation bar
    │   │   │   └── Sidebar.tsx          # Left sidebar (friends list)
    │   │   ├── notifications/           # Notification components
    │   │   └── users/
    │   │       └── FriendCard.tsx       # User / friend card
    │   ├── hooks/
    │   │   ├── useAuth.ts           # Auth user query (React Query)
    │   │   ├── useFriends.ts        # Friends & requests queries/mutations
    │   │   ├── useStreamChat.ts     # Stream Chat connection lifecycle
    │   │   └── useStreamVideo.ts    # Stream Video client lifecycle
    │   ├── lib/
    │   │   ├── axios.ts             # Axios instance (baseURL + credentials)
    │   │   ├── streamClient.ts      # Singleton StreamChat client
    │   │   └── videoContext.ts      # React context for StreamVideoClient
    │   ├── pages/
    │   │   ├── LandingPage.tsx      # Public marketing / splash page
    │   │   ├── SignupPage.tsx        # Registration form
    │   │   ├── LoginPage.tsx         # Login form
    │   │   ├── OnboardingPage.tsx    # Profile completion wizard
    │   │   ├── HomePage.tsx          # Recommended users feed
    │   │   ├── FriendsPage.tsx       # Friends list
    │   │   ├── NotificationsPage.tsx # Friend request notifications
    │   │   ├── ChatPage.tsx          # Stream Chat UI
    │   │   └── CallPage.tsx          # Stream Video call UI
    │   ├── types/                    # Shared TypeScript types
    │   ├── App.tsx                   # Root component + routing
    │   └── main.tsx                  # ReactDOM render entry
    ├── .env.example
    └── package.json
```

---

## 🗄 Data Models

### `User`
```js
{
  fullname:         String,  // required
  email:            String,  // required, unique
  password:         String,  // bcrypt-hashed, min 6 chars
  bio:              String,
  profilePic:       String,  // URL (defaults to ui-avatars.com)
  nativeLanguage:   String,
  learningLanguage: String,
  location:         String,
  isOnboarded:      Boolean, // false until onboarding form is completed
  friends:          [ObjectId → User],
  createdAt, updatedAt       // auto-timestamps
}
```

### `FriendRequest`
```js
{
  sender:    ObjectId → User,
  recipient: ObjectId → User,
  status:    String,  // 'pending' | 'accepted'
  createdAt, updatedAt
}
```

---

## 📡 API Reference

All routes are prefixed with `/api`. Protected routes require a valid JWT cookie.

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|--------|------|:----:|-------------|
| `POST` | `/signup` | ❌ | Register a new user |
| `POST` | `/login` | ❌ | Log in, receive JWT cookie |
| `POST` | `/logout` | ❌ | Clear JWT cookie |
| `POST` | `/onboarding` | ✅ | Complete profile setup |
| `GET`  | `/me` | ✅ | Get current authenticated user |

### Users — `/api/users` *(all protected)*

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/` | Get recommended users (onboarded, not yet friends) |
| `GET`  | `/friends` | Get current user's friend list |
| `POST` | `/friend-request/:id` | Send a friend request to user `id` |
| `PUT`  | `/friend-request/:id/accept` | Accept friend request `id` |
| `GET`  | `/friend-request` | Get incoming & accepted friend requests |
| `GET`  | `/outgoing-friend-request` | Get outgoing pending friend requests |

### Chat — `/api/chat` *(all protected)*

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/token` | Generate a short-lived Stream Chat/Video token |

---

## 🗺 Frontend Routing

| Path | Guard | Page |
|------|-------|------|
| `/` | Public | `LandingPage` |
| `/signup` | Public | `SignupPage` |
| `/login` | Public | `LoginPage` |
| `/onboarding` | Auth (not onboarded) | `OnboardingPage` |
| `/home` | Auth + Onboarded | `HomePage` |
| `/friends` | Auth + Onboarded | `FriendsPage` |
| `/notifications` | Auth + Onboarded | `NotificationsPage` |
| `/chat` | Auth + Onboarded | `ChatPage` |
| `/chat/:userId` | Auth + Onboarded | `ChatPage` (pre-selected user) |
| `/call/:callId` | Auth + Onboarded | `CallPage` |
| `*` | — | Redirect to `/` |

`ProtectedRoute` checks both `isAuthenticated` and `isOnboarded`. If not authenticated the user is sent to `/login`; if authenticated but not yet onboarded they are sent to `/onboarding`.

---

## 🔄 State & Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│  TanStack React Query (server state)                             │
│    queryKey: ['authUser']   → useAuth hook                       │
│    queryKey: ['friends']    → useFriends hook                    │
│    queryKey: ['friendReqs'] → useFriends hook                    │
│    queryKey: ['recUsers']   → HomePage                           │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  React Context (singleton clients)                               │
│    VideoClientContext  → StreamVideoClient instance              │
│    StreamVideo provider (from SDK, wraps routes when ready)      │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  Custom Hooks                                                     │
│    useAuth          — fetches & caches auth user                 │
│    useStreamChat    — manages StreamChat connection lifecycle     │
│    useStreamVideo   — initialises StreamVideoClient              │
│    useFriends       — friends list, requests, mutations          │
└──────────────────────────────────────────────────────────────────┘
```

**Key architectural decisions:**
- **Stream Chat client is a singleton** (`streamClient.ts`) — a single `StreamChat` instance is reused across the entire app to avoid duplicate WebSocket connections.
- **Video client is in React context** (`VideoClientContext`) — allows `IncomingCallModal` and `CallPage` to consume the same client regardless of mount order.
- **Chat connection survives navigation** — `useStreamChat` intentionally does NOT disconnect on unmount; it only disconnects when the user logs out (`authUser === null`).
- **TanStack Query for all REST data** — eliminates manual loading/error state, provides automatic background refetch, and handles deduplication.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```env
PORT=5001
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_here
STREAM_API_KEY=your_stream_api_key
STREAM_SECRET_KEY=your_stream_secret_key
NODE_ENV=development
```

### Frontend (`frontend/.env`)

```env
VITE_STREAM_API_KEY=your_stream_api_key
```

> **Note:** The `VITE_` prefix is required for Vite to expose the variable to the browser bundle. The Stream API key is public-safe; **never** expose `STREAM_SECRET_KEY` to the client.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB Atlas** account (or local MongoDB instance)
- **Stream.io** account — [getstream.io](https://getstream.io) (free tier available)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/SwiftChat.git
cd SwiftChat
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, STREAM_API_KEY, STREAM_SECRET_KEY
npm install
npm run dev          # starts on http://localhost:5001
```

### 3. Configure the frontend

```bash
cd ../frontend
cp .env.example .env
# Set VITE_STREAM_API_KEY
npm install
npm run dev          # starts on http://localhost:5173
```

### 4. Open the app

Navigate to **http://localhost:5173** in your browser.

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feat/my-feature`
3. **Commit** your changes: `git commit -m "feat: add my feature"`
4. **Push** to your branch: `git push origin feat/my-feature`
5. **Open** a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

<div align="center">

Built with ❤️ using React, Express, MongoDB & Stream

</div>
