import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { ColDef, RowDataTransaction } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { AgGridReact as AgGridReactType } from 'ag-grid-react/lib/agGridReact';

import { AsxSymbolStat } from '../../types/dataTypes';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducer';

import '../../css/_daily-prices.scss';
import { dateRenderer } from './Renderers';
import DailyPricesCharts from './DailyPricesCharts';

const fieldName = (header: keyof AsxSymbolStat | 'company' | 'sector'): string => header;


const columnDefs: ColDef[] = [
  {
    headerName: 'Symbol',
    field: fieldName('symbol'),
    width: 70,
  },
  {
    headerName: 'Company',
    field: fieldName('company'),
  },
  {
    headerName: 'Sector',
    field: fieldName('sector'),
    maxWidth: 200,
  },
  {
    headerName: 'Highest Price',
    field: fieldName('highestPrice'),
    maxWidth: 85,
  },
  {
    headerName: 'Highest Date',
    field: fieldName('highestDate'),
    cellRenderer: (params) => dateRenderer(params.value),
    maxWidth: 85,
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
    headerName: 'Recovered %',
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
      data.company = priceData.symbols[node.data.symbol].company;
      data.sector = priceData.symbols[node.data.symbol].sector;
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
