import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import ReactEcharts from 'echarts-for-react';
import { EChartOption } from 'echarts';
import { RootState } from '../../redux/reducer';
import { AsxPrice, AsxSymbol, STRING_TO_COLOUR } from '../../types/dataTypes';
import styles from '../../css/_theme.scss';


type DailyPricesChartsProps = {
  selectedSymbol: string,
};

const getOption = (symbol: string, symbols: { [key: string]: AsxSymbol }, prices: AsxPrice[], title: string) => {
  if (!symbol.length) return {};

  const priceData: { name: string, value: [number, number] }[] = [];
  const minMax: { min: number, max: number } = { min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER };

  prices.forEach((point) => {
    if (point.symbol === symbol) {
      priceData.push({ name: new Date(point.date).toLocaleDateString(), value: [point.date, point.price] });

      if (point.price > minMax.max) minMax.max = point.price;
      if (point.price < minMax.min) minMax.min = point.price;
    }
  });

  let colour = STRING_TO_COLOUR[symbols[symbol]?.sector];
  if (colour === undefined) colour = '#ffffff';

  minMax.min = Math.floor(minMax.min);
  minMax.max = Math.ceil(minMax.max);

  const option: EChartOption = {
    title: {
      text: title,
      textStyle: { color: styles.fontColour, },
    },
    textStyle: { color: styles.fontColour, },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        if (Array.isArray(params)) {
          const date = params[0].name;
          const value = params[0].value as [number, number];

          return `${date}: $${value[1]}`;
        }
        return '';
      },
    },
    dataZoom: [
      {
        type: 'inside',
        show: true,
      }
    ],
    xAxis: {
      type: 'time',
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      splitLine: { show: false },
      ...minMax
    },
    series: [{
      name: 'Price',
      type: 'line',
      showSymbol: false,
      hoverAnimation: false,
      data: priceData,
      lineStyle: {
        color: colour,
      }
    }],
  };

  return option;
};

function DailyPricesCharts(props: DailyPricesChartsProps): ReactElement {
  const priceData = useSelector((state: RootState) => ({
    prices: state.data.prices,
    symbols: state.data.symbols,
  }));

  const title = `${props.selectedSymbol} - ${priceData.symbols[props.selectedSymbol]?.company} - ${priceData.symbols[props.selectedSymbol]?.sector}`;
  const option = getOption(props.selectedSymbol, priceData.symbols, priceData.prices, title);

  return (
    <div className="asx-chart">
      <ReactEcharts
        option={option}
        notMerge={true}
        lazyUpdate={true}
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
}

export default DailyPricesCharts;
