import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import {store} from './store';
import { ConnectedEditControls } from './MapEditor';
import { ConnectedRenderedMap } from './CanvasRenderer';
import RouteLists from './RouteLists';

function MainUI() {
  return (
  <Provider store={store}>
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h1>Map Plot Editor</h1>
        </div>
      </div>
        <div className="row">
          <div className="col-12 col-sm-7">
            <div>
              <ConnectedRenderedMap/>
            </div>
          </div>
          <div className="col-12 col-sm-5" id="editor">
            <ConnectedEditControls/>
          </div>
        </div>
        <RouteLists/>
      </div>
    </Provider>
  );
}

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(<MainUI/>, document.getElementById('appui'));
});
