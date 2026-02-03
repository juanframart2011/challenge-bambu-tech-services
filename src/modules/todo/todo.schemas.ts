import { z } from 'zod';
import { TodoStatus } from '../../entities';

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es requerido')
    .max(200, 'El título no puede exceder 200 caracteres'),
  description: z.string().optional(),
  status: z.nativeEnum(TodoStatus).optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.number().int().min(0).max(10).optional(),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  status: z.nativeEnum(TodoStatus).optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.number().int().min(0).max(10).optional(),
});

export const todoQuerySchema = z.object({
  status: z.nativeEnum(TodoStatus).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoQueryInput = z.infer<typeof todoQuerySchema>;
