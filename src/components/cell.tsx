import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState, AppDispatch } from '..';
import { flip } from '../Life.slice';
import { styled } from 'linaria/react';

const StyledCell = styled.div<{ alive: boolean; visible: boolean }>`
  background: ${(props) => (props.alive ? '#00000057' : 'orange')};
  opacity: ${(props) => (props.visible ? 1 : 0)};
`;

const cell = ({
  x,
  y,
  edgeX,
  edgeY,
  alive,
  flip,
}: PropsFromRedux & OwnProps) => {
  const handleClick = () => {
    const str = alive ? '1' : '';
    localStorage.removeItem(`${x}${y}`);

    if (!alive) {
      localStorage.setItem(`${x}${y}`, 'true');
    }

    flip({ x, y });
  };

  const onMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log(e.buttons);
    if (e.buttons == 1) {
      localStorage.setItem(`${x}${y}`, 'true');
      if (!alive) {
        flip({ x, y });
      }
    }
  };

  return (
    <StyledCell
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      className="cell"
      alive={alive}
      visible={!(edgeX || edgeY)}
    />
  );
};

const mapStateToProps = (state: RootState, { x, y }: OwnProps) => {
  return {
    edgeX: x < 2 || x >= state.life.cells.length - 2,
    edgeY: y < 2 || y >= state.life.cells.length - 2,
    alive: state.life.cells[x][y],
  };
};

const mapD = (dispatch: AppDispatch) => {
  return {
    flip: ({ x, y }: OwnProps) => dispatch(flip({ x, y })),
  };
};

type OwnProps = {
  x: number;
  y: number;
};
const connector = connect(mapStateToProps, mapD);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const Cell = connector(cell);
