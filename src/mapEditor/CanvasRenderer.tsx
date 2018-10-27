import * as React from 'react';
import { MapData } from '../Types';
import draw from '../draw';
import { State } from './reducers';
import { connect } from 'react-redux';

export interface RenderedMapProps {
  map: MapData
}

class RenderedMap extends React.Component<RenderedMapProps> {
  canvas: HTMLCanvasElement;

  constructor(props: RenderedMapProps) {
    super(props);
    this.state = {map: props.map};
  }

  componentDidMount() {
    this.updateCanvas();
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  updateCanvas() {
    draw(this.props.map, this.canvas);
  }

  render() {
    return (
      <canvas id="mapCanvas" ref={el => this.canvas = el}></canvas>
    );
  }
}

function mapStateToProps(state: State): RenderedMapProps {
  return {map: state.data};
}

export const ConnectedRenderedMap = connect(mapStateToProps)(RenderedMap);
