# The Aan Story Backend

Production-ready Express, MongoDB Atlas, Firebase Google login support, AWS S3, JWT, and Razorpay backend.

## Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Copy `.env.example` to `.env` and fill MongoDB Atlas, Firebase Admin, Razorpay, and AWS S3 values.

3. Start locally:

```bash
npm run dev
```

## Google Authentication Flow

The frontend starts Google Sign-In with Firebase Authentication, receives a Firebase ID token, and sends that token to the backend.

```http
POST /api/auth/google
```

The backend verifies the Firebase ID token with Firebase Admin SDK, finds or creates the MongoDB user, preserves the stored role, and returns an HTTP-only JWT session cookie.

## Security

The API includes Helmet, CORS, rate limiting, Mongo sanitize, HPP protection, HTTP-only JWT cookie support, bearer token auth, Joi validation, and role middleware.
