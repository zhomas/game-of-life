import * as Comlink from 'comlink';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LifeWorker } from './Life.worker';
import { createAppThunk } from '.';
import { requestNextState } from './Life.slice';

type UIState = {
  generation: number;
  status: 'playing' | 'paused';
  requestTime: number;
  completeTime: number;
  times: number[];
};

const initialState: UIState = {
  status: 'paused',
  generation: 0,
  requestTime: 0,
  completeTime: 0,
  times: [0],
};

const uiSlice = createSlice({
  name: 'life',
  initialState: initialState,
  reducers: {
    play: (state) => {
      state.status = 'playing';
    },
    pause: (state) => {
      state.status = 'paused';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(requestNextState.pending, (state) => {
      state.requestTime = performance.now();
    });
    builder.addCase(requestNextState.fulfilled, (state) => {
      const t = performance.now();
      state.completeTime = t;

      const times = [t - state.requestTime, ...state.times];

      if (times.length > 10) {
        times.splice(0, times.length - 10 + 1);
      }

      state.times = times;
      state.generation++;
    });
  },
});

export const { play, pause } = uiSlice.actions;

export default uiSlice.reducer;
