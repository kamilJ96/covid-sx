import React, { createContext, useContext, useRef, useEffect, ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import DataActions from '../../redux/reducers/DataReducer/DataActions';
import { AsxPrice, AsxSymbol } from '../../types/dataTypes';

import * as c from './constants';

type Props = {
  children: React.ReactNode;
};

type WebsocketContextType = {
  sendMessage: (header: c.MessageHeaders, data?: string) => void;
};

const WebSocketContext = createContext<WebsocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: Props): ReactElement => {
  const dispatch = useDispatch();
  const ws = useRef<WebSocket | null>(null);

  const queuedMessages: string[] = [];
  let sendingQueuedMessage = false;
  let dataRetrieved = false;
  let reconnect = false;

  const sendQueuedMessage = () => {
    if (queuedMessages.length) {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const msg = queuedMessages.splice(0, 1)[0];
        ws.current.send(msg);
      } else {
        setTimeout(() => sendQueuedMessage(), 1000);
      }
    } else {
      sendingQueuedMessage = false;
    }
  };

  const incomingMessage = async (msg: MessageEvent) => {
    const message = await new Response(msg.data).text();
    const header: c.MessageHeaders = message.slice(0, 2) as c.MessageHeaders;

    switch (header) {
      case '00': {
        const prices = message.slice(2).split('|');
        const priceData: AsxPrice[] = [];
        prices.forEach((point) => {
          if (point.length) {
            const [symbol, d, p, v] = point.split(',');
            const date = Number(d);
            const price = Number(p);
            const volume = Number(v);

            if (Number.isInteger(date) && !Number.isNaN(price) && Number.isInteger(volume)) {
              priceData.push({
                symbol,
                date: Number(date),
                price: Number(price),
                volume: Number(volume),
              });
            } else {
              console.error('Price Data Not Well-Formed: ', point);
            }
          }
        });

        dispatch(DataActions.addPrices(priceData));
        break;
      }

      case '01': {
        const symbols: { [key: string]: AsxSymbol } = {};
        const symbolData = message.slice(2).split('|');
        symbolData.forEach((symbolString) => {
          const s = symbolString.split(',');
          if (s.length === 4) {
            const [symbol, company, sector, marketCap] = s;
            symbols[symbol] = { company, sector, marketCap: BigInt(marketCap) };
          }
        });

        dispatch(DataActions.addSymbols(symbols));
        break;
      }

      case '-1':
        console.error('Received Websocket Error Message: ', message.slice(2));
        break;

      default:
        console.error(`Unknown Header: ${header} | Message: ${message.slice(2)}`);
        break;
    }
  };

  const sendMessage = (header: c.MessageHeaders, data = '') => {
    const message = JSON.stringify({ header, data });
    if (ws.current && ws.current.readyState === WebSocket.OPEN) ws.current.send(message);
    else queuedMessages.push(message);
  };

  const open = (_: Event) => {
    console.log('Websocket Open - Queued Messages: ', queuedMessages.length);
    if (queuedMessages.length && !sendingQueuedMessage) {
      sendingQueuedMessage = true;
      sendQueuedMessage();
    }

    if (!dataRetrieved) {
      sendMessage(c.MessageHeaders.SYMBOLS);
      sendMessage(c.MessageHeaders.DAILY_DATA);
      dataRetrieved = true;
    }

    reconnect = false;
  };

  const close = (event: CloseEvent) => {
    console.log('Websocket Closed: ', event.reason, ` [${event.code}]`);
    reconnect = false;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    setTimeout(() => initWebsocket(), 1000);
  };

  const error = (event: Event) => {
    console.error('Websocket Error: ', event);
  };

  const initWebsocket = () => {
    if (ws.current && !reconnect) {
      reconnect = true;
      ws.current.removeEventListener('message', incomingMessage);
      ws.current.removeEventListener('close', close);
      ws.current.removeEventListener('error', error);
      ws.current.removeEventListener('open', open);

      if (
        ws.current.readyState !== WebSocket.CONNECTING ||
        ws.current.readyState !== WebSocket.OPEN
      )
        ws.current.close(1000);

      ws.current = new WebSocket(`ws://${c.SOCKET_SERVER_HOST}:${c.SOCKET_SERVER_PORT}/asx-data`);
      ws.current.addEventListener('message', incomingMessage);
      ws.current.addEventListener('close', close);
      ws.current.addEventListener('error', error);
      ws.current.addEventListener('open', open);
    }
  };

  useEffect(() => {
    ws.current = new WebSocket(`ws://${c.SOCKET_SERVER_HOST}:${c.SOCKET_SERVER_PORT}/asx-data`);
    ws.current.addEventListener('message', incomingMessage);
    ws.current.addEventListener('close', close);
    ws.current.addEventListener('error', error);
    ws.current.addEventListener('open', open);

    return (() => {
      if (ws.current?.readyState === WebSocket.CONNECTING || ws.current?.readyState === WebSocket.OPEN)
        ws.current.close();
    });
  }, []);

  return <WebSocketContext.Provider value={{ sendMessage }}>{children}</WebSocketContext.Provider>;
};

export const useWebsocket = (): WebsocketContextType | undefined => useContext(WebSocketContext);
