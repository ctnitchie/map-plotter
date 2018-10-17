import './style.scss';
import plot from './routes/adjusted2';
import routeEditor, { ChangeListener } from './mapEditor/MapEditor';

window.addEventListener('DOMContentLoaded', function() {

  const canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');
  plot.draw(canvas);
  const listener: ChangeListener = {
    onChange(r) {
      plot.updateRoute(r);
      plot.draw(canvas);
    },

    onAdd(r, i) {
      plot.addRouteObject(r, i);
      plot.draw(canvas);
    },

    onRemove(r) {
      plot.deleteRoute(r);
      plot.draw(canvas);
    }
  };
  routeEditor(plot, document.getElementById('editor'), listener);
  window.addEventListener('resize', () => plot.draw(canvas), false);
});
