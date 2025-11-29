# sinecta-maps-backend
Backend for Sinecta Maps App (Fastify, Sequelize, PostgreSQL, PostGIS)

## Stack Tecnológico

- **Framework**: Fastify 5.6.2
- **ORM**: Sequelize 6.27.0
- **Base de Datos**: PostgreSQL con extensión PostGIS
- **Lenguaje**: TypeScript 5.3.3
- **Documentación**: Swagger/OpenAPI (disponible en `/docs`)

## Características

- ✅ API REST para gestión de polígonos geográficos
- ✅ Optimizado para performance (pool de conexiones, índices espaciales)
- ✅ Validación de entrada con JSON Schema
- ✅ Protección contra abuso (rate limiting, API key)
- ✅ TypeScript con tipos estrictos

### API Protection

This API is protected with:
- Rate limiting: 100 GET/min, 10 POST/min, 5 DELETE/min per IP
- API key required for POST/DELETE (X-API-Key header)
- CORS restricted to frontend domain
- Input validation with JSON Schema (TypeBox)
- Body size limit: 1MB
- Maximum 100 polygons per GET request

For portfolio/demo purposes, API key is available in environment variables.

## Documentación

La API incluye documentación interactiva generada automáticamente con Swagger/OpenAPI:

- **Swagger UI**: `http://localhost:3000/docs`
- **OpenAPI JSON**: `http://localhost:3000/docs/json`

Puedes probar los endpoints directamente desde la interfaz de Swagger.

## Configuración

### Variables de Entorno

Copia `.env.example` a `.env` y configura las siguientes variables:

```env
# Database
DB_HOST=your-database-host
DB_DATABASE=your-database-name
DB_USER=your-database-user
DB_PASS=your-database-password
DB_PORT=5432

# Server
PORT=3000
NODE_ENV=production

# API Protection
API_KEY=your-api-key-here
FRONTEND_URL=https://your-frontend-url.com

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm start
```

## Build

```bash
npm run build
```

## Endpoints

- `GET /` - Health check
- `GET /ping` - Ping endpoint
- `GET /docs` - Documentación interactiva de la API (Swagger UI)
- `GET /api/polygons` - Obtener todos los polígonos (máximo 100)
- `POST /api/polygons` - Crear nuevo polígono (requiere API key)
- `DELETE /api/polygons/:id` - Eliminar polígono por ID (requiere API key)

## Estructura del Proyecto

```
src/
├── routes/          # Rutas HTTP (handlers Fastify)
├── repositories/    # Lógica de acceso a datos
├── models/          # Modelos Sequelize
├── services/        # Servicios auxiliares (Response, etc.)
├── middleware/      # Middleware personalizado (API key, etc.)
├── database/        # Configuración de BD y migraciones
└── utils/           # Utilidades y errores personalizados
```

## Performance

- Pool de conexiones configurado (max: 10, min: 2)
- Índices espaciales GiST para consultas geoespaciales rápidas
- Validación previa de entrada para evitar procesamiento innecesario
- Optimizado para respuesta < 2 segundos en POST requests

## Deployment

Este backend está diseñado para desplegarse en plataformas como Render, Railway, o Fly.io, conectado a Supabase o Neon para PostgreSQL + PostGIS.

## Licencia

ISC
