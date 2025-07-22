# Internship Management System

This project is a full-stack internship management system built with the MERN stack (MongoDB, Express, React, Node.js) and includes role-based access control.

## Project Structure

```
/
├── frontend/         # React Vite Frontend
│   ├── src/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── dashboards/
│   │   │       └── AdminDashboard.jsx
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Modal.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/          # Express Backend
│   ├── routes/
│   │   ├── auth.js
│   │   └── users.js
│   ├── models/
│   │   ├── User.js
│   │   └── Batch.js
│   ├── seed/
│   │   └── seed.js
│   ├── .env
│   └── package.json
└── README.md
```

## Features

- **Authentication:** JWT-based authentication with bcrypt for password hashing.
- **Role-Based Access Control (RBAC):**
  - **CEO/HR:** Can create and delete user credentials for any role.
  - **Mentor:** Can view interns in their assigned batch.
  - **Intern:** Can view their assigned mentor.
- **User Management:** Admins can perform CRUD operations on users.
- **Batching:** Interns and Mentors are grouped by `batchId`.

## Technologies Used

- **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Axios, `react-hook-form`
- **Backend:** Node.js, Express, MongoDB (with Mongoose)
- **Authentication:** JWT, bcryptjs

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd internship-management-system
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Set up environment variables:**
    - In the `backend` directory, create a `.env` file.
    - Add the following variables:
      ```
      MONGO_URI=<your_mongodb_connection_string>
      JWT_SECRET=<your_jwt_secret>
      ```

### Running the Application

1.  **Seed the database:**
    - Open a terminal in the `backend` directory.
    - Run the seed script to populate the database with initial data.
    ```bash
    npm run seed
    ```

2.  **Start the backend server:**
    ```bash
    npm start
    ```
    The backend will be running at `http://localhost:5000`.

3.  **Start the frontend development server:**
    - Open a new terminal in the `frontend` directory.
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

## Available Scripts

### Backend

- `npm start`: Starts the production server.
- `npm run dev`: Starts the development server with Nodemon.
- `npm run seed`: Seeds the database with initial data.

### Frontend

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Previews the production build. 