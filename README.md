# Node.js Authentication API

A robust and secure authentication API built with Node.js, Express, and MongoDB. The API provides endpoints for user registration, login, profile retrieval, and secure session management using JSON Web Tokens (JWT) and HTTP-only cookies.

## Features
- **User Authentication**: Secure signup and login workflows.
- **Session Management**: Session tracking stored in the database. Supports standard logouts and a multi-device logout (logout all).
- **JWT & HTTP-Only Cookies**: Issues short-lived access tokens and longer-lived refresh tokens stored as HTTP-only, secure cookies to prevent XSS. 
- **Hash Security**: Passwords are mathematically shielded using `bcrypt` triggered natively via Mongoose `pre('save')` hooks. Refresh tokens are also individually hashed and secured.
- **Modular Codebase**: Clean MVC (Model-View-Controller) architecture, isolating utilities like token generation to keep the core controllers lean.

## Authentication Security (Tokens & Sessions)

This project strictly utilizes the **Access Token & Refresh Token pair strategy** to provide both high-end security and an uninterrupted user experience.

### 1. The Access Token (Short-lived)
- Provides stateless access to the API. In this project, it is purposefully configured for a short lifespan (`15m`).
- Returned directly in the JSON response payload of authentication actions (such as `/login`, `/register`, and `/refresh-token`).
- Must be attached by the client application to the `Authorization: Bearer <token>` header to access protected routes (e.g., `/api/v1/auth/get-me`).

### 2. The Refresh Token (Long-lived & Protected)
- Allows a continuous login experience without prompting the user to re-type their password constantly (e.g., `15d` validity).
- Sent exclusively to the user's browser as an **HTTP-only, Secure cookie** rather than standard JSON.
- By being an HTTP-only cookie, malicious scripts (XSS attacks) cannot access or steal the token from the browser.

### 3. Database Session Tracking
- Every time a refresh token is issued, a `bcrypt` hashed version of it is deliberately recorded in MongoDB under the `Session` model.
- Upon requesting `/refresh-token`, the backend strictly cross-references the cookie with the database to verify the session has not been flagged as `revoked: true`.
- If valid, a brand new Access Token and a brand new Refresh Token are systematically created and rotated back to the user.

## Tech Stack
- **Node.js & Express.js**: Backend framework and JS environment.
- **MongoDB & Mongoose**: NoSQL database and Object Data Modeling (ODM) library.
- **JSON Web Tokens (JWT)**: Used for tokenized stateless authentication and payload verification.
- **Swagger UI**: Dynamic, interactive graphical API documentation natively served!
- **Gmail OAuth2 & Nodemailer**: High-deliverability robust email services mapped for secure OTPs.
- **bcrypt**: Industry standard password, abstract refresh token, and OTP encryption.
- **cookie-parser**: Parse and securely transmit cookies required for the auth workflows.

## Project Structure

```text
├── config/
│   ├── config.js          # Centralized environment checks
│   ├── swagger.js         # OpenAPI 3.0 specification generator
│   └── db.js              # MongoDB connection utility
├── controllers/
│   └── auth.controller.js # Logic for auth, session tracking, and email validation
├── models/
│   ├── otp.model.js       # Temporary Expirable OTP Database Tracking
│   ├── session.model.js   # Multi-device Session Tracking & revocation
│   └── user.models.js     # User schema equipped with auto password hashing hooks
├── routes/
│   └── auth.routes.js     # Express routers annotated natively with Swagger JSDoc
├── service/
│   └── email.service.js   # OAuth2 Gmail robust transporter module
├── utils/
│   ├── otp_generate.js    # Math engine and graphical HTML email template compiler
│   └── token.utils.js     # Centralized helper logic for JWT generation
├── .env                   # Environment variables (Google secrets, Mongo URI, etc)
├── app.js                 # Express bootstrapper (mounting /api-docs and /api/v1/auth)
└── server.js              # Physical entry point listening instance
```

## Setup & Installation

1. Navigate to the project directory:
   ```bash
   cd node_auth
   ```

2. Install the necessary dependencies (defined in `package.json`):
   ```bash
   npm install
   ```

3. Create the configuration variables file:
   Specify all `.env` attributes, including Gmail OAuth tokens, at the root directory:
   ```env
   PORT=7511
   MONGO_URI=mongodb://localhost:27017 # Your MongoDB connection string
   DB_NAME=node_auth
   JWT_SECRET=your_super_secret_jwt_key
   
   # Gmail Developer Application API Credentials natively for OTPs
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REFRESH_TOKEN=your_google_refresh_token
   GOOGLE_USER=your-email@gmail.com
   ```

4. Start the server (Development mode using `nodemon`):
   ```bash
   npm run dev
   ```
   > You will see a log stating `Server is running at port : 7511 and url is http://localhost:7511`

## API Endpoints & Usage

All authentication API paths are prefixed with `/api/v1/auth`. 

> **⭐️ Interactive API Documentation**: When running locally, visit **[http://localhost:7511/api-docs](http://localhost:7511/api-docs)** to visually test identically formatted endpoints smoothly.

### 1. Register User
- **Method**: `POST`
- **Path**: `/register`
- **Description**: Registers the user and actively physically dispatches a **6-digit OTP code dynamically via Gmail OAuth2**. Initiates standard session payloads natively.
- **Body**:
  ```json
  {
      "username": "johndoe",
      "email": "john@example.com",
      "password": "securepassword123"
  }
  ```

### 2. Verify Email OTP
- **Method**: `POST`
- **Path**: `/verify-email`
- **Description**: Mathematically checks incoming generic OTP codes against the database. Automatically unlocks the associated user logically if validated natively.
- **Body**:
  ```json
  {
      "email": "john@example.com",
      "otp": "123456"
  }
  ```

### 3. Login User
- **Method**: `POST`
- **Path**: `/login`
- **Description**: Authenticates an effectively verified user seamlessly mapping fresh physical tokens dynamically. Fails if profile isn't verified via email initially!

### 4. Get Current User Profile
- **Method**: `GET`
- **Path**: `/get-me`
- **Description**: Fetches user details (excluding password!).
- **Security Check**: Requires an Authorization header starting with `Bearer <access_token>`.

### 5. Get Active Sessions
- **Method**: `GET`
- **Path**: `/sessions`
- **Description**: Retrieves an organized array exclusively listing physically active devices natively. Securely exposes critical IP and User Agent footprints!
- **Security Check**: Requires an Authorization header starting with `Bearer <access_token>`.

### 6. Refresh Token
- **Method**: `GET`
- **Path**: `/refresh-token`
- **Description**: Mints a fresh, unexpired access token seamlessly. Relies heavily exclusively on the valid `refresh_token` securely mapped automatically inside HTTP-only cookies.

### 7. Logout
- **Method**: `POST`
- **Path**: `/logout`
- **Description**: Logs out the explicit active physical device seamlessly updating database variables specifically (`revoked = true`) correctly!

### 8. Logout All
- **Method**: `POST`
- **Path**: `/logout-all`
- **Description**: Ultra High-security endpoint! Automatically effectively iterates exclusively mapping every associated specific session realistically and natively revokes them universally.
