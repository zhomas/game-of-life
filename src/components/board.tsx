import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '..';
import { Cell } from './cell';
import { styled } from 'linaria/react';

type Props = ConnectedProps<typeof connector>;

const Container = styled.div`
  background: #547a86;
  flex: 1 1;
  display: flex;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
`;

const Grid = styled.div<{ size: number }>`
  display: grid;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  grid-template-columns: repeat(${(props) => props.size}, 1fr);
  grid-template-rows: repeat(${(props) => props.size}, 1fr);
`;

const Island = styled.div`
  width: 100%;
  max-width: 100vh;
  position: relative;

  &:after {
    background: #547a86;
    display: block;
    content: '';
    padding-bottom: 100%;
  }
`;

const _Board: React.FunctionComponent<Props> = ({ size }) => (
  <Container>
    <Island>
      <Grid size={size}>
        {[...Array(size * size)].map((_, i) => {
          const x = i % size;
          const y = (i - x) / size;
          return <Cell key={i} x={x} y={y} />;
        })}
      </Grid>
    </Island>
  </Container>
);

const mapStateToProps = (state: RootState) => {
  return {
    size: state.life.cells.length,
  };
};

const connector = connect(mapStateToProps);

export const LifeBoard = connector(_Board);
