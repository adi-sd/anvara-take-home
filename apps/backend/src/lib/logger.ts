// lib/logger.ts
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
} as const;

const getTimestamp = (): string => {
  return new Date().toISOString().split('T')[1].slice(0, 8);
};

type LogArgument = string | number | boolean | object | null | undefined;

export const logger = {
  info: (message: string, ...args: LogArgument[]): void => {
    console.log(
      `${colors.gray}${getTimestamp()}${colors.reset} ${colors.cyan}[INFO]${colors.reset} ${message}`,
      ...args
    );
  },
  warn: (message: string, ...args: LogArgument[]): void => {
    console.log(
      `${colors.gray}${getTimestamp()}${colors.reset} ${colors.yellow}[WARN]${colors.reset} ${message}`,
      ...args
    );
  },
  error: (message: string, ...args: LogArgument[]): void => {
    console.log(
      `${colors.gray}${getTimestamp()}${colors.reset} ${colors.red}[ERROR]${colors.reset} ${message}`,
      ...args
    );
  },
  debug: (message: string, ...args: LogArgument[]): void => {
    if (process.env.LOG_LEVEL === 'debug') {
      console.log(
        `${colors.gray}${getTimestamp()}${colors.reset} ${colors.magenta}[DEBUG]${colors.reset} ${message}`,
        ...args
      );
    }
  },
};
