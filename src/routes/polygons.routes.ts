import { FastifyPluginAsync } from 'fastify';
import { Type } from '@sinclair/typebox';
import { validateApiKey } from '../middleware/api-key';
import { Polygon } from '../repositories';
import Response from '../services/Response';
import { NotFoundError, BadRequestError } from '../utils/errors';
import {
  CreatePolygonBody,
  CreatePolygonBodyType,
  CreatePolygonResponse,
  GetPolygonsResponse,
  DeletePolygonResponse,
  ErrorResponse,
} from '../schemas/polygon.schema';

// ============================================
// Polygon Router for Fastify
// ============================================

const polygonRouter: FastifyPluginAsync = async (fastify) => {
  // ============================================
  // GET /api/polygons - Get All Polygons
  // ============================================
  fastify.get(
    '/polygons',
    {
      schema: {
        description: 'Get all polygons (maximum 100)',
        tags: ['Polygons'],
        response: {
          200: GetPolygonsResponse,
          500: ErrorResponse,
        },
      },
      config: {
        rateLimit: {
          max: 100,
          timeWindow: '1 minute'
        }
      }
    },
    async (request, reply) => {
      const response = new Response();
      
      request.log.info('GET /polygons request');

      try {
        const polygons = await Polygon.getAllPolygons();
        
        response.setData(polygons);
        response.setMessage("Polygons loaded successfully");
        
        request.log.info({
          count: polygons.features?.length || 0,
        }, 'Polygons retrieved successfully');

        return reply.code(200).send(response);
      } catch (error: any) {
        request.log.error({
          err: error,
        }, 'Error fetching polygons');

        throw error;
      }
    }
  );

  // ============================================
  // POST /api/polygons - Create Polygon
  // ============================================
  fastify.post<{ Body: CreatePolygonBodyType }>(
    '/polygons',
    {
      schema: {
        description: 'Create a new polygon (GeoJSON Feature with Polygon geometry)',
        tags: ['Polygons'],
        security: [{ apiKey: [] }],
        body: CreatePolygonBody,
        response: {
          201: CreatePolygonResponse,
          400: ErrorResponse,
          401: ErrorResponse,
          500: ErrorResponse,
        },
      },
      preHandler: validateApiKey,
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 minute'
        }
      }
    },
    async (request, reply) => {
      const response = new Response();
      
      request.log.info({
        polygonId: request.body.id,
        hasGeometry: !!request.body.geometry,
      }, 'POST /polygons request');

      try {
        // Validación adicional de coordenadas
        const coordinates = request.body.geometry.coordinates[0];
        if (!coordinates || coordinates.length < 4) {
          return reply.status(400).send({
            error: 'Bad Request',
            message: 'Polygon must have at least 4 coordinates (closed ring)',
            statusCode: 400,
          });
        }

        // Verificar que el polígono esté cerrado (primer y último punto iguales)
        const first = coordinates[0];
        const last = coordinates[coordinates.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
          return reply.status(400).send({
            error: 'Bad Request',
            message: 'Polygon ring must be closed (first and last coordinates must be equal)',
            statusCode: 400,
          });
        }

        const polygon = await Polygon.addPolygon(request.body);
        
        response.setData(polygon);
        response.setMessage("Polygon created successfully");
        
        request.log.info({
          polygonId: polygon.id,
        }, 'Polygon created successfully');

        return reply.code(201).send(response);
      } catch (error: any) {
        request.log.error({
          err: error,
          polygonId: request.body.id,
        }, 'Error creating polygon');

        // Manejar errores de validación de Sequelize
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          return reply.status(400).send({
            error: 'Bad Request',
            message: error.message || 'Invalid polygon data',
            statusCode: 400,
          });
        }

        // Re-throw para que el error handler global lo maneje
        throw error;
      }
    }
  );

  // ============================================
  // DELETE /api/polygons/:id - Delete Polygon
  // ============================================
  fastify.delete<{ Params: { id: string } }>(
    '/polygons/:id',
    {
      schema: {
        description: 'Delete a polygon by ID',
        tags: ['Polygons'],
        security: [{ apiKey: [] }],
        params: Type.Object({
          id: Type.String({ description: 'Polygon ID', minLength: 1 }),
        }),
        response: {
          200: DeletePolygonResponse,
          401: ErrorResponse,
          404: ErrorResponse,
          500: ErrorResponse,
        },
      },
      preHandler: validateApiKey,
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute'
        }
      }
    },
    async (request, reply) => {
      const response = new Response();
      const { id } = request.params;

      request.log.info({
        polygonId: id,
      }, 'DELETE /polygons/:id request');

      try {
        // Validar que el ID no esté vacío
        if (!id || id.trim().length === 0) {
          return reply.status(400).send({
            error: 'Bad Request',
            message: 'Polygon ID is required',
            statusCode: 400,
          });
        }

        const deleted = await Polygon.deletePolygon(id.trim());

        response.setData(deleted);
        response.setMessage("Polygon deleted successfully");
        
        request.log.info({
          polygonId: id,
          deletedCount: deleted,
        }, 'Polygon deleted successfully');

        return reply.code(200).send(response);
      } catch (error: any) {
        request.log.error({
          err: error,
          polygonId: id,
        }, 'Error deleting polygon');

        // Manejar NotFoundError del repository
        if (error instanceof NotFoundError) {
          return reply.status(404).send({
            error: 'Not Found',
            message: error.message,
            statusCode: 404,
          });
        }

        // Manejar errores de formato de ID
        if (error.name === 'CastError' || error.message?.includes('Invalid')) {
          return reply.status(400).send({
            error: 'Bad Request',
            message: 'Invalid polygon ID format',
            statusCode: 400,
          });
        }

        throw error;
      }
    }
  );
};

export default polygonRouter;
