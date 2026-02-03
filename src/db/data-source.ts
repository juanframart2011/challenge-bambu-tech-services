import { DataSource } from 'typeorm';
import { ENV } from '../config/env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  username: ENV.DB_USERNAME,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
  synchronize: false, // Usar migraciones en lugar de synchronize
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
    
    // Ejecutar migraciones pendientes
    console.log('🔄 Running pending migrations...');
    const pendingMigrations = await AppDataSource.showMigrations();
    
    if (pendingMigrations) {
      await AppDataSource.runMigrations();
      console.log('✅ Migrations executed successfully');
    } else {
      console.log('✅ Database is up to date');
    }
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
    process.exit(1);
  }
};
