import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import {store} from './store';
import { ConnectedEditControls } from './MapEditor';

function MainUI() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h1>Map Plot Editor</h1>
        </div>
      </div>
      <Provider store={store}>
        <div className="row">
          <div className="col-7">
            {/* TODO: Canvas goes here. */}
          </div>
          <div className="col-5" id="editor">
            <ConnectedEditControls/>
          </div>
        </div>
      </Provider>
    </div>
  );
}

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(<MainUI/>, document.getElementById('appui'));
});
