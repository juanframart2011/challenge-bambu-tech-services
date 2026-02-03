import { Repository } from 'typeorm';
import { AppDataSource } from '../../db/data-source';
import { User } from '../../entities';
import { hashPassword, comparePassword } from '../../utils/bcrypt';
import { RegisterInput, LoginInput } from './auth.schemas';

export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async register(data: RegisterInput): Promise<Omit<User, 'password'>> {
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Crear nuevo usuario
    const hashedPassword = await hashPassword(data.password);
    const user = this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
    });

    await this.userRepository.save(user);

    // Retornar usuario sin contraseña
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(data: LoginInput): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
