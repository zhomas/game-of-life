import * as comlink from 'comlink';
import { RootState } from '.';

const neigh = (state: RootState) => (_x: number, _y: number): 0 | 1 => {
  if (_x < 0) return 0;
  if (_y < 0) return 0;
  if (_x > state.life.cells.length - 1) return 0;
  if (_y > state.life.cells.length - 1) return 0;

  return state.life.cells[_x][_y] ? 1 : 0;
};

const getNextAlive = (x: number, y: number, state: RootState): boolean => {
  const getValue = neigh(state);

  const alive = getValue(x, y);

  const count =
    getValue(x, y + 1) +
    getValue(x, y - 1) +
    getValue(x - 1, y) +
    getValue(x + 1, y) +
    getValue(x - 1, y + 1) +
    getValue(x + 1, y + 1) +
    getValue(x + 1, y - 1) +
    getValue(x - 1, y - 1);

  return (alive && (count == 2 || count == 3)) || (!alive && count == 3);
};

const output = {
  getNext: (state: RootState) => {
    const size = state.life.cells.length;
    return [...Array(size)].map((_, x) => {
      return [...Array(size)].map((_, y) => getNextAlive(x, y, state));
    });
  },
};

export type LifeWorker = typeof output;

comlink.expose(output);
