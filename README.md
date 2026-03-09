# Native App - Student Attendance Tracking System

A full-stack mobile application for educational institutions to manage and track student attendance using facial recognition.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native (Expo) + TypeScript |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT (JSON Web Tokens) |
| Security | bcryptjs password hashing |
| Routing | Expo Router (file-based) |
| State Management | React Context API |

---

## Project Structure

```
Native-app/
├── backend/                    # Express.js REST API
│   ├── config/
│   │   └── db.js               # MongoDB connection setup
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── AttendanceRecord.js
│   │   ├── AttendanceSummary.js
│   │   ├── ChatMessage.js
│   │   ├── Conversation.js
│   │   ├── Notification.js
│   │   └── Subject.js
│   ├── routes/                 # API route handlers
│   │   ├── auth.js
│   │   ├── attendance.js
│   │   ├── messages.js
│   │   └── notifications.js
│   ├── server.js               # Express app entry point
│   └── .env                    # Backend environment variables
│
└── myApp/                      # Expo React Native frontend
    ├── app/                    # File-based screens (Expo Router)
    │   ├── (tabs)/             # Tab navigator screens
    │   ├── sign-in.tsx
    │   ├── sign-up.tsx
    │   ├── dashboard.tsx
    │   ├── mark-attendance.tsx
    │   ├── face-capture.tsx
    │   ├── chat.tsx
    │   ├── messages.tsx
    │   ├── notifications.tsx
    │   ├── attendance-report.tsx
    │   ├── profile.tsx
    │   └── _layout.tsx
    ├── components/
    │   └── AppBottomNav.tsx    # Bottom navigation bar
    ├── context/
    │   └── AppContext.tsx      # Global state and API methods
    ├── services/
    │   └── api.ts              # Axios API client
    ├── hooks/                  # Custom React hooks
    ├── constants/              # Theme colors and constants
    ├── assets/                 # Images, icons, fonts
    ├── app.json                # Expo configuration
    └── .env                    # Frontend environment variables
```

---

## Features

### Authentication
- **Multiple login methods**: Email/password, College ID, and Phone number login
- **User registration** with full form validation (name, college ID, email, phone, password)
- **JWT-based sessions** with 7-day token expiration
- **Password security** with bcrypt hashing
- **Field-level validation** with real-time error messages
- **Password visibility toggle** on login screen
- **Auto-provisioning** — support conversation, welcome notification, and attendance summary created on signup

### Attendance Management
- **Mark attendance** with optional face photo capture
- **Clock-in / Clock-out** time recording
- **Daily hours tracking** with visual progress indicator
- **Attendance history** with date-based filtering
- **Attendance summary** — total classes, attended count, percentage
- **Subject / class tracking** with progress bars and completion status
- **In-progress and completed class views** on dashboard

### Face Recognition (Capture)
- **Front-facing camera** with guided oval frame overlay
- **Camera permission** handling with user-friendly prompts
- **Photo preview** before submission
- **Success confirmation** with badge animation
- **Retry capability** on failure or rejection
- Face photo URI stored per attendance record in the database

### Messaging
- **Conversations list** with last message preview, timestamps, and unread badge counts
- **Real-time chat UI** with sent/received message bubble styles
- **Keyboard-aware layout** that adjusts to the on-screen keyboard
- **Auto-scroll** to the latest message
- **Message read/unread** status tracking
- **Support conversation** auto-created on registration

### Notifications
- **Push-style in-app notifications** with title and body
- **Unread indicator** dots for unseen notifications
- **Tap-to-read** — marks notification as read on tap
- **Welcome notification** automatically sent to new users
- **Retry on error** for failed notification fetches

### Dashboard
- **User profile header** with name, college ID, and verified badge
- **Quick-access buttons** for messages and notifications with unread counts
- **Attendance summary card** showing overall stats
- **Subject progress grid** with color-coded status and progress bars
- **Empty state handling** for users with no classes loaded

