import app from './app';
import logger from './utils/logger';
import dotenv from 'dotenv';
import { connectDB } from './configs/db';

dotenv.config();

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  logger.error({ missingEnvVars }, 'Missing required environment variables');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

logger.info('Starting server initialization...');

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
      logger.info(`📚 Leaenwhitehouse API is ready!`);
    });

    const gracefulShutdown = (signal: string) => {
      logger.info(`${signal} signal received: closing server gracefully`);
      server.close((err) => {
        if (err) {
          logger.error({ error: err }, 'Error during server shutdown');
          process.exit(1);
        }
        logger.info('Server closed successfully');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      logger.error({ reason, promise }, 'Unhandled Rejection');
      gracefulShutdown('UNHANDLED_REJECTION');
    });

    process.on('uncaughtException', (err: Error) => {
      logger.error({ error: err }, 'Uncaught Exception');
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();