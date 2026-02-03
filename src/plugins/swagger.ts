import { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { ENV } from '../config/env';

export async function registerSwagger(app: FastifyInstance) {
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'TODO API - Bambu Tech Services Challenge',
        description: 'API REST para gestión de tareas con autenticación JWT',
        version: '1.0.0',
        contact: {
          name: 'API Support',
          email: 'support@bambtech.com',
        },
      },
      servers: [
        {
          url: `http://localhost:${ENV.PORT}`,
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ bearerAuth: [] }],
      tags: [
        { name: 'Auth', description: 'Endpoints de autenticación' },
        { name: 'Users', description: 'Endpoints de usuarios' },
        { name: 'Todos', description: 'Endpoints de tareas' },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
    staticCSP: true,
    transformStaticCSP: (header: string) => header,
  });
}
