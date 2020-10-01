import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Label, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RootState } from '../../redux/reducer';
import { SECTOR_TO_COLOUR } from '../../types/dataTypes';

type DailyPricesChartsProps = {
  selectedSymbol: string,
};

function DailyPricesCharts(props: DailyPricesChartsProps): ReactElement {
  const [pricePoints, setPricePoints] = useState<{ price: number, name: string }[]>([]);
  const [lines, setLines] = useState<ReactElement>(<></>);

  const priceData = useSelector((state: RootState) => ({
    prices: state.data.prices,
    symbols: state.data.symbols,
  }));

  useEffect(() => {
    const tmpPrices: { [key: number]: { price: number, name: string } } = {};
    const symbol = props.selectedSymbol;
    if (!symbol.length) return;

    priceData.prices.forEach((point) => {
      if (point.symbol === symbol)
        tmpPrices[point.date] = { name: new Date(point.date).toLocaleDateString(), price: point.price };
    });

    const priceKeys = Object.keys(tmpPrices);
    priceKeys.sort((a, b) => Number(a) - Number(b));

    let colour = SECTOR_TO_COLOUR[priceData.symbols[symbol]?.sector];
    if (colour === undefined) colour = '#ffffff';

    setPricePoints(priceKeys.map(key => tmpPrices[Number(key)]));
    setLines(<Line
      type="monotone"
      key={symbol}
      dataKey={'price'}
      dot={false}
      name='Price'
      stroke={colour as string}
    />
    );
  }, [priceData.prices.length, priceData.symbols, props.selectedSymbol]);

  return (
    <div className="asx-chart">
      <span className="chart-title">{props.selectedSymbol} - {priceData.symbols[props.selectedSymbol]?.company} - {priceData.symbols[props.selectedSymbol]?.sector}</span>
      <ResponsiveContainer width='100%' height='99%'>
        <LineChart data={pricePoints}>
          <XAxis
            dataKey="name"
            label='Date'
          />
          <YAxis
            domain={['auto', 'auto']}
          >
            <Label
              angle={-90}
              value='Price'
              position='insideLeft'
              style={{ textAnchor: 'middle' }}
            />
          </YAxis>
          <Tooltip
            isAnimationActive={false}
            labelFormatter={(value) => `Date: ${value}`}
          />
          {lines}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DailyPricesCharts;
