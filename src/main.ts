import 'reflect-metadata';
import { buildApp } from './app';
import { initializeDatabase } from './db/data-source';
import { ENV } from './config/env';

async function main() {
  try {
    // Inicializar base de datos
    console.log('🔄 Connecting to database...');
    await initializeDatabase();

    // Construir aplicación
    console.log('🔄 Building application...');
    const app = await buildApp();

    // Iniciar servidor
    const address = await app.listen({
      port: parseInt(ENV.PORT),
      host: '0.0.0.0',
    });

    console.log(`🚀 Server is running on ${address}`);
    console.log(`📚 Swagger documentation available at http://localhost:${ENV.PORT}/docs`);
    console.log(`💚 Health check available at http://localhost:${ENV.PORT}/health`);

    // Manejo de señales de cierre
    const signals = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`\n⚠️  Received ${signal}, closing server gracefully...`);
        await app.close();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

main();
