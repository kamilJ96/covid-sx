export type AsxSymbol = {
  company: string;
  sector: SectorType;
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
export type SectorType = 'Real Estate' | 'Materials' | 'Information Technology' | 'Utilities' | 'Industrials' | 'Health Care' | 'Consumer Discretionary' | 'Financials' | 'Consumer Staples' | 'Telecommunication Services' | 'Communication Services' | 'Energy';
