export type AsxSymbol = {
  company: string;
  sector: string;
  marketCap: BigInt;
};

export type AsxPrice = {
  symbol: string;
  date: number;
  price: number;
  volume: number;
};

export type AsxSymbolStat = {
  symbol: string;
  highestPrice: number;
  highestDate: Date;
  tmpHighestDate?: number;
  lowestPrice: number;
  lowestDate: Date;
  tmpLowestDate?: number;
  currentPrice: number;
  recovered: number;
};
