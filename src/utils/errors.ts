// ============================================
// Custom Error Classes for Fastify
// ============================================

export class FastifyError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends FastifyError {
  constructor(message: string = 'Bad Request') {
    super(message, 400);
  }
}

export class UnauthorizedError extends FastifyError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends FastifyError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends FastifyError {
  constructor(message: string = 'Not Found') {
    super(message, 404);
  }
}

export class ConflictError extends FastifyError {
  constructor(message: string = 'Conflict') {
    super(message, 409);
  }
}

export class InternalServerError extends FastifyError {
  constructor(message: string = 'Internal Server Error') {
    super(message, 500);
  }
}

