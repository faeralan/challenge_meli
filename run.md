# MercadoLibre Challenge Project - How to Run

## Prerequisites

- Node.js v16 or higher
- npm (included with Node.js)

## Quick Start

### Option 1: Single Command (Recommended) ⭐

1. **Install all dependencies**:
```bash
npm run install:all
```

2. **Run the entire project** (frontend + backend):
```bash
npm run dev
```

This will automatically run:
- Backend on: http://localhost:3000
- Frontend on: http://localhost:3001  
- API Documentation on: http://localhost:3000/api

### Option 2: Manual Execution (alternative)

1. **Install Backend dependencies**:
```bash
cd api
npm install
```

2. **Install Frontend dependencies**:
```bash
cd ../frontend
npm install
```

3. **Run Backend** (terminal 1):
```bash
cd api
npm run start:dev
```

4. **Run Frontend** (terminal 2):
```bash
cd frontend
npm start
```

## Verify Functionality

1. **Backend**: Visit http://localhost:3000/api to see Swagger documentation
2. **Frontend**: Visit http://localhost:3001 to see the React application


## Important URLs

- **Frontend Application**: http://localhost:3001
- **Backend API**: http://localhost:3000/api
- **API Documentation**: http://localhost:3000/api
- **Sample Product Page**: http://localhost:3001/product/MLA123456789


## Available Commands

With the configured `package.json`, you have these useful commands:

```bash
# Development (recommended)
npm run dev                    # Run frontend + backend in development mode

# Installation
npm run install:all           # Install dependencies for entire project

# Testing  
npm run test                  # Run tests for frontend + backend
npm run test:api:cov          # Backend tests with coverage

# Production
npm run build                 # Build frontend for production
npm run start                 # Run everything in production mode

# Cleanup
npm run clean                 # Clean all node_modules and builds
```

## Individual Scripts

If you prefer to run projects separately:

```bash
npm run dev:api               # Backend only in development
npm run dev:frontend          # Frontend only in development
npm run test:api              # Backend tests only
npm run test:frontend         # Frontend tests only
```