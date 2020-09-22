/** Severity of logging types */
export enum ENUM_LOG_LEVELS {
  ERR,   /// Only log errors
  INFO,  /// Log errors and info
  DEBUG, /// Log everything
}

/** @type {number} Severity of logging */
export const LOG_LEVEL: number = ENUM_LOG_LEVELS.DEBUG;

export const SOCKET_SERVER_PORT = 8000;
export const SOCKET_SERVER_HOST = '0.0.0.0';
