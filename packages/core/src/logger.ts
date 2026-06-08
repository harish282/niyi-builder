const LOG_PREFIX = 'Niyi Builder';

type LogMethod = 'debug' | 'info' | 'warn' | 'error';

let loggingEnabled = false;

export function configureLogger(options: { enabled: boolean }): void {
  loggingEnabled = options.enabled;
}

export function isLoggerEnabled(): boolean {
  return loggingEnabled;
}

function write(level: LogMethod, message: string, details?: unknown): void {
  if (!loggingEnabled) {
    return;
  }

  const label = `[${LOG_PREFIX}] ${message}`;
  const consoleMethod = console[level] ?? console.log;

  if (details === undefined) {
    consoleMethod(label);

    return;
  }

  consoleMethod(label, details);
}

export const logger = {
  debug(message: string, details?: unknown): void {
    write('debug', message, details);
  },
  info(message: string, details?: unknown): void {
    write('info', message, details);
  },
  warn(message: string, details?: unknown): void {
    write('warn', message, details);
  },
  error(message: string, details?: unknown): void {
    write('error', message, details);
  },
};
