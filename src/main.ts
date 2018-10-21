import './style.scss';
import plotFn from './routes/adjusted2';
import routeEditor, { ChangeListener } from './mapEditor/MapEditor';
import { LineType, MapData, MapPlot } from './MapPlot';

function loadPlot(): MapPlot {
  const data = localStorage.getItem('plotData');
  if (data) {
    const struct: MapData = JSON.parse(data);
    return new MapPlot(struct);
  } else {
    return plotFn();
  }
}

window.addEventListener('DOMContentLoaded', function() {
  let plot = loadPlot();
  const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
  const pre1 = document.getElementById('routes');
  const pre2 = document.getElementById('routes2');

  function render() {
    plot.draw(canvas);
/*    pre1.innerHTML = '';
    pre2.innerHTML = '';
    plot.routes.filter(r => r.opts.type !== LineType.NONE && r.endLabel)
    .filter(r => !r.previousId || (r.previousId && r.previous.endLabel))
    .forEach(r => {
      const startPt = r.previousId ? r.previous.endLabel : plot.startLabel;
      let txt = `${startPt} - ${r.endLabel}: ${r.heading}°, ${r.distance}'`;
      pre1.innerHTML += txt + '\n';
      txt = `${r.endLabel} - ${startPt}: ${adjust(r.heading)}°, ${r.distance}'`;
      pre2.innerHTML += txt + '\n';
    });*/
    //localStorage.setItem('plotData', JSON.stringify(plot.getData()));
  }

  const listener: ChangeListener = {
    onStartPointChange(v) {
      plot.startLabel = v;
      render();
    },

    onChange(r) {
      plot.updateRoute(r);
      render();
    },

    onAdd(r, i) {
      plot.addRouteObject(r, i);
      render();
    },

    onRemove(r) {
      plot.deleteRoute(r);
      render();
    },

    onReset() {
      plot = plotFn();
      render();
      return plot;
    },

    onClear() {
      plot = new MapPlot();
      plot.addRoute(null, 0, 10, 'First Point');
      render();
      return plot;
    }
  };
  routeEditor(plot, document.getElementById('editor'), listener);

  render();
  window.addEventListener('resize', () => render, false);
});
