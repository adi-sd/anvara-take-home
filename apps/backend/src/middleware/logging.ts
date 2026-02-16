// middleware/logging.ts
import { Request, Response, NextFunction } from 'express';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
} as const;

const getTimestamp = (): string => {
  return new Date().toISOString().split('T')[1].slice(0, 8);
};

const getStatusColor = (statusCode: number): string => {
  if (statusCode >= 500) return colors.red;
  if (statusCode >= 400) return colors.yellow;
  if (statusCode >= 300) return colors.cyan;
  return colors.green;
};

const getLogLevel = (statusCode: number): string => {
  if (statusCode >= 500) return `${colors.red}[ERROR]${colors.reset}`;
  if (statusCode >= 400) return `${colors.yellow}[WARN]${colors.reset}`;
  return `${colors.cyan}[INFO]${colors.reset}`;
};

export function httpLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = getTimestamp();
    const statusColor = getStatusColor(res.statusCode);
    const level = getLogLevel(res.statusCode);

    console.log(
      `${colors.gray}${timestamp}${colors.reset} ${level} ${req.method} ${req.url} → ${statusColor}${res.statusCode}${colors.reset} (${duration}ms)`
    );
  });

  next();
}
