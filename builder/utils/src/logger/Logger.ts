const PREFIX = 'NiyiBuilder';

export interface Logger {
  info(namespace: string, message: string): void;
  warn(namespace: string, message: string): void;
  error(namespace: string, message: string): void;
  debug(namespace: string, message: string): void;
}

export const logger: Logger = {
  info(namespace: string, message: string): void {
    console.log(`[${PREFIX}][${namespace}]\n${message}`);
  },

  warn(namespace: string, message: string): void {
    console.warn(`[${PREFIX}][${namespace}]\n${message}`);
  },

  error(namespace: string, message: string): void {
    console.error(`[${PREFIX}][${namespace}]\n${message}`);
  },

  debug(namespace: string, message: string): void {
    console.debug(`[${PREFIX}][${namespace}]\n${message}`);
  },
};
