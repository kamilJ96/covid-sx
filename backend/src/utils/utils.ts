import { LOG_LEVEL, ENUM_LOG_LEVELS } from './constants.js';
import chalk from 'chalk';

/**
 * Writes a message to the log if the _logLevel_ meets or exceeds the current logLevel
 * @param source Source of function writing this log
 * @param logLevel Severity of this log
 * @param msg Message(s) to log
 */
export const Log = (source: string, logLevel = 1, ...msg: unknown[]): void => {
  if (logLevel <= LOG_LEVEL) {
    source = source.padEnd(17);

    if (logLevel === ENUM_LOG_LEVELS.DEBUG) {
      console.debug(chalk.bgYellowBright.black(new Date().toISOString(), `[${source}]`, ...msg));
    }
    else if (logLevel === ENUM_LOG_LEVELS.ERR) {
      console.error(chalk.bgRed.white.bold(new Date().toISOString(), `[${source}]`, ...msg));
    }
    else {
      console.log(chalk.bgGreenBright.black(new Date().toISOString(), `[${source}]`, ...msg));
    }
  }
};

export const formatDate = (date: Date, includeTime = false): string => {
  let day = date.getUTCDate().toString(), month = (date.getUTCMonth() + 1).toString();

  if (day.length < 2) day = `0${day}`;
  if (month.length < 2) month = `0${month}`;

  if (!includeTime) return `${date.getFullYear()}.${month}.${day}`;

  let hours = date.getUTCHours().toString(), min = date.getUTCMinutes().toString();

  if (hours.length < 2) hours = `0${hours}`;
  if (min.length < 2) min = `0${min}`;

  return `${date.getFullYear()}.${month}.${day} ${hours}:${min}`;
};

export const validJson = (msg: string): { [key: string]: unknown } | false => {
  try {
    const json = JSON.parse(msg);
    if (json != null) return json;
  } catch (err) {
    Log('validJson', ENUM_LOG_LEVELS.ERR, 'Invalid JSON message: ', msg);
  }

  return false;
};


export const dbConf = { user: 'kam', password: 'smokingcausesheartdisease', host: 'localhost', port: 5432, database: 'asx_data' };
