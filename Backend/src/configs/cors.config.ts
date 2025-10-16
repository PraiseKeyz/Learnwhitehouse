import dotenv from 'dotenv';
dotenv.config();

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin) return callback(null, true);

    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001'
    ];

    const normalizedOrigin = origin.replace(/\/$/, '');
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      const normalizedAllowed = allowedOrigin.replace(/\/$/, '');
      return normalizedOrigin === normalizedAllowed || 
             normalizedOrigin.endsWith('.' + normalizedAllowed.replace(/^https?:\/\//, ''));
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from: ${origin}`);
      console.warn(`Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400
};

export default corsOptions;
