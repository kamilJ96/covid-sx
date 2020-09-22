import WebSocket from 'ws';
const { Server } = WebSocket;
import { createServer, IncomingMessage } from 'http';
import { parse } from 'url';
import { Socket } from 'net';

import { Log, validJson } from '../utils/utils.js';
import { ENUM_LOG_LEVELS, SOCKET_SERVER_HOST, SOCKET_SERVER_PORT } from '../utils/constants.js';
import { MessageHeaders, validateClientMessage } from './msgTypes.js';
import { getDataForSymbols, getSymbols } from '../utils/dbQueries.js';

const server = createServer();
const ws = new Server({ noServer: true });

let cachedAsxData = '';
let cachedSymbols = '';

const sendMessage = (conn: WebSocket, data: string, header: string, binary = true): void => {
  conn.send(data, { binary }, (err) => {
    if (err !== undefined) {
      Log('wsSend', ENUM_LOG_LEVELS.ERR, `[HEADER: ${header}] Error Sending Message: ${err.message} | Message Shown Below.`);
      Log('wsSend', ENUM_LOG_LEVELS.ERR, data.slice(0, 50));
    }
  });
};

ws.on('connection', (conn: WebSocket, req: IncomingMessage) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  Log('ws', ENUM_LOG_LEVELS.DEBUG, 'New Connection From: ', ip);

  conn.on('message', async (data) => {
    const msg = validJson(data.toString());
    if (msg) {
      if (validateClientMessage(msg)) {
        switch (msg.header) {
          case '00':
            if (cachedAsxData.length < 10) {
              const symbolData = await setSymbolData();
              if (!symbolData) {
                sendMessage(conn, `${MessageHeaders.ERROR}Failed Getting Symbols.`, 'ASX Data');
                return;
              }

              const asxData = await setAsxData(symbolData);

              if (!asxData) {
                sendMessage(conn, `${MessageHeaders.ERROR}Failed Getting ASX Data.`, 'ASX Data');
                return;
              }
            }

            sendMessage(conn, cachedAsxData, 'ASX Data');
            break;

          case '01':
            if (cachedSymbols.length < 10) {
              const symbolData = await setSymbolData();
              if (!symbolData) {
                sendMessage(conn, `${MessageHeaders.ERROR}Failed Getting Symbols.`, 'ASX Data');
                return;
              }
            }

            sendMessage(conn, cachedSymbols, 'Symbol Data');
        }
      }
    }
  });

  conn.on('error', (err) => {
    Log('ws', ENUM_LOG_LEVELS.ERR, 'Socket Connection Error: ', err.message);
  });
});

server.on('upgrade', async (req: IncomingMessage, sock: Socket, head) => {
  let upgrade = false;

  if (req.url !== undefined) {
    const url = parse(req.url, true);
    const path = url.pathname;

    if (path?.includes('asx-data')) {
      upgrade = true;
    }
  }

  if (upgrade) {
    ws.handleUpgrade(req, sock, head, (client) => {
      ws.emit('connection', client, req);
    });
  }
  else {
    const ip = req.headers['x-forwarded-for'] || sock.remoteAddress;
    Log('serverUpgrade', ENUM_LOG_LEVELS.ERR, 'Unauthorized Upgrade Attempt From: ', ip);
    sock.destroy();
  }
});

const setSymbolData = async (): Promise<string[] | false> => {
  cachedSymbols = MessageHeaders.SYMBOLS.toString();
  const symbols = await getSymbols();
  if (symbols.length) {
    const symbolsString: string[] = [];

    symbols.forEach(s => {
      cachedSymbols += `${s.code},${s.company},${s.sector},${s.market_cap}|`;
      symbolsString.push(s.code);
    });

    return symbolsString;
  }

  Log('startSocket', ENUM_LOG_LEVELS.ERR, 'Failed Getting Symbol Data.');
  return false;
};

const setAsxData = async (symbols: string[]): Promise<string | false> => {
  cachedAsxData = MessageHeaders.DAILY_DATA.toString();
  const data = await getDataForSymbols(symbols);

  if (!data.length) {
    Log('startSocket', ENUM_LOG_LEVELS.ERR, 'Failed Getting Price Data For Symbols: ', symbols.slice(0, 30), '...');
  }

  data.forEach(point => {
    cachedAsxData += `${point.symbol},${Number(point.date)},${point.price},${point.volume}|`;
  });

  return cachedAsxData;
};

export const startSocket = (): void => {
  server.listen(SOCKET_SERVER_PORT, SOCKET_SERVER_HOST, async () => {
    Log('wsServer', ENUM_LOG_LEVELS.INFO, 'Socket Server Listening On: ' + SOCKET_SERVER_PORT);
    const symbolsString = await setSymbolData();
    if (symbolsString !== false) {
      const data = await setAsxData(symbolsString);

      if (data && data.length) Log('wsServer', ENUM_LOG_LEVELS.INFO, 'Successfully Cached ASX/Symbol Data.');
    }
  });
};

startSocket();
