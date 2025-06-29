# Challenge MercadoLibre

Prototipo de una página de detalle de ítem inspirada en MercadoLibre, con API backend completa.

## 🏗️ Arquitectura del Proyecto

- **Backend**: API RESTful construida con NestJS + TypeScript
- **Frontend**: Aplicación React + TypeScript + Styled Components
- **Base de datos**: Archivos JSON locales (como especificado en el challenge)

## 📋 Prerrequisitos

- Node.js v16 o superior
- npm o yarn

## 🚀 Instalación y Ejecución

### Opción 1: Ejecución rápida (Recomendado) ⭐

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd challenge_meli

# 2. Instalar todas las dependencias
npm run install:all

# 3. Ejecutar todo el proyecto (frontend + backend)
npm run dev
```

¡Eso es todo! Con estos 3 comandos tendrás el proyecto completo funcionando.

### Opción 2: Ejecución manual

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd challenge_meli

# 2. Configurar el Backend
cd api
npm install

# 3. Configurar el Frontend  
cd ../frontend
npm install

# 4. Ejecutar aplicaciones
# Terminal 1 - Backend (Puerto 3000)
cd api
npm run start:dev

# Terminal 2 - Frontend (Puerto 3001)  
cd frontend
npm start
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000  
- **Documentación API**: http://localhost:3000/api

## 🎯 Comandos principales

```bash
# Instalar todo
npm run install:all

# Ejecutar todo (desarrollo)  
npm run dev

# Ejecutar tests
npm run test

# Ver cobertura de tests
npm run test:api:cov
```

## 📚 Documentación de la API

### Autenticación

#### Registrar usuario
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "vendedor@ejemplo.com",
  "password": "password123",
  "name": "TechStore Premium",
  "location": "Capital Federal, Buenos Aires",
  "isVerified": true
}
```

#### Iniciar sesión
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "vendedor@ejemplo.com",
  "password": "password123"
}
```

### Productos

#### Listar todos los productos
```bash
GET /api/products
```

#### Obtener producto por ID
```bash
GET /api/products/MLA123456789
```

#### Crear producto (requiere autenticación)
```bash
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "MLA999888777",
  "title": "iPhone 14 Pro Max 256GB Space Black",
  "description": "iPhone 14 Pro Max con 256GB de almacenamiento...",
  "price": 850000,
  "images": ["image1.jpg", "image2.jpg"],
  "mainImage": "image1.jpg",
  "stock": 10,
  "condition": "new",
  "category": "Electronics",
  "brand": "Apple",
  "model": "iPhone 14 Pro Max",
  "rating": 4.5,
  "totalReviews": 150,
  "enabledPaymentMethods": ["mercadopago", "credit_card", "debit_card"],
  "freeShipping": true,
  "warranty": "12 meses de garantía oficial"
}
```

#### Métodos de pago disponibles
```bash
GET /api/products/payment-methods
```

## 🎨 Características del Frontend

### Página de Detalle del Producto

- ✅ **Galería de imágenes**: Navegación entre múltiples imágenes con thumbnails
- ✅ **Información del producto**: Título, descripción, precio, rating
- ✅ **Información del vendedor**: Reputación, ubicación, ventas
- ✅ **Métodos de pago**: Lista de opciones de pago disponibles
- ✅ **Características**: Envío gratis, garantía, condición
- ✅ **Selector de cantidad**: Con validación de stock
- ✅ **Diseño responsivo**: Adaptado a móviles y desktop
- ✅ **Estilo MercadoLibre**: Colores y diseño inspirado en la plataforma

### Header

- ✅ **Barra de búsqueda**: Funcional (preparada para búsquedas)
- ✅ **Menú de usuario**: Dropdown con opciones
- ✅ **Carrito de compras**: Icono de acceso rápido
- ✅ **Autenticación**: Botones de login/registro
- ✅ **Responsive**: Adaptado a dispositivos móviles

## 🧪 Testing

### Backend
```bash
cd api

# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura de código
npm run test:cov
```

**Cobertura actual**: 82.8% (supera el 80% requerido)

## 📁 Estructura del Proyecto

```
challenge_meli/
├── api/                    # Backend NestJS
│   ├── src/
│   │   ├── auth/          # Autenticación
│   │   ├── products/      # Gestión de productos
│   │   ├── users/         # Gestión de usuarios
│   │   └── ...
│   ├── data/              # Archivos JSON de datos
│   ├── test/              # Tests
│   └── ...
├── frontend/              # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # Servicios API
│   │   ├── styles/        # Estilos globales
│   │   ├── types/         # Tipos TypeScript
│   │   └── ...
│   └── ...
└── README.md
```

## 🛠️ Stack Tecnológico

### Backend
- **NestJS**: Framework Node.js
- **TypeScript**: Tipado estático
- **JWT**: Autenticación
- **bcrypt**: Encriptación de contraseñas
- **class-validator**: Validación de DTOs
- **Swagger**: Documentación automática

### Frontend
- **React**: Biblioteca de interfaz de usuario
- **TypeScript**: Tipado estático
- **Styled Components**: CSS-in-JS
- **React Router**: Navegación
- **Axios**: Cliente HTTP
- **Lucide React**: Iconos

## 🎯 Funcionalidades Completadas

### Requisitos del Challenge

- ✅ **Página de detalle del ítem**: Completa con todas las características
- ✅ **API RESTful**: Endpoints para productos y autenticación
- ✅ **Diseño responsive**: Adaptado a diferentes dispositivos
- ✅ **Estilo MercadoLibre**: Colores, tipografías y layout similares
- ✅ **Manejo de errores**: Tratamiento adecuado de errores
- ✅ **Documentación**: README y documentación de API
- ✅ **Cobertura de tests**: >80% de cobertura de código

### Funcionalidades Extra

- 🔐 **Sistema de autenticación**: Login/registro completo
- 📱 **Header funcional**: Con búsqueda y menús
- 🎨 **Componentes reutilizables**: Biblioteca de componentes
- 📊 **Estado global**: Context API para autenticación
- 🔄 **Interceptores HTTP**: Manejo automático de tokens

## 🚧 Próximos Pasos

- [ ] Página de login/registro
- [ ] Lista de productos principales  
- [ ] Funcionalidad de búsqueda
- [ ] Carrito de compras
- [ ] Perfil de usuario
- [ ] Gestión de productos para vendedores

## 📝 Notas de Desarrollo

### Decisiones de Diseño

1. **Arquitectura separada**: Frontend y backend independientes para escalabilidad
2. **TypeScript**: Usado en ambos lados para mayor robustez
3. **Styled Components**: Para un CSS más mantenible y temático
4. **Context API**: Para manejo de estado de autenticación
5. **Interceptores HTTP**: Para manejo automático de autenticación
6. **Components responsivos**: Mobile-first approach

### Desafíos Resueltos

1. **Autenticación JWT**: Implementación completa con refresh automático
2. **Galería de imágenes**: Navegación fluida entre múltiples imágenes
3. **Diseño responsive**: Adaptación a diferentes tamaños de pantalla
4. **Tipado TypeScript**: Interfaces compartidas entre frontend y backend
5. **Testing**: Cobertura alta manteniendo funcionalidad

## 🤝 Contribución

Este proyecto fue desarrollado como parte del Challenge MercadoLibre, demostrando capacidades en:
- Desarrollo full-stack con tecnologías modernas
- Diseño de APIs RESTful
- Interfaces de usuario complejas
- Testing y documentación
- Arquitectura escalable
