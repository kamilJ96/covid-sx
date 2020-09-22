import { combineReducers } from 'redux';
import { StateType } from 'typesafe-actions';

import { DataReducer } from './reducers/DataReducer/DataReducer';

export const rootReducer = combineReducers({
  data: DataReducer,
});

export type RootState = StateType<typeof rootReducer>;
