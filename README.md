# Hostel Grievance System

A full-stack hostel grievance management system with student, worker, and admin portals for filing complaints, tracking progress, publishing announcements, and managing hostel maintenance workflows.

## Overview

This project includes:
- `backend/` — Node.js + Express API with MongoDB support and JWT authentication
- `frontend/` — React + Vite SPA with role-based portals for students, workers, and admins

The app supports:
- student complaint submission for LAN, civil, and electrical issues
- worker complaint assignment, status updates, and resolution tracking
- admin announcement management and full complaint visibility
- secure login and protected routes for each role

## Features

- Role-based login: student, worker, admin
- JWT authentication with protected frontend routes
- Complaint creation, tracking, update, and rating
- Auto-assignment of workers by department for mock/demo mode
- Announcement posting for admin and viewing by students
- Student profile and password change support
- Frontend state stored in `localStorage`

## 🎥 Demo Video
[Watch Demo](https://youtu.be/TULJ8LyNVBs)

## 📸 Screenshots
<img width="1366" height="768" alt="Screenshot (25)" src="https://github.com/user-attachments/assets/9be96fbe-3d1c-42aa-be29-da9a35b8dcf0" />
<img width="1366" height="768" alt="Screenshot (26)" src="https://github.com/user-attachments/assets/7e6fb92b-76f5-464c-90d1-3cb49d8d490c" />
<img width="1366" height="768" alt="Screenshot (27)" src="https://github.com/user-attachments/assets/3d536ef4-3c4f-4632-95be-510a3453f6fe" />
<img width="1366" height="768" alt="Screenshot (28)" src="https://github.com/user-attachments/assets/2fe54002-5fca-4b1a-ab09-2ab8ae00da6e" />
<img width="1366" height="768" alt="Screenshot (29)" src="https://github.com/user-attachments/assets/6c20226f-308f-4fed-a87c-d66638050b77" />
<img width="1366" height="768" alt="Screenshot (30)" src="https://github.com/user-attachments/assets/596e6d88-370b-4a18-8ee3-99847d12ca55" />

## Tech Stack

- Backend: Node.js, Express, Mongoose, MongoDB
- Frontend: React, Vite, React Router
- Auth: JWT, bcrypt / bcryptjs
- HTTP: CORS
- Dev: nodemon

## Project structure

- `backend/`
  - `server.js` — Express server entrypoint
  - `db.js` — MongoDB connection and mock fallback logic
  - `routes/` — auth, complaints, announcements APIs
  - `models/` — User, Complaint, Announcement schemas
  - `middleware/` — JWT auth and role authorization
  - `mockUsers.js` — demo users for development without DB

- `frontend/`
  - `src/` — React app source
  - `src/Login/` — login and homepage
  - `src/portals/student/` — student dashboard, complaint forms, profile
  - `src/portals/worker/` — worker complaint handling
  - `src/portals/admin/` — admin dashboard
  - `src/utils/` — API and auth helpers

## Installation

### Backend

```bash
cd backend
npm install
