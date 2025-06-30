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

## Testing 🧪

The project includes comprehensive test suites with excellent coverage:
- **Backend**: 90%+ coverage (78 E2E tests) - **E2E only, no unit tests**
- **Frontend**: 85%+ coverage (191 tests across components, hooks, and utilities)

All commands can be run from the project root:

## API + UI Testing Commands
```bash
# 🎯 All Tests
npm run test                   # Run all tests (API + Frontend)
```

### API Testing Commands

```bash
# 🎯 E2E Tests (Only Backend Testing Method)
npm run test:api:e2e           # E2E tests with detailed output 
npm run test:api:e2e:cov       # E2E tests with coverage report 

```

### Frontend Testing Commands

```bash
# 🧪 All Tests (Recommended)
npm run test:frontend          # All frontend tests with watch mode

# 🎯 Specific Test Execution
npm test ComponentName.test.tsx -- --watchAll=false     # Single test file
npm test src/components/__tests__/ -- --watchAll=false  # Component tests only
npm test src/hooks/__tests__/ -- --watchAll=false       # Hook tests only
npm test src/utils/__tests__/ -- --watchAll=false       # Utility tests only

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
npm run test:frontend         # Frontend tests (191 tests, 85%+ coverage)
npm run test:api:e2e          # Backend E2E tests (78 tests, 90%+ coverage)
npm run test:api:e2e:cov      # Backend E2E tests with coverage report
npm run test:api:watch        # Backend tests in watch mode

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
npm run test:api:e2e          # Backend E2E tests only
npm run test:frontend         # Frontend tests only
```

## Architecture & Quality

- **Repository Pattern**: Clean architecture with proper separation of concerns
- **Comprehensive Testing**: 90%+ backend coverage, 85%+ frontend coverage
  - **Backend**: 78 E2E tests (90%+ coverage) - No unit tests
  - **Frontend**: 191 tests covering components, hooks, utils (85%+ coverage)
- **Type Safety**: Full TypeScript implementation
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Data Persistence**: JSON-based storage with proper error handling
