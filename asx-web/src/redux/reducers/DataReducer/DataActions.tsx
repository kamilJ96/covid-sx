import { createAction } from 'typesafe-actions';
import { AsxPrice, AsxSymbol, AsxSymbolStat } from '../../../types/dataTypes';

const addSymbols = createAction(
  'data/ADD_SYMBOLS',
  (symbolData: { [key: string]: AsxSymbol }) => symbolData
)();

const addPrices = createAction('data/ADD_PRICES', (priceData: AsxPrice[]) => {
  const stats: { [key: string]: AsxSymbolStat } = {};
  let numSymbols = 0;

  priceData.forEach((point) => {
    if (stats[point.symbol] !== undefined) {
      const stat = stats[point.symbol];
      if (point.price > stat.highestPrice) {
        stat.highestPrice = point.price;
        stat.tmpHighestDate = point.date;
      } else if (point.price < stat.lowestPrice) {
        stat.lowestPrice = point.price;
        stat.tmpLowestDate = point.date;
      }
    } else {
      const date = new Date(point.date);
      const stat: AsxSymbolStat = {
        symbol: point.symbol,
        highestPrice: point.price,
        highestDate: date,
        tmpHighestDate: point.date,
        lowestPrice: point.price,
        lowestDate: date,
        tmpLowestDate: point.date,
        currentPrice: point.price,
        recovered: 0,
      };

      stats[point.symbol] = stat;
      numSymbols++;
    }
  });

  const priceDataSorted = priceData.slice();
  priceDataSorted.sort((a, b) => b.date - a.date);
  const symbolsUsed: string[] = [];
  const symbolStats: AsxSymbolStat[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const price of priceDataSorted) {
    if (!symbolsUsed.includes(price.symbol)) {
      const stat = stats[price.symbol];

      stat.currentPrice = price.price;
      stat.highestDate = new Date(stat.tmpHighestDate!);
      stat.lowestDate = new Date(stat.tmpLowestDate!);
      stat.recovered = (price.price / stat.highestPrice) * 100;

      stat.recovered = Number(stat.recovered.toFixed(2));
      symbolStats.push(stats[price.symbol]);
      symbolsUsed.push(price.symbol);

      if (symbolsUsed.length === numSymbols) break;
    }
  }

  return { priceData, symbolStats };
})();

export default { addSymbols, addPrices };
