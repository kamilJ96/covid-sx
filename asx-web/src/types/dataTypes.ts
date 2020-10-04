export type AsxSymbol = {
  company: string;
  sector: SectorType;
  marketCap: BigInt;
  country: string,
  state: string,
  industry: string,
};

export type AsxPrice = {
  symbol: string;
  date: number;
  price: number;
  volume: number;
};

export type AsxSymbolStat = {
  symbol: string;
  janAvg: number;
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
export type StateType = 'NSW' | 'QLD' | 'SA' | 'TAS' | 'VIC' | 'WA';
export type GroupedTypes = SectorType | StateType;
export enum GroupedKeys {
  sector='sector',
  state='state',
}

export const STRING_TO_COLOUR: { [key in GroupedTypes]: string } = {
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
  'NSW': '#1af4ff',
  'VIC': '#02de13',
  'QLD': '#901190',
  'SA': '#d8f10b',
  'TAS': '#ff00bc',
  'WA': '#f1a00b',
};
