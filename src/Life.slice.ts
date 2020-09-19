import * as Comlink from 'comlink';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LifeWorker } from './Life.worker';
import { createAppThunk } from '.';

const size = 100;
const w = new Worker('./Life.worker.ts', { type: 'module' });
const worker = Comlink.wrap<LifeWorker>(w);

const getInitialRows = () => {
  return [...Array(size)].map((_, x) => {
    return [...Array(size)].map((_, y) => !!localStorage.getItem(`${x}${y}`));
  });
};

export const requestNextState = createAppThunk(
  'life/next',
  async (_, thunk) => {
    const next = await worker.getNext(thunk.getState());
    return next;
  }
);

const lifeSlice = createSlice({
  name: 'life',
  initialState: {
    cells: getInitialRows(),
  },
  reducers: {
    flip: (state, action: PayloadAction<{ x: number; y: number }>) => {
      const { x, y } = action.payload;
      state.cells[x][y] = !state.cells[x][y];
    },
    clear: (state) => {
      state.cells = getInitialRows();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(requestNextState.fulfilled, (state, action) => {
      state.cells = action.payload;
    });
  },
});

export const { flip, clear } = lifeSlice.actions;

export default lifeSlice.reducer;
