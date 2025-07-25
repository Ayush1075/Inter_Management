# Frontend README

## Overview
This is the frontend for the Intern Management System. It is built with React, Vite, and Tailwind CSS. It provides dashboards for admins and interns, document upload, and resume analysis features.

## Folder Structure
- `src/`
  - `App.jsx` - Main app component, sets up routing
  - `main.jsx` - Entry point, wraps app in router and auth context
  - `api/` - (Reserved for API utilities)
  - `assets/` - Static images and logos
  - `components/` - Reusable UI components (modals, cards, tables, etc.)
  - `context/` - React context for authentication and protected routes
  - `pages/`
    - `dashboards/`
      - `AdminDashboard.jsx` - Admin/HR dashboard with user, batch, and document management
      - `InternUpload.jsx` - Intern upload page for submitting resumes
    - `Login.jsx` - Login page for all users
  - `utils/` - Utility functions (e.g., setAuthToken)

## Key Functionalities
- **Routing:** Uses `react-router-dom` for navigation and protected routes
- **Authentication Context:** Manages user state, login/logout, and role-based access
- **Admin Dashboard:**
  - View all users, batches, and uploaded documents
  - View, download, and delete resumes
  - See parsed resume summaries and suggested roles
  - Responsive, modern UI with Tailwind CSS
- **Intern Upload Page:**
  - Simple, protected page for interns to upload resumes
  - Shows upload status and logout option
- **Document View & Analysis:**
  - Admins can view resumes in a split panel (PDF preview + summary)
  - Summarized skills, projects, and suggested role shown for each document

## How to Run
1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. The frontend runs on `http://localhost:5173` by default

## Notes
- API requests are proxied to the backend via Vite config
- Auth token is stored in localStorage and sent with all requests
- UI is fully responsive and modern 