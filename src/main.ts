import './style.scss';
import plotFn from './routes/adjusted2';
import routeEditor, { ChangeListener } from './mapEditor/MapEditor';
import { LineType, MapData, MapPlot } from './MapPlot';

function getPlot(): MapPlot {
  //const data = localStorage.getItem('plotData');
  let data = null;
  if (data) {
    const struct: MapData = JSON.parse(data);
    return new MapPlot(struct);
  } else {
    return plotFn();
  }
}

window.addEventListener('DOMContentLoaded', function() {
  const plot = getPlot();
  const canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');
  const pre = document.getElementById('routes');
  function render() {
    plot.draw(canvas);
    pre.innerHTML = '';
    plot.routes.filter(r => r.opts.type !== LineType.NONE && r.endLabel)
    .filter(r => !r.previousId || (r.previousId && r.previous.endLabel))
    .forEach(r => {
      const startPt = r.previousId ? r.previous.endLabel : plot.startLabel;
      const txt = `${startPt} - ${r.endLabel}: ${r.heading}°, ${r.distance}'`;
      pre.innerHTML += txt + '\n';
    });
    localStorage.setItem('plotData', JSON.stringify(plot.getData()));
  }

  const listener: ChangeListener = {
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
    }
  };
  routeEditor(plot, document.getElementById('editor'), listener);

  render();
  window.addEventListener('resize', () => render, false);
});
