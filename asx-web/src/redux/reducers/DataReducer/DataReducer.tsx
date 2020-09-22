import { createReducer, ActionType } from 'typesafe-actions';
import { AsxPrice, AsxSymbol, AsxSymbolStat } from '../../../types/dataTypes';
import Actions from './DataActions';

export type DataState = {
  symbols: { [key: string]: AsxSymbol };
  prices: AsxPrice[];
  symbolStats: AsxSymbolStat[];
};

const initialState: DataState = {
  symbols: {},
  prices: [],
  symbolStats: [],
};

export type RootAction = ActionType<typeof import('./DataActions').default>;
declare module 'typesafe-actions' {
  interface Types {
    RootAction: RootAction;
  }
}

export const DataReducer = createReducer(initialState)
  .handleAction(Actions.addSymbols, (state, action) => ({ ...state, symbols: action.payload }))
  .handleAction(Actions.addPrices, (state, action) => ({
    ...state,
    prices: action.payload.priceData,
    symbolStats: action.payload.symbolStats,
  }));
