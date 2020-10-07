export type PriceData = {
  symbol: string,
  date: Date,
  price: number,
  volume: number
}

export type AsxSymbol = {
  code: string,
  company: string,
  sector: string,
  market_cap: BigInt,
  country: string,
  state: string,
  industry: string,
};
