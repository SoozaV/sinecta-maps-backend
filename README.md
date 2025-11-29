# 🗺️ Sinecta Maps Backend

REST API for geographic polygon management with Fastify, PostgreSQL + PostGIS, and TypeScript.

## ⚡ Tech Stack

- **Framework**: Fastify 5.6.2
- **ORM**: Sequelize 6.27.0
- **Database**: PostgreSQL with PostGIS extension
- **Language**: TypeScript 5.3.3
- **Documentation**: Swagger/OpenAPI (available at `/docs`)

## ✨ Features

- ✅ REST API for geographic polygon management
- ✅ Optimized for performance (connection pooling, spatial indexes)
- ✅ Input validation with JSON Schema (TypeBox)
- ✅ Abuse protection (rate limiting, API key)
- ✅ Strict TypeScript types

### API Protection

This API is protected with:
- Rate limiting: 100 GET/min, 10 POST/min, 5 DELETE/min per IP
- API key required for POST/DELETE (X-API-Key header)
- CORS restricted to frontend domain
- Input validation with JSON Schema (TypeBox)
- Body size limit: 1MB
- Maximum 100 polygons per GET request

For portfolio/demo purposes, API key is available in environment variables.

## 📖 Documentation

The API includes interactive auto-generated documentation with Swagger/OpenAPI:

- **Swagger UI**: `http://localhost:3000/docs`
- **OpenAPI JSON**: `http://localhost:3000/docs/json`

You can test endpoints directly from the Swagger interface.

## ⚙️ Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

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

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start development server
npm start

# Build for production
npm run build
```

## 🔌 Endpoints

- `GET /` - Health check
- `GET /ping` - Ping endpoint
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /api/polygons` - Get all polygons (max 100)
- `POST /api/polygons` - Create new polygon (requires API key)
- `DELETE /api/polygons/:id` - Delete polygon by ID (requires API key)

## 📁 Project Structure

```
src/
├── routes/          # HTTP routes (Fastify handlers)
├── repositories/    # Data access logic
├── models/          # Sequelize models
├── services/        # Helper services (Response, etc.)
├── middleware/      # Custom middleware (API key, etc.)
├── database/        # DB config and migrations
└── utils/           # Utilities and custom errors
```

## ⚡ Performance

- Connection pooling configured (max: 10, min: 2)
- GiST spatial indexes for fast geospatial queries
- Input validation before processing
- Optimized for <2s response time on POST requests

## 🚀 Deployment

Designed to deploy on platforms like Render, Railway, or Fly.io, connected to Supabase or Neon for PostgreSQL + PostGIS.

## 💡 Credits

Inspired by [test-nsi](https://github.com/wahyuade/test-nsi), evolved with a completely different tech stack (Fastify, TypeBox, Swagger, etc.).

## 📝 License

ISC

---

Built with ❤️ using Fastify, TypeScript, and PostgreSQL
