import { DataSource } from 'typeorm';
import { ENV } from '../config/env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  username: ENV.DB_USERNAME,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
  synchronize: ENV.NODE_ENV === 'development', // Solo en desarrollo
  logging: ENV.NODE_ENV === 'development',
  entities: [__dirname + '/../entities/**/*.{ts,js}'],
  migrations: [__dirname + '/../migrations/**/*.{ts,js}'],
  subscribers: [],
});

// Función para inicializar la base de datos
export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
    process.exit(1);
  }
};
