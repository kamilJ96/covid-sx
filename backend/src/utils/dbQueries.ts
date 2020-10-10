import { ENUM_LOG_LEVELS } from './constants.js';
import { dbQuery } from './db.js';
import { PriceData, AsxSymbol } from './dbTypes.js';
import { Log } from './utils.js';


export const getSymbols = async (): Promise<AsxSymbol[]> => {
  const symbols: AsxSymbol[] = await dbQuery('SELECT * FROM symbols ORDER BY code ASC');
  if (!symbols.length) {
    Log('getSymbols', ENUM_LOG_LEVELS.ERR, 'Failed getting symbols, additional information is likely displayed above.');
  }

  return symbols;
};

export const getDataForSymbols = async (symbols: string[]): Promise<PriceData[]> => {
  const data: PriceData[] = await dbQuery('SELECT * FROM asx_d1 WHERE symbol = ANY ($1) ORDER BY date ASC, symbol ASC', [symbols]);
  return data;
};

export const getLatestDate = async (): Promise<Date | null> => {
  const data: PriceData[] = await dbQuery('SELECT * FROM asx_d1 ORDER BY date DESC LIMIT 1');
  
  if (data.length) return data[0].date;
  return null;
};
