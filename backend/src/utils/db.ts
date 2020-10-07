import pg from 'pg';
import { ENUM_LOG_LEVELS } from './constants.js';
import { Log } from './utils.js';
const { Pool } = pg;

// export const dbConf = { user: 'kam', host: 'localhost', port: 5432, password: 'smokingcausesheartdisease', database: 'tmp_asx' };
export const dbConf = { user: 'kam', host: 'localhost', port: 5432, password: 'smokingcausesheartdisease', database: 'asx_data' };
const db = new Pool(dbConf);

const _dbQuery = async <T>(query: string, params: unknown[] = []): Promise<T[] | null> => {
  try {
    const res = await db.query(query, params);
    return res.rows;
  } catch (err) {
    Log('DB', ENUM_LOG_LEVELS.ERR, 'Error Performing Query: ' + err.message, '\nQuery:   ' + query, '\nParams: ', params);
    return null;
  }
};

export const dbQuery = async <T>(query: string, params: unknown[] = []): Promise<T[]> => {
  const data = await _dbQuery<T>(query, params);
  if (data != null) return data;
  
  return [];
};

db.on('error', (err: Error) => {
  Log('DB', ENUM_LOG_LEVELS.ERR, 'Error With Database Pool: ', err.message);
});
