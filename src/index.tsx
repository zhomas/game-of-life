import * as React from 'react';
import { render } from 'react-dom';

import {
  configureStore,
  createAsyncThunk,
  AsyncThunkPayloadCreator,
  combineReducers,
} from '@reduxjs/toolkit';
import './styles.css';
import lifeReducer from './Life.slice';
import uiReducer from './ui.slice';
import { Provider } from 'react-redux';
import { LifeBoard } from './components/board';
import { Controls } from './components/controls';

const rootReducer = combineReducers({
  life: lifeReducer,
  ui: uiReducer,
});

const store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

type ThunkApiConfig = {
  dispatch: AppDispatch;
  state: RootState;
};

export function createAppThunk<Returned = void, ThunkArg = void>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkApiConfig>
) {
  return createAsyncThunk<Returned, ThunkArg, ThunkApiConfig>(
    typePrefix,
    payloadCreator
  );
}

render(
  <Provider store={store}>
    <div className="App">
      <LifeBoard />
      <Controls />
    </div>
  </Provider>,
  document.getElementById('root')
);
