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

export const SECTOR_TO_COLOUR: Record<string, unknown> = {
  'Real Estate': '#960000',
  'Materials': '#007109',
  'Information Technology': '#1af4ff',
  'Utilities': '#d8f10b',
  'Industrials': '#f1a00b',
  'Health Care': '#e00e0e',
  'Consumer Discretionary': '#901190',
  'Financials': '#02de13',
  'Consumer Staples': '#123494',
  'Telecommunication Services': '#8c9412',
  'Communication Services': '#ff00bc',
  'Energy': '#0b9cf1',
};


export const SectorDefaults: { [sector in SectorType]: number } = {
  'Communication Services': 0,
  'Consumer Discretionary': 0,
  'Consumer Staples': 0,
  'Energy': 0,
  'Financials': 0,
  'Health Care': 0,
  'Industrials': 0,
  'Information Technology': 0,
  'Materials': 0,
  'Real Estate': 0,
  'Telecommunication Services': 0,
  'Utilities': 0,
};
