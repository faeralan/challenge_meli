# MercadoLibre Challenge Project - How to Run

## Prerequisites

- Node.js v16 or higher
- npm (included with Node.js)
- Docker (for redis)

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

## API
**Environment Setup**
   
Copy the example environment file and configure your variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration

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

## FRONTEND
**Environment Setup**
   
Copy the example environment file and configure your variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration

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

## Cache Operations

### Automatic Caching
- `GET /products` - Cached for 5 minutes
- `GET /products/:id` - Cached for 10 minutes per product

### Cache Invalidation
- **Create Product**: Invalidates all products cache
- **Update Product**: Invalidates specific product and all products cache
- **Delete Product**: Invalidates specific product and all products cache

## Testing Cache

1. Start Redis server
2. Start the API
3. Make a GET request to `/products`
4. Check logs for "Products retrieved from database"
5. Make the same request again
6. Check logs for "Products retrieved from cache"

## Performance Benefits

- **Reduced Database Load**: Frequent queries served from memory
- **Faster Response Times**: Redis retrieval is significantly faster than JSON file reads
- **Scalability**: Better handling of concurrent requests

## Monitoring

Monitor cache performance using Redis CLI:

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