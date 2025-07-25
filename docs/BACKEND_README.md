# Backend README

## Overview
This is the backend for the Intern Management System. It is built with Node.js, Express, and MongoDB. It handles authentication, user and batch management, document uploads, and resume summarization.

## Folder Structure
- `index.js` - Main entry point, sets up Express, MongoDB connection, and routes.
- `models/` - Mongoose models:
  - `User.js` - User schema (interns, mentors, HR, CEO)
  - `Batch.js` - Batch schema
  - `Document.js` - Uploaded document schema, including parsed summary fields
- `routes/` - Express route handlers:
  - `auth.js` - Login/authentication endpoints
  - `users.js` - User CRUD, document upload, document listing, download, and delete
  - `batches.js` - Batch CRUD
- `middleware/` - Custom middleware:
  - `auth.js` - Auth and admin role checks
- `seed/` - Database seeding script
- `uploads/` - Uploaded files (PDF resumes, etc.)

## Key Functionalities
- **Authentication:** JWT-based login for all users. Role-based access control (INTERN, MENTOR, HR, CEO).
- **User Management:** Admins can create, update, and delete users. Interns can only upload documents.
- **Batch Management:** Admins can create and manage batches, assign users to batches.
- **Document Upload:** Interns upload PDF resumes via `/api/users/upload-document`. Files are stored in `uploads/` and metadata in MongoDB.
- **Document Listing & Download:** Admins/HR can list all uploaded documents, view parsed summaries, and download files.
- **Document Deletion:** Admins/HR can delete documents, which removes both the file and the DB record.
- **Resume Summarization:** On upload, resumes are parsed (PDF), and skills, projects, and a suggested role are extracted and saved for admin review.

## How to Run
1. Install dependencies: `npm install`
2. Set up your `.env` with MongoDB URI and JWT secret.
3. Start the server: `npm run dev` (or `npm start`)
4. The backend runs on `http://localhost:5000` by default.

## Environment Variables
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing

## Notes
- All API endpoints are under `/api/`
- File uploads are handled with `multer`
- Resume parsing uses `pdf-parse` and simple regex for demo purposes 