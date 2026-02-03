# devHelp - Team Management Platform

A comprehensive project and task management platform built for companies and teams.

## Features

- **Team Management**: Manage team members and their roles
- **Company Management**: Super Admin can manage multiple companies
- **Authentication**: Secure JWT-based authentication with refresh tokens
- **Role-Based Access**: Admin, Member, and Super Admin roles
- **Modern UI**: Clean emerald green theme with responsive design

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Inversify (Dependency Injection)
- Clean Architecture

### Frontend
- React + TypeScript
- Vite
- TanStack Query (React Query)
- Zustand (State Management)
- Tailwind CSS
- React Router

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or connection string)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd devhelp
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables

**Backend** - Create `backend/.env`:
```env
PORT=3001
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/devHelp
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
FRONTEND_URL=http://localhost:5173
SUPER_ADMIN_EMAIL=admin@devhelp.com
SUPER_ADMIN_PASSWORD=your-password
```

**Frontend** - Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

5. Seed Super Admin (backend)
```bash
cd backend
npm run seed:superadmin
```

6. Run the application

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`
The backend API will be available at `http://localhost:3001`

## Project Structure

```
devhelp/
├── backend/
│   ├── src/
│   │   ├── core/           # Domain layer
│   │   ├── infra/          # Infrastructure layer
│   │   └── shared/         # Shared utilities
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/            # API calls
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # State management
│   │   └── utils/          # Utilities
│   └── package.json
└── README.md
```

## Default Credentials

**Super Admin:**
- Email: admin@devhelp.com
- Password: (set in .env SUPER_ADMIN_PASSWORD)

## License

MIT
