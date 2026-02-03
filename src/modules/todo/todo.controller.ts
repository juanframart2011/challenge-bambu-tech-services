import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { TodoService } from './todo.service';
import {
  createTodoSchema,
  updateTodoSchema,
  CreateTodoInput,
  UpdateTodoInput,
} from './todo.schemas';
import { TodoStatus } from '../../entities';

export async function todoRoutes(app: FastifyInstance) {
  const todoService = new TodoService();

  // Crear TODO
  app.post<{ Body: CreateTodoInput }>(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Todos'],
        summary: 'Crear nueva tarea',
        description: 'Crea una nueva tarea para el usuario autenticado',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed'],
            },
            dueDate: { type: 'string', format: 'date-time' },
            priority: { type: 'number', minimum: 0, maximum: 10 },
          },
        },
        response: {
          201: {
            description: 'Tarea creada exitosamente',
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              status: { type: 'string' },
              dueDate: { type: 'string' },
              priority: { type: 'number' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
              userId: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: CreateTodoInput }>, reply: FastifyReply) => {
      try {
        const validatedData = createTodoSchema.parse(request.body);
        const todo = await todoService.create(validatedData, request.user.id);
        return reply.code(201).send(todo);
      } catch (error: any) {
        if (error.name === 'ZodError') {
          return reply.code(400).send({
            error: 'Validation Error',
            message: error.errors.map((e: any) => e.message).join(', '),
          });
        }
        return reply.code(500).send({
          error: 'Server Error',
          message: 'Error al crear tarea',
        });
      }
    }
  );

  // Listar TODOs con paginación y filtros
  app.get<{
    Querystring: { status?: TodoStatus; page?: string; limit?: string };
  }>(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Todos'],
        summary: 'Listar tareas',
        description: 'Obtiene la lista de tareas del usuario autenticado con paginación',
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed'],
              description: 'Filtrar por estado',
            },
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
          },
        },
        response: {
          200: {
            description: 'Lista de tareas',
            type: 'object',
            properties: {
              todos: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    status: { type: 'string' },
                    dueDate: { type: 'string' },
                    priority: { type: 'number' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                  },
                },
              },
              total: { type: 'number' },
              page: { type: 'number' },
              totalPages: { type: 'number' },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Querystring: { status?: TodoStatus; page?: string; limit?: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const filters = {
          status: request.query.status,
          page: request.query.page ? parseInt(request.query.page) : undefined,
          limit: request.query.limit ? parseInt(request.query.limit) : undefined,
        };

        const result = await todoService.findAll(request.user.id, filters);
        return reply.code(200).send(result);
      } catch (error: any) {
        return reply.code(500).send({
          error: 'Server Error',
          message: 'Error al obtener tareas',
        });
      }
    }
  );

  // Obtener estadísticas
  app.get(
    '/statistics',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Todos'],
        summary: 'Estadísticas de tareas',
        description: 'Obtiene estadísticas de las tareas del usuario',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'Estadísticas de tareas',
            type: 'object',
            properties: {
              total: { type: 'number' },
              pending: { type: 'number' },
              inProgress: { type: 'number' },
              completed: { type: 'number' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const stats = await todoService.getStatistics(request.user.id);
        return reply.code(200).send(stats);
      } catch (error: any) {
        return reply.code(500).send({
          error: 'Server Error',
          message: 'Error al obtener estadísticas',
        });
      }
    }
  );

  // Obtener TODO por ID
  app.get<{ Params: { id: string } }>(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Todos'],
        summary: 'Obtener tarea por ID',
        description: 'Obtiene los detalles de una tarea específica',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
        response: {
          200: {
            description: 'Detalles de la tarea',
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              status: { type: 'string' },
              dueDate: { type: 'string' },
              priority: { type: 'number' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
          404: {
            description: 'Tarea no encontrada',
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const todo = await todoService.findOne(request.params.id, request.user.id);

        if (!todo) {
          return reply.code(404).send({
            error: 'Not Found',
            message: 'Tarea no encontrada',
          });
        }

        return reply.code(200).send(todo);
      } catch (error: any) {
        return reply.code(500).send({
          error: 'Server Error',
          message: 'Error al obtener tarea',
        });
      }
    }
  );

  // Actualizar TODO
  app.put<{ Params: { id: string }; Body: UpdateTodoInput }>(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Todos'],
        summary: 'Actualizar tarea',
        description: 'Actualiza una tarea existente',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
        body: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed'],
            },
            dueDate: { type: 'string', format: 'date-time' },
            priority: { type: 'number', minimum: 0, maximum: 10 },
          },
        },
        response: {
          200: {
            description: 'Tarea actualizada',
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              status: { type: 'string' },
              dueDate: { type: 'string' },
              priority: { type: 'number' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
          404: {
            description: 'Tarea no encontrada',
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: UpdateTodoInput }>,
      reply: FastifyReply
    ) => {
      try {
        const validatedData = updateTodoSchema.parse(request.body);
        const todo = await todoService.update(
          request.params.id,
          request.user.id,
          validatedData
        );

        if (!todo) {
          return reply.code(404).send({
            error: 'Not Found',
            message: 'Tarea no encontrada',
          });
        }

        return reply.code(200).send(todo);
      } catch (error: any) {
        if (error.name === 'ZodError') {
          return reply.code(400).send({
            error: 'Validation Error',
            message: error.errors.map((e: any) => e.message).join(', '),
          });
        }
        return reply.code(500).send({
          error: 'Server Error',
          message: 'Error al actualizar tarea',
        });
      }
    }
  );

  // Eliminar TODO
  app.delete<{ Params: { id: string } }>(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Todos'],
        summary: 'Eliminar tarea',
        description: 'Elimina una tarea existente',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
        response: {
          200: {
            description: 'Tarea eliminada',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
          404: {
            description: 'Tarea no encontrada',
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const deleted = await todoService.delete(request.params.id, request.user.id);

        if (!deleted) {
          return reply.code(404).send({
            error: 'Not Found',
            message: 'Tarea no encontrada',
          });
        }

        return reply.code(200).send({ message: 'Tarea eliminada exitosamente' });
      } catch (error: any) {
        return reply.code(500).send({
          error: 'Server Error',
          message: 'Error al eliminar tarea',
        });
      }
    }
  );
}
