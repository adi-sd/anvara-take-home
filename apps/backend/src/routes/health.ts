import { type Request, type Response } from 'express';
import { prisma } from '../lib/db.js';

// healthCheck- Health check endpoint - PUBLIC
export const healthCheck = async (_req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    console.error('Error fetching health status:', error);
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
};
