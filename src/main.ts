import './style.scss';
import { MapPlot, Route } from './MapPlot';
import routeEditor, { ChangeListener } from './mapEditor/MapEditor';

window.addEventListener('DOMContentLoaded', function() {

  function original() {
    const plot = new MapPlot();
    const baseLine = 250;
    const eastLine = 110;
    const westLine = 35;

    const brynne = plot.addRoute(null, baseLine, 134, 'HMCS Brynne');
    const dino = plot.addRoute(brynne, 0, 85, 'Scubasaurus');
    const buddha = plot.addRoute(dino, 330, 51, 'Buddha');
    const david = plot.addRoute(buddha, eastLine, 70, 'David');
    const soldier = plot.addRoute(david, eastLine, 58, 'Soldier');
    const platformReturn = plot.addRoute(soldier, eastLine, 46, 'Platform (from Buddah)');
    const lady = plot.addRoute(platformReturn, 325, 19, 'Lady');
    const tub = plot.addRoute(lady, 0, 63, 'Tub');

    const pvcPipe = plot.addRoute(brynne, baseLine, 75, 'PVC Pipe');
    const westPlatform = plot.addRoute(pvcPipe, baseLine, 67, 'West Platform');
    const westPlatformWest = plot.addRoute(westPlatform, 270, 10);
    const hoop = plot.addRoute(westPlatformWest, 315, 64, 'Hoop');
    const trash = plot.addRoute(hoop, 315, 50, 'Trash');
    const hoop2 = plot.addRoute(westPlatformWest, 335, 21, 'Hoop');
    const end = plot.addRoute(hoop2, 335, 113, 'End of the Line');
    const gocart = plot.addRoute(westPlatform, westLine, 56, 'Cart');
    const hoop3 = plot.addRoute(gocart, westLine, 19, 'Hoop');
    const buddah2 = plot.addRoute(hoop3, westLine, 150, 'Buddah (from West Platform)');
    return plot;
  }

  function adjusted() {
    const plot = new MapPlot();
    const baseLine = 250;
    const eastLine = 117;
    const westLine = 31;

    const brynne = plot.addRoute(null, baseLine, 134, 'HMCS Brynne');
    const dino = plot.addRoute(brynne, 0, 85, 'Scubasaurus');
    const buddha = plot.addRoute(dino, 330, 51, 'Buddha');
    const david = plot.addRoute(buddha, eastLine, 71, 'David');
    const soldier = plot.addRoute(david, eastLine, 58, 'Soldier');
    const platformReturn = plot.addRoute(soldier, eastLine, 41);
    const lady = plot.addRoute(platformReturn, 325, 19, 'Lady');
    const tub = plot.addRoute(lady, 0, 63, 'Tub');

    const pvcPipe = plot.addRoute(brynne, baseLine, 75, 'PVC Pipe');
    const westPlatform = plot.addRoute(pvcPipe, baseLine, 67, 'West Platform');
    const westPlatformWest = plot.addRoute(westPlatform, 270, 10);
    const hoop = plot.addRoute(westPlatformWest, 315, 64, 'Hoop');
    const trash = plot.addRoute(hoop, 315, 50, 'Trash');
    const hoop2 = plot.addRoute(westPlatformWest, 335, 21, 'Hoop');
    const end = plot.addRoute(hoop2, 335, 113, 'End of the Line');
    const gocart = plot.addRoute(westPlatform, westLine, 56, 'Cart');
    const hoop3 = plot.addRoute(gocart, westLine, 19, 'Hoop');
    const buddah2 = plot.addRoute(hoop3, westLine, 132);
    return plot;
  }

  function adjusted2() {
    const plot = new MapPlot();
    const baseLine = 250;
    const eastLine = 115;
    const westLine = 30;

    const platform = plot.startPoint;
    const brynne = plot.addRoute(null, baseLine, 134, 'HMCS Brynne');
    const dino = plot.addRoute(brynne, 355, 85, 'Scubasaurus');
    const buddha = plot.addRoute(dino, 330, 51, 'Buddha');
    const david = plot.addRoute(buddha, eastLine, 70, 'David');
    const soldier = plot.addRoute(david, eastLine, 58, 'Soldier');
    const platformReturn = plot.addRoute(soldier, eastLine, 46, 'Platform NW', {labelDot: false});
    const lady = plot.addRoute(platformReturn, 325, 19, 'Lady', {showLabel: false});
    const tub = plot.addRoute(lady, 0, 63, 'Tub');

    const pvcPipe = plot.addRoute(brynne, baseLine, 75, 'PVC Pipe');
    const westPlatform = plot.addRoute(pvcPipe, baseLine, 67, 'West Platform');
    const westPlatformWest = plot.addRoute(westPlatform, 270, 10, 'West Platform Far Corner', {showLabel: false, labelDot: false});
    const hoop = plot.addRoute(westPlatformWest, 315, 64, 'Hoop 2');
    const trash = plot.addRoute(hoop, 315, 50, 'Trash');
    const hoop2 = plot.addRoute(westPlatformWest, 335, 21, 'Hoop 1');
    const end = plot.addRoute(hoop2, 335, 113, 'End of the Line');
    const gocart = plot.addRoute(westPlatform, westLine, 56, 'Cart');
    const hoop3 = plot.addRoute(gocart, westLine, 19, 'Hoop 5');
    const buddah2 = plot.addRoute(hoop3, westLine, 129, 'Buddah (return)', {makeDot: false});

    // Draw the East platform
    plot.addConnector(null, platformReturn);

    return plot;
  }

  const canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');
  const plot = adjusted2();
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
