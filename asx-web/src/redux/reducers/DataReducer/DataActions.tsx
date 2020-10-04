import { createAction } from 'typesafe-actions';
import { AsxPrice, AsxSymbol, AsxSymbolStat } from '../../../types/dataTypes';
import { formatToDecimals } from '../../../utils/dataUtils';

const addSymbols = createAction(
  'data/ADD_SYMBOLS',
  (symbolData: { [key: string]: AsxSymbol }) => symbolData
)();

const addPrices = createAction('data/ADD_PRICES', (priceData: AsxPrice[]) => {
  const stats: { [key: string]: AsxSymbolStat } = {};
  const janAvgs: { [symbol: string]: { value: number, count: number } } = {};
  let numSymbols = 0;

  priceData.forEach((point) => {
    const s = point.symbol;
    if (stats[s] !== undefined) {
      const stat = stats[s];

      if (point.price > stat.highestPrice) {
        stat.highestPrice = point.price;
        stat.tmpHighestDate = point.date;
      } else if (point.price < stat.lowestPrice) {
        stat.lowestPrice = point.price;
        stat.tmpLowestDate = point.date;
      }

      stat.currentPrice = point.price;

      if (new Date(point.date).getMonth() === 0) {
        const janAvg = janAvgs[s];
        if (janAvg) {
          janAvg.value += point.price;
          janAvg.count++;
        } else {
          janAvgs[s] = { value: point.price, count: 1 };
        }
      }
    } else {
      const date = new Date(point.date);
      if (date.getMonth() === 0) janAvgs[s] = { value: point.price, count: 1 };

      const stat: AsxSymbolStat = {
        symbol: s,
        janAvg: 1,
        highestPrice: point.price,
        highestDate: date,
        tmpHighestDate: point.date,
        lowestPrice: point.price,
        lowestDate: date,
        tmpLowestDate: point.date,
        currentPrice: point.price,
        recovered: 0,
      };

      stats[s] = stat;
      numSymbols++;
    }
  });

  const priceDataSorted = priceData.slice();
  priceDataSorted.sort((a, b) => b.date - a.date);

  const symbolsUsed: string[] = [];
  const symbolStats: AsxSymbolStat[] = [];

  for (const price of priceDataSorted) {
    if (!symbolsUsed.includes(price.symbol)) {
      const stat = stats[price.symbol];

      stat.currentPrice = formatToDecimals(stat.currentPrice, 2);
      stat.highestPrice = formatToDecimals(stat.highestPrice, 2);
      stat.lowestPrice = formatToDecimals(stat.lowestPrice, 2);

      stat.highestDate = stat.tmpHighestDate ? new Date(stat.tmpHighestDate) : new Date(0);
      stat.lowestDate = stat.tmpLowestDate ? new Date(stat.tmpLowestDate) : new Date(0);

      const avg = janAvgs[price.symbol] ? janAvgs[price.symbol].value / janAvgs[price.symbol].count : stat.lowestPrice;
      stat.janAvg = formatToDecimals(avg, 2);

      stat.recovered = (price.price / stat.janAvg) * 100;
      stat.recovered = Number(stat.recovered.toFixed(2));

      symbolStats.push(stats[price.symbol]);
      symbolsUsed.push(price.symbol);

      if (symbolsUsed.length === numSymbols) break;
    }
  }

  return { priceData, symbolStats };
})();

export default { addSymbols, addPrices };
