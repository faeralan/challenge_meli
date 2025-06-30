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

### API Testing Commands

```bash
# 🎯 E2E Tests (Recommended - Main test suite)
npm run test:api:e2e           # E2E tests with detailed output
npm run test:api:e2e:cov       # E2E tests with coverage report

# ⚡ Unit Tests  
npm run test:api               # Quick unit tests
npm run test:api:cov           # Unit tests with coverage

# 🔄 Development
npm run test:api:watch         # Tests in watch mode (re-run on changes)

# 🎯 All Tests
npm run test                   # Run all tests (API + Frontend)
npm run test:frontend          # Frontend tests only
```

### Frontend Testing Commands

```bash
# 🧪 All Tests (Recommended)
npm run test:frontend          # All frontend tests with watch mode
npm test                       # Quick execution (from frontend/)

# 🎯 Specific Test Execution
npm test ComponentName.test.tsx -- --watchAll=false     # Single test file
npm test src/components/__tests__/ -- --watchAll=false  # Component tests only
npm test src/hooks/__tests__/ -- --watchAll=false       # Hook tests only
npm test src/utils/__tests__/ -- --watchAll=false       # Utility tests only

```


## Important URLs

- **Frontend Application**: http://localhost:3001
- **Backend API**: http://localhost:3000/api
- **API Documentation**: http://localhost:3000/api
- **Sample Product Page**: http://localhost:3001/product/MLA123456789
