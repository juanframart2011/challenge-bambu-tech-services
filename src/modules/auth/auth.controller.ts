import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema, RegisterInput, LoginInput } from './auth.schemas';
import { ENV } from '../../config/env';

export async function authRoutes(app: FastifyInstance) {
  const authService = new AuthService();

  // Registro de usuario
  app.post<{ Body: RegisterInput }>(
    '/register',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Registrar nuevo usuario',
        description: 'Crea una nueva cuenta de usuario en el sistema',
        body: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: { type: 'string', format: 'email', example: 'usuario@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
            name: { type: 'string', minLength: 2, example: 'Juan Pérez' },
          },
        },
        response: {
          201: {
            description: 'Usuario creado exitosamente',
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  name: { type: 'string' },
                  createdAt: { type: 'string' },
                },
              },
              token: { type: 'string' },
            },
          },
          400: {
            description: 'Datos inválidos',
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: RegisterInput }>, reply: FastifyReply) => {
      try {
        // Validar datos
        const validatedData = registerSchema.parse(request.body);

        // Registrar usuario
        const user = await authService.register(validatedData);

        // Generar token
        const token = app.jwt.sign(
          { id: user.id, email: user.email },
          { expiresIn: ENV.JWT_EXPIRES_IN }
        );

        return reply.code(201).send({ user, token });
      } catch (error: any) {
        if (error.name === 'ZodError') {
          return reply.code(400).send({
            error: 'Validation Error',
            message: error.errors.map((e: any) => e.message).join(', '),
          });
        }

        return reply.code(400).send({
          error: 'Registration Error',
          message: error.message || 'Error al registrar usuario',
        });
      }
    }
  );

  // Login
  app.post<{ Body: LoginInput }>(
    '/login',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Iniciar sesión',
        description: 'Autentica un usuario y devuelve un token JWT',
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'usuario@example.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        response: {
          200: {
            description: 'Login exitoso',
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  name: { type: 'string' },
                },
              },
              token: { type: 'string' },
            },
          },
          401: {
            description: 'Credenciales inválidas',
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) => {
      try {
        // Validar datos
        const validatedData = loginSchema.parse(request.body);

        // Autenticar usuario
        const user = await authService.login(validatedData);

        if (!user) {
          return reply.code(401).send({
            error: 'Authentication Error',
            message: 'Email o contraseña incorrectos',
          });
        }

        // Generar token
        const token = app.jwt.sign(
          { id: user.id, email: user.email },
          { expiresIn: ENV.JWT_EXPIRES_IN }
        );

        const { password, ...userWithoutPassword } = user;

        return reply.code(200).send({ user: userWithoutPassword, token });
      } catch (error: any) {
        if (error.name === 'ZodError') {
          return reply.code(400).send({
            error: 'Validation Error',
            message: error.errors.map((e: any) => e.message).join(', '),
          });
        }

        return reply.code(500).send({
          error: 'Server Error',
          message: 'Error al iniciar sesión',
        });
      }
    }
  );

  // Obtener perfil (ruta protegida)
  app.get(
    '/profile',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Auth'],
        summary: 'Obtener perfil del usuario',
        description: 'Devuelve la información del usuario autenticado',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'Perfil del usuario',
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              name: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
          401: {
            description: 'No autorizado',
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = await authService.getUserById(request.user.id);

        if (!user) {
          return reply.code(404).send({
            error: 'Not Found',
            message: 'Usuario no encontrado',
          });
        }

        return reply.code(200).send(user);
      } catch (error: any) {
        return reply.code(500).send({
          error: 'Server Error',
          message: 'Error al obtener perfil',
        });
      }
    }
  );
}
