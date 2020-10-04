import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { ColDef, RowDataTransaction } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { AgGridReact as AgGridReactType } from 'ag-grid-react/lib/agGridReact';

import { AsxSymbolStat, SectorType, STRING_TO_COLOUR } from '../../types/dataTypes';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducer';

import '../../css/_daily-prices.scss';
import { dateRenderer } from './Renderers';
import DailyPricesCharts from './DailyPricesCharts';

const fieldName = (header: keyof AsxSymbolStat | 'company' | 'sector' | 'state'): string => header;


const columnDefs: ColDef[] = [
  {
    headerName: 'Symbol',
    field: fieldName('symbol'),
    width: 70,
    tooltipField: 'company',
  },
  {
    headerName: 'Company',
    field: fieldName('company'),
    tooltipField: 'company',
  },
  {
    headerName: 'Sector',
    field: fieldName('sector'),
    maxWidth: 180,
    cellStyle: (params) => ({
      color: STRING_TO_COLOUR[params.value as SectorType],
    }),
    tooltipField: 'sector',
  },
  {
    headerName: 'State',
    field: fieldName('state'),
    width: 70,
  },
  {
    headerName: 'Jan. Avg',
    field: fieldName('janAvg'),
    maxWidth: 75,
  },
  {
    headerName: 'Lowest Price',
    field: fieldName('lowestPrice'),
    maxWidth: 85,
  },
  {
    headerName: 'Lowest Date',
    field: fieldName('lowestDate'),
    cellRenderer: (params) => dateRenderer(params.value),
    maxWidth: 85,
  },
  {
    headerName: 'Current Price',
    field: fieldName('currentPrice'),
    maxWidth: 85
  },
  {
    headerName: 'Recovered From Avg.',
    field: fieldName('recovered'),
    cellClass: (params) => {
      if (params.value <= 25) return 'recovered dark-red';
      if (params.value <= 50) return 'recovered red';
      if (params.value <= 75) return 'recovered orange';
      if (params.value < 100) return 'recovered yellow';
      return 'recovered green';
    },
    width: 85,
  },
];

function DailyPrices(): ReactElement {
  const grid = useRef<AgGridReactType>(null);

  const priceData = useSelector((state: RootState) => ({
    priceData: state.data.symbolStats,
    symbols: state.data.symbols,
  }));

  const [selectedSymbol, setSelectedSymbol] = useState('');

  useEffect(() => {
    const transaction: RowDataTransaction = { update: [] };

    grid.current?.api?.forEachNode((node) => {
      const data = node.data;
      const symbolData = priceData.symbols[node.data.symbol];

      data.company = symbolData.company;
      data.sector = symbolData.sector;
      data.state = symbolData.state;
      transaction.update?.push(data);
    });

    grid.current?.api?.applyTransaction(transaction);

  }, [priceData.priceData, priceData.symbols]);

  useEffect(() => {
    if (!selectedSymbol.length && Object.keys(priceData.symbols).length) {
      setSelectedSymbol(Object.keys(priceData.symbols)[0]);
    }
  }, [selectedSymbol, priceData.symbols]);

  return (
    <div className="asx-daily-prices">
      <div className="asx-grid">
        <AgGridReact
          ref={grid}
          defaultColDef={{ sortable: true, filter: true, resizable: true }}
          columnDefs={columnDefs}
          enableBrowserTooltips={true}
          onGridReady={() => grid.current?.api?.sizeColumnsToFit()}
          getRowNodeId={(data) => data.symbol}
          rowData={priceData.priceData}
          onRowClicked={(e) => setSelectedSymbol(e.data.symbol)}
          rowStyle={{ cursor: 'pointer' }}
        />
      </div>
      <DailyPricesCharts
        selectedSymbol={selectedSymbol}
      />
    </div>
  );
}

export default DailyPrices;
