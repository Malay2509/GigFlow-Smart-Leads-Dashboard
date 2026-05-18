import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/leads.routes';
import { ApiError } from './utils/ApiError';

const app = express();

// --------------- Middleware ---------------
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      // Allow local development, configured client URL, or any Vercel deployment
      if (
        allowedOrigins.includes(origin) ||
        origin === process.env.CLIENT_URL ||
        origin.endsWith('.vercel.app')
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// --------------- Routes ---------------
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// --------------- 404 Handler ---------------
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, 'Route not found'));
});

// --------------- Global Error Handler ---------------
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
  });
});

export default app;
