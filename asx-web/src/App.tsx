import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import DailyPrices from './components/DailyPrices/DailyPrices';

import './css/App.scss';
import './css/_grid.scss';

import { RootState } from './redux/reducer';
import { WebSocketProvider } from './components/WebSocket/WebSocket';

function App(): ReactElement {
  const asxData = useSelector((state: RootState) => ({
    symbols: state.data.symbols,
    prices: state.data.prices,
  }));

  return (
    <WebSocketProvider>
      <div className="asx-wrapper">
        <header className="asx-header">
          <span>Number Of Symbols: {Object.keys(asxData.symbols).length}</span>
          <div className="asx-symbols">
            {/* {Object.keys(asxData.symbols).map((x, i) => (
              <div key={x} className="symbol">
                {x}: {asxData.symbols[x].company}
              </div>
            ))} */}
          </div>
          <span>Price Points: {asxData.prices.length} </span>
        </header>
        <div className="asx-body">
          <DailyPrices />
        </div>
      </div>
    </WebSocketProvider>
  );
}

export default App;
