import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import ReactEcharts from 'echarts-for-react';
import { EChartOption } from 'echarts';
import styles from '../../css/_theme.scss';
import { RootState } from '../../redux/reducer';
import { AsxPrice, AsxSymbol, GroupedTypes, SectorType, STRING_TO_COLOUR } from '../../types/dataTypes';

type SeriesType = {
  name: SectorType,
  type: 'line',
  stack: string,
  data: { name: string, value: [number, number] }[],
  lineStyle: { color: string },
  showSymbol: false,
  hoverAnimation: false,
};

const defaultSeriesType: SeriesType = {
  name: 'Energy',
  type: 'line',
  stack: 'prices',
  data: [],
  lineStyle: { color: '#fff' },
  showSymbol: false,
  hoverAnimation: false,
};

const getOption = (symbols: { [key: string]: AsxSymbol }, prices: AsxPrice[]) => {
  const data: SeriesType[] = [], legendData: EChartOption.Legend.LegendDataObject[] = [];
  const tmpPrices: Map<SectorType, { [date: number]: number }> = new Map();

  prices.forEach((point) => {
    const sector = symbols[point.symbol].sector;
    const val = tmpPrices.get(sector);

    if (!val) {
      const p = { [point.date]: point.price };
      tmpPrices.set(sector, p);
    } else if (!val[point.date]) {
      val[point.date] = point.price;
    } else {
      val[point.date] += point.price;
    }
  });

  tmpPrices.forEach((d, sector) => {
    const priceKeys = Object.keys(d);
    priceKeys.sort((a, b) => Number(a) - Number(b));

    const firstDate = Number(priceKeys[0]);
    const baselinePrice = d[firstDate];

    if (baselinePrice !== undefined) {
      let colour = STRING_TO_COLOUR[sector];
      if (colour === undefined) colour = '#ffffff';

      const sectorPrices = { ...defaultSeriesType };
      sectorPrices.name = sector;
      sectorPrices.data = [({ name: new Date(firstDate).toLocaleDateString(), value: [firstDate, 100] })];
      sectorPrices.lineStyle = { color: colour };
      sectorPrices.stack = sector;

      legendData.push({ name: sector, textStyle: { color: colour } });

      for (let i = 1; i < priceKeys.length; i++) {
        const date = Number(priceKeys[i]);
        const p = d[date];
        if (p) {
          const change = 100 - ((baselinePrice - p) / baselinePrice) * 100;
          sectorPrices.data.push({ name: new Date(date).toLocaleDateString(), value: [date, change] });
        }
      }

      data.push(sectorPrices);
    }
  });

  const option: EChartOption = {
    textStyle: { color: styles.fontColour, },
    grid: {
      left: '5%',
      right: '10%',
    },
    title: {
      text: 'Cumulative Sector Prices Over Time',
      textStyle: { color: styles.fontColour, },
    },
    legend: {
      show: true,
      orient: 'vertical',
      right: 0,
      data: legendData,
      icon: 'none',
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#000000cc',
      formatter: function (params) {
        let tooltip = '<div>';
        const sectorTooltips: string[] = [];
        let date = '';

        if (Array.isArray(params)) {
          params.forEach(param => {
            const colour = param.seriesName ? STRING_TO_COLOUR[param.seriesName as GroupedTypes] : '#fff';
            const value = param.value as [number, number];
            sectorTooltips.push(`<div style="color:${colour}">${param.seriesName}: <strong>${value[1].toFixed(2)}%</strong></div>`);

            if (param.axisValueLabel) date = param.axisValueLabel;
          });
        }

        tooltip += `<div><strong>${date}</strong></div>`;
        tooltip += sectorTooltips.join('\n');
        tooltip += '</div>';

        return tooltip;
      },
    },
    xAxis: {
      type: 'time',
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      splitLine: { show: false },
    },
    series: data,
  };

  return option;
};

function SectorPricesChart(): ReactElement {
  const priceData = useSelector((state: RootState) => ({
    prices: state.data.prices,
    symbols: state.data.symbols,
  }));

  return (
    <div className="asx-prices-charts">
      {/* <SectorFilter
        sectors={Object.keys(SECTOR_TO_COLOUR)}
        sectorColours={SECTOR_TO_COLOUR}
        sectorsExcluded={sectorsExcluded}
        clickSector={setSectorsExcluded}
      /> */}
      <ReactEcharts
        option={getOption(priceData.symbols, priceData.prices)}
        notMerge={true}
        lazyUpdate={true}
        style={{ height: '100%', width: '100%' }}
      // onChartReady={(chart: ECharts) => setChartInstance(chart)}
      />
    </div>
  );
}

export default SectorPricesChart;
