import express from 'express';
import { apiRoutes } from './api';
import { errorHandler } from './utils/middleware';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './utils/logger';

dotenv.config();

const PORT = process.env.PORT || 8000;


const app = express();
app.use(express.json())

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use('/api', apiRoutes);

// 404 handler - must be after all routes
app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler - must be last, after all middleware and routes
app.use(errorHandler)

app.listen(PORT, () => {
    logger.info(`Server started successfully`, { port: PORT, environment: process.env.NODE_ENV || 'development' });
});