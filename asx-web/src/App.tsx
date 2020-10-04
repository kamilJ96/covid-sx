import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import DailyPrices from './components/DailyPrices/DailyPrices';

import './css/App.scss';
import './css/_grid.scss';

import { RootState } from './redux/reducer';
import { WebSocketProvider } from './components/WebSocket/WebSocket';
import Loading from './components/Loading';
import GroupedPrices from './components/GroupedPrices/GroupedPrices';
import { GroupedKeys } from './types/dataTypes';
import Header from './components/Header/Header';

function App(): ReactElement {
  const [group, setGroup] = useState<GroupedKeys>(GroupedKeys.sector);

  const asxData = useSelector((state: RootState) => ({
    symbols: state.data.symbols,
    prices: state.data.prices,
  }));

  return (
    <WebSocketProvider>
      <div className="asx-wrapper">
        {asxData.prices.length && Object.keys(asxData.symbols).length ? <>
          <Header
            group={group}
            changeGroup={setGroup}
          />
          <div className="asx-body">
            <GroupedPrices groupKey={group} />
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
