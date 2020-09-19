import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState, AppDispatch } from '..';
import { requestNextState, clear } from '../Life.slice';
import { play, pause } from '../ui.slice';

const map = (s: number, a1: number, a2: number, b1: number, b2: number) => {
  return b1 + ((s - a1) * (b2 - b1)) / (a2 - a1);
};

const Component: React.FunctionComponent<PropsFromRedux> = ({
  status,
  tick,
  play,
  pause,
  clear,
  calcTime,
  generation,
}) => {
  const [playbackSpeed, setPlaybackSpeed] = useState(0.85);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaybackSpeed(e.target.valueAsNumber);
  };

  const handleReset = () => {
    localStorage.clear();
    clear();
  };

  useEffect(() => {
    if (status == 'playing') {
      tick();
      const tt = map(1 - playbackSpeed, 0, 1, 0, 600);
      const interval = setInterval(tick, Math.max(1000 / 60, tt));
      return () => clearInterval(interval);
    }
    return () => {};
  }, [status, playbackSpeed]);

  return (
    <div className="controls">
      <div className="buttons">
        <button onClick={play} disabled={status === 'playing'}>
          Play
        </button>
        <button onClick={pause} disabled={status === 'paused'}>
          Pause
        </button>
        <button onClick={tick} disabled={status === 'playing'}>
          Next
        </button>
        <button onClick={handleReset} disabled={status === 'playing'}>
          Clear
        </button>
      </div>
      <div>Generation: {generation}</div>
      <div>Calc time: {calcTime}ms</div>
      <div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={playbackSpeed}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    status: state.ui.status,
    calcTime: (
      state.ui.times.reduce((a, b) => a + b) / state.ui.times.length
    ).toFixed(2),
    generation: state.ui.generation,
  };
};

const mapd = (dispatch: AppDispatch) => {
  return {
    tick: () => dispatch(requestNextState()),
    play: () => dispatch(play()),
    pause: () => dispatch(pause()),
    clear: () => dispatch(clear()),
  };
};

type StateProps = ReturnType<typeof mapStateToProps>;

const connector = connect(mapStateToProps, mapd);
type PropsFromRedux = ConnectedProps<typeof connector>;

export const Controls = connector(Component);
