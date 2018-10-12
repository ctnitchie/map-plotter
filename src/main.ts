import Plot from './Plot';
import routeEditor from './routeEditor/index';

window.addEventListener('DOMContentLoaded', function() {

  const canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');

  function original() {
    const plot = new Plot(canvas);
    const baseLine = 250;
    const eastLine = 110;
    const westLine = 35;

    const platform = plot.startPoint;
    const brynne = plot.addLineFrom(platform, baseLine, 134, 'HMCS Brynne');
    const dino = plot.addLineFrom(brynne, 0, 85, 'Scubasaurus');
    const buddha = plot.addLineFrom(dino, 330, 51, 'Buddha');
    const david = plot.addLineFrom(buddha, eastLine, 70, 'David');
    const soldier = plot.addLineFrom(david, eastLine, 58, 'Soldier');
    const platformReturn = plot.addLineFrom(soldier, eastLine, 46, 'Platform (from Buddah)');
    const lady = plot.addLineFrom(platformReturn, 325, 19, 'Lady');
    const tub = plot.addLineFrom(lady, 0, 63, 'Tub');

    const pvcPipe = plot.addLineFrom(brynne, baseLine, 75, 'PVC Pipe');
    const westPlatform = plot.addLineFrom(pvcPipe, baseLine, 67, 'West Platform');
    const westPlatformWest = plot.addLineFrom(westPlatform, 270, 10);
    const hoop = plot.addLineFrom(westPlatformWest, 315, 64, 'Hoop');
    const trash = plot.addLineFrom(hoop, 315, 50, 'Trash');
    const hoop2 = plot.addLineFrom(westPlatformWest, 335, 21, 'Hoop');
    const end = plot.addLineFrom(hoop2, 335, 113, 'End of the Line');
    const gocart = plot.addLineFrom(westPlatform, westLine, 56, 'Cart');
    const hoop3 = plot.addLineFrom(gocart, westLine, 19, 'Hoop');
    const buddah2 = plot.addLineFrom(hoop3, westLine, 150, 'Buddah (from West Platform)');
    return plot;
  }

  function adjusted() {
    const plot = new Plot(canvas);
    const baseLine = 250;
    const eastLine = 117;
    const westLine = 31;

    const platform = plot.startPoint;
    const brynne = plot.addLineFrom(platform, baseLine, 134, 'HMCS Brynne');
    const dino = plot.addLineFrom(brynne, 0, 85, 'Scubasaurus');
    const buddha = plot.addLineFrom(dino, 330, 51, 'Buddha');
    const david = plot.addLineFrom(buddha, eastLine, 71, 'David');
    const soldier = plot.addLineFrom(david, eastLine, 58, 'Soldier');
    const platformReturn = plot.addLineFrom(soldier, eastLine, 41);
    const lady = plot.addLineFrom(platformReturn, 325, 19, 'Lady');
    const tub = plot.addLineFrom(lady, 0, 63, 'Tub');

    const pvcPipe = plot.addLineFrom(brynne, baseLine, 75, 'PVC Pipe');
    const westPlatform = plot.addLineFrom(pvcPipe, baseLine, 67, 'West Platform');
    const westPlatformWest = plot.addLineFrom(westPlatform, 270, 10);
    const hoop = plot.addLineFrom(westPlatformWest, 315, 64, 'Hoop');
    const trash = plot.addLineFrom(hoop, 315, 50, 'Trash');
    const hoop2 = plot.addLineFrom(westPlatformWest, 335, 21, 'Hoop');
    const end = plot.addLineFrom(hoop2, 335, 113, 'End of the Line');
    const gocart = plot.addLineFrom(westPlatform, westLine, 56, 'Cart');
    const hoop3 = plot.addLineFrom(gocart, westLine, 19, 'Hoop');
    const buddah2 = plot.addLineFrom(hoop3, westLine, 132);
    return plot;
  }

  function adjusted2() {
    const plot = new Plot(canvas);
    const baseLine = 250;
    const eastLine = 115;
    const westLine = 30;

    const platform = plot.startPoint;
    const brynne = plot.addLineFrom(platform, baseLine, 134, 'HMCS Brynne');
    const dino = plot.addLineFrom(brynne, 355, 85, 'Scubasaurus');
    const buddha = plot.addLineFrom(dino, 330, 51, 'Buddha');
    const david = plot.addLineFrom(buddha, eastLine, 70, 'David');
    const soldier = plot.addLineFrom(david, eastLine, 58, 'Soldier');
    const platformReturn = plot.addLineFrom(soldier, eastLine, 46, '');
    const lady = plot.addLineFrom(platformReturn, 325, 19, 'Lady');
    const tub = plot.addLineFrom(lady, 0, 63, 'Tub');

    const pvcPipe = plot.addLineFrom(brynne, baseLine, 75, 'PVC Pipe');
    const westPlatform = plot.addLineFrom(pvcPipe, baseLine, 67, 'West Platform');
    const westPlatformWest = plot.addLineFrom(westPlatform, 270, 10, '', {label: false});
    const hoop = plot.addLineFrom(westPlatformWest, 315, 64, 'Hoop');
    const trash = plot.addLineFrom(hoop, 315, 50, 'Trash');
    const hoop2 = plot.addLineFrom(westPlatformWest, 335, 21, 'Hoop');
    const end = plot.addLineFrom(hoop2, 335, 113, 'End of the Line');
    const gocart = plot.addLineFrom(westPlatform, westLine, 56, 'Cart');
    const hoop3 = plot.addLineFrom(gocart, westLine, 19, 'Hoop');
    const buddah2 = plot.addLineFrom(hoop3, westLine, 129);

    // Draw the East platform
    plot.addLineBetween(platform, platformReturn);

    return plot;
  }

  const plot = adjusted2();
  plot.draw();
  routeEditor(plot, document.getElementById('editor'));
  window.addEventListener('resize', () => plot.draw(), false);
});
