# React Native TODO Application

A full-stack React Native TODO application with a Node.js and Redis backend.

## Features
- Add, edit, and delete TODO items
- Persistent storage using Redis
- REST API integration
- Real-time UI updates using component state

## Tech Stack
- Frontend: React Native, JavaScript (ES6)
- Backend: Node.js, Express
- Database: Redis

## API Endpoints
- GET /load – Load TODO items
- POST /save – Save TODO items
- GET /clear – Clear TODO list

## How to Run the Project

### Backend
```bash
cd backend
npm install
npm start

### Frontend
cd frontend
npm install
npm start
