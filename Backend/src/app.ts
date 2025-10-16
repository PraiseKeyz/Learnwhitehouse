import express, { Request, Response,Application } from 'express';
import cors from 'cors';
import corsOptions from './configs/cors.config';
import routes from './routes/router'
import { ApiResponse } from './types';
import { securityHeaders, requestLogger } from './utils/validation';

const app: Application = express();

app.use(securityHeaders);
app.use(requestLogger);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors(corsOptions));

app.get('/health', (req: Request, res: Response<ApiResponse>) => {
    res.status(200).json({ 
      success: true, 
      message: "API is running",
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    });
});

app.get('/', (req: Request, res: Response<ApiResponse>) => {
    res.status(200).json({ 
      success: true, 
      message: "Welcome to GPS360 Academy API",
      version: "1.0.0"
    });
  });

//  404 handler
  app.use(/(.*)/, (req: Request, res: Response<ApiResponse>) => {
    res.status(404).json({
      success: false,
      error: 'Route not found',
      message: `Cannot ${req.method} ${req.originalUrl}`
    });
  });

Object.entries(routes).forEach(([path, router]) => {
    app.use('/api' + path, router);  // Combine the base URL with the route path
  });

export default app