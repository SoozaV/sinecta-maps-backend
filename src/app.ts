import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import routes from './routes/polygons.routes';

async function buildApp() {
  const fastify = Fastify({ 
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
    },
    bodyLimit: 1024 * 1024, // 1MB
    ajv: {
      customOptions: {
        removeAdditional: 'all', // Remove additional properties not in schema
        coerceTypes: true,       // Coerce types (e.g., string to number)
        useDefaults: true,       // Use default values from schema
      },
    },
  }).withTypeProvider<TypeBoxTypeProvider>();

  // Rate limiting global
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    keyGenerator: (request) => request.ip
  });

  // CORS
  await fastify.register(cors, {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-API-Key'],
  });

  // ============================================
  // OpenAPI/Swagger Configuration
  // ============================================
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Sinecta Maps API',
        description: 'API for managing geographic polygons with PostGIS',
        version: '1.0.0',
      },
      servers: [
        {
          url: process.env.API_URL || 'http://localhost:3000',
          description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          apiKey: {
            type: 'apiKey',
            name: 'X-API-Key',
            in: 'header',
            description: 'API key for protected endpoints',
          },
        },
      },
      tags: [
        { name: 'Polygons', description: 'Geographic polygon management endpoints' },
      ],
    },
  });

  await fastify.register(fastifySwaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });

  // Health checks
  fastify.get('/', async () => ({ status: 'ok' }));
  fastify.get('/ping', async () => ({ message: 'pong' }));

  // Routes
  await fastify.register(routes, { prefix: '/api' });

  // ============================================
  // Error Handler
  // ============================================
  fastify.setErrorHandler((error: any, request: any, reply: any) => {
    const statusCode = error.statusCode || 500;

    if (process.env.NODE_ENV === 'development') {
      console.error(`🔴 ERROR: ${request.method} ${request.url} - ${statusCode}`);
      console.error(`   Message: ${error.message}`);
      if (error.stack) {
        console.error(`   Stack: ${error.stack}`);
      }
    } else {
      // Production: use structured logging
      console.error(JSON.stringify({
        error: error.message,
        statusCode,
        url: request.url,
        method: request.method,
      }));
    }

    reply.status(statusCode).send({
      error: error.name || 'Error',
      message: error.message || 'Internal server error',
      statusCode,
    });
  });

  // ============================================
  // Not Found Handler
  // ============================================
  fastify.setNotFoundHandler((request: any, reply: any) => {
    reply.status(404).send({
      error: 'Not Found',
      message: `Route ${request.method}:${request.url} not found`,
      statusCode: 404,
    });
  });

  return fastify;
}

export default buildApp;
