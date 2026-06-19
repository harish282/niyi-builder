const PREFIX = 'NiyiBuilder';

export interface Logger {
    info(message: string, data?: unknown): void;
    warn(message: string, data?: unknown): void;
    error(message: string, data?: unknown): void;
    debug(message: string, data?: unknown): void;
}

export const logger: Logger = {
    info(message: string, data?: unknown): void {
        console.log(`[${PREFIX}] ${message}`, data ?? '');
    },

    warn(message: string, data?: unknown): void {
        console.warn(`[${PREFIX}] ${message}`, data ?? '');
    },

    error(message: string, data?: unknown): void {
        console.error(`[${PREFIX}] ${message}`, data ?? '');
    },

    debug(message: string, data?: unknown): void {
        console.debug(`[${PREFIX}] ${message}`, data ?? '');
    }
};