# MercadoLibre Challenge - Product API

A RESTful API built with NestJS for managing products and user authentication, simulating a MercadoLibre marketplace.

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd challenge_meli/api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy the example environment file and configure your variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
   
   # Application Configuration  
   PORT=3000
   NODE_ENV=development
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

The API will be available at: `http://localhost:3000`

## 📚 API Documentation

Once the application is running, you can access the interactive Swagger documentation at:

```
http://localhost:3000/api
```

This provides a comprehensive overview of all available endpoints, request/response schemas, and allows you to test the API directly from the browser.

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

## 💳 Payment Methods - Hardcode

The system supports the following payment methods:

- **MercadoPago**: Up to 12 installments
- **Credit Card**: Up to 6 installments (Visa, Mastercard, American Express)
- **Debit Card**: 1 installment (immediate payment)
- **Bank Transfer**: 1 installment
- **Cash**: 1 installment (pay on pickup)

## 📁 Data Storage

The application uses JSON files for data persistence:

- `data/users.json` - User information (passwords are encrypted)
- `data/products.json` - Product catalog

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```
