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
