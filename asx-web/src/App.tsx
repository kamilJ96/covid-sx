import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import DailyPrices from './components/DailyPrices/DailyPrices';

import './css/App.scss';
import './css/_grid.scss';

import { RootState } from './redux/reducer';
import { WebSocketProvider } from './components/WebSocket/WebSocket';
import Loading from './components/Loading';
import SectorPricesChart from './components/SectorPrices/SectorPricesChart';

function App(): ReactElement {
  const asxData = useSelector((state: RootState) => ({
    symbols: state.data.symbols,
    prices: state.data.prices,
  }));

  return (
    <WebSocketProvider>
      <div className="asx-wrapper">
        {asxData.prices.length && Object.keys(asxData.symbols).length ? <>
          <header className="asx-header">
            <span>Number Of Symbols: {Object.keys(asxData.symbols).length}</span>
            <span>Price Points: {asxData.prices.length} </span>
          </header>
          <div className="asx-body">
            <SectorPricesChart />
            <DailyPrices />
          </div>
        </>
          :
          <Loading />}
      </div>
    </WebSocketProvider>
  );
}

export default App;
