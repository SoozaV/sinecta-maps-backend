import { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError } from '../utils/errors';

// ============================================
// API Key Middleware
// ============================================
export async function validateApiKey(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Solo para POST/DELETE
  if (['POST', 'DELETE'].includes(request.method)) {
    const apiKey = request.headers['x-api-key'];
    const validKey = process.env.API_KEY;
    
    if (!apiKey || apiKey !== validKey) {
      throw new UnauthorizedError('Valid API key required in X-API-Key header');
    }
  }
}

