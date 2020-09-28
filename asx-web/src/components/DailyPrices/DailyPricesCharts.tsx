import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RootState } from '../../redux/reducer';
import SectorFilter from '../SectorPrices/SectorFilter';

const SECTOR_TO_COLOUR: Record<string, unknown> = {
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

function DailyPricesCharts(): ReactElement {
  const [sectorsExcluded, setSectorsExcluded] = useState<string[]>([]);
  const [pricePoints, setPricePoints] = useState<{ [symbol: string]: number | string, name: string }[]>([]);
  const [lines, setLines] = useState<ReactElement[]>([]);

  const priceData = useSelector((state: RootState) => ({
    prices: state.data.prices,
    symbols: state.data.symbols,
  }));

  useEffect(() => {
    const tmpPrices: { [key: number]: { [symbol: string]: number | string, name: string } } = {};
    const prices = sectorsExcluded.length
      ? priceData.prices.filter((point) => !sectorsExcluded.includes(priceData.symbols[point.symbol].sector))
      : priceData.prices;

    prices.forEach((point) => {
      const val = tmpPrices[point.date];

      if (val === undefined) {
        tmpPrices[point.date] = { name: new Date(point.date).toLocaleDateString(), [point.symbol]: point.price };
      } else {
        tmpPrices[point.date][point.symbol] = point.price;
      }
    });

    const priceKeys = Object.keys(tmpPrices);
    priceKeys.sort((a, b) => Number(a) - Number(b));

    setPricePoints(priceKeys.map(key => tmpPrices[Number(key)]));
    setLines(Object.keys(priceData.symbols).map((x, i) => {
      let colour = SECTOR_TO_COLOUR[priceData.symbols[x]?.sector];
      if (colour === undefined) colour = '#ffffff';

      return <Line
        key={x}
        type="monotone"
        dataKey={x}
        dot={false}
        stroke={colour as string}
      />;
    }));
  }, [sectorsExcluded, priceData.prices.length, priceData.symbols]);

  console.log('render')

  return (
    <div className="asx-prices-charts">
      <SectorFilter
        sectors={Object.keys(SECTOR_TO_COLOUR)}
        sectorColours={SECTOR_TO_COLOUR}
        sectorsExcluded={sectorsExcluded}
        clickSector={setSectorsExcluded}
      />
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={pricePoints}>
          <XAxis dataKey="name" />
          <YAxis />
          {/* <Tooltip isAnimationActive={false} /> */}
          {lines}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DailyPricesCharts;
