export type PriceData = {
  symbol: string,
  date: Date,
  price: string,
  volume: number
}

export type AsxSymbol = {
  code: string,
  company: string,
  sector: string,
  market_cap: BigInt
};
