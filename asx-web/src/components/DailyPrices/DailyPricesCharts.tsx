import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RootState } from '../../redux/reducer';

const SECTOR_TO_COLOUR: Record<string, unknown> = {
  'Real Estate': '#960000',
  'Materials': '#007109',
  'Information Technology': '#1af4ff',
  'Utilities': '#d8f10b',
  'Industrials': '#f1a00b',
  'Health Care': '#e00e0e',
  'Consumer Discretionary': '#901190',
  'Financials': '#02de13',
};

function DailyPricesCharts(): ReactElement {
  const priceData = useSelector((state: RootState) => ({
    prices: state.data.prices,
    symbols: state.data.symbols,
  }));


  const tmpPrices: { [key: number]: { [symbol: string]: number | string, name: string } } = {};

  priceData.prices.forEach((point) => {
    const val = tmpPrices[point.date];

    if (val === undefined) {
      tmpPrices[point.date] = { name: new Date(point.date).toLocaleDateString(), [point.symbol]: point.price };
    } else {
      tmpPrices[point.date][point.symbol] = point.price;
    }
  });

  const priceKeys = Object.keys(tmpPrices);
  priceKeys.sort((a, b) => Number(a) - Number(b));

  const prices: { [symbol: string]: number | string, name: string }[] = priceKeys.map(key => tmpPrices[Number(key)]);
  const lines: ReactElement[] = Object.keys(priceData.symbols).map((x, i) => {
    let colour = SECTOR_TO_COLOUR[priceData.symbols[x]?.sector];
    if (colour === undefined) colour = '#ff00bc';

    return <Line
      key={x}
      type="monotone"
      dataKey={x}
      dot={false}
      stroke={colour as string}
    />;
  });

  return (
    <div className="asx-prices-charts">
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={prices}>
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
