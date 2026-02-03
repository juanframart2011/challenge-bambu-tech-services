import { Repository } from 'typeorm';
import { AppDataSource } from '../../db/data-source';
import { Todo, TodoStatus } from '../../entities';
import { CreateTodoInput, UpdateTodoInput } from './todo.schemas';

export class TodoService {
  private todoRepository: Repository<Todo>;

  constructor() {
    this.todoRepository = AppDataSource.getRepository(Todo);
  }

  async create(data: CreateTodoInput, userId: string): Promise<Todo> {
    const todo = this.todoRepository.create({
      ...data,
      userId,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    });

    return await this.todoRepository.save(todo);
  }

  async findAll(
    userId: string,
    filters?: { status?: TodoStatus; page?: number; limit?: number }
  ): Promise<{ todos: Todo[]; total: number; page: number; totalPages: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const query = this.todoRepository
      .createQueryBuilder('todo')
      .where('todo.userId = :userId', { userId });

    if (filters?.status) {
      query.andWhere('todo.status = :status', { status: filters.status });
    }

    query.orderBy('todo.createdAt', 'DESC');
    query.skip(skip).take(limit);

    const [todos, total] = await query.getManyAndCount();

    return {
      todos,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string): Promise<Todo | null> {
    return await this.todoRepository.findOne({
      where: { id, userId },
    });
  }

  async update(id: string, userId: string, data: UpdateTodoInput): Promise<Todo | null> {
    const todo = await this.findOne(id, userId);

    if (!todo) {
      return null;
    }

    const updatedData = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : todo.dueDate,
    };

    Object.assign(todo, updatedData);
    return await this.todoRepository.save(todo);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await this.todoRepository.delete({ id, userId });
    return (result.affected || 0) > 0;
  }

  async getStatistics(userId: string) {
    const [total, pending, inProgress, completed] = await Promise.all([
      this.todoRepository.count({ where: { userId } }),
      this.todoRepository.count({ where: { userId, status: TodoStatus.PENDING } }),
      this.todoRepository.count({ where: { userId, status: TodoStatus.IN_PROGRESS } }),
      this.todoRepository.count({ where: { userId, status: TodoStatus.COMPLETED } }),
    ]);

    return {
      total,
      pending,
      inProgress,
      completed,
    };
  }
}
