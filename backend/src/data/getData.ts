import pgPromise from 'pg-promise';
import { IInitOptions, IMain } from 'pg-promise';
import yahoo from 'yahoo-finance';
const { historical } = yahoo;

import { dbConf } from '../utils/db.js';
import { ENUM_LOG_LEVELS } from '../utils/constants.js';
import { getLatestDate } from '../utils/dbQueries.js';
import { PriceData } from '../utils/dbTypes.js';
import { Log } from '../utils/utils.js';

const initOpts: IInitOptions = {
  capSQL: true,
};

const pgp: IMain = pgPromise(initOpts);
const db = pgp(dbConf);
const cs = new pgp.helpers.ColumnSet(['symbol', 'date', 'price', 'volume'], { table: 'asx_d1' });

const timer = (ms: number) => { return new Promise(res => setTimeout(res, ms)); };

type HistoricalQuote = {
  date: Date,
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number,
  adjClose: number,
  symbol: string,
}

const downloadData = async (symbols: string[], startDate: string, endDate: string): Promise<PriceData[]> => {
  const data: PriceData[] = [];

  Log('downloadData', ENUM_LOG_LEVELS.DEBUG, `Begin download from ${startDate} to ${endDate} for ${symbols.length} Symbols.`);

  for (const symbol of symbols) {
    try {
      Log('downloadData', ENUM_LOG_LEVELS.DEBUG, 'Downloading Data For ', symbol);
      const res = await historical({
        symbol,
        from: startDate,
        to: endDate,
        period: 'd'
      });

      const s = symbol.split('.')[0];

      if (res)
        res.forEach((quote: HistoricalQuote) => {
          const price = quote.adjClose ? quote.adjClose : quote.close ? quote.close : 0;
          data.push({ date: quote.date, price, symbol: s, volume: quote.volume });
        });
      else
        Log('downloadData', ENUM_LOG_LEVELS.ERR, 'No Data Returned For ', symbol);

    } catch (err) {
      Log('downloadData', ENUM_LOG_LEVELS.ERR, 'Failed To Download Data For ', symbol, ' | Error: ', err);
    }
  }

  return data;
};

const dateFormatter = (date: Date): string => {
  let month = (date.getUTCMonth() + 1).toString();
  if (month.length === 1) month = `0${month}`;

  let day = (date.getUTCDate() + 1).toString();
  if (day.length === 1) day = `0${day}`;

  return `${date.getUTCFullYear()}-${month}-${day}`;
};

const checkNewQuote = (startDate: Date, endDate: Date): boolean => {
  const currDay = endDate.getUTCDay();
  if (currDay === 6 || currDay === 7) return false;

  if (endDate.getUTCDate() !== startDate.getUTCDate()) {
    // 7am UTC is 6pm AEDT/5pm AEST so the ASX market will definitely be closed by now (get fucked DST)
    if (endDate.getUTCHours() >= 7) return true;
  }

  return false;
};

const getTimeUntilNextQuote = (): number => {
  const currDate = new Date();
  const nextQuote = new Date(currDate);
  const nextTradingDay = currDate.getUTCDay() === 5 ? 3 : currDate.getUTCDay() === 6 ? 2 : 1;

  nextQuote.setUTCHours(7, 0, 0, 0);
  nextQuote.setDate(currDate.getUTCDate() + nextTradingDay);

  const diff = Number(nextQuote) - Number(currDate);

  Log('nextQuoteTime', ENUM_LOG_LEVELS.DEBUG, 'Current Date: ', currDate.toISOString(), ' | Next Quote Date: ', nextQuote.toISOString(), ' | Diff in ms: ', diff);

  return diff;
};

export const startDownloader = async (symbols: string[], init = true): Promise<void> => {
  const logSource = 'startDownloader';

  if (init) {
    Log(logSource, ENUM_LOG_LEVELS.INFO, 'Data Downloader Initialised For ', symbols.length, ' symbols.');
    symbols = symbols.map(x => `${x}.AX`);
  }

  const startDate = await getLatestDate();
  const endDate = new Date();

  const newQuote = checkNewQuote(startDate, endDate);
  Log(logSource, ENUM_LOG_LEVELS.DEBUG, 'Latest Date In DB: ', startDate.toISOString(), ' | Current Date: ', endDate.toISOString());

  if (newQuote) {
    Log(logSource, ENUM_LOG_LEVELS.DEBUG, 'Should have new quotes, begin download.');

    const data = await downloadData(symbols, dateFormatter(startDate), dateFormatter(endDate));

    if (data.length) {
      Log(logSource, ENUM_LOG_LEVELS.DEBUG, 'Fetched ', data.length, ' new quotes.');
      try {
        const query = pgp.helpers.insert(data, cs);
        await db.none(query);
        Log(logSource, ENUM_LOG_LEVELS.INFO, ':) Inserted ', data.length, ' New Quotes. :)');
      } catch (err) {
        Log(logSource, ENUM_LOG_LEVELS.ERR, '*** Error Inserting New Quotes: ', err.message, 'First Ten Quotes: ', data.slice(0, 10));
      }
    }
    else {
      Log(logSource, ENUM_LOG_LEVELS.ERR, 'No New Quotes Returned!');
    }
  }
  else {
    Log(logSource, ENUM_LOG_LEVELS.DEBUG, 'No New Quotes Yet...');
  }

  const intervalLength = getTimeUntilNextQuote();
  await timer(intervalLength);
  startDownloader(symbols);
};
