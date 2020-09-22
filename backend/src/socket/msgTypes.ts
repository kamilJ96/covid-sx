export enum MessageHeaders {
  DAILY_DATA = '00',
  SYMBOLS = '01',
  ERROR = '-1'
}

export type ClientMessage = {
  header: MessageHeaders,
}

export const validateClientMessage = (msg: {[key: string]: unknown}): msg is ClientMessage => {
  return msg.header && Object.values(MessageHeaders).includes(msg.header as MessageHeaders); 
};
