export type Log<T extends string> = (type: T, scope: string, ...msg: unknown[]) => void;

export type LogType = 'info' | 'warn' | 'error' | 'trace';

export class Logger {
    constructor(
        protected scope: string,
        protected log: Log<LogType>,
    ) {}

    error(...msg: unknown[]) {
        this.log('error', this.scope, ...msg)
    }
    info(...msg: unknown[]) {
        this.log('info', this.scope, ...msg)
    }
    warn(...msg: unknown[]) {
        this.log('warn', this.scope, ...msg)
    }
    trace(...msg: unknown[]) {
        this.log('trace', this.scope, ...msg)
    }
}

const logFn: Record<LogType, (...msg: unknown[]) => void> = {
    'error': console.error,
    'warn': console.warn,
    'info': console.info,
    'trace': console.trace,
}
export const loggerType = {
    console: (type: LogType, scope: string, ...msg: unknown[]) => {
        const log = logFn[type]

        log(`${type.toUpperCase()} [${scope}]:`, ...msg)
    },
}

