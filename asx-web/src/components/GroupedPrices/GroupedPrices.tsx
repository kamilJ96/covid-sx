import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import ReactEcharts from 'echarts-for-react';
import { EChartOption } from 'echarts';
import styles from '../../css/_theme.scss';
import { RootState } from '../../redux/reducer';
import { AsxPrice, AsxSymbol, AsxSymbolStat, GroupedKeys, GroupedTypes, STRING_TO_COLOUR } from '../../types/dataTypes';

type SeriesType = {
  name: string,
  type: 'line',
  stack: string,
  data: { name: string, value: [number, number] }[],
  lineStyle: { color: string },
  showSymbol: false,
  hoverAnimation: false,
};

const defaultSeriesType: SeriesType = {
  name: '',
  type: 'line',
  stack: 'prices',
  data: [],
  lineStyle: { color: '#fff' },
  showSymbol: false,
  hoverAnimation: false,
};

const getOption = (symbols: { [key: string]: AsxSymbol }, prices: AsxPrice[], groupKey: GroupedKeys, symbolStats: AsxSymbolStat[]) => {
  const data: SeriesType[] = [], legendData: EChartOption.Legend.LegendDataObject[] = [];
  const tmpPrices: Map<GroupedTypes, { [date: number]: number }> = new Map();
  const baselineDate = Number(new Date('2020/02/01'));

  prices.forEach((point) => {
    if (point.date >= baselineDate) {
      const group = symbols[point.symbol][groupKey] as GroupedTypes;
      if (group.length) {
        const val = tmpPrices.get(group);

        if (!val) {
          const p = { [point.date]: point.price };
          tmpPrices.set(group, p);
        } else if (!val[point.date]) {
          val[point.date] = point.price;
        } else {
          val[point.date] += point.price;
        }
      }
    }
  });

  const avgPrices: Map<GroupedTypes, number> = new Map();
  symbolStats.forEach(symbol => {
    const group = symbols[symbol.symbol][groupKey] as GroupedTypes;
    if (group.length) {
      const avgGroupPrice = avgPrices.get(group);
      let newPrice = symbol.janAvg;

      if (avgGroupPrice) newPrice += avgGroupPrice;

      avgPrices.set(group, newPrice);
    }
  });

  tmpPrices.forEach((d, group) => {
    const priceKeys = Object.keys(d);
    priceKeys.sort((a, b) => Number(a) - Number(b));

    if (avgPrices.has(group)) {
      const baselinePrice = avgPrices.get(group) as number;
      let colour = STRING_TO_COLOUR[group];
      if (colour === undefined) colour = '#ffffff';

      const groupPrices = { ...defaultSeriesType };
      groupPrices.name = group;
      groupPrices.data = [({ name: new Date(baselineDate).toLocaleDateString(), value: [baselineDate, 100] })];
      groupPrices.lineStyle = { color: colour };
      groupPrices.stack = group;

      legendData.push({ name: group, textStyle: { color: colour } });

      for (let i = 1; i < priceKeys.length; i++) {
        const date = Number(priceKeys[i]);
        const p = d[date];
        if (p) {
          const change = 100 - ((baselinePrice - p) / baselinePrice) * 100;
          groupPrices.data.push({ name: new Date(date).toLocaleDateString(), value: [date, change] });
        }
      }

      data.push(groupPrices);
    }
  });

  const option: EChartOption = {
    textStyle: { color: styles.fontColour, },
    grid: {
      left: '5%',
      right: '10%',
    },
    title: {
      text: `Relative Performance Over Time By ${groupKey.toUpperCase()}`,
      textStyle: { color: styles.fontColour, },
    },
    dataZoom: [
      {
        type: 'inside',
        show: true,
      }
    ],
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

type GroupedPricesProps = {
  groupKey: GroupedKeys,
};

function GroupedPrices(props: GroupedPricesProps): ReactElement {
  const priceData = useSelector((state: RootState) => ({
    prices: state.data.prices,
    symbols: state.data.symbols,
    symbolStats: state.data.symbolStats,
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
        option={getOption(priceData.symbols, priceData.prices, props.groupKey, priceData.symbolStats)}
        notMerge={true}
        lazyUpdate={true}
        style={{ height: '100%', width: '100%' }}
      // onChartReady={(chart: ECharts) => setChartInstance(chart)}
      />
    </div>
  );
}

export default GroupedPrices;
