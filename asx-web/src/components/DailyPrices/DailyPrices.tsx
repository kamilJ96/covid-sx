import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { ColDef, RowDataTransaction } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { AgGridReact as AgGridReactType } from 'ag-grid-react/lib/agGridReact';

import { AsxSymbolStat } from '../../types/dataTypes';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducer';

import '../../css/_daily-prices.scss';
import { dateRenderer } from './Renderers';

const fieldName = (header: keyof AsxSymbolStat | 'company' | 'sector'): string => header;


const columnDefs: ColDef[] = [
  {
    headerName: 'Symbol',
    field: fieldName('symbol'),
    width: 75,
  },
  {
    headerName: 'Company',
    field: fieldName('company'),
  },
  {
    headerName: 'Sector',
    field: fieldName('sector'),
  },
  {
    headerName: 'Highest Price',
    field: fieldName('highestPrice'),
  },
  {
    headerName: 'Highest Date',
    field: fieldName('highestDate'),
    cellRenderer: (params) => dateRenderer(params.value),
  },
  {
    headerName: 'Lowest Price',
    field: fieldName('lowestPrice'),
  },
  {
    headerName: 'Lowest Date',
    field: fieldName('lowestDate'),
    cellRenderer: (params) => dateRenderer(params.value),
  },
  {
    headerName: 'Current Price',
    field: fieldName('currentPrice'),
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
    }
  },
];

function DailyPrices(): ReactElement {
  const grid = useRef<AgGridReactType>(null);

  const priceData = useSelector((state: RootState) => ({
    priceData: state.data.symbolStats,
    symbols: state.data.symbols,
  }));

  useEffect(() => {
    const transaction: RowDataTransaction = { update: [] };

    grid.current?.api?.forEachNode((node) => {
      const data = node.data;
      data.company = priceData.symbols[node.data.symbol].company;
      data.sector = priceData.symbols[node.data.symbol].sector;
      transaction.update?.push(data);
    });

    grid.current?.api?.applyTransaction(transaction);

  }, [priceData.priceData]);

  return (
    <div className="asx-daily-prices asx-grid">
      <AgGridReact
        ref={grid}
        defaultColDef={{ sortable: true, filter: true }}
        columnDefs={columnDefs}
        getRowNodeId={(data) => data.symbol}
        rowData={priceData.priceData}
      />
    </div>
  );
}

export default DailyPrices;
