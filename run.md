# MercadoLibre Challenge Project - How to Run

## Prerequisites

- Node.js v16 or higher
- npm (included with Node.js)
- Docker (for redis)

## Quick Start

1. Clone the repository:

```bash
git clone https://github.com/faeralan/challenge_meli
cd challenge_meli
```

2. API and Frontend

**Environment Setup**
   
   Copy the example environment file and configure your variables:
```bash
cd api/
cp .env.example .env

cd ../frontend/
cp .env.example .env
```

Edit the `.env` file with your configuration

### Option 1: Single Command (Recommended) ⭐

1. **Install all dependencies**:
```bash
npm run install:all
```

2. **Run the entire project** (frontend + backend):
```bash
npm run dev
```

3. ## Redis Installation

### Using Docker
```bash
docker run -d --name redis -p 6379:6379 redis:latest
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

## 🔐 Authentication Flow

### Step-by-Step Guide to Create and Manage Products

#### 1. Register a New User
**POST** `/api/auth/register`

#### 2. Login
**POST** `/api/auth/login`

## 🔐 Protected Endpoints

#### 1. Create a Product (Requires Authentication)
**POST** `/api/products`

#### 2. Update Product (Requires Authentication)
**PATCH** `/api/products/MLA999888777`

#### 3. Delete Product (Requires Authentication)
**DELETE** `/api/products/MLA999888777`

## 📁 Data Storage

The application uses JSON files for data persistence:

- `data/users.json` - User information (passwords are encrypted)
- `data/products.json` - Product catalog


## Important URLs

- **Frontend Application**: http://localhost:3001
- **Backend API**: http://localhost:3000/api
- **API Documentation**: http://localhost:3000/api
- **Sample Product Page**: http://localhost:3001/product/MLA123456789

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

## Monitoring cache using Redis CLI

```bash
redis-cli monitor
```

Check cache keys:
```bash
redis-cli keys "*"
```

Check memory usage:
```bash
redis-cli info memory
``` 