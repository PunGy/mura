import { Logger, loggerType, type ILogger } from "./Logger"

/**
 * Engine related logging
 */
export const muraLog = new Logger('MURA_ENGINE', loggerType.console) as never as ILogger
