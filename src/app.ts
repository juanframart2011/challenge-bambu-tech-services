import Fastify from 'fastify';
import cors from '@fastify/cors';
import { registerSwagger, registerJWT } from './plugins';
import { authRoutes } from './modules/auth';
import { todoRoutes } from './modules/todo';
import { ENV } from './config/env';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: ENV.NODE_ENV === 'development' ? 'info' : 'error',
      transport:
        ENV.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
    },
  });

  // Registrar plugins
  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  await registerJWT(app);
  await registerSwagger(app);

  // Health check
  app.get('/health', {
    schema: {
      tags: ['Health'],
      summary: 'Health check',
      description: 'Verifica el estado del servidor',
      response: {
        200: {
          description: 'Servidor funcionando correctamente',
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
            uptime: { type: 'number' },
          },
        },
      },
    },
  }, async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });

  // Registrar rutas
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(todoRoutes, { prefix: '/api/todos' });

  // Error handler global
  app.setErrorHandler((error, request, reply) => {
    app.log.error(error);

    const statusCode = error.statusCode || 500;

    reply.status(statusCode).send({
      error: error.name || 'InternalServerError',
      message: error.message || 'Ha ocurrido un error interno del servidor',
      statusCode,
    });
  });

  return app;
}
