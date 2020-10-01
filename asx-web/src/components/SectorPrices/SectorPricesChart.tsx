import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Line, LineChart, ResponsiveContainer, /* Tooltip, */ XAxis, YAxis } from 'recharts';
import { RootState } from '../../redux/reducer';
import { SectorDefaults, SectorType, SECTOR_TO_COLOUR } from '../../types/dataTypes';
import SectorFilter from './SectorFilter';



function SectorPricesChart(): ReactElement {
  const [sectorsExcluded, setSectorsExcluded] = useState<string[]>([]);
  const [pricePoints, setPricePoints] = useState<{ [symbol: string]: number | string, name: string }[]>([]);
  const [lines, setLines] = useState<ReactElement[]>([]);

  const priceData = useSelector((state: RootState) => ({
    prices: state.data.prices,
    symbols: state.data.symbols,
  }));

  useEffect(() => {
    const tmpPrices: Map<number, { [sector in SectorType]: number }> = new Map();
    const prices = sectorsExcluded.length
      ? priceData.prices.filter((point) => !sectorsExcluded.includes(priceData.symbols[point.symbol].sector))
      : priceData.prices;

    prices.forEach((point) => {
      const val = tmpPrices.get(point.date);
      const sector = priceData.symbols[point.symbol].sector;

      if (val === undefined) {
        const defaultSector = { ...SectorDefaults };
        defaultSector[sector] = point.price;
        tmpPrices.set(point.date, defaultSector);
      } else if (val[sector] === undefined) {
        val[sector] = point.price;
      } else {
        val[sector] += point.price;
      }
    });

    const priceKeys = Array.from(tmpPrices.keys());
    priceKeys.sort((a, b) => Number(a) - Number(b));

    const firstDate = Number(priceKeys[0]);
    const baselinePrices = tmpPrices.get(firstDate);

    if (baselinePrices !== undefined) {
      const sectorPrices: typeof pricePoints = [];
      for (let i = 1; i < priceKeys.length; i++) {
        const date = Number(priceKeys[i]);
        const p = tmpPrices.get(date);
        if (p) {
          Object.keys(p).forEach((s) => {
            const sector = s as SectorType;
            const change = (baselinePrices[sector] - p[sector]) / baselinePrices[sector];
            p[sector] = 100 - (change * 100);
          });
          sectorPrices.push({ ...p, name: new Date(date).toLocaleDateString() });
        }
      }

      setPricePoints(sectorPrices);
      setLines(Object.keys(SectorDefaults).map((x, i) => {
        let colour = SECTOR_TO_COLOUR[x];
        if (colour === undefined) colour = '#ffffff';

        return <Line
          key={x}
          type="monotone"
          dataKey={x}
          dot={false}
          stroke={colour as string}
        />;
      }));
    }
  }, [sectorsExcluded, priceData.prices.length, priceData.symbols]);

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
          <XAxis dataKey="name" tickSize={5} />
          <YAxis domain={['auto', 'auto']} tickFormatter={(val) => Number(val).toFixed(2) + '%'} />
          {/* <Tooltip
            isAnimationActive={false}
            wrapperStyle={{ backgroundColor: '#0b0a18' }}
          /> */}
          {lines}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SectorPricesChart;