### UI / UX
- **Consistent purple theme** (`#6439FF` primary color)
- **Bottom navigation bar** with tab-based routing
- **Loading indicators** and skeleton states on data fetch
- **Error states** with retry buttons
- **SafeAreaView** for notch and edge-to-edge support
- **Portrait-only orientation** lock
- **Native status bar** styling per screen

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/login-college` | Login with college ID |
| POST | `/api/auth/login-phone` | Login with phone number |
| POST | `/api/auth/logout` | Logout user |

### Attendance
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/attendance/mark` | Mark attendance (with optional face photo) |
| GET | `/api/attendance/summary` | Get attendance summary stats |
| GET | `/api/attendance/records` | Get attendance history |
| GET | `/api/attendance/subjects` | Get subject/class list |
| GET | `/api/attendance/today-hours` | Get today's tracked hours |

### Messages
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/messages/conversations` | List all conversations |
| GET | `/api/messages/conversations/:id/messages` | Get messages in a conversation |
| POST | `/api/messages/conversations/:id/messages` | Send a message |

### Notifications
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notifications` | Get all notifications for user |
| PATCH | `/api/notifications/:id/read` | Mark a notification as read |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- MongoDB Atlas account (or local MongoDB)
- Android/iOS device or emulator

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the server:

```bash
npm run dev       # development (nodemon)
npm start         # production
```

### Frontend Setup

```bash
cd myApp
npm install
```

Create a `.env` file in `myApp/`:

```env
EXPO_PUBLIC_API_URL=http://<your-local-ip>:3001
```

> Use your machine's local IP (e.g., `192.168.x.x`) instead of `localhost` when testing on a physical device.

Start Expo:

```bash
npx expo start
```

Scan the QR code with Expo Go (Android/iOS) or press `a` for Android emulator / `i` for iOS simulator.

---

## Database Models

| Model | Key Fields |
|---|---|
| `User` | collegeId, name, email, phone, passwordHash |
| `AttendanceRecord` | userId, date, clockIn, clockOut, hours, faceCaptured, facePhotoUri |
| `AttendanceSummary` | userId, total, attended, percentage |
| `Subject` | userId, name, time, status, progress |
| `Conversation` | userId, name, avatar |
| `ChatMessage` | conversationId, userId, text, read, createdAt |
| `Notification` | userId, title, body, read, createdAt |

---

## Future Features

### Planned Enhancements

#### Face Recognition (AI-Powered)
- [ ] On-device face detection and liveness check to prevent photo spoofing
- [ ] Face embedding matching — verify identity against enrolled photo
- [ ] Automatic attendance marking when a recognized face is detected

#### Real-Time Features
- [ ] WebSocket / Socket.IO integration for live chat messaging
- [ ] Real-time notifications via push (Expo Notifications)
- [ ] Live attendance feed for instructors

#### Instructor / Admin Panel
- [ ] Web-based admin dashboard for teachers and admins
- [ ] View attendance of all students per subject
- [ ] Manually override or correct attendance records
- [ ] Export attendance reports as PDF or CSV
- [ ] Manage subjects, schedules, and enrolled students

#### Geolocation Verification
- [ ] GPS-based attendance — only allow marking within campus boundary
- [ ] Location history logged per attendance record

#### QR Code Attendance
- [ ] Instructor generates a time-limited QR code per session
- [ ] Students scan QR to mark attendance (alternative to face capture)

#### Offline Support
- [ ] Cache attendance records and subjects locally with AsyncStorage
- [ ] Queue attendance marks when offline; sync when back online
- [ ] Offline-first architecture using local-first state

#### Analytics & Reporting
- [ ] Detailed per-subject attendance trend charts (line/bar graphs)
- [ ] Monthly/semester summary reports
- [ ] Low-attendance alerts with push notifications
- [ ] Shareable attendance report cards

#### Profile & Settings
- [ ] Profile photo upload and management
- [ ] Edit personal details (phone, email, password change)
- [ ] App theme selection (light/dark mode)
- [ ] Notification preferences and quiet hours

#### Security Improvements
- [ ] Refresh token rotation for extended secure sessions
- [ ] Two-factor authentication (OTP via SMS or email)
- [ ] Rate limiting on login endpoints to prevent brute force
- [ ] Account lockout after repeated failed login attempts

#### Accessibility
- [ ] Full screen reader support (ARIA roles)
- [ ] High-contrast mode
- [ ] Larger text and button size options
- [ ] Localization / multi-language support (i18n)

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Port for the Express server (default: 3001) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |

### Frontend (`myApp/.env`)

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_URL` | Base URL of the backend API |

---

## License

This project is for educational and personal use.
