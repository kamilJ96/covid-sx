import { ENUM_LOG_LEVELS } from '../utils/constants.js';
import { formatDate, Log } from '../utils/utils.js';
import { AsxSymbol } from '../utils/dbTypes.js';
import { getDataForSymbols, getSymbols } from '../utils/dbQueries.js';

type SymbolData = {
  symbol: string,
  highPrice: number,
  highDate: Date,
  lowPrice: number,
  lowDate: Date,
  currentPrice: number,
};



const symbolToSector: { [key: string]: string } = {};

const getHighsAndLows = async (symbols: AsxSymbol[]): Promise<SymbolData[]> => {
  const allSymData: SymbolData[] = [];

  for (const s of symbols) {
    const data = await getDataForSymbols([s.code]);

    if (!data.length) {
      Log('getHighsAndLows', ENUM_LOG_LEVELS.ERR, 'No Data For Symbol: ', s.code);
      continue;
    }

    const symData: SymbolData = { symbol: s.code, highDate: new Date(0), highPrice: -1, lowDate: new Date(0), lowPrice: Number.MAX_SAFE_INTEGER, currentPrice: 0 };

    data.forEach(row => {
      const price = Number(row.price);

      if (price < symData.lowPrice) {
        symData.lowPrice = price;
        symData.lowDate = row.date;
      }
      if (price > symData.highPrice) {
        symData.highPrice = price;
        symData.highDate = row.date;
      }
    });

    symData.currentPrice = Number(data[0].price);

    if (symData.highPrice < symData.lowPrice) Log('getHighsAndLows', ENUM_LOG_LEVELS.ERR, 'High Price Found Lower Than Low Price For Symbol ', s.code, ' | Data[0]: ', JSON.stringify(data[0]));

    allSymData.push(symData);
  }

  return allSymData;
};


const start = async () => {
  const symbols = await getSymbols();
  if (!symbols.length) return;

  symbols.forEach(s => symbolToSector[s.code] = s.sector);

  const data = await getHighsAndLows(symbols);

  if (!data.length) return;

  data.forEach(symData => {
    const diff = symData.highPrice - symData.lowPrice;
    const avg = (symData.highPrice + symData.lowPrice) / 2;
    const diffPercent = 100 * (diff / avg);

    console.log(`
-------------- ${symData.symbol} - ${symbolToSector[symData.symbol]} --------------
High Date: ${formatDate(symData.highDate)} | Price: ${symData.highPrice}
Low Date:  ${formatDate(symData.lowDate)} | Price: ${symData.lowPrice}
Difference: ${diff.toFixed(2)} | Percent Change: ${diffPercent.toFixed(2)}%
Current Price: ${symData.currentPrice.toFixed(2)} | Diff From High: ${(symData.currentPrice - symData.highPrice).toFixed(2)} | Diff From Low: ${(symData.currentPrice - symData.lowPrice).toFixed(2)}
-------------- ${symData.symbol} - ${symbolToSector[symData.symbol]} --------------
`);
  });

  Log('Highs&Lows', ENUM_LOG_LEVELS.ERR, 'Done.');
};

start();
